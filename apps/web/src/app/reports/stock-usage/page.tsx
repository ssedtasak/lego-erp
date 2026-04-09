'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import BackButton from '@/components/BackButton';

type PeriodValue = number | 'month';

const periods = [
  { label: '7 วัน', value: 7 },
  { label: '14 วัน', value: 14 },
  { label: '21 วัน', value: 21 },
  { label: '31 วัน', value: 31 },
  { label: 'เดือนนี้', value: 'month' as const },
];

function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    start: start.toISOString().split('T')[0],
    end: now.toISOString().split('T')[0],
  };
}

type UsageTransaction = {
  id: number;
  created_at: string;
  amount: number;
  total_price: number;
  note: string | null;
  ingredients: {
    name: string;
    unit: string;
    cost_per_unit: number;
  };
};

type DailyUsage = {
  date: string;
  total_used: number;
  total_cost: number;
  transaction_count: number;
};

export default function StockUsagePage() {
  const [usageData, setUsageData] = useState<UsageTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodValue>('month');
  const supabase = createClient();

  useEffect(() => {
    fetchUsage();
  }, [period]);

  async function fetchUsage() {
    setLoading(true);

    let startDate: Date;
    let endDate: string;

    if (period === 'month') {
      const range = getMonthRange();
      startDate = new Date(range.start);
      endDate = range.end;
    } else {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - period);
      endDate = new Date().toISOString().split('T')[0];
    }

    const { data } = await supabase
      .from('transactions')
      .select('*, ingredients(name, unit, cost_per_unit)')
      .eq('type', 'OUT')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    setUsageData(data || []);
    setLoading(false);
  }

  const { dailyUsage, totalItems, totalCost, dailyChartData } = useMemo(() => {
    const grouped: Record<string, DailyUsage> = {};
    usageData.forEach((tx) => {
      const date = tx.created_at.split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { date, total_used: 0, total_cost: 0, transaction_count: 0 };
      }
      grouped[date].total_used += 1;
      grouped[date].total_cost += tx.total_price;
      grouped[date].transaction_count += 1;
    });

    const daily = Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));
    const items = usageData.length;
    const cost = usageData.reduce((sum, tx) => sum + tx.total_price, 0);

    // For chart: group by date for last 14 days
    const chartGrouped: Record<string, number> = {};
    usageData.forEach((tx) => {
      const date = tx.created_at.split('T')[0];
      if (!chartGrouped[date]) {
        chartGrouped[date] = 0;
      }
      chartGrouped[date] += tx.total_price;
    });
    const chartData = Object.entries(chartGrouped)
      .map(([date, cost]) => ({ date, cost }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);

    return { dailyUsage: daily, totalItems: items, totalCost: cost, dailyChartData: chartData };
  }, [usageData]);

  const maxCost = useMemo(() => {
    return Math.max(...dailyChartData.map(d => d.cost), 1);
  }, [dailyChartData]);

  const sortedByAmount = useMemo(() => {
    return [...usageData].sort((a, b) => b.total_price - a.total_price);
  }, [usageData]);

  // Simple bar chart using divs
  function SimpleBarChart() {
    if (dailyChartData.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">กราฟการใช้วัตถุดิบรายวัน</h3>
        <div className="flex items-end gap-1 h-32">
          {dailyChartData.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-orange-500 rounded-t"
                style={{ height: `${(day.cost / maxCost) * 100}%`, minHeight: day.cost > 0 ? '4px' : '0' }}
                title={`${day.date}: ${formatCurrency(day.cost)}`}
              />
              <span className="text-xs text-gray-400 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
                {day.date.split('-')[2]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getDateRangeText = () => {
    if (period === 'month') {
      const range = getMonthRange();
      return `${range.start} ถึง ${range.end}`;
    } else {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - period);
      return `${startDate.toISOString().split('T')[0]} ถึง ${new Date().toISOString().split('T')[0]}`;
    }
  };

  return (
    <div className="min-h-screen p-8">
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .print-header { display: block !important; }
          body { background: white !important; color: black !important; }
          table { border: 1px solid #000 !important; }
          th, td { border: 1px solid #000 !important; color: black !important; }
          .shadow { box-shadow: none !important; }
        }
        .print-header { display: none; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6 no-print">
          <BackButton />
          <h1 className="text-2xl font-bold">รายงานการใช้วัตถุดิบ</h1>
        </div>

        <div className="print-header mb-4">
          <h1 className="text-2xl font-bold">รายงานการใช้วัตถุดิบ</h1>
          <p className="text-gray-600">ช่วงเวลา: {getDateRangeText()}</p>
        </div>

        <div className="bg-orange-600 text-white p-6 rounded-lg mb-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">จำนวนรายการใช้ {period === 'month' ? 'เดือนนี้' : `${period} วัน`}</p>
              <p className="text-3xl font-bold">{totalItems} รายการ</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">มูลค่าการใช้วัตถุดิบ</p>
              <p className="text-xl font-bold">{formatCurrency(totalCost)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4 no-print">
          <div className="flex gap-2 flex-wrap">
            {periods.map((p) => (
              <button
                key={String(p.value)}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-2 rounded min-h-[44px] ${period === p.value ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p>กำลังโหลด...</p>
        ) : (
          <>
            <SimpleBarChart />
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left">วันที่</th>
                    <th className="p-4 text-left">วัตถุดิบ</th>
                    <th className="p-4 text-right">จำนวน</th>
                    <th className="p-4 text-right">หน่วย</th>
                    <th className="p-4 text-right">มูลค่า</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByAmount.map((tx) => (
                    <tr key={tx.id} className="border-t">
                      <td className="p-4">{tx.created_at.split('T')[0]}</td>
                      <td className="p-4">{tx.ingredients?.name || '-'}</td>
                      <td className="p-4 text-right">{tx.amount}</td>
                      <td className="p-4 text-right">{tx.ingredients?.unit || '-'}</td>
                      <td className="p-4 text-right font-medium">{formatCurrency(tx.total_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {usageData.length === 0 && (
                <p className="p-4 text-center text-gray-500">ไม่มีข้อมูลในช่วงที่เลือก</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
