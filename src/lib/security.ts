
import CryptoJS from 'crypto-js';

class SecurityManager {
  private static instance: SecurityManager;
  private encryptionKey: string;

  private constructor() {
    // In production, this should come from a secure key management service
    this.encryptionKey = process.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-prod';
  }

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  encryptApiKey(apiKey: string): string {
    return CryptoJS.AES.encrypt(apiKey, this.encryptionKey).toString();
  }

  decryptApiKey(encryptedKey: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedKey, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  hashPassword(password: string): string {
    return CryptoJS.SHA256(password + this.encryptionKey).toString();
  }

  generateSecureToken(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  validateTLSConfig(): boolean {
    // Check if TLS is properly configured
    if (typeof window !== 'undefined') {
      return window.location.protocol === 'https:';
    }
    return process.env.NODE_ENV === 'production';
  }
}

export default SecurityManager;
