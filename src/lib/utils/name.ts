export function getAvatarLetters(fullName: string): string {
  const words = fullName.split(" ");

  if (words.length === 1) {
    // For a single word, take the first two characters
    return words[0].substring(0, 2).toUpperCase();
  } else {
    // For multiple words, take the first character of the first name and the first character of the last name
    const firstName = words[0].charAt(0);
    const lastName = words[words.length - 1].charAt(0);

    return (firstName + lastName).toUpperCase();
  }
}

export function getLastName(fullName: string) {
  const words = fullName.split(" ");
  return words[words.length - 1];
}
