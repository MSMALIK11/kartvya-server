import express from "express"
import { isAuthenticated } from "../middleware"
import { getAnswersheet, uploadAnswerSheet } from "../controller/answerSheetController"
const router = express.Router()

router.route('/upload').post(isAuthenticated, uploadAnswerSheet)
router.route('/getAnswersheetVIewList').get(isAuthenticated, getAnswersheet)

export default router

