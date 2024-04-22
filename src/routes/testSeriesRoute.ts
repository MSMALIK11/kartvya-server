import express from 'express'
import { isAuthenticated } from '../middleware'
import { addQuestions, addTestSubject, addTopicSet, deleteQuesion, deleteSingleTopic, getAllQuestion, getSubjectAndTopicAndQuestion } from '../controller/testSeriesControler'

const router = express.Router()
router.route('/admin/test-series/subject/add').post(isAuthenticated, addTestSubject)
router.route('/admin/test-series/subject/:subjectId/add-topic').post(isAuthenticated, addTopicSet)
router.route('/admin/test-series/subject/:subjectId').get(isAuthenticated, getSubjectAndTopicAndQuestion)
router.route('/admin/test-series/topic/question/:id/insert').post(isAuthenticated, addQuestions)
router.route('/admin/test-series/questions').get(isAuthenticated, getAllQuestion)
router.route('/admin/test-series/question/:id').delete(isAuthenticated, deleteQuesion)
router.route('/admin/test-series/topic/:id').delete(isAuthenticated, deleteSingleTopic)
export default router