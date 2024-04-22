import express from 'express'
import { signup, userLogin, currentUser, userLogout, getAdminAllCourse } from '../controller'
import { getAllCourse, addNewCourse, searchCourse, filterCourse } from '../controller'
import { isAuthenticated } from '../middleware'
import { changePassword, getAllUsers } from '../controller/userController'
import { updateRole } from '../controller/adminController'
import { getAnalysis } from '../controller/QuizController'
const router = express.Router()
// User Routes
router.route('/signup').post(signup)
router.route('/login').post(userLogin)
router.route('/logout').get(userLogout)
router.route('/getAllUsers').get(getAllUsers)
router.route('/profile').get(isAuthenticated, currentUser)
router.route('/user/changePassword').put(isAuthenticated, changePassword)
// ADMIN ROUTE
router.route('/course/add').post(isAuthenticated, addNewCourse)
router.route('/admin/courseList').get(isAuthenticated, getAdminAllCourse)
router.route('/admin/updateRole/:id').put(isAuthenticated, updateRole)
router.route('/admin/getAnalysis').get(isAuthenticated, getAnalysis)
// Course Route
router.route('/courseList').get(getAllCourse)
// Route to search courses by name
router.get('/courses/search', searchCourse);
// Route to Filtr courses by category
router.get('/courses/filter', filterCourse);
router.route('/test').get((req, res) => {
    res.send({
        message: 'Route is workign fine'
    })

})


export default router