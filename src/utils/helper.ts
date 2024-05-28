export const validateEmail = (email: string) => {
  const re = /^.+@(?:[\w-]+\.)+\w+$/
  return re.test(email)
}

export const getAddress = (location?: any) => {
  return `${location?.address},  ${location?.ward.name}, ${location?.district.name}, ${location?.province.name}`
}
