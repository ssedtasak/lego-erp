'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { exportToCSV } from '@/lib/csv';

type ShoppingItem = {
  ingredient_id: string;
  name: string;
  unit: string;
  current_qty: number;
  min_qty: number;
  needed_qty: number;
};

import BackButton from '@/components/BackButton';

type SortField = 'urgency' | 'name' | 'current_qty' | 'needed_qty';
type SortDir = 'asc' | 'desc';

export default function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('urgency');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const supabase = createClient();

  useEffect(() => {
    fetchShoppingList();
  }, []);

  async function fetchShoppingList() {
    const { data } = await supabase.rpc('get_shopping_list');
    setItems(data || []);
    setLoading(false);
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  // Urgency = how far below min_qty (higher = more urgent)
  function getUrgency(item: ShoppingItem): number {
    return item.min_qty - item.current_qty;
  }

  const sortedItems = useMemo(() => {
    const withUrgency = items.map(item => ({ ...item, _urgency: getUrgency(item) }));
    withUrgency.sort((a, b) => {
      let valA: any, valB: any;
      if (sortField === 'urgency') {
        valA = a._urgency;
        valB = b._urgency;
      } else if (sortField === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else {
        valA = a[sortField];
        valB = b[sortField];
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return withUrgency;
  }, [items, sortField, sortDir]);

  function getUrgencyBadge(item: ShoppingItem) {
    const gap = item.min_qty - item.current_qty;
    if (gap > item.min_qty) return { bg: 'bg-red-500', text: 'text-white', label: 'วิกฤต' };
    if (gap > item.min_qty * 0.5) return { bg: 'bg-orange-100', text: 'text-orange-800', label: 'เร่งด่วน' };
    return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'ปกติ' };
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <span className="text-gray-400 ml-1">↕</span>;
    return <span className="text-primary-600 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  function exportCSV() {
    const headers = ['วัตถุดิบ', 'หน่วย', 'คงเหลือ', 'ขั้นต่ำ', 'ต้องซื้อ'];
    const rows = sortedItems.map(item => [
      item.name,
      item.unit,
      item.current_qty,
      item.min_qty,
      item.needed_qty,
    ]);
    exportToCSV(headers, rows, `shopping_list_${new Date().toISOString().split('T')[0]}.csv`);
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-2xl font-bold">รายการซื้อวันนี้</h1>
          </div>
          {!loading && items.length > 0 && (
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              ส่งออก CSV
            </button>
          )}
        </div>

        {loading ? (
          <p>กำลังโหลด...</p>
        ) : items.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-green-800 font-medium">ไม่มีรายการที่ต้องซื้อเพิ่ม</p>
            <p className="text-green-600 text-sm">วัตถุดิบทั้งหมดอยู่เหนือขั้นต่ำ</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                    วัตถุดิบ<SortIcon field="name" />
                  </th>
                  <th className="p-4 text-center w-24">ความเร่งด่วน</th>
                  <th className="p-4 text-right cursor-pointer hover:bg-gray-100" onClick={() => handleSort('current_qty')}>
                    คงเหลือ<SortIcon field="current_qty" />
                  </th>
                  <th className="p-4 text-right cursor-pointer hover:bg-gray-100" onClick={() => handleSort('needed_qty')}>
                    ต้องซื้อ<SortIcon field="needed_qty" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item) => {
                  const badge = getUrgencyBadge(item);
                  return (
                    <tr key={item.ingredient_id} className="border-t">
                      <td className="p-4 font-medium">{item.name}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-red-600 font-medium">{item.current_qty}</span>
                          <span className="text-xs text-gray-400">/ {item.min_qty} {item.unit}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-green-600 font-medium">
                        {item.needed_qty} {item.unit}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
