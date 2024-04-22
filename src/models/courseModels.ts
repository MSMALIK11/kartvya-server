import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUserModel } from './userModal';
import { ILessonDocument } from './lecturesModel';


export interface ICourseDocument extends Document {
    title?: string;
    shortDescription: string;
    description?: string;
    category: string;
    slug?: string;
    courseLevel: string;
    instructor?: Types.ObjectId | IUserModel;
    image?: {
        url?: string;
        public_id?: string;
    };
    lessons?: ILessonDocument[];
}

const courseSchema: Schema<ICourseDocument> = new Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        shortDescription: {
            type: String,
            trim: true
        },
        category: String,
        courseLevel: String,
        description: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            lowercase: true,
        },
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        image: {
            url: String,
            public_id: String,
        },
        lessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Lesson",
            },
        ],
    },
    { timestamps: true }
);

const Course = mongoose.model<ICourseDocument>('Course', courseSchema);

export default Course;
