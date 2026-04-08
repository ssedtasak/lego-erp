import liff from '@line/liff';

const initLiff = async (): Promise<{ ok: boolean; error?: string }> => {
  const liffId = import.meta.env.VITE_LINE_LIFF_ID || '';
  if (!liffId) {
    const msg = 'VITE_LINE_LIFF_ID is not set — check Vercel environment variables';
    console.error(msg);
    return { ok: false, error: msg };
  }
  try {
    console.log('LIFF init with ID:', liffId);
    await liff.init({ liffId });
    console.log('LIFF init success, logged in:', liff.isLoggedIn());
    return { ok: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('LIFF init failed:', msg);
    return { ok: false, error: msg };
  }
};

export const getUserProfile = async () => {
  if (!liff.isLoggedIn()) return null;
  try {
    return await liff.getProfile();
  } catch {
    return null;
  }
};

export const sendMessage = async (messages: { type: 'text'; text: string }[]) => {
  if (!liff.isLoggedIn()) return false;
  try {
    await liff.sendMessages(messages);
    return true;
  } catch {
    return false;
  }
};

export type LiffInitResult = { ok: boolean; error?: string };
export default initLiff;
