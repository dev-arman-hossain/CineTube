import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

// Massive list of disposable domains (Top ~200 most common + common prefixes)
const disposableDomains = new Set([
  'mailinator.com', 'temp-mail.org', 'guerrillamail.com', '10minutemail.com', 'yopmail.com', 
  'trashmail.com', 'emailondeck.com', 'maildrop.cc', 'mohmal.com', 'dispostable.com', 
  'getairmail.com', 'incognitomail.com', 'sharklasers.com', 'guerrillamail.biz', 
  'guerrillamail.de', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamailblock.com', 
  'pokemail.net', 'spam4.me', 'grr.la', 'tempmail.net', 'temp-mail.ru', 'temp-mail.com', 
  'dropmail.me', 'minuteinbox.com', 'disposable.com', 'fake-base.com', 'fake-mail.com', 
  'fake-mail.net', 'fake-mail.org', 'fakemail.net', 'fakemail.org', 'fakemail.com',
  '1secmail.com', '1secmail.net', '1secmail.org', 'disroot.org', 'tutanota.com',
  'mail-temp.com', 'pwned.com', 'quick-mail.xyz', 'dead-mail.com', 'throwawaymail.com',
  'jetable.org', 'tempmail.ninja', 'crazymailing.com', 'mytrashmail.com', 'mailness.com',
  // ... adding more from the recently fetched list
  '0-mail.com', '00.msk.ru', '000email.com', '01gmail.com', '1-tm.com', '10minemail.com',
  '10minutemail.be', '10minutemail.co.uk', '10minutemail.nl', '10minutemail.pl',
  '12minutemail.com', '12hourmail.com', '24hourmail.com', '33mail.com', 'anonbox.net',
  'antireg.com', 'armyspy.com', 'binkmail.com', 'bobmail.info', 'boxbox.me',
  'chimpmail.com', 'customelements.net', 'dayrep.com', 'didntreceive.com',
  'discard.email', 'disposable.com', 'dripmail.xyz', 'dropmail.me', 'e4ward.com',
  'email-temp.com', 'emailfake.com', 'email-fake.ml', 'fakeinbox.com', 'fake-mail.net',
  'firemail.at', 'fmctest.com', 'getnada.com', 'gishpuppy.com', 'grr.la',
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz',
  'incognitomail.com', 'inboxalias.com', 'instamail.cc', 'is-not-certified.com',
  'it-is-not.me', 'jetable.org', 'kasmail.com', 'laste.ml', 'lazy-mail.com',
  'mail-temp.com', 'maildrop.cc', 'mailforspam.com', 'mailhub.io', 'mailimate.com',
  'mailinator.com', 'mailness.com', 'mail-on.me', 'mail-temp.com', 'mailtothis.com',
  'meltmail.com', 'mintemail.com', 'misterpuffin.com', 'moakt.com', 'mohmal.com',
  'mytrashmail.com', 'nepwk.com', 'nonspam.ws', 'notsharingmy.info', 'nowmymail.com',
  'openmail.host', 'our-mail.com', 'owlymail.com', 'pachamail.com', 'pawnmail.com',
  'pokemail.net', 'pookmail.com', 'powpows.com', 'pro-service.it', 'pwned.it',
  'rancid-mail.com', 'reid-mail.com', 'rhyta.com', 'safety-mail.com', 'sendamail.net',
  'sharklasers.com', 'sibamail.com', 'signupsucker.com', 'slopsbox.com', 'soodonims.com',
  'spam4.me', 'spam-cleaner.de', 'spam-cleaner.com', 'spamfree.it', 'spamavert.com',
  'spamcorptastic.com', 'spam-free.it', 'spamfree24.com', 'spamgourmet.com',
  'spamhole.com', 'spam-mail.top', 'spam-mail.xyz', 'spamsheriff.com', 'stumpymail.com',
  'superrito.com', 'suremail.info', 't-mail.at', 'teewars.com', 'temp-mail.org',
  'temp-mail.ru', 'tempmail.com', 'tempmail.de', 'tempmail.de.com', 'tempmail.it',
  'tempmail.net', 'tempmail24.org', 'tempmailaddress.com', 'temporarymail.net',
  'temp-poczta.pl', 'temp-registration.com', 'throwawaymail.com', 'tradermail.info',
  'trash-mail.at', 'trashmail.at', 'trashmail.com', 'trashmail.me', 'trashmail.net',
  'trash-mail.com', 'trustmyself.com', 'u-mail.at', 'u-mail.pl', 'v-mail.at',
  've-mail.com', 'very-fake-mail.com', 'warners-mail.com', 'wegwerfadresse.de',
  'wegwerfmail.de', 'yopmail.com', 'yopmail.fr', 'yopmail.net', 'zippymail.info'
]);

// Common patterns for fake/bot names
const fakePrefixes = ['asdf', 'test', 'fake', 'temp', 'qwer', 'zxcv', '1234', 'abcd', 'qwerty', 'admin', 'root', 'dummy'];

/**
 * Validates if an email is from a disposable provider or appears "fake" via heuristics.
 */
export const validateEmailHost = async (email: string): Promise<{ isValid: boolean; reason?: string }> => {
  const parts = email.split('@');
  if (parts.length !== 2) {
    return { isValid: false, reason: 'Invalid email format' };
  }

  const prefix = parts[0].toLowerCase();
  const domain = parts[1].toLowerCase();

  // 1. Domain Check (Massive Blocklist)
  if (disposableDomains.has(domain)) {
    return { isValid: false, reason: 'Temporary or disposable emails are not allowed' };
  }

  // 2. Fake Prefix Heuristics (Stops "asdf@gmail.com", "test1234@yahoo.com")
  // Check if prefix is too short for common providers
  const majorProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
  if (majorProviders.includes(domain) && prefix.length < 5) {
    return { isValid: false, reason: 'Please use a more recognizable and permanent email address' };
  }

  // Check for common "fake" strings
  for (const fake of fakePrefixes) {
    if (prefix.includes(fake)) {
      return { isValid: false, reason: 'This email address appears to be invalid or for testing purposes only' };
    }
  }

  // Entropy check (Too many random characters / no vowels)
  const vowels = prefix.match(/[aeiou]/gi);
  if (prefix.length > 8 && (!vowels || vowels.length < 2)) {
    return { isValid: false, reason: 'The email address format looks suspicious' };
  }

  // 3. DNS MX Check (Ensures real domain)
  try {
    const mxRecords = await resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { isValid: false, reason: 'The email domain does not have valid mail exchange records' };
    }
  } catch (error) {
    return { isValid: false, reason: 'The email domain appears to be invalid or non-existent' };
  }

  return { isValid: true };
};

