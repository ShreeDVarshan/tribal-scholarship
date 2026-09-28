export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar || aadhaar.length < 4) return 'XXXX XXXX XXXX';
  return `XXXX XXXX ${aadhaar.slice(-4)}`;
}

export function maskMobile(mobile: string): string {
  if (!mobile || mobile.length < 6) return '**********';
  return `${mobile.slice(0, 2)}${'*'.repeat(mobile.length - 4)}${mobile.slice(-2)}`;
}

export function maskAccount(account: string): string {
  if (!account || account.length < 4) return '****';
  return `${'*'.repeat(account.length - 4)}${account.slice(-4)}`;
}

export function maskEmail(email: string): string {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  const masked = user.slice(0, 2) + '*'.repeat(Math.max(0, user.length - 2));
  return `${masked}@${domain}`;
}

export function maskDbtReference(ref: string): string {
  if (!ref || ref.length < 6) return 'JSS***XXXX';
  return `JSS***${ref.slice(-4)}`;
}
