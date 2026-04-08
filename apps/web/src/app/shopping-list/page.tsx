'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

type ShoppingItem = {
  ingredient_id: string;
  name: string;
  unit: string;
  current_qty: number;
  min_qty: number;
  needed_qty: number;
};

import BackButton from '@/components/BackButton';

export default function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchShoppingList();
  }, []);

  async function fetchShoppingList() {
    const { data } = await supabase.rpc('get_shopping_list');
    setItems(data || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold">รายการซื้อวันนี้</h1>
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
                  <th className="p-4 text-left">วัตถุดิบ</th>
                  <th className="p-4 text-right">คงเหลือ</th>
                  <th className="p-4 text-right">ต้องซื้อ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.ingredient_id} className="border-t">
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4 text-right text-red-600">
                      {item.current_qty} {item.unit}
                    </td>
                    <td className="p-4 text-right text-green-600 font-medium">
                      {item.needed_qty} {item.unit}
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
