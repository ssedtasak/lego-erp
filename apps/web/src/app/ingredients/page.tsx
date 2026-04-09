'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { exportToCSV } from '@/lib/csv';

type Ingredient = {
  id: string;
  name: string;
  unit: string;
  min_qty: number;
  current_qty: number;
  cost_per_unit: number;
};

import BackButton from '@/components/BackButton';

type SortField = 'name' | 'unit' | 'min_qty' | 'current_qty' | 'cost_per_unit';
type SortDir = 'asc' | 'desc';

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [form, setForm] = useState({
    name: '',
    unit: 'kg',
    min_qty: '',
    cost_per_unit: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
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
    if (editingId) {
      // Update existing
      const { error } = await supabase
        .from('ingredients')
        .update({
          name: form.name,
          unit: form.unit,
          min_qty: parseFloat(form.min_qty) || 0,
          cost_per_unit: parseFloat(form.cost_per_unit) || 0,
        })
        .eq('id', editingId);

      if (!error) {
        setEditingId(null);
        setForm({ name: '', unit: 'kg', min_qty: '', cost_per_unit: '' });
        setShowForm(false);
        fetchIngredients();
      }
    } else {
      // Insert new
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
  }

  function handleEdit(ing: Ingredient) {
    setForm({
      name: ing.name,
      unit: ing.unit,
      min_qty: String(ing.min_qty),
      cost_per_unit: String(ing.cost_per_unit),
    });
    setEditingId(ing.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (confirm('ยืนยันการลบ?')) {
      await supabase.from('ingredients').delete().eq('id', id);
      fetchIngredients();
    }
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  function exportCSV() {
    const headers = ['ชื่อ', 'หน่วย', 'ขั้นต่ำ', 'คงเหลือ', 'ราคา/หน่วย'];
    const rows = filteredAndSorted.map(ing => [
      ing.name,
      ing.unit,
      ing.min_qty,
      ing.current_qty,
      ing.cost_per_unit,
    ]);
    exportToCSV(headers, rows, `ingredients_${new Date().toISOString().split('T')[0]}.csv`);
  }

  function downloadTemplate() {
    const headers = ['ชื่อ', 'หน่วย', 'ขั้นต่ำ', 'ราคา/หน่วย'];
    const sample = [
      ['เนื้อหมู', 'kg', '10', '180'],
      ['ข้าว', 'kg', '20', '45'],
    ];
    const csv = [headers, ...sample].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ingredient_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleCSVImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const rows = lines.map(line => {
      const cells: string[] = [];
      let current = '';
      let inQuotes = false;
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cells.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      cells.push(current.trim());
      return cells;
    });

    for (const row of rows.slice(1)) {
      if (row.length < 4) continue;
      const [name, unit, min_qty, cost_per_unit] = row;

      const { data: existing } = await supabase
        .from('ingredients')
        .select('id')
        .eq('name', name)
        .single();

      if (existing) {
        await supabase.from('ingredients').update({
          unit,
          min_qty: parseFloat(min_qty),
          cost_per_unit: parseFloat(cost_per_unit),
        }).eq('id', existing.id);
      } else {
        await supabase.from('ingredients').insert({
          name,
          unit,
          min_qty: parseFloat(min_qty),
          cost_per_unit: parseFloat(cost_per_unit),
          current_qty: 0,
        });
      }
    }

    fetchIngredients();
    e.target.value = '';
  }

  const filteredAndSorted = useMemo(() => {
    let result = [...ingredients];
    if (search) {
      result = result.filter(ing => ing.name.toLowerCase().includes(search.toLowerCase()));
    }
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
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
              {editingId ? 'บันทึก' : 'เพิ่มวัตถุดิบ'}
            </button>
          </form>
        )}

        {!loading && (
          <>
            <div className="flex gap-2 mb-4">
              <button
                onClick={downloadTemplate}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                ดาวน์โหลด Template
              </button>
              <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                นำเข้า CSV
                <input type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
              </label>
            </div>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="ค้นหาชื่อวัตถุดิบ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                ส่งออก CSV
              </button>
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
                  <th className="p-4 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                    ชื่อ<SortIcon field="name" />
                  </th>
                  <th className="p-4 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('unit')}>
                    หน่วย<SortIcon field="unit" />
                  </th>
                  <th className="p-4 text-right cursor-pointer hover:bg-gray-100" onClick={() => handleSort('min_qty')}>
                    ขั้นต่ำ<SortIcon field="min_qty" />
                  </th>
                  <th className="p-4 text-right cursor-pointer hover:bg-gray-100" onClick={() => handleSort('current_qty')}>
                    คงเหลือ<SortIcon field="current_qty" />
                  </th>
                  <th className="p-4 text-right cursor-pointer hover:bg-gray-100" onClick={() => handleSort('cost_per_unit')}>
                    ราคา/หน่วย<SortIcon field="cost_per_unit" />
                  </th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((ing) => (
                  <tr key={ing.id} className="border-t">
                    <td className="p-4 font-medium">{ing.name}</td>
                    <td className="p-4">{ing.unit}</td>
                    <td className="p-4 text-right">{ing.min_qty}</td>
                    <td className="p-4 text-right">{ing.current_qty}</td>
                    <td className="p-4 text-right">{formatCurrency(ing.cost_per_unit)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleEdit(ing)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        แก้ไข
                      </button>
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
            {filteredAndSorted.length === 0 && (
              <p className="p-4 text-center text-gray-500">ไม่พบวัตถุดิบที่ค้นหา</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
