'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary-600">LEGO ERP</h1>
          <p className="text-gray-600">ระบบจัดการสต็อกวัตถุดิบ</p>
          {user && (
            <button
              onClick={handleLogout}
              className="mt-2 text-sm text-gray-500 hover:text-red-600 flex items-center gap-1 mx-auto"
            >
              <LogOut size={14} /> ออกจากระบบ
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/ingredients"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-2">จัดการวัตถุดิบ</h2>
            <p className="text-gray-600 text-sm">เพิ่ม / แก้ไข / ลบ รายการวัตถุดิบ</p>
          </Link>

          <Link
            href="/inventory"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-2">ตรวจสอบสต็อก</h2>
            <p className="text-gray-600 text-sm">ดูยอดคงเหลือปัจจุบัน</p>
          </Link>

          <Link
            href="/transactions"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-2">รายการเคลื่อนไหว</h2>
            <p className="text-gray-600 text-sm">ดูประวัติการรับเข้า / ใช้ออก</p>
          </Link>

          <Link
            href="/reports"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-2">รายงานค่าใช้จ่าย</h2>
            <p className="text-gray-600 text-sm">สรุปยอดเงินที่จ่ายไปกับวัตถุดิบ</p>
          </Link>

          <Link
            href="/shopping-list"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-2">รายการซื้อวันนี้</h2>
            <p className="text-gray-600 text-sm">วัตถุดิบที่ต้องสั่งเพิ่ม</p>
          </Link>

          <Link
            href="/alerts"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-2">การแจ้งเตือน</h2>
            <p className="text-gray-600 text-sm">ดูสถานะการแจ้งเตือน</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
