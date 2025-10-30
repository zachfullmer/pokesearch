/**
 * Capitalize the first letter of each word in a string. Only recognizes spaces as word boundaries.
 * @param str String to capitalize.
 */
export function capitalize(str: string) {
  return str
    .split(" ")
    .map(
      (word) => `${word.slice(0, 1).toLocaleUpperCase("en")}${word.slice(1)}`
    )
    .join(" ");
}

/**
 * Check if `subStr` is contained in `str`. Gaps are allowed between any character in `subStr`,
 * as long as all characters in `subStr` are present in `str` in the same order.
 * @param str Parent string to check the contents of.
 * @param subStr Substring which may be contained in parent string.
 */
export function stringContainsBrokenSubstring(str: string, subStr: string) {
  let strIdx = 0;
  let subStrIdx = 0;
  while (strIdx < str.length) {
    if (str[strIdx] == subStr[subStrIdx]) {
      subStrIdx++;
    }
    if (subStrIdx >= subStr.length) {
      return true;
    }
    strIdx++;
  }
  return false;
}
