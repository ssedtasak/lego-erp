import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Ingredient = {
  id: string;
  name: string;
  unit: string;
  current_qty: number;
};

type Props = {
  staffId: string;
  onBack: () => void;
};

export default function StockOut({ staffId, onBack }: Props) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchIngredients();
  }, []);

  async function fetchIngredients() {
    const { data } = await supabase
      .from('ingredients')
      .select('id, name, unit, current_qty')
      .order('name');
    setIngredients(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !amount) return;

    setSaving(true);
    const { error } = await supabase.rpc('record_stock_out', {
      p_ingredient_id: selectedId,
      p_amount: parseFloat(amount),
      p_staff_id: staffId,
    });

    setSaving(false);
    if (!error) {
      setSuccess(true);
      setAmount('');
      setTimeout(() => setSuccess(false), 2000);
      fetchIngredients();
    } else {
      alert('ไม่สามารถบันทึกได้: ' + error.message);
    }
  }

  const selected = ingredients.find((i) => i.id === selectedId);

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-2 text-primary-600">← กลับ</button>
        <h2 className="text-xl font-bold">ใช้ของออก</h2>
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
              setAmount('');
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

        <div>
          <label className="block text-sm font-medium mb-1">จำนวนที่ใช้ ({selected?.unit || 'หน่วย'})</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder={`ไม่เกิน ${selected?.current_qty || 0}`}
            max={selected?.current_qty}
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50"
        >
          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
      </form>
    </div>
  );
}
