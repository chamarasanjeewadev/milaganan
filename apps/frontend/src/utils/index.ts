/**
 * Generates an 8-digit unique number
 * Combines timestamp and random numbers to minimize collision probability
 * @returns number - 8 digit unique number
 */
export function generateUniqueEightDigitNumber(): number {
  // Get last 4 digits of current timestamp
  const timestampPart = Date.now() % 10000;

  // Generate 4 random digits
  const randomPart = Math.floor(Math.random() * 10000);

  // Combine both parts and ensure 8 digits by padding if necessary
  let combined = parseInt(
    `${timestampPart}${randomPart.toString().padStart(4, '0')}`,
  );

  // If the number is larger than 8 digits, take the last 8 digits
  if (combined > 99999999) {
    combined = combined % 100000000;
  }

  // If the number is less than 8 digits, pad with leading zeros
  if (combined < 10000000) {
    combined += 10000000;
  }

  return combined;
}
