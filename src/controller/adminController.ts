import { Request, Response } from "express";
import User from "../models/userModal";
export const updateRole = async (req: Request, res: Response) => {
    const id = req.params.id
    const role = req.body
    console.log('role', role, id)
    try {
        const updatedUser = await User.findOneAndUpdate({ _id: id }, role, { new: true })
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found '
            })
        }
        return res.status(200).json({
            success: true,
            message: 'User role updated successfully to Admin.',
            updatedUser
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }



}