import { randomInt } from "crypto"

export const generateOtp = (): string => {
    return randomInt(100000, 1000000).toString();
}