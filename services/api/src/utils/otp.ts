import bcrypt from 'bcryptjs';

const DEMO_OTP = process.env.DEMO_OTP || '123456';
const DEMO_MOBILE = process.env.DEMO_STUDENT_MOBILE || '9999999999';

export function generateOTP(): string {
  // Always return demo OTP for prototype
  return DEMO_OTP;
}

export async function hashOTP(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

export async function verifyOTP(mobile: string, otp: string, hashedOtp: string | null): Promise<boolean> {
  // Demo mode: always accept DEMO_OTP for any mobile
  if (otp === DEMO_OTP) return true;
  if (!hashedOtp) return false;
  return bcrypt.compare(otp, hashedOtp);
}

export function getOTPExpiry(): Date {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 10); // 10 minute expiry
  return d;
}
