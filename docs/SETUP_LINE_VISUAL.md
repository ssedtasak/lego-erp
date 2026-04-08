# LEGO ERP — LINE Developer Console Setup Visual Guide

A step-by-step guide to setting up LINE Developer Console for LEGO ERP with screenshots and common fixes.

**Thai notes:** คำแนะนำภาษาไทยสำหรับจุดสำคัญ

---

## Table of Contents

1. [Create LINE Developer Account](#step-1-create-line-developer-account)
2. [Create a Messaging API Channel](#step-2-create-a-messaging-api-channel)
3. [Create a LIFF App (LINE Login Channel)](#step-3-create-a-liff-app-line-login-channel)
4. [Find LIFF ID, Channel ID, Channel Secret](#step-4-find-liff-id-channel-id-channel-secret)
5. [Set Up LIFF Endpoints](#step-5-set-up-liff-endpoints)
6. [Get Channel Access Token](#step-6-get-channel-access-token)
7. [Common Errors & Fixes](#common-errors--fixes)

---

## Overview

LEGO ERP uses LINE for staff authentication and stock logging. We need:

| Component | Purpose | Where to Create |
|-----------|---------|-----------------|
| **Messaging API channel** | Bot replies, notifications | LINE Official Account Manager |
| **LINE Login channel** | LIFF app for staff login | LINE Developers Console |
| **LIFF app** | Web app inside LINE for stock-in/out | LINE Developers Console |

**Important (2025-2026):** LIFF apps can only be added to **LINE Login** or **LINE MINI App** channels — not directly to Messaging API channels.

---

## Step 1: Create LINE Developer Account

### 1.1 Open LINE Developers Console

1. Open your browser (Chrome, Safari, or Edge)
2. Go to: **[https://developers.line.biz/console/](https://developers.line.biz/console/)**

```
[Screenshot: LINE Developers Console login page]
```

**✅ Success:** You see the LINE Developers Console login page with "Log in" button.

---

### 1.2 Log In with LINE Account

You can log in using:

**Option A: LINE Account (Recommended for Thailand)**
1. Click **"Log in with LINE"**
2. Enter your **LINE email** and **password**
3. Complete any 2FA if enabled

**Option B: Email (Business)**
1. Click **"Log in with email"**
2. Enter your Business ID email and password

```
[Screenshot: Login options - LINE account or email]
```

**Thai note:** ใช้บัญชี LINE ที่ใช้อยู่แล้ว จะสะดวกกว่า

---

### 1.3 First-Time Developer Registration

**If this is your first time logging in**, you may need to register as a developer:

1. Enter your **name** (ใส่ชื่อของคุณ)
2. Enter your **email** (ใส่อีเมลของคุณ)
3. Click **"Register"** (สมัคร)

```
[Screenshot: Developer registration form]
```

**✅ Success:** You see the LINE Developers Console dashboard with providers list.

---

### 1.4 Create a Provider (If None Exists)

A **provider** is your organization/company that owns the channels.

1. On the Console home, click **"Create a new provider"** button

```
[Screenshot: Create a new provider button highlighted]
```

**Or** (if you already have providers):
- Scroll down to **"Providers"** section
- Click the **"Create"** button

```
[Screenshot: Create button in Providers section]
```

---

### 1.5 Enter Provider Name

1. Enter your provider name (e.g., `LEGO ERP` or your restaurant name)
2. Click **"Create"**

```
[Screenshot: Create a new provider dialog]
```

**Note:** Provider name can be your personal name or company name. This is just for organization.

**Thai note:** ใส่ชื่อร้านหรือชื่อบริษัทของคุณ เช่น "ร้านอาหาร XYZ"

**✅ Success:** Provider is created and you see it in the providers list.

---

## Step 2: Create a Messaging API Channel

**Important:** As of September 2024, you can no longer create Messaging API channels directly from the LINE Developers Console. You must create a LINE Official Account first via the LINE Official Account Manager.

### 2.1 Open LINE Official Account Manager

1. Go to: **[https://account.line.biz/signup](https://account.line.biz/signup)**

```
[Screenshot: LINE Business ID registration page]
```

---

### 2.2 Register for Business ID

1. Click **"Register"** (สมัคร)
2. Choose to register with:
   - **LINE account** (ใช้บัญชี LINE ที่มีอยู่) — Recommended
   - **Email** (อีเมล)

```
[Screenshot: Business ID registration options]
```

**Thai note:** ถ้ามีบัญชี LINE อยู่แล้ว เลือก "ลงทะเบียนด้วยบัญชี LINE" จะเร็วกว่า

---

### 2.3 Complete Business ID Registration

1. Enter required information:
   - **Country/Region**: Thailand (ประเทศไทย)
   - **Business type**: Select appropriate type
   - **Company name**: Your restaurant/company name
2. Click **"Register"**

```
[Screenshot: Business ID form filled]
```

**✅ Success:** You receive confirmation and are redirected to LINE Official Account Manager.

---

### 2.4 Create LINE Official Account

After Business ID registration, you should see the entry form for creating a LINE Official Account:

1. Fill in required information:
   - **Account name**: Your restaurant name (e.g., `LEGO ERP`)
   - **Category**: Restaurant / Food & Beverage
   - **Sub-category**: Japanese Restaurant / Sushi
   - **Region**: Thailand
2. Click **"Confirm"** or **"Create"**

```
[Screenshot: LINE Official Account entry form]
```

**Thai note:** ชื่อบัญชีจะเป็นชื่อที่ลูกค้าเห็นใน LINE ดังนั้นตั้งชื่อให้ตรงกับร้านของคุณ

**✅ Success:** Your LINE Official Account is created. You can access it at **[https://manager.line.biz/](https://manager.line.biz/)**.

---

### 2.5 Enable Messaging API

**Now enable Messaging API for your LINE Official Account:**

1. Go to **[https://manager.line.biz/](https://manager.line.biz/)**
2. Select your LINE Official Account
3. Click **"Settings"** (ตั้งค่า)

```
[Screenshot: LINE Official Account Manager dashboard]
```

---

### 2.6 Find Messaging API Option

1. In the left sidebar, look for **"Messaging API"** (or "Messaging API settings")
2. Click to open

```
[Screenshot: Messaging API settings option]
```

**✅ Success:** You see the Messaging API settings page.

---

### 2.7 Enable Messaging API

1. Look for toggle or button to **"Enable Messaging API"** (เปิดใช้งาน Messaging API)
2. Click it

```
[Screenshot: Enable Messaging API button]
```

**Note:** You may be asked to select a provider. Select the same provider you created in Step 1.

**⚠️ Important:** Once you assign a provider, you **cannot change it**. Choose carefully!

```
[Screenshot: Provider selection dialog]
```

**Thai note:** เลือก provider ที่สร้างไว้ในขั้นตอนที่ 1 และต้องเป็น provider เดียวกับ LINE Login channel ที่จะสร้างภายหลัง

**✅ Success:** Messaging API is enabled. You are redirected to LINE Developers Console.

---

### 2.8 Verify Messaging API Channel Created

Back in LINE Developers Console:

1. Select your **provider**
2. You should see **two channels** listed:
   - **LINE Official Account** (messaging icon)
   - **Messaging API** channel

```
[Screenshot: Provider page showing Messaging API channel]
```

**✅ Success:** You see the Messaging API channel in your provider.

---

## Step 3: Create a LIFF App (LINE Login Channel)

**Important:** LIFF apps must be added to a **LINE Login** channel, not a Messaging API channel.

### 3.1 Create LINE Login Channel

1. In LINE Developers Console, with your provider selected
2. Click **"Create new channel"** button

```
[Screenshot: Create new channel button]
```

---

### 3.2 Select Channel Type

1. Select **"LINE Login"** as the channel type

```
[Screenshot: Channel type selection with LINE Login highlighted]
```

**Note:** Do NOT select "Messaging API" — that's for the bot account.

---

### 3.3 Fill in LINE Login Channel Details

| Field | Value | Notes |
|-------|-------|-------|
| **Channel name** | `LEGO ERP Staff` | No "LINE" in the name |
| **Channel description** | `Staff stock management app` | What the app does |
| **App type** | **Web app** | Required for LIFF |
| **Icon image** | Upload restaurant icon | Optional |

```
[Screenshot: LINE Login channel creation form]
```

**⚠️ Important:** 
- Channel name cannot contain "LINE" or similar strings
- App type MUST be "Web app" (not Native app)

**Thai note:** ชื่อช่องห้ามมีคำว่า LINE และ App type ต้องเป็น Web app ถึงจะเพิ่ม LIFF ได้

---

### 3.4 Submit Channel Creation

1. Review the information
2. Click **"Create"** (สร้าง)

```
[Screenshot: Confirm channel creation]
```

**✅ Success:** LINE Login channel is created and you see the channel settings.

---

### 3.5 Add LIFF App

Now add a LIFF app to this LINE Login channel:

1. In the channel settings, click the **"LIFF"** tab

```
[Screenshot: LIFF tab highlighted in channel settings]
```

---

### 3.6 Click Add LIFF App

1. Click the **"Add"** button

```
[Screenshot: Add LIFF app button]
```

---

### 3.7 Fill in LIFF App Details

| Field | Value | Notes |
|-------|-------|-------|
| **LIFF app name** | `LEGO Stock` | Shown when LIFF opens |
| **Size** | `Compact` | For mobile staff use |
| **Endpoint URL** | `https://your-domain.com` | See Step 5 for details |
| **Scopes** | `openid`, `profile` | Required for user info |
| **Add friend option** | `Off` (or `On`) | Optional for your OA |

```
[Screenshot: LIFF app settings form]
```

**Size explanation:**
| Size | Description | Best for |
|------|-------------|----------|
| **Compact** | 50% screen height | Simple forms (stock-in/out) |
| **Tall** | 80% screen height | Scrollable content |
| **Full** | Full screen | Complex apps |

**Thai note:** เลือก Compact เพราะเป็นแอปบันทึก stock ง่ายสุด

---

### 3.8 Save LIFF App

1. Click **"Add"** or **"Save"**

```
[Screenshot: Add button for LIFF app]
```

**✅ Success:** LIFF app is created and you see:
- **LIFF ID** (e.g., `1234567890-AbcdEfgh`)
- **LIFF URL** (e.g., `https://liff.line.me/1234567890-AbcdEfgh`)

---

## Step 4: Find LIFF ID, Channel ID, Channel Secret

### 4.1 LIFF ID (From LIFF Tab)

1. Go to **LIFF** tab of your LINE Login channel
2. You see the LIFF app you created

```
[Screenshot: LIFF app list showing LIFF ID]
```

**LIFF ID Format:** `1234567890-AbcdEfgh` (numbers-letters pattern)

**✅ Success:** LIFF ID looks like: `1234567890-ABCDEFGH`

---

### 4.2 Channel ID and Channel Secret (From Basic Settings)

1. Go to **"Basic settings"** tab of your LINE Login channel

```
[Screenshot: Basic settings tab highlighted]
```

2. Find these values:

| Value | Location | Example |
|-------|----------|---------|
| **Channel ID** | Top of Basic settings page | `1234567890` |
| **Channel Secret** | Below Channel ID | `abcdef1234567890...` |

```
[Screenshot: Channel ID and Channel Secret fields]
```

**Thai note:** Channel ID เป็นตัวเลข 10 หลัก, Channel Secret เป็นสตริงยาว

**✅ Success:** You have:
- `VITE_LINE_LIFF_ID` = `1234567890-ABCDEFGH`
- `VITE_LINE_CHANNEL_ID` = `1234567890`
- `VITE_LINE_CHANNEL_SECRET` = `abcdef...` (long string)

---

### 4.3 Also Get from Messaging API Channel

For the Messaging API bot, also note the Channel ID from the Messaging API channel:

1. Go back to your **provider** page
2. Click on the **Messaging API** channel (not LINE Login)
3. Go to **"Basic settings"** tab
4. Copy the **Channel ID** here too

```
[Screenshot: Messaging API channel basic settings]
```

**Note:** This is different from the LINE Login Channel ID!

**✅ Success:** You now have:
- LINE Login Channel ID (for LIFF)
- Messaging API Channel ID (for bot)

---

## Step 5: Set Up LIFF Endpoints

### 5.1 Understand LIFF URL Structure

Each LIFF app has:
- **LIFF ID**: Unique identifier (e.g., `1234567890-AbcdEfgh`)
- **LIFF URL**: `https://liff.line.me/1234567890-AbcdEfgh`

Staff open this URL in LINE to access the stock app.

```
[Screenshot: LIFF URL format]
```

---

### 5.2 Set Endpoint URL for Development

**For local development with ngrok:**

1. Start your LIFF app locally:
   ```bash
   cd apps/liff && npm run dev
   ```
2. Get ngrok URL:
   ```bash
   ngrok http 3000
   ```
3. Your ngrok URL will be like: `https://abc123.ngrok.io`

```
[Screenshot: ngrok URL in terminal]
```

4. In LINE Developers Console → LIFF tab
5. Click **"Edit"** on your LIFF app
6. Update **Endpoint URL** to your ngrok URL:
   ```
   https://abc123.ngrok.io
   ```

```
[Screenshot: LIFF endpoint URL field]
```

**⚠️ Important:** The URL must be HTTPS (not HTTP).

**Thai note:** Endpoint URL ต้องเป็น HTTPS เท่านั้น ngrok จะสร้าง HTTPS ให้อัตโนมัติ

---

### 5.3 Set Endpoint URL for Production

**When deploying to production:**

1. Deploy your LIFF app to a hosting service (Vercel, Netlify, Railway, etc.)
2. Get your production URL (e.g., `https://lego-staff.vercel.app`)
3. Update the **Endpoint URL** in LIFF settings

```
[Screenshot: Production endpoint URL configuration]
```

**✅ Success:** LIFF app endpoint is configured correctly.

---

### 5.4 Test LIFF URL

Open your LIFF URL in a browser:
```
https://liff.line.me/1234567890-AbcdEfgh
```

**✅ Success:** 
- If logged in: You see your web app
- If not logged in: You see LINE login screen

**If blank page:** See [Common Errors & Fixes](#common-errors--fixes)

---

## Step 6: Get Channel Access Token

The **Channel Access Token** is required for Messaging API (sending notifications, etc.).

### 6.1 Go to Messaging API Channel

1. In LINE Developers Console, select your **provider**
2. Click on the **Messaging API** channel

```
[Screenshot: Messaging API channel selected]
```

---

### 6.2 Go to Messaging API Tab

1. Click the **"Messaging API"** tab at the top

```
[Screenshot: Messaging API tab highlighted]
```

---

### 6.3 Generate Long-Lived Token

1. Scroll down to **"Channel access token"** section
2. Click **"Generate"** or **"Issue"** button

```
[Screenshot: Generate token button]
```

**Note:** There are two types of tokens:
| Token Type | Lifespan | Use Case |
|------------|----------|----------|
| **Short-lived** | 30 days | Testing |
| **Long-lived** | Until revoked | Production |

For LEGO ERP, generate a **long-lived** token.

---

### 6.4 Copy the Token

1. Click the **"Copy"** button next to the generated token

```
[Screenshot: Channel access token with copy button]
```

**⚠️ Warning:** Never expose this token publicly! It gives full access to your Messaging API.

**Thai note:** Token นี้ให้สิทธิ์ใช้งาน Messaging API เต็มรูปแบบ ห้ามแชร์หรือ commit ลง git

**✅ Success:** You have `LINE_CHANNEL_ACCESS_TOKEN` = `abcdef...`

---

### 6.5 Store Token Securely

Add to your `.env` file:

```bash
# LINE Configuration
VITE_LINE_LIFF_ID=1234567890-AbcdEfgh
VITE_LINE_CHANNEL_ID=1234567890
VITE_LINE_CHANNEL_SECRET=abcdef1234567890
LINE_CHANNEL_ACCESS_TOKEN=abcdefghijklmnopqrstuvwxyz
```

```
[Screenshot: .env file with LINE credentials]
```

---

## Common Errors & Fixes

### Error: "Cannot create Messaging API channel from Console"

**Problem:** As of September 2024, you can't create Messaging API channels directly from LINE Developers Console.

**Cause:** LINE changed the process.

**Fix:**
1. Create LINE Official Account via [https://account.line.biz/](https://account.line.biz/)
2. Enable Messaging API from LINE Official Account Manager ([https://manager.line.biz/](https://manager.line.biz/))
3. Messaging API channel will be created automatically

---

### Error: "LIFF app not showing"

**Problem:** Can't find where to add LIFF app.

**Cause:** LIFF apps can only be added to LINE Login or LINE MINI App channels, not Messaging API channels.

**Fix:**
1. Create a separate **LINE Login** channel (Step 3)
2. Add LIFF app to that LINE Login channel
3. The Messaging API channel is for bot messages only

---

### Error: "Endpoint URL must be HTTPS"

**Problem:** Can't save endpoint URL with HTTP URL.

**Cause:** LINE requires HTTPS for LIFF endpoints.

**Fix:**
- For local dev: Use [ngrok](https://ngrok.com/) which provides HTTPS URL
- For production: Deploy to Vercel, Netlify, or Railway (all provide HTTPS)

---

### Error: "Invalid LIFF ID format"

**Problem:** LIFF ID not accepted.

**Cause:** Wrong format.

**Fix:** LIFF ID format is `1234567890-AbcdEfgh` (numbers followed by hyphen and letters).

---

### Error: "Permission denied" when calling LINE API

**Problem:** API calls fail with permission error.

**Cause:** Missing or incorrect token.

**Fix:**
1. Check Channel Access Token is correct
2. Make sure token is not expired (regenerate if needed)
3. Verify Channel ID is correct for the operation

---

### Error: "Channel type not supported for LIFF"

**Problem:** Can't add LIFF to this channel type.

**Cause:** LIFF only works with LINE Login and LINE MINI App channels.

**Fix:**
1. Create a new **LINE Login** channel
2. Add LIFF app there
3. Use Messaging API channel separately for bot

---

### Error: "Provider already assigned, cannot change"

**Problem:** Can't change provider when enabling Messaging API.

**Cause:** Provider was already assigned to the LINE Official Account.

**Fix:**
1. This is permanent — provider cannot be changed once assigned
2. To use a different provider: Create a new LINE Official Account
3. When creating multiple channels, always use the same provider

---

### Error: "Blank page when opening LIFF URL"

**Problem:** LIFF opens but shows blank/white page.

**Cause:** 
- Endpoint URL is wrong
- App has JavaScript errors
- SSL certificate issue

**Fix:**
1. Check browser console for errors (open in external browser)
2. Verify endpoint URL matches your deployed app exactly
3. Make sure your app handles the LIFF URL correctly
4. Try clearing cache and reopening

---

### Error: "Login failed" in LINE app

**Problem:** Staff cannot log in via LINE.

**Cause:**
- Channel ID or LIFF ID is wrong
- LINE Login not properly configured

**Fix:**
1. Verify `VITE_LINE_CHANNEL_ID` in .env matches the LINE Login Channel ID
2. Verify `VITE_LINE_LIFF_ID` matches the LIFF ID
3. Check that LINE Login channel is enabled

---

### Error: "CORS blocked" or "Network error"

**Problem:** API calls from LIFF app fail.

**Cause:** Server not allowing cross-origin requests.

**Fix:**
1. Make sure your backend allows requests from LINE
2. Check Supabase CORS settings include your LIFF domain
3. For local development, use ngrok (CORS-friendly)

---

## Quick Reference: What You Should See

### At the End of Setup, You Have:

| Item | Status | Where to Verify |
|------|--------|-----------------|
| LINE Developer account | ✅ Created | developers.line.biz/console |
| Provider | ✅ Created | Console home |
| LINE Official Account | ✅ Created | manager.line.biz |
| Messaging API channel | ✅ Created | Console → Provider |
| LINE Login channel | ✅ Created | Console → Provider |
| LIFF app | ✅ Added | LINE Login channel → LIFF tab |
| LIFF ID | ✅ Copied | LIFF tab (format: `1234567890-ABCDefgh`) |
| Channel ID (LINE Login) | ✅ Copied | LINE Login → Basic settings |
| Channel ID (Messaging API) | ✅ Copied | Messaging API → Basic settings |
| Channel Secret | ✅ Copied | LINE Login → Basic settings |
| Channel Access Token | ✅ Generated | Messaging API → Messaging API tab |
| .env file | ✅ Created | Project root with all credentials |

---

## Environment Variables for LEGO ERP

After setup, your `.env` file should have:

```bash
# Supabase (from previous guide)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# LINE Configuration
VITE_LINE_LIFF_ID=1234567890-AbcdEfgh
VITE_LINE_CHANNEL_ID=1234567890
VITE_LINE_CHANNEL_SECRET=abcdef1234567890
LINE_CHANNEL_ACCESS_TOKEN=abcdefghijklmnopqrstuvwxyz
```

**Thai note:** ตรวจสอบว่า VITE_ prefix ถูกต้องสำหรับ LIFF app (Vite) และไม่มี VITE_ สำหรับ server-side token

---

## Next Steps

Once LINE Developer Console is set up, proceed to:

1. **Set up Web Dashboard:** `docs/setup-web.md`
2. **Configure LINE Login in LIFF App:** `apps/liff/src/pages/StockPage.tsx`
3. **Test LINE Login flow:** Use LINE Lite on mobile

---

## Provider and Channel Summary for LEGO ERP

```
Provider: LEGO ERP (or your company name)
│
├── LINE Official Account / Messaging API channel
│   ├── Channel ID: (for bot messages)
│   ├── Channel Secret: (for bot)
│   ├── Channel Access Token: (for Messaging API)
│   └── Use: Notifications, auto-reply
│
└── LINE Login channel (for LIFF)
    ├── Channel ID: (for LINE Login)
    ├── Channel Secret: (for LINE Login)
    └── LIFF app: LEGO Stock
        ├── LIFF ID: 1234567890-AbcdEfgh
        ├── LIFF URL: https://liff.line.me/1234567890-AbcdEfgh
        └── Endpoint: https://your-app.vercel.app (or ngrok URL)
```

---

*Created for LEGO ERP — Modular Restaurant Stock Management System*
