import { UAParser } from 'ua-parser-js';

export interface ParsedDevice {
  os: string;
  model: string;
  browser: string;
  type: 'mobile' | 'desktop';
}

export const parseUserAgent = (userAgent: string | undefined): ParsedDevice => {
  if (!userAgent) {
    return { os: 'Unknown', model: 'Unknown', browser: 'Unknown', type: 'desktop' };
  }

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const os = result.os.name || 'Unknown OS';
  const browser = result.browser.name || 'Unknown Browser';
  
  // Specific Handling for Models
  let model = 'Desktop';
  if (result.device.model) {
    const brand = result.device.vendor ? `${result.device.vendor} ` : '';
    model = `${brand}${result.device.model}`;
  } else if (result.device.type) {
    model = result.device.type.charAt(0).toUpperCase() + result.device.type.slice(1);
  }

  return {
    os,
    browser,
    model,
    type: result.device.type === 'mobile' || result.device.type === 'tablet' ? 'mobile' : 'desktop'
  };
};
