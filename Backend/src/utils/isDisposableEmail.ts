import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

// A list of common disposable email domains
const disposableDomains = new Set([
  'mailinator.com',
  'temp-mail.org',
  'guerrillamail.com',
  '10minutemail.com',
  'yopmail.com',
  'trashmail.com',
  'emailondeck.com',
  'maildrop.cc',
  'mohmal.com',
  'dispostable.com',
  'getairmail.com',
  'incognitomail.com',
  'sharklasers.com',
  'guerrillamail.biz',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'grr.la',
  'tempmail.net',
  'temp-mail.ru',
  'temp-mail.com',
  'dropmail.me',
  'minuteinbox.com',
  'disposable.com',
  'fake-base.com',
  'fake-mail.com',
  'fake-mail.net',
  'fake-mail.org',
  'fakemail.net',
  'fakemail.org',
  'fakemail.com',
]);

/**
 * Validates if an email is from a disposable provider or has no valid MX records.
 * @param email The email address to check
 * @returns Object indicating if invalid and the reason
 */
export const validateEmailHost = async (email: string): Promise<{ isValid: boolean; reason?: string }> => {
  const domain = email.split('@')[1];
  if (!domain) {
    return { isValid: false, reason: 'Invalid email format' };
  }

  // 1. Check against blocklist
  if (disposableDomains.has(domain.toLowerCase())) {
    return { isValid: false, reason: 'Temporary or disposable emails are not allowed' };
  }

  // 2. Perform DNS MX Check (Ensures "false" or non-existent domains are blocked)
  try {
    const mxRecords = await resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { isValid: false, reason: 'The email domain does not have valid mail exchange records' };
    }
  } catch (error) {
    // If ENOTFOUND or ENODATA, it's definitely an invalid domain for receiving mail
    return { isValid: false, reason: 'The email domain appears to be invalid or non-existent' };
  }

  return { isValid: true };
};
