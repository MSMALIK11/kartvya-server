import mongoose, { Schema, Document, Types } from 'mongoose'
export interface ITopicDocument extends Document {
    subjectId: Schema.Types.ObjectId,
    title: string,
    totalQuestion: number,
    duration: number,
    totalMark: number,
    totalAttempt: number,
    hasAccess: boolean,
}
const topicSchema: Schema<ITopicDocument> = new Schema({
    subjectId: {
        type: mongoose.Types.ObjectId,
        ref: 'TestSubject',

    },
    title: {
        type: String,
        required: [true, 'Title is required.'],
    },
    totalQuestion: {
        type: Number,
        required: [true, 'Question count is required.'],
        default: 0
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required.'],
    },
    totalMark: {
        type: Number,
        required: [true, 'Total mark is required.'],
        default: 0,
    },
    totalAttempt: {
        type: Number,
        default: 0
    },
    hasAccess: {
        type: Boolean,
    }

})

const Topic = mongoose.model<ITopicDocument>("Topic", topicSchema)
export default Topic