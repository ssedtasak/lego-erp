'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';

type DailyExpense = {
  date: string;
  total_spent: number;
  transaction_count: number;
};

import BackButton from '@/components/BackButton';

export default function ReportsPage() {
  const [dailyExpenses, setDailyExpenses] = useState<DailyExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalMonth, setTotalMonth] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    // Fetch last 30 days of stock-in transactions
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data } = await supabase
      .from('transactions')
      .select('created_at, total_price')
      .eq('type', 'IN')
      .gte('created_at', thirtyDaysAgo.toISOString())
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
    setTotalMonth(expenses.reduce((sum, d) => sum + d.total_spent, 0));
    setLoading(false);
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold">รายงานค่าใช้จ่าย</h1>
        </div>

        <div className="bg-primary-600 text-white p-6 rounded-lg mb-6">
          <p className="text-sm opacity-80">ยอดรวม 30 วัน</p>
          <p className="text-3xl font-bold">{formatCurrency(totalMonth)}</p>
        </div>

        {loading ? (
          <p>กำลังโหลด...</p>
        ) : (
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
          </div>
        )}
      </div>
    </div>
  );
}
