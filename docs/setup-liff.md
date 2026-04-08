# LEGO ERP - Setup Guide: LINE LIFF

## Step 1: Create LINE Channel

1. Go to [LINE Developer Console](https://developers.line.biz/)
2. Create a **Messaging API** channel
3. Copy your **Channel ID** and **Channel Secret**

## Step 2: Create LIFF App

1. In your Messaging API channel, go to **LIFF** tab
2. Click **Add LIFF app**
3. Set:
   - **LIFF app name**: `LEGO ERP Staff`
   - **Size**: `Compact` (for mobile)
   - **Endpoint URL**: `https://your-domain.com` (or localhost for dev)
   - **Scopes**: `openid`, `profile`
4. Copy your **LIFF ID** (starts with `LIFF-`)

## Step 3: Configure Environment

In `apps/liff/.env`:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_LINE_LIFF_ID=LIFF-xxxxxxxxxxxx
VITE_LINE_CHANNEL_ID=1234567890
```

## Step 4: Set Up LINE Login (Optional)

If using LINE Login instead of LIFF:
1. Go to **LINE Login** tab in Developer Console
2. Create a LINE Login channel
3. Set callback URL to your app's `/callback` route

## Step 5: Add to LINE App

1. In Messaging API channel settings, go to **Messaging API** tab
2. Set **Auto-reply** to `Disable`
3. Add the LIFF app to your LINE Official Account's menu

## Testing Locally

```bash
cd apps/liff
npm install
npm run dev
```

Use [LINE Lite](https://line.me/en/download) or ngrok to test LIFF locally:
```bash
ngrok http 3000
```

Update the LIFF endpoint URL in LINE Developer Console to your ngrok URL.

## LIFF SDK Reference

```typescript
import liff from '@line/liff';

// Initialize
await liff.init({ liffId: 'your-liff-id' });

// Check login
if (liff.isLoggedIn()) {
  const profile = await liff.getProfile();
}

// Send messages
await liff.sendMessages([{ type: 'text', text: 'Hello!' }]);
```

## Common Issues

**"Permission denied"**
→ Ensure LIFF scope includes `openid` and `profile`

**Blank page on LINE**
→ Check browser console for JavaScript errors
→ Verify endpoint URL matches exactly

**Login fails**
→ Verify Channel ID is correct
→ Check that LIFF ID format is `LIFF-xxxxxxxxxx`
