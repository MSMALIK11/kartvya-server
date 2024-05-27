import express from 'express'
import { isAuthenticated } from '../middleware'
import { addQuestions, addTestSubject, addTopicSet, deleteQuesion, deleteSingleTopic, getAllQuestion, getAllTestSeriesList, getSubjectAndTopicAndQuestion, deleteSubject, publishSubject, privateSubject, getPipeline, updateQuestion, updateTopic, getPublishTestSeries } from '../controller/testSeriesControler'

const router = express.Router()
router.route('/admin/test-series/subject/add').post(isAuthenticated, addTestSubject)
router.route('/admin/test-series/subject/:subjectId/add-topic').post(isAuthenticated, addTopicSet)
router.route('/admin/test-series/subject/:subjectId').get(isAuthenticated, getSubjectAndTopicAndQuestion)
router.route('/admin/test-series/topic/question/:id/insert').post(isAuthenticated, addQuestions)
router.route('/admin/test-series/questions').get(isAuthenticated, getAllQuestion)
router.route('/admin/test-series/question/:id').delete(isAuthenticated, deleteQuesion)
router.route('/admin/test-series/topic/:id').delete(isAuthenticated, deleteSingleTopic)
router.route('/admin/test-series/getAllTestSeries').get(isAuthenticated, getAllTestSeriesList)
router.route('/admin/test-series/subject/:id').delete(isAuthenticated, deleteSubject)
router.route('/admin/test-series/subject/:id/publish').put(isAuthenticated, publishSubject)
router.route('/admin/test-series/subject/:id/private').put(isAuthenticated, privateSubject)
router.route('/admin/test-series/topic/question/update').put(isAuthenticated, updateQuestion)
router.route('/admin/test-series/topic/:topicId').put(isAuthenticated, updateTopic)
router.route('/test-series/published').get(isAuthenticated, getPublishTestSeries)
// for test
router.route('/getPipeline').get(getPipeline)

export default router