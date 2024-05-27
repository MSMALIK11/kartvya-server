
import { getMaxListeners } from 'events'
import mongoose, { Schema, Document, Types } from 'mongoose'

enum Status {
    PENDING = 'pending',
    DONE = 'done'
}
interface AnswerSheet extends Document {
    filename: string,
    filepath: string,
    description?: string,
    noOfQuesSubmitted?: number
    instaructor?: Types.ObjectId,
    studentId: Types.ObjectId,
    status?: Status,
    image: {
        url: string,
        public_id: string
    }

}

const answersheetSchema: Schema<AnswerSheet> = new Schema({
    description: {
        type: String,
    },
    noOfQuesSubmitted: {
        type: Number
    },

    instaructor: {
        type: mongoose.Schema.Types.ObjectId,
        res: "User"
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        res: "User"
    },
    filename: {
        type: String
    },
    filepath: {
        type: String
    },
    status: {
        type: String,
        default: 'Pending'

    },
    image: {
        url: String,
        public_id: String
    }
}, { timestamps: true })

const AnswerSheet = mongoose.model<AnswerSheet>('AnswerSheet', answersheetSchema)
export default AnswerSheet