export function isValidEmail(email: string) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/
    return emailRegex.test(email)
}