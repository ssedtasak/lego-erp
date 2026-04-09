'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Trash2, CheckCircle } from 'lucide-react';

type Alert = {
  id: string;
  ingredient_id: string;
  message: string;
  is_sent: boolean;
  sent_at: string | null;
  created_at: string;
  ingredient?: { name: string };
};

import BackButton from '@/components/BackButton';

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

  async function markAsSent(alertId: string) {
    await supabase
      .from('alerts')
      .update({ is_sent: true, sent_at: new Date().toISOString() })
      .eq('id', alertId);
    fetchAlerts();
  }

  async function deleteAlert(alertId: string) {
    if (!confirm('ลบการแจ้งเตือนนี้?')) return;
    await supabase.from('alerts').delete().eq('id', alertId);
    fetchAlerts();
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold">การแจ้งเตือน</h1>
          <span className="text-sm text-gray-500">({alerts.length} รายการ)</span>
        </div>

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
                  <div className="flex-1">
                    <p className="font-medium">{alert.ingredient?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      alert.is_sent ? 'bg-gray-200' : 'bg-yellow-200'
                    }`}>
                      {alert.is_sent ? 'ส่งแล้ว' : 'รอส่ง'}
                    </span>
                    {!alert.is_sent && (
                      <button
                        onClick={() => markAsSent(alert.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="ทำเครื่องหมายว่าส่งแล้ว"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="ลบ"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
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
