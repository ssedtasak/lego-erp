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

type BulkChange = {
  ingredient_id: string;
  old_qty: number;
  new_qty: number;
};

import BackButton from '@/components/BackButton';

type SortField = 'name' | 'current_qty' | 'min_qty';
type SortDir = 'asc' | 'desc';
type AdjustmentType = 'in' | 'out';

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('in');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentNote, setAdjustmentNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Receipt state
  const [receiptCollapsed, setReceiptCollapsed] = useState(true);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [receiptDate, setReceiptDate] = useState('');
  const [receiptTotal, setReceiptTotal] = useState('');

  // Bulk edit state
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [bulkChanges, setBulkChanges] = useState<Map<string, number>>(new Map());
  const [bulkNote, setBulkNote] = useState('');
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [bulkSubmitError, setBulkSubmitError] = useState('');
  const [bulkSubmitSuccess, setBulkSubmitSuccess] = useState('');

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

  function openEditModal(ingredient: Ingredient) {
    setSelectedIngredient(ingredient);
    setAdjustmentType('in');
    setAdjustmentAmount('');
    setAdjustmentNote('');
    setSubmitError('');
    setSuccessMsg('');
    setReceiptCollapsed(true);
    setInvoiceNumber('');
    setVendorName('');
    setReceiptDate('');
    setReceiptTotal('');
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedIngredient(null);
    setAdjustmentAmount('');
    setAdjustmentNote('');
    setSubmitError('');
    setSuccessMsg('');
    setInvoiceNumber('');
    setVendorName('');
    setReceiptDate('');
    setReceiptTotal('');
  }

  // Bulk edit functions
  function enterBulkEditMode() {
    const initialChanges = new Map<string, number>();
    ingredients.forEach(ing => initialChanges.set(ing.id, ing.current_qty));
    setBulkChanges(initialChanges);
    setBulkNote('');
    setBulkSubmitError('');
    setBulkSubmitSuccess('');
    setIsBulkEditMode(true);
  }

  function exitBulkEditMode() {
    setIsBulkEditMode(false);
    setBulkChanges(new Map());
    setBulkNote('');
    setBulkSubmitError('');
    setBulkSubmitSuccess('');
  }

  function handleBulkChange(ingredientId: string, newQty: string) {
    const qty = parseFloat(newQty);
    const newChanges = new Map(bulkChanges);
    newChanges.set(ingredientId, isNaN(qty) ? 0 : qty);
    setBulkChanges(newChanges);
  }

  function getChangedItems(): BulkChange[] {
    const changes: BulkChange[] = [];
    bulkChanges.forEach((newQty, ingredientId) => {
      const original = ingredients.find(i => i.id === ingredientId);
      if (original && original.current_qty !== newQty) {
        changes.push({
          ingredient_id: ingredientId,
          old_qty: original.current_qty,
          new_qty: newQty
        });
      }
    });
    return changes;
  }

  function hasChanges(): boolean {
    return getChangedItems().length > 0;
  }

  async function handleBulkSave() {
    const changes = getChangedItems();
    if (changes.length === 0) {
      setBulkSubmitError('ไม่มีการเปลี่ยนแปลง');
      return;
    }

    setIsBulkSubmitting(true);
    setBulkSubmitError('');

    try {
      const { error } = await supabase.rpc('bulk_update_stock', {
        p_adjustments: changes,
        p_staff_id: null,
        p_note: bulkNote.trim() || 'Bulk edit from inventory page'
      });

      if (error) throw error;

      setBulkSubmitSuccess('บันทึกการแก้ไขแบบกลุ่มเรียบร้อยแล้ว');
      setTimeout(() => {
        exitBulkEditMode();
        fetchInventory();
      }, 1000);
    } catch (err: any) {
      setBulkSubmitError(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setIsBulkSubmitting(false);
    }
  }

  async function handleAdjustStock() {
    if (!selectedIngredient || !adjustmentAmount || !adjustmentNote.trim()) {
      setSubmitError('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const amount = parseFloat(adjustmentAmount);
    if (isNaN(amount) || amount <= 0) {
      setSubmitError('กรุณากรอกจำนวนที่ถูกต้อง');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      if (adjustmentType === 'in') {
        // Build receipt data object if any receipt field is filled
        const hasReceiptData = invoiceNumber.trim() || vendorName.trim() || receiptDate.trim() || receiptTotal.trim();
        const receiptData = hasReceiptData ? {
          invoice_number: invoiceNumber.trim() || null,
          vendor_name: vendorName.trim() || null,
          receipt_date: receiptDate.trim() || null,
          receipt_total: receiptTotal.trim() ? parseFloat(receiptTotal) : null
        } : null;

        const { error } = await supabase.rpc('record_stock_in', {
          p_ingredient_id: selectedIngredient.id,
          p_amount: amount,
          p_unit_price: selectedIngredient.cost_per_unit,
          p_staff_id: null,
          p_note: adjustmentNote.trim(),
          p_receipt_data: receiptData
        });
        if (error) throw error;
        setSuccessMsg('เพิ่มสต็อกเรียบร้อยแล้ว');
      } else {
        const { error } = await supabase.rpc('record_stock_out', {
          ingredient_id: selectedIngredient.id,
          amount: amount,
          staff_id: null,
          note: adjustmentNote.trim()
        });
        if (error) throw error;
        setSuccessMsg('ลดสต็อกเรียบร้อยแล้ว');
      }

      setTimeout(() => {
        closeModal();
        fetchInventory();
      }, 1000);
    } catch (err: any) {
      setSubmitError(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-2xl font-bold flex-1">ตรวจสอบสต็อก</h1>
          {!loading && !isBulkEditMode && (
            <button
              onClick={enterBulkEditMode}
              className="bg-amber-500 text-white hover:bg-amber-600 px-4 py-2 rounded transition-colors"
            >
              แก้ไขแบบกลุ่ม
            </button>
          )}
          {!loading && isBulkEditMode && (
            <div className="flex gap-2">
              <button
                onClick={exitBulkEditMode}
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={isBulkSubmitting}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleBulkSave}
                className="bg-amber-500 text-white hover:bg-amber-600 px-4 py-2 rounded disabled:opacity-50 transition-colors"
                disabled={!hasChanges() || isBulkSubmitting}
              >
                {isBulkSubmitting ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
              </button>
            </div>
          )}
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
                  <th className="p-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((item) => {
                  const isChanged = isBulkEditMode && bulkChanges.has(item.id) && bulkChanges.get(item.id) !== item.current_qty;
                  return (
                    <tr key={item.id} className={`border-t ${isChanged ? 'bg-amber-50' : ''}`}>
                      <td className="p-4 font-medium">{item.name}</td>
                      <td className="p-4 text-right">
                        {isBulkEditMode ? (
                          <input
                            type="number"
                            value={bulkChanges.get(item.id) ?? item.current_qty}
                            onChange={(e) => handleBulkChange(item.id, e.target.value)}
                            className="border border-amber-300 bg-amber-50 p-1 w-24 text-right rounded"
                            min="0"
                            step="any"
                          />
                        ) : (
                          <>
                            <span className="text-lg font-semibold">{item.current_qty}</span>
                            <span className="text-gray-500 ml-1">{item.unit}</span>
                          </>
                        )}
                      </td>
                      <td className="p-4 text-right text-gray-500">{item.min_qty} {item.unit}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatus(item)}`}>
                          {getStatusLabel(item)}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {isBulkEditMode ? (
                          <span className="text-amber-600 font-medium">กำลังแก้ไข</span>
                        ) : (
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-primary-600 hover:text-primary-800 font-medium"
                          >
                            แก้ไข
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredAndSorted.length === 0 && (
              <p className="p-4 text-center text-gray-500">ไม่พบวัตถุดิบที่ค้นหา</p>
            )}
          </div>
        )}

        {/* Bulk edit note field */}
        {isBulkEditMode && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <label className="block text-sm font-medium mb-2">หมายเหตุสำหรับการแก้ไขแบบกลุ่ม</label>
            <textarea
              value={bulkNote}
              onChange={(e) => setBulkNote(e.target.value)}
              className="w-full p-2 border rounded bg-white"
              rows={2}
              placeholder="ระบุเหตุผลสำหรับการแก้ไขครั้งนี้..."
            />
            {bulkSubmitError && (
              <div className="mt-3 p-3 bg-red-100 text-red-700 rounded">
                {bulkSubmitError}
              </div>
            )}
            {bulkSubmitSuccess && (
              <div className="mt-3 p-3 bg-green-100 text-green-700 rounded">
                {bulkSubmitSuccess}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedIngredient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">ปรับปรุงสต็อก</h2>

            <div className="mb-4">
              <p className="font-medium text-lg">{selectedIngredient.name}</p>
              <p className="text-gray-600">
                คงเหลือ: <span className="font-semibold">{selectedIngredient.current_qty} {selectedIngredient.unit}</span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">ประเภทการปรับปรุง</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="adjustmentType"
                    value="in"
                    checked={adjustmentType === 'in'}
                    onChange={() => setAdjustmentType('in')}
                  />
                  <span>เพิ่มสต็อก</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="adjustmentType"
                    value="out"
                    checked={adjustmentType === 'out'}
                    onChange={() => setAdjustmentType('out')}
                  />
                  <span>ลดสต็อก</span>
                </label>
              </div>
            </div>

            {/* Receipt/Invoice Section - only for Stock In */}
            {adjustmentType === 'in' && (
              <div className="mb-4 border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setReceiptCollapsed(!receiptCollapsed)}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-left flex justify-between items-center"
                >
                  <span className="font-medium">ใบเสร็จ/ใบ invoice</span>
                  <span>{receiptCollapsed ? '▼' : '▲'}</span>
                </button>
                {!receiptCollapsed && (
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">เลขที่ invoice</label>
                      <input
                        type="text"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="เช่น INV-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">ชื่อผู้ขาย/ร้าน</label>
                      <input
                        type="text"
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="เช่น ร้านค้าส่ง ก."
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">วันที่ใบเสร็จ</label>
                      <input
                        type="date"
                        value={receiptDate}
                        onChange={(e) => setReceiptDate(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">ยอดรวมใบเสร็จ</label>
                      <input
                        type="number"
                        value={receiptTotal}
                        onChange={(e) => setReceiptTotal(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">จำนวน</label>
              <input
                type="number"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
                className="w-full p-2 border rounded"
                min="0"
                step="any"
                placeholder="0"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">หมายเหตุ (必填)</label>
              <textarea
                value={adjustmentNote}
                onChange={(e) => setAdjustmentNote(e.target.value)}
                className="w-full p-2 border rounded"
                rows={2}
                placeholder="ระบุเหตุผล..."
              />
            </div>

            {submitError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {submitError}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {successMsg}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={isSubmitting}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAdjustStock}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยัน'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
