'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { exportToCSV } from '@/lib/csv';

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

import BackButton from '@/components/BackButton';

type SortField = 'created_at' | 'ingredient_name' | 'amount' | 'total_price';
type SortDir = 'asc' | 'desc';
type FilterType = 'ALL' | 'IN' | 'OUT';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const supabase = createClient();

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    const { data } = await supabase
      .from('transactions')
      .select('*, ingredient:ingredients(name, unit)')
      .order('created_at', { ascending: false })
      .limit(500);
    setTransactions(data || []);
    setLoading(false);
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function exportCSV() {
    const headers = ['วัน/เวลา', 'วัตถุดิบ', 'ประเภท', 'จำนวน', 'ราคา/หน่วย', 'รวม', 'หมายเหตุ'];
    const rows = filteredAndSorted.map(tx => [
      formatDateTime(tx.created_at),
      tx.ingredient?.name || 'N/A',
      tx.type === 'IN' ? 'รับเข้า' : 'ใช้ออก',
      tx.amount,
      tx.unit_price,
      tx.total_price,
      tx.note || '',
    ]);
    exportToCSV(headers, rows, `transactions_${new Date().toISOString().split('T')[0]}.csv`);
  }

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];
    
    // Filter by type
    if (filterType !== 'ALL') {
      result = result.filter(tx => tx.type === filterType);
    }
    
    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter(tx => new Date(tx.created_at) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(tx => new Date(tx.created_at) <= end);
    }
    
    // Sort
    result.sort((a, b) => {
      let valA: any, valB: any;
      if (sortField === 'created_at') {
        valA = new Date(a.created_at).getTime();
        valB = new Date(b.created_at).getTime();
      } else if (sortField === 'ingredient_name') {
        valA = a.ingredient?.name?.toLowerCase() || '';
        valB = b.ingredient?.name?.toLowerCase() || '';
      } else {
        valA = a[sortField];
        valB = b[sortField];
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [transactions, startDate, endDate, filterType, sortField, sortDir]);

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <span className="text-gray-400 ml-1">↕</span>;
    return <span className="text-primary-600 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold">รายการเคลื่อนไหว</h1>
        </div>

        {!loading && (
          <>
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">วันเริ่มต้น</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">วันสิ้นสุด</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ประเภท</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="ALL">ทั้งหมด</option>
                    <option value="IN">รับเข้า</option>
                    <option value="OUT">ใช้ออก</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={exportCSV}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    ส่งออก CSV
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {loading ? (
          <p>กำลังโหลด...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('created_at')}>
                    วัน/เวลา<SortIcon field="created_at" />
                  </th>
                  <th className="p-4 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('ingredient_name')}>
                    วัตถุดิบ<SortIcon field="ingredient_name" />
                  </th>
                  <th className="p-4 text-center">ประเภท</th>
                  <th className="p-4 text-right cursor-pointer hover:bg-gray-100" onClick={() => handleSort('amount')}>
                    จำนวน<SortIcon field="amount" />
                  </th>
                  <th className="p-4 text-right cursor-pointer hover:bg-gray-100" onClick={() => handleSort('total_price')}>
                    รวม<SortIcon field="total_price" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((tx) => (
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
            {filteredAndSorted.length === 0 && (
              <p className="p-4 text-center text-gray-500">ไม่พบรายการที่ค้นหา</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
