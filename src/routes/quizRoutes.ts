import express from "express"
import { addNewQuiz, deleteCourse, getAllQuizCourses } from "../controller/QuizController"
const quizRoutes = express.Router()
quizRoutes.route('/insert').post(addNewQuiz)
quizRoutes.route('/getAllLists').get(getAllQuizCourses)
quizRoutes.route('/:id').delete(deleteCourse)

export default quizRoutes