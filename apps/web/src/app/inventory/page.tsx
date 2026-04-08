'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

type Ingredient = {
  id: string;
  name: string;
  unit: string;
  min_qty: number;
  current_qty: number;
  cost_per_unit: number;
};

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">ตรวจสอบสต็อก</h1>

        {loading ? (
          <p>กำลังโหลด...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">วัตถุดิบ</th>
                  <th className="p-4 text-right">คงเหลือ</th>
                  <th className="p-4 text-right">ขั้นต่ำ</th>
                  <th className="p-4 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((item) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
