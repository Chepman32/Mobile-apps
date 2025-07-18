import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ENCRYPTION_KEY = 'journal_encryption_key';
const ENCRYPTION_ENABLED_KEY = 'encryption_enabled';

class EncryptionServiceClass {
  private encryptionKey: string | null = null;

  async isEncryptionEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(ENCRYPTION_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Failed to check encryption status:', error);
      return false;
    }
  }

  async enableEncryption(userPassword: string): Promise<void> {
    try {
      // Generate a key from the user password
      const key = await this.generateKeyFromPassword(userPassword);
      
      // Store the key securely
      await SecureStore.setItemAsync(ENCRYPTION_KEY, key);
      
      // Mark encryption as enabled
      await AsyncStorage.setItem(ENCRYPTION_ENABLED_KEY, 'true');
      
      this.encryptionKey = key;
    } catch (error) {
      console.error('Failed to enable encryption:', error);
      throw new Error('Failed to enable encryption');
    }
  }

  async disableEncryption(): Promise<void> {
    try {
      // Remove the stored key
      await SecureStore.deleteItemAsync(ENCRYPTION_KEY);
      
      // Mark encryption as disabled
      await AsyncStorage.setItem(ENCRYPTION_ENABLED_KEY, 'false');
      
      this.encryptionKey = null;
    } catch (error) {
      console.error('Failed to disable encryption:', error);
      throw new Error('Failed to disable encryption');
    }
  }

  async authenticate(userPassword: string): Promise<boolean> {
    try {
      const storedKey = await SecureStore.getItemAsync(ENCRYPTION_KEY);
      if (!storedKey) {
        return false;
      }

      const userKey = await this.generateKeyFromPassword(userPassword);
      const isValid = storedKey === userKey;
      
      if (isValid) {
        this.encryptionKey = userKey;
      }
      
      return isValid;
    } catch (error) {
      console.error('Failed to authenticate:', error);
      return false;
    }
  }

  async encrypt(data: string): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }

    try {
      // Simple encryption using base64 encoding with key mixing
      // Note: This is a basic implementation. For production, use proper encryption libraries
      const combined = data + '|' + this.encryptionKey;
      const encoded = Buffer.from(combined).toString('base64');
      return encoded;
    } catch (error) {
      console.error('Failed to encrypt data:', error);
      throw new Error('Encryption failed');
    }
  }

  async decrypt(encryptedData: string): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }

    try {
      // Simple decryption
      const decoded = Buffer.from(encryptedData, 'base64').toString();
      const [data, key] = decoded.split('|');
      
      if (key !== this.encryptionKey) {
        throw new Error('Invalid encryption key');
      }
      
      return data;
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      throw new Error('Decryption failed');
    }
  }

  private async generateKeyFromPassword(password: string): Promise<string> {
    try {
      // Generate a hash from the password
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password + 'daily_journal_salt',
        { encoding: Crypto.CryptoEncoding.HEX }
      );
      return hash;
    } catch (error) {
      console.error('Failed to generate key:', error);
      throw new Error('Key generation failed');
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      // Verify old password first
      const isValid = await this.authenticate(oldPassword);
      if (!isValid) {
        throw new Error('Invalid current password');
      }

      // Generate new key
      const newKey = await this.generateKeyFromPassword(newPassword);
      
      // Store the new key
      await SecureStore.setItemAsync(ENCRYPTION_KEY, newKey);
      
      this.encryptionKey = newKey;
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }

  async hasPasswordSet(): Promise<boolean> {
    try {
      const key = await SecureStore.getItemAsync(ENCRYPTION_KEY);
      return key !== null;
    } catch (error) {
      console.error('Failed to check password:', error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    return this.encryptionKey !== null;
  }

  async logout(): Promise<void> {
    this.encryptionKey = null;
  }

  async generateBackupKey(): Promise<string> {
    try {
      if (!this.encryptionKey) {
        throw new Error('No encryption key available');
      }

      // Generate a backup key that can be used to recover data
      const backupKey = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        this.encryptionKey + 'backup_salt_' + Date.now(),
        { encoding: Crypto.CryptoEncoding.HEX }
      );

      return backupKey;
    } catch (error) {
      console.error('Failed to generate backup key:', error);
      throw new Error('Backup key generation failed');
    }
  }
}

export const EncryptionService = new EncryptionServiceClass();