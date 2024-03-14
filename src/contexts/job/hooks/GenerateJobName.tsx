function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function generateUniqueJobName() {
  const prefix = 'PP';
  const separator = '_';
  const middle = "DGCS";
  const randomSuffix = generateRandomString(4); // 6 characters for the suffix
  const randomNumbers = generateRandomString(2); // 2 characters for random numbers

  return `${prefix}${separator}${middle}${randomSuffix}${separator}${randomNumbers}`;
}


