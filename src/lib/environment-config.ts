
interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  features: {
    encryption: boolean;
    auditLogging: boolean;
    twoFactorAuth: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
  };
}

class EnvironmentManager {
  private static instance: EnvironmentManager;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = {
      supabase: {
        url: "https://xfwtjndfclckgvpvgiaj.supabase.co",
        anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmd3RqbmRmY2xja2d2cHZnaWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NDUyNDIsImV4cCI6MjA2NTEyMTI0Mn0.8ZUZVBHkq9vLuMJJmIECXx6-q40lAJ40C5T8IL3yrNc"
      },
      features: {
        encryption: true,
        auditLogging: true,
        twoFactorAuth: false
      },
      security: {
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true
        }
      }
    };
  }

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  getConfig(): EnvironmentConfig {
    return this.config;
  }

  setSecureApiKey(keyName: string, keyValue: string): void {
    // In a real implementation, this would encrypt and store the key securely
    // For now, we'll use localStorage with a warning
    if (typeof window !== 'undefined') {
      const encryptedKey = btoa(keyValue); // Basic encoding (not real encryption)
      localStorage.setItem(`secure_${keyName}`, encryptedKey);
    }
  }

  getSecureApiKey(keyName: string): string | null {
    if (typeof window !== 'undefined') {
      const encryptedKey = localStorage.getItem(`secure_${keyName}`);
      return encryptedKey ? atob(encryptedKey) : null;
    }
    return null;
  }

  updateSecuritySettings(settings: Partial<EnvironmentConfig['security']>): void {
    this.config.security = { ...this.config.security, ...settings };
  }
}

export default EnvironmentManager;
