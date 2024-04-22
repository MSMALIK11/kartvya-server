import { Request, Response } from "express"
import QuizCourse from "../models/QuizSchema"
import User from "../models/userModal";


const addNewQuiz = async (req: Request, res: Response) => {
    try {
        console.log('body', req.body);
        // Create a new QuizCourse instance using the request body and save it to the database
        const data = await QuizCourse.create(req.body);
        return res.status(200).json({
            success: true,
            message: 'Quiz added successfully'
        });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error adding quiz:', error);
        return res.status(500).json({ success: false, error: 'Failed to add quiz' });
    }
};
const getAllQuizCourses = async (req: Request, res: Response) => {
    try {
        const courses = await QuizCourse.find()
        console.log('courses', courses)
        if (courses) {
            return res.status(201).json({
                succes: true,
                courses: courses
            })
        }


    } catch (error) {

    }

}
const deleteCourse = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const deletedCourse = await QuizCourse.findByIdAndDelete(id);

        if (deletedCourse) {
            return res.status(200).json({
                success: true,
                message: `Course with ID ${id} has been deleted successfully.`,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: `Course with ID ${id} not found.`,
            });
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete course. Please try again later.',
        });
    }
};
// Get  analysis
export const getAnalysis = async (req: Request, res: Response) => {
    // get Total Course and Total Students
    try {
        const [students, courses] = await Promise.all([User.find(), QuizCourse.find()]);

        return res.status(200).json({
            success: true,
            analysis: [
                {
                    value: 0,
                    label: 'Total Sales',
                    key: 'totalsales'

                },
                {
                    value: students?.length,
                    label: 'Total Students',
                    key: 'totalstudent'
                },
                {
                    value: courses?.length,
                    label: 'Total Quizes',
                    key: 'totalcourse'
                },
                {
                    value: 0,
                    label: 'Total Enroll',
                    key: 'totalenroll'
                },
            ]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching analysis data.'
        });
    }


}


export { addNewQuiz, getAllQuizCourses, deleteCourse }