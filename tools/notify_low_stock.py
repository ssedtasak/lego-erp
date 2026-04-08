#!/usr/bin/env python3
"""
notify_low_stock.py
Scans ingredients below min_qty and sends LINE notifications.
Run daily via cron or supabase edge function.
"""

import os
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
LINE_NOTIFY_TOKEN = os.getenv("LINE_NOTIFY_TOKEN")

def get_low_stock_items():
    """Fetch ingredients where current_qty < min_qty"""
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
    result = sb.rpc("get_shopping_list").execute()
    return result.data

def send_line_notify(message: str):
    """Send notification via LINE Notify"""
    import urllib.request
    data = f"message={urllib.parse.quote(message)}".encode("utf-8")
    req = urllib.request.Request(
        "https://notify-api.line.me/api/notify",
        data=data,
        headers={"Authorization": f"Bearer {LINE_NOTIFY_TOKEN}"}
    )
    with urllib.request.urlopen(req) as resp:
        return resp.status == 200

def main():
    items = get_low_stock_items()
    if not items:
        print("No low stock items found.")
        return

    message = "⚠️ LEGO ERP: วัตถุดิบต่ำกว่าขั้นต่ำ\n\n"
    for item in items:
        message += f"• {item['name']}: {item['current_qty']} {item['unit']} (ต้องซื้อ {item['needed_qty']} {item['unit']})\n"

    if LINE_NOTIFY_TOKEN:
        success = send_line_notify(message)
        print(f"LINE notification {'sent' if success else 'failed'}")
    else:
        print(message)

if __name__ == "__main__":
    import urllib.parse
    main()
