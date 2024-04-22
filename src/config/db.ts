
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const connection = async (): Promise<void> => {
    console.log('Connecting to Database....');
    try {
        const connectionInfo = await mongoose.connect(process.env.DB_URI as string);

        console.log(`MongoDB connected with server: ${connectionInfo.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

