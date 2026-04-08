'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

type Alert = {
  id: string;
  ingredient_id: string;
  message: string;
  is_sent: boolean;
  sent_at: string | null;
  created_at: string;
  ingredient?: { name: string };
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    const { data } = await supabase
      .from('alerts')
      .select('*, ingredient:ingredients(name)')
      .order('created_at', { ascending: false })
      .limit(50);
    setAlerts(data || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">การแจ้งเตือน</h1>

        {loading ? (
          <p>กำลังโหลด...</p>
        ) : alerts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">ยังไม่มีการแจ้งเตือน</div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.is_sent
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{alert.ingredient?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    alert.is_sent ? 'bg-gray-200' : 'bg-yellow-200'
                  }`}>
                    {alert.is_sent ? 'ส่งแล้ว' : 'รอส่ง'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(alert.created_at).toLocaleString('th-TH')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
