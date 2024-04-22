import mongoose, { Schema, Document } from 'mongoose';

export interface ILessonDocument extends Document {
  title?: string;
  slug?: string;
  link?: {
    url?: string;
    public_id?: string;
  };
}

const lessonSchema: Schema<ILessonDocument> = new Schema(
  {
    title: {
      type: String,
    },
    slug: {
      type: String,
      lowercase: true,
      default: 'no slug available',
    },
    link: { 
      url: String,
      public_id: String,
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model<ILessonDocument>('Lesson', lessonSchema);

export default Lesson;
