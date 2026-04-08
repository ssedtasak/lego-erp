import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Ingredient = {
  id: string;
  name: string;
  unit: string;
  current_qty: number;
  cost_per_unit: number;
};

type Props = {
  staffId: string;
  onBack: () => void;
};

export default function StockIn({ staffId, onBack }: Props) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [amount, setAmount] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchIngredients();
  }, []);

  async function fetchIngredients() {
    const { data } = await supabase
      .from('ingredients')
      .select('id, name, unit, current_qty, cost_per_unit')
      .order('name');
    setIngredients(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !amount) return;

    setSaving(true);
    const { error } = await supabase.rpc('record_stock_in', {
      p_ingredient_id: selectedId,
      p_amount: parseFloat(amount),
      p_unit_price: parseFloat(unitPrice) || 0,
      p_staff_id: staffId,
    });

    setSaving(false);
    if (!error) {
      setSuccess(true);
      setAmount('');
      setUnitPrice('');
      setTimeout(() => setSuccess(false), 2000);
      fetchIngredients();
    }
  }

  const selected = ingredients.find((i) => i.id === selectedId);

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-2 text-primary-600">← กลับ</button>
        <h2 className="text-xl font-bold">รับของเข้า</h2>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
          บันทึกสำเร็จ!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">เลือกวัตถุดิบ</label>
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              const ing = ingredients.find((i) => i.id === e.target.value);
              if (ing) setUnitPrice(ing.cost_per_unit.toString());
            }}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">-- เลือกวัตถุดิบ --</option>
            {ingredients.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name} (คงเหลือ: {ing.current_qty} {ing.unit})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">จำนวน ({selected?.unit || 'หน่วย'})</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ราคาต่อหน่วย (฿)</label>
            <input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="0"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-medium disabled:opacity-50"
        >
          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
      </form>
    </div>
  );
}
