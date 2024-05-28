export const REGEX = {
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:<>?~])[A-Za-z\d!@#$%^&*()_+{}|:<>?~]{6,50}$/,
  NUMBER: /\d/,
  SYMBOLS: /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/,
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  ONLY_NUMBER: /^[0-9]*$/
}
