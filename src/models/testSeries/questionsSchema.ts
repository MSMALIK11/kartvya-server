

import mongoose, { Schema, Document } from 'mongoose';

interface QuestionDocument extends Document {
    question: string;
    options: string[];
    correctAnswer: string;
    topicId: mongoose.Types.ObjectId;
    explanation?: string
}
const courseSchema = new Schema<QuestionDocument>({
    question: {
        type: String
    },
    options: {
        type: [String]
    },
    correctAnswer: {
        type: String,
        required: true
    },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    explanation: { type: String },
});

const Questions = mongoose.model<QuestionDocument>('Questions', courseSchema);

export default Questions;

