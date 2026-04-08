'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { formatCurrency, formatDateTime } from '@/lib/utils';

type Transaction = {
  id: string;
  ingredient_id: string;
  type: 'IN' | 'OUT';
  amount: number;
  unit_price: number;
  total_price: number;
  staff_id: string | null;
  note: string | null;
  created_at: string;
  ingredient?: { name: string; unit: string };
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    const { data } = await supabase
      .from('transactions')
      .select('*, ingredient:ingredients(name, unit)')
      .order('created_at', { ascending: false })
      .limit(100);
    setTransactions(data || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">รายการเคลื่อนไหว</h1>

        {loading ? (
          <p>กำลังโหลด...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">วัน/เวลา</th>
                  <th className="p-4 text-left">วัตถุดิบ</th>
                  <th className="p-4 text-center">ประเภท</th>
                  <th className="p-4 text-right">จำนวน</th>
                  <th className="p-4 text-right">รวม</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-t">
                    <td className="p-4 text-sm text-gray-600">
                      {formatDateTime(tx.created_at)}
                    </td>
                    <td className="p-4">
                      {tx.ingredient?.name || 'N/A'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${
                        tx.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {tx.type === 'IN' ? 'รับเข้า' : 'ใช้ออก'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {tx.amount} {tx.ingredient?.unit}
                    </td>
                    <td className="p-4 text-right font-medium">
                      {formatCurrency(tx.total_price)}
                    </td>
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
