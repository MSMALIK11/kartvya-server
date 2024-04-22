import mongoose, { Document, Model, Schema } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { isValidEmail } from '../helper/isValidEmail';
interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    role?: string;
    isVerified: boolean,
    generateToken: () => Promise<string>;
    myCourses: mongoose.Types.ObjectId[];
}

export interface IUserModel extends Model<IUser> { }

const userSchema = new Schema<IUser, IUserModel>({
    name: {
        type: String,
        required: [true, 'Enter your name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter a valid email'],
        unique: true,
        validate: function (value: string) {
            return isValidEmail(value)
        },

    },
    // password: {
    //     type: String,
    //     required: [true, 'Password must be at least 6 characters'],
    //     minlength: 6,
    // },
    password: {
        type: String,
    },
    avatar: {
        public_id: String,
        url: String
    },
    role: {
        type: String,
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    myCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

userSchema.methods.generateToken = async function (this: IUser): Promise<string> {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET || '');
};
// Hash password before save to database
// userSchema.pre<IUser>('save', async function (next) {
//     if (!this.isModified('password')) {
//         next();
//     }
//     try {
//         if (this?.password) {
//             const hashedPassword = await bcrypt.hash(this.password, 10);
//             this.password = hashedPassword || "";
//             next();
//         }
//     } catch (error: any) {
//         next(error);
//     }
// });

// compare password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password)
}
const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
