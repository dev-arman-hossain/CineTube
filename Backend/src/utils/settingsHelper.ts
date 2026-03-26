import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(__dirname, '../data/settings.json');

export interface SystemSettings {
  siteName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  emailNotifications: boolean;
}

const defaultSettings: SystemSettings = {
  siteName: 'Cinetube Admin',
  supportEmail: 'support@cinetube.com',
  maintenanceMode: false,
  emailNotifications: true,
};

export const getSystemSettings = (): SystemSettings => {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      // Create data directory if it doesn't exist
      const dataDir = path.dirname(SETTINGS_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
      return defaultSettings;
    }
    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading settings file:', error);
    return defaultSettings;
  }
};

export const updateSystemSettings = (newSettings: Partial<SystemSettings>): SystemSettings => {
  try {
    const current = getSystemSettings();
    const updated = { ...current, ...newSettings };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2));
    return updated;
  } catch (error) {
    console.error('Error updating settings file:', error);
    throw error;
  }
};
