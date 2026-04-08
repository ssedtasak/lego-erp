import liff from '@line/liff';

const initLiff = async () => {
  try {
    await liff.init({ liffId: import.meta.env.VITE_LINE_LIFF_ID || '' });
    return liff.isLoggedIn();
  } catch (error) {
    console.error('LIFF init failed:', error);
    return false;
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

export default initLiff;
