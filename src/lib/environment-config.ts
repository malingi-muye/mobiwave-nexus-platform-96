
import SecurityManager from './security';

interface EnvironmentConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    auditLogging: boolean;
    encryption: boolean;
    tlsRequired: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordPolicy: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
    };
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableConsole: boolean;
    enableRemote: boolean;
  };
}

class EnvironmentManager {
  private static instance: EnvironmentManager;
  private config: EnvironmentConfig;
  private securityManager: SecurityManager;

  private constructor() {
    this.securityManager = SecurityManager.getInstance();
    this.config = this.loadConfig();
    this.validateEnvironment();
  }

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  private loadConfig(): EnvironmentConfig {
    const env = import.meta.env.VITE_NODE_ENV || 'development';
    
    return {
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      environment: env as 'development' | 'staging' | 'production',
      features: {
        auditLogging: env === 'production' || import.meta.env.VITE_ENABLE_AUDIT_LOGGING === 'true',
        encryption: env === 'production' || import.meta.env.VITE_ENABLE_ENCRYPTION === 'true',
        tlsRequired: env === 'production'
      },
      security: {
        sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000'), // 1 hour
        maxLoginAttempts: parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS || '5'),
        passwordPolicy: {
          minLength: 8,
          requireSpecialChars: true,
          requireNumbers: true
        }
      },
      logging: {
        level: (import.meta.env.VITE_LOG_LEVEL as any) || 'info',
        enableConsole: env !== 'production',
        enableRemote: env === 'production'
      }
    };
  }

  private validateEnvironment(): void {
    if (this.config.features.tlsRequired && !this.securityManager.validateTLSConfig()) {
      console.error('TLS is required but not properly configured');
      throw new Error('TLS configuration validation failed');
    }

    if (this.config.environment === 'production') {
      const requiredEnvVars = [
        'VITE_API_URL',
        'VITE_ENCRYPTION_KEY'
      ];

      for (const envVar of requiredEnvVars) {
        if (!import.meta.env[envVar]) {
          console.error(`Required environment variable ${envVar} is missing`);
          throw new Error(`Missing required environment variable: ${envVar}`);
        }
      }
    }
  }

  getConfig(): EnvironmentConfig {
    return { ...this.config };
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  getApiUrl(): string {
    return this.config.apiUrl;
  }

  getSecureApiKey(keyName: string): string | null {
    const encryptedKey = localStorage.getItem(`encrypted_${keyName}`);
    if (!encryptedKey) return null;

    try {
      return this.securityManager.decryptApiKey(encryptedKey);
    } catch (error) {
      console.error('Failed to decrypt API key:', error);
      return null;
    }
  }

  setSecureApiKey(keyName: string, apiKey: string): void {
    const encryptedKey = this.securityManager.encryptApiKey(apiKey);
    localStorage.setItem(`encrypted_${keyName}`, encryptedKey);
  }

  removeSecureApiKey(keyName: string): void {
    localStorage.removeItem(`encrypted_${keyName}`);
  }
}

export default EnvironmentManager;
