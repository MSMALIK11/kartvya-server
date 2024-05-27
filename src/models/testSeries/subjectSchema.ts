import mongoose, { Schema, Document, Types } from 'mongoose';
interface ImageInterface {
    public_id: string,
    url: string
}

export interface ITestSubjectDocument extends Document {
    title?: string;
    shortDescription: string;
    description?: string;
    category?: string;
    slug?: string;
    price?: number,
    instructor?: mongoose.Types.ObjectId;
    isPaidCourse?: boolean,
    totalTopic: number,
    freeTopic: number,
    isPublish?: boolean,
    isDraft?: boolean,
    image?: ImageInterface

}

const testCourseSchema: Schema<ITestSubjectDocument> = new Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            default: 0,
        },
        shortDescription: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        category: String,
        slug: {
            type: String,
            lowercase: true,
        },
        isPaidCourse: {
            type: Boolean,
            default: false
        },
        totalTopic: {
            type: Number,
            default: 0
        },
        freeTopic: {
            type: Number,
            default: 0
        },
        isPublish: {
            type: Boolean,
            default: false
        },
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        image: {
            url: String,
            public_id: String,
        },
    },
    { timestamps: true }
);

const TestSubject = mongoose.model<ITestSubjectDocument>('TestSubject', testCourseSchema);

export default TestSubject;
