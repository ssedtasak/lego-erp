import liff from '@line/liff';
import { useState, useEffect } from 'react';
import initLiff, { getUserProfile } from './lib/liff';
import { supabase } from './lib/supabase';
import StockIn from './pages/StockIn';
import StockOut from './pages/StockOut';

type User = {
  lineUserId: string;
  displayName: string;
};

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'stock-in' | 'stock-out'>('home');

  useEffect(() => {
    const init = async () => {
      const result = await initLiff();
      if (!result.ok) {
        setInitError(result.error ?? 'LIFF init failed');
        setIsReady(true);
        return;
      }
      setIsReady(true);

      if (liff.isLoggedIn()) {
        const profile = await getUserProfile();
        if (profile) {
          const newUser = {
            lineUserId: profile.userId,
            displayName: profile.displayName,
          };
          setUser(newUser);
          // Upsert staff profile with role (default: staff)
          await supabase.from('staff_profiles').upsert({
            line_user_id: newUser.lineUserId,
            display_name: newUser.displayName,
            role: 'staff',
          }, { onConflict: 'line_user_id' });
        }
      }
    };
    init();
  }, []);

  const handleLogin = () => {
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">กำลังโหลด...</p>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-xl font-bold text-red-600 mb-2">เริ่มต้นระบบไม่สำเร็จ</h1>
        <p className="text-gray-600 text-sm text-center font-mono bg-white p-3 rounded border border-red-200">{initError}</p>
      </div>
    );
  }

  if (!liff.isLoggedIn()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-primary-600 mb-4">LEGO ERP</h1>
        <p className="text-gray-600 text-center mb-6">เข้าสู่ระบบเพื่อบันทึกสต็อก</p>
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
        >
          เข้าสู่ระบบด้วย LINE
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold">LEGO ERP</h1>
            <p className="text-sm opacity-80">{user?.displayName}</p>
          </div>
        </div>
      </div>

      {/* Page Content */}
      {currentPage === 'home' && (
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setCurrentPage('stock-in')}
              className="p-6 bg-white rounded-lg shadow text-left"
            >
              <h2 className="text-lg font-semibold text-green-600">📥 รับของเข้า</h2>
              <p className="text-gray-600 text-sm">บันทึกการรับวัตถุดิบใหม่</p>
            </button>
            <button
              onClick={() => setCurrentPage('stock-out')}
              className="p-6 bg-white rounded-lg shadow text-left"
            >
              <h2 className="text-lg font-semibold text-orange-600">📤 ใช้ของออก</h2>
              <p className="text-gray-600 text-sm">บันทึกการใช้วัตถุดิบ</p>
            </button>
          </div>
        </div>
      )}

      {currentPage === 'stock-in' && (
        <StockIn staffId={user?.lineUserId || ''} onBack={() => setCurrentPage('home')} />
      )}

      {currentPage === 'stock-out' && (
        <StockOut staffId={user?.lineUserId || ''} onBack={() => setCurrentPage('home')} />
      )}
    </div>
  );
}
