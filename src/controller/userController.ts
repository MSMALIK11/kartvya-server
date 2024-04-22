import { Request, Response } from 'express';
import User from '../models/userModal';
import bcrypt from 'bcrypt';
import { transporter } from '../services/sendMail';
import { isValidEmail } from '../helper/isValidEmail';
const signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ status: false, message: 'All fields are required 😉' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ status: false, message: `Invalid Email Id ::${email}` });
    }
    try {
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(401).json({ status: false, message: 'User already exists' });
        }
        const hashPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashPassword,
        });
        await user.save();
        return res.status(200).json({
            status: true,
            message: "You've Successfully Signed Up",
            data: user,
        });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};
const userLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: false, message: 'All fields are required 😉' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ status: false, message: `Invalid Email Id ::${email}` });
    }
    // const mailOptions = {
    //     from: process.env.SMTP_MAIL, // sender address
    //     to: email, // list of receivers
    //     secure: true,
    //     subject: 'Hello', // Subject line
    //     text: 'Hello world?', // plain text body
    //     html: '<b>Hello world?</b>' // html body
    // };
    // await transporter.sendMail(mailOptions, (error: any, info: any) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log('Message sent: %s', info.messageId);
    // });


    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({
            success: false,
            message: 'Please  enter a valid credentials'
        });
        const hashedPassword = user.password || "";
        const match = await bcrypt.compare(password, hashedPassword);
        const token = await user.generateToken();
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        if (match) {
            user.password = undefined;
            return res
                .status(200)
                .cookie('token', token, options)
                .json({
                    success: true,
                    user,
                    token,
                    message: 'Login Successfully Completed 💐',
                });
        } else {
            return res.status(400).json({ message: `Invalid Password::${password}` });
        }
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: 'Internal server error',
            warning: error.message,
        });
    }
};
const userLogout = async (req: Request, res: Response) => {
    res.clearCookie('token', {
        path: '/',
        secure: true,
        expires: new Date(0),
    });
    return res.json({ message: 'Logout successfully ✌️' });
};
const currentUser = async (req: Request, res: Response) => {
    try {
        // Check if req.user exists and is an object
        const user = req.user as any;
        const id = user._id as any || "";
        if (user) {
            const userData = await User.findById(id).select('-password').exec();
            if (userData) {
                return res.status(200).json({ success: true, userData });
            } else {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
        } else {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    } catch (error: any) {
        console.log('Error finding current user: ', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}; const getAllUsers = async (req: Request, res: Response) => {
    const users = await User.find()
    return res.status(200).json({
        success: true,
        users
    })
}
// Change password
const changePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body
    console.log(req.body)
    const user = req.user as any;
    const id = user._id as any || "";
    // Find User 
    const userData = await User.findById(id).select('+password')
    const oldPassword = userData?.password || ""
    // match password
    const matchPassword = await bcrypt.compare(currentPassword, oldPassword)
    if (!matchPassword) {
        return res.status(401).json({
            success: false,
            message: "Current password is incorrect ☹️"
        })
    }
    // hash new passowrd 
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    if (userData) {
        userData.password = hashedPassword
        await userData?.save()
        return res.status(201).json({ message: 'Password updated successfully 😎' });
    }


    // replace old passowrd to new pass 
    // save

}
// 
export { signup, userLogin, userLogout, currentUser, getAllUsers, changePassword }

