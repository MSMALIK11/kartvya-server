import express, { Request, Response } from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
import router from './routes/router';
import testSeriesRoutes from './routes/testSeriesRoute'
import quizRoutes from './routes/quizRoutes';
import answerSheetRoute from './routes/answerSheetRoutes'
import cookieParser from "cookie-parser";
import expressFileupload from 'express-fileupload';
import { connection } from './config/db'
const app = express()

dotenv.config()
// body parser
app.use(express.json({ limit: '50mb' }));
// cookie parser
app.use(cookieParser());

// cors =>cross origin resource sharing
app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(expressFileupload({ useTempFiles: true }));

const PORT = process.env.PORT || 8080
// Quiz Routes
app.use('/api/quiz', quizRoutes)
// Test series route
app.use('/api', testSeriesRoutes)
// video lecture quiz
app.use('/api', router)
// Answersheet Routes
app.use('/api/answersheet', answerSheetRoute)
app.use("*", (req: Request, res: Response) => {
    const err = Error(`Requested path ${req.path} not found`);
    res.status(404).send({
        success: false,
        message: `Something went wrong, please try again.`,
        stack: err.stack,
    });
});
connection()
app.listen(PORT, () => {
    console.log(`Server is running on post:8080`)
})
