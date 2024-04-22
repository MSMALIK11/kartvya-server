import jwt from 'jsonwebtoken'
import { IUserModel } from '../models/userModal';
import { promises } from 'dns';
interface IActivationToken {
    token: string,
    activationCode: string
}

export const generateToken = (user: { _id: string }) => {
    return jwt.sign({ _id: user._id }, process.env.JWT_SECRET || '');
}
// export const createActivationToken = async (name: string) => {
//     const activationCode = Math.floor(1000 + Math.random() * 900).toString()
//     const token = await jwt.sign({ name: name }, process.env.JWT_SECRET || '');
//     return { activationCode, token }
// }
