// import mongoose, { Schema, Document } from 'mongoose';

// interface QuestionType {
//     question: string;
//     options: string[];
//     correctAnswer: string;
// }
// interface QuestionType extends Document {
//     question: string;
//     options: string[];
//     correctAnswer: string;
//     topicId: mongoose.Types.ObjectId;
// }

// interface CourseType extends Document {
//     questions: QuestionType[];
//     explanation: string;
// }
// const questionSchema = new Schema<QuestionType>({
//     question: { type: String, required: true },
//     options: [{ type: String, required: true }],
//     correctAnswer: { type: String, required: true },

// });

// const questionCourseSchema = new Schema<CourseType>({
//     questions: [{ type: questionSchema, required: true }],
//     explanation: { type: String },
// });

// const Questions = mongoose.model<CourseType>('Questions', questionCourseSchema);

// export default Questions;

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

