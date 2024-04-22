import mongoose, { Schema, Document } from 'mongoose';

interface QuestionType {
    question: string;
    options: string[];
    correctAnswer: string;
}
interface CourseType extends Document {
    title: string;
    description: string;
    totalQuestions: number | string;
    price: number | string;
    totalMarks: number | string;
    timeDuration: {
        hh: string | number;
        mm: string | number;
        ss: string | number;
    };
    questions: QuestionType[];
    explanation: {
        text: string,
        image: {
            public_id: string,
            url: string
        }

    }
}

const QuestionSchema = new Schema<QuestionType>({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true }
});

const CourseSchema = new Schema<CourseType>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    totalQuestions: { type: Schema.Types.Mixed, required: true },
    price: { type: Schema.Types.Mixed, required: true },
    totalMarks: { type: Schema.Types.Mixed, required: true },
    timeDuration: {
        hh: { type: Schema.Types.Mixed, },
        mm: { type: Schema.Types.Mixed, },
        ss: { type: Schema.Types.Mixed, }
    },
    questions: [{ type: QuestionSchema, required: true }],
    explanation: {
        text: {
            type: String,
        },
        image: {
            public_id: {
                type: String
            },
            url: {
                type: String
            }
        }

    }
});

const QuizCourse = mongoose.model<CourseType>('QuizQuestions', CourseSchema);

export default QuizCourse;
