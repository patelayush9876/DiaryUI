const DIARY_KEY_STORAGE_PREFIX = 'diary_crypto_key_v1';
const DEFAULT_ALGORITHM = 'aes-256-gcm';
const DEFAULT_CIPHER_VERSION = 'webcrypto-v1';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toBase64 = (bytes: Uint8Array): string => {
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
};

const fromBase64 = (value: string): Uint8Array => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

const getStorageKey = (userScope = 'anonymous') => `${DIARY_KEY_STORAGE_PREFIX}:${userScope}`;

const getUserScopedKeyMaterial = (userScope?: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(getStorageKey(userScope));
};

const persistUserScopedKeyMaterial = (value: string, userScope?: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(getStorageKey(userScope), value);
};

const ensureKeyMaterial = (userScope?: string): Uint8Array => {
  const existing = getUserScopedKeyMaterial(userScope);

  if (existing) {
    return fromBase64(existing);
  }

  const keyBytes = crypto.getRandomValues(new Uint8Array(32));
  persistUserScopedKeyMaterial(toBase64(keyBytes), userScope);
  return keyBytes;
};

const importDiaryKey = async (userScope?: string): Promise<CryptoKey> => {
  const keyBytes = ensureKeyMaterial(userScope);

  return crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ]);
};

export const encryptDiaryContent = async (content: string, userScope?: string) => {
  const key = await importDiaryKey(userScope);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(content)
  );

  return {
    encryptedContent: toBase64(new Uint8Array(encrypted)),
    iv: toBase64(iv),
    algorithm: DEFAULT_ALGORITHM,
    cipherVersion: DEFAULT_CIPHER_VERSION,
  };
};

export const decryptDiaryContent = async (
  encryptedContent?: string,
  iv?: string,
  userScope?: string
) => {
  if (!encryptedContent || !iv) {
    return '';
  }

  try {
    const key = await importDiaryKey(userScope);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(iv) },
      key,
      fromBase64(encryptedContent)
    );

    return decoder.decode(decrypted);
  } catch {
    return '[Unable to decrypt this entry on this device]';
  }
};
