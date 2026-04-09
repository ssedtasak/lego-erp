'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase';

type Ingredient = {
  id: string;
  name: string;
  unit: string;
  min_qty: number;
  current_qty: number;
  cost_per_unit: number;
};

import BackButton from '@/components/BackButton';

type SortField = 'name' | 'current_qty' | 'min_qty';
type SortDir = 'asc' | 'desc';

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const supabase = createClient();

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    const { data } = await supabase
      .from('ingredients')
      .select('*')
      .order('name');
    setIngredients(data || []);
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

  function getStatus(item: Ingredient) {
    if (item.current_qty < item.min_qty) return 'bg-red-100 text-red-800';
    if (item.current_qty < item.min_qty * 1.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }

  function getStatusLabel(item: Ingredient) {
    if (item.current_qty < item.min_qty) return 'ต่ำกว่าขั้นต่ำ';
    if (item.current_qty < item.min_qty * 1.5) return 'ใกล้หมด';
    return 'ปกติ';
  }

  const filteredAndSorted = useMemo(() => {
    let result = [...ingredients];
    if (search) {
      result = result.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    result.sort((a, b) => {
      let valA: any = sortField === 'name' ? a.name.toLowerCase() : a[sortField];
      let valB: any = sortField === 'name' ? b.name.toLowerCase() : b[sortField];
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [ingredients, search, sortField, sortDir]);

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <span className="text-gray-400 ml-1">↕</span>;
    return <span className="text-primary-600 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold">ตรวจสอบสต็อก</h1>
        </div>

        {!loading && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="ค้นหาวัตถุดิบ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {loading ? (
          <p>กำลังโหลด...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                    วัตถุดิบ<SortIcon field="name" />
                  </th>
                  <th className="p-4 text-right cursor-pointer hover:bg-gray-100" onClick={() => handleSort('current_qty')}>
                    คงเหลือ<SortIcon field="current_qty" />
                  </th>
                  <th className="p-4 text-right cursor-pointer hover:bg-gray-100" onClick={() => handleSort('min_qty')}>
                    ขั้นต่ำ<SortIcon field="min_qty" />
                  </th>
                  <th className="p-4 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4 text-right">
                      <span className="text-lg font-semibold">{item.current_qty}</span>
                      <span className="text-gray-500 ml-1">{item.unit}</span>
                    </td>
                    <td className="p-4 text-right text-gray-500">{item.min_qty} {item.unit}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatus(item)}`}>
                        {getStatusLabel(item)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAndSorted.length === 0 && (
              <p className="p-4 text-center text-gray-500">ไม่พบวัตถุดิบที่ค้นหา</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
