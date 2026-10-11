const MEMBER_KEY = "pdk-member-phone";

let expectedOtp = "";

const wait = () => new Promise((resolve) => setTimeout(resolve, 120));

function makeOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizePhone(value: string) {
  const thaiDigits = "๐๑๒๓๔๕๖๗๘๙";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  return value
    .replace(/[๐-๙]/g, (digit) => String(thaiDigits.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)))
    .replace(/[^\d]/g, "");
}

export async function requestOtp(phone: string) {
  await wait();
  const normalizedPhone = normalizePhone(phone);
  expectedOtp = makeOtp();
  return { phone: normalizedPhone, demoCode: expectedOtp };
}

export async function verifyOtp({ phone, otp }: { phone: string; otp: string }) {
  await wait();
  if (otp.trim() !== expectedOtp) return { ok: false as const };
  try {
    localStorage.setItem(MEMBER_KEY, normalizePhone(phone));
  } catch {
    // Treat unavailable storage as successful in the mock flow.
  }
  return { ok: true as const };
}
