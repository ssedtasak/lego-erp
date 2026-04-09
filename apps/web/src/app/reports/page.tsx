'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';

type DailyExpense = {
  date: string;
  total_spent: number;
  transaction_count: number;
};

import BackButton from '@/components/BackButton';

type Period = '7' | '14' | '30' | '90';

export default function ReportsPage() {
  const [dailyExpenses, setDailyExpenses] = useState<DailyExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPeriod, setTotalPeriod] = useState(0);
  const [period, setPeriod] = useState<Period>('30');
  const supabase = createClient();

  useEffect(() => {
    fetchReports();
  }, [period]);

  async function fetchReports() {
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data } = await supabase
      .from('transactions')
      .select('created_at, total_price')
      .eq('type', 'IN')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Group by date
    const grouped: Record<string, DailyExpense> = {};
    data?.forEach((tx) => {
      const date = tx.created_at.split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { date, total_spent: 0, transaction_count: 0 };
      }
      grouped[date].total_spent += tx.total_price;
      grouped[date].transaction_count += 1;
    });

    const expenses = Object.values(grouped);
    setDailyExpenses(expenses);
    setTotalPeriod(expenses.reduce((sum, d) => sum + d.total_spent, 0));
    setLoading(false);
  }

  const maxSpent = useMemo(() => {
    return Math.max(...dailyExpenses.map(d => d.total_spent), 1);
  }, [dailyExpenses]);

  const avgDaily = useMemo(() => {
    if (dailyExpenses.length === 0) return 0;
    return totalPeriod / dailyExpenses.length;
  }, [dailyExpenses, totalPeriod]);

  // Simple bar chart using divs
  function SimpleBarChart() {
    if (dailyExpenses.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">กราฟค่าใช้จ่ายรายวัน</h3>
        <div className="flex items-end gap-1 h-32">
          {dailyExpenses.slice(-14).map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-primary-500 rounded-t"
                style={{ height: `${(day.total_spent / maxSpent) * 100}%`, minHeight: day.total_spent > 0 ? '4px' : '0' }}
                title={`${day.date}: ${formatCurrency(day.total_spent)}`}
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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold">รายงานค่าใช้จ่าย</h1>
        </div>

        <div className="bg-primary-600 text-white p-6 rounded-lg mb-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">ยอดรวม {period} วัน</p>
              <p className="text-3xl font-bold">{formatCurrency(totalPeriod)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">เฉลี่ย/วัน</p>
              <p className="text-xl font-bold">{formatCurrency(avgDaily)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex gap-2">
            {(['7', '14', '30', '90'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded ${period === p ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {p === '90' ? '3 เดือน' : `${p} วัน`}
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
                    <th className="p-4 text-right">ยอดซื้อวัตถุดิบ</th>
                    <th className="p-4 text-right">จำนวนรายการ</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyExpenses.map((day) => (
                    <tr key={day.date} className="border-t">
                      <td className="p-4">{day.date}</td>
                      <td className="p-4 text-right font-medium">{formatCurrency(day.total_spent)}</td>
                      <td className="p-4 text-right text-gray-500">{day.transaction_count} รายการ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {dailyExpenses.length === 0 && (
                <p className="p-4 text-center text-gray-500">ไม่มีข้อมูลในช่วงที่เลือก</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
