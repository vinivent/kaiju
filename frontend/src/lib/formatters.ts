/**
 * Utility functions for formatting and validating form inputs
 */

/**
 * Formats phone number to Brazilian format: (00) 00000-0000
 */
export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 10) {
    // Format: (00) 0000-0000
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    // Format: (00) 00000-0000
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }
}

/**
 * Formats CEP to Brazilian format: 00000-000
 */
export function formatCEP(value: string): string {
  const numbers = value.replace(/\D/g, "").slice(0, 8);
  return numbers.replace(/(\d{5})(\d)/, "$1-$2");
}

/**
 * Formats currency value to Brazilian format: R$ 0,00
 */
export function formatCurrency(value: string | number): string {
  const numValue =
    typeof value === "string"
      ? parseFloat(value.replace(/\D/g, "")) / 100
      : value;
  if (isNaN(numValue)) return "";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
}

/**
 * Parses currency string to number
 */
export function parseCurrency(value: string): number {
  const numbers = value.replace(/\D/g, "");
  if (!numbers) return 0;
  return parseFloat(numbers) / 100;
}

/**
 * Formats currency input (for input fields)
 */
export function formatCurrencyInput(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (!numbers) return "";

  const cents = parseInt(numbers, 10);
  const reais = cents / 100;

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(reais);
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number (Brazilian format)
 */
export function isValidPhone(phone: string): boolean {
  const numbers = phone.replace(/\D/g, "");
  return numbers.length >= 10 && numbers.length <= 11;
}

/**
 * Validates CEP (Brazilian format)
 */
export function isValidCEP(cep: string): boolean {
  const numbers = cep.replace(/\D/g, "");
  return numbers.length === 8;
}

/**
 * Validates URL format
 */
export function isValidURL(url: string): boolean {
  if (!url.trim()) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats state (UF) to uppercase and limits to 2 characters
 */
export function formatState(value: string): string {
  return value
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Validates CRMV format (basic validation)
 */
export function isValidCRMV(crmv: string): boolean {
  // CRMV format: CRMV-XX 00000 or similar
  const trimmed = crmv.trim();
  if (trimmed.length < 5) return false;
  return /^[A-Z]{0,5}[-]?[A-Z]{0,2}\s?\d+$/i.test(trimmed);
}

/**
 * Formats number input to only allow digits
 */
export function formatNumber(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Validates that a value is not empty or only whitespace
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validates that a number is positive
 */
export function isPositiveNumber(value: number): boolean {
  return value > 0;
}

/**
 * Validates that a number is non-negative
 */
export function isNonNegativeNumber(value: number): boolean {
  return value >= 0;
}

/**
 * Removes all non-digit characters from phone number
 * and ensures it has Brazil country code (55) at the beginning
 */
export function cleanPhoneNumber(phone: string): string {
  const numbers = phone.replace(/\D/g, "");

  // If already starts with 55, return as is
  if (numbers.startsWith("55")) {
    return numbers;
  }

  // If starts with 0, remove it (common in Brazilian numbers)
  const withoutLeadingZero = numbers.startsWith("0")
    ? numbers.slice(1)
    : numbers;

  // Add country code 55 if not present
  return `55${withoutLeadingZero}`;
}

/**
 * Creates WhatsApp link with personalized message
 */
export function createWhatsAppLink(
  phoneNumber: string,
  veterinarianName: string
): string {
  const cleanPhone = cleanPhoneNumber(phoneNumber);
  const message = encodeURIComponent(
    `Olá ${veterinarianName}! Vi seu perfil no site do Kaiju e gostaria de entrar em contato.`
  );
  return `https://wa.me/${cleanPhone}?text=${message}`;
}
