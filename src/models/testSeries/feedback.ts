import { timeStamp } from 'console'
import mongoose, { Schema, Document, Types } from 'mongoose'

export interface Ifeedback extends Document {
    userId: Schema.Types.ObjectId,
    message: string,
    rating: number,
}

const feedbackSchema = new Schema<Ifeedback>({
    userId: {
        type: String,
        required: [true, "User ID is requied"]
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    },
    rating: {
        type: Number
    }
})

const Feedback = mongoose.model<Ifeedback>('Feedback', feedbackSchema)

export default Feedback


