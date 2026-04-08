'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';

type Ingredient = {
  id: string;
  name: string;
  unit: string;
  min_qty: number;
  current_qty: number;
  cost_per_unit: number;
};

import BackButton from '@/components/BackButton';

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    unit: 'kg',
    min_qty: '',
    cost_per_unit: '',
  });
  const supabase = createClient();

  useEffect(() => {
    fetchIngredients();
  }, []);

  async function fetchIngredients() {
    const { data } = await supabase
      .from('ingredients')
      .select('*')
      .order('name');
    setIngredients(data || []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('ingredients').insert({
      name: form.name,
      unit: form.unit,
      min_qty: parseFloat(form.min_qty) || 0,
      cost_per_unit: parseFloat(form.cost_per_unit) || 0,
      current_qty: 0,
    });

    if (!error) {
      setForm({ name: '', unit: 'kg', min_qty: '', cost_per_unit: '' });
      setShowForm(false);
      fetchIngredients();
    }
  }

  async function handleDelete(id: string) {
    if (confirm('ยืนยันการลบ?')) {
      await supabase.from('ingredients').delete().eq('id', id);
      fetchIngredients();
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-2xl font-bold">จัดการวัตถุดิบ</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {showForm ? 'ยกเลิก' : '+ เพิ่มวัตถุดิบ'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อวัตถุดิบ</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">หน่วย</label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="kg">กิโลกรัม (kg)</option>
                  <option value="g">กรัม (g)</option>
                  <option value="ลิตร">ลิตร</option>
                  <option value="ชิ้น">ชิ้น</option>
                  <option value="ขวด">ขวด</option>
                  <option value="ถุง">ถุง</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ขั้นต่ำ (min_qty)</label>
                <input
                  type="number"
                  value={form.min_qty}
                  onChange={(e) => setForm({ ...form, min_qty: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ราคาต่อหน่วย (฿)</label>
                <input
                  type="number"
                  value={form.cost_per_unit}
                  onChange={(e) => setForm({ ...form, cost_per_unit: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              บันทึก
            </button>
          </form>
        )}

        {loading ? (
          <p>กำลังโหลด...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">ชื่อ</th>
                  <th className="p-4 text-left">หน่วย</th>
                  <th className="p-4 text-right">ขั้นต่ำ</th>
                  <th className="p-4 text-right">ราคา/หน่วย</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ing) => (
                  <tr key={ing.id} className="border-t">
                    <td className="p-4 font-medium">{ing.name}</td>
                    <td className="p-4">{ing.unit}</td>
                    <td className="p-4 text-right">{ing.min_qty}</td>
                    <td className="p-4 text-right">{formatCurrency(ing.cost_per_unit)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(ing.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ลบ
                      </button>
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
