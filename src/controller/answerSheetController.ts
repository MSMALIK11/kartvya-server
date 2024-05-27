import { Request, Response } from 'express';
import AnswerSheet from '../models/answerSheetModel'
import cloudinary from '../config/cloudinary';

const uploadAnswerSheet = async (req: Request, res: Response) => {
    const files = req?.files?.file;
    const file = Array.isArray(files) ? files[0] : files;
    const tempFilePath = file?.tempFilePath || '';
    try {
        if (req.files) {
            const result = await cloudinary.v2.uploader.upload(tempFilePath, { folder: 'answersheet' });
            const answerSheet = new AnswerSheet({
                filename: file?.name,
                filepath: tempFilePath,
                instructor: "",
                status: "",
                studentId: (req.user as any)?._id,
                image: { url: result.secure_url, public_id: result.public_id },

            });
            console.log('result', result)
            await answerSheet.save();
            res.status(201).json({ message: 'Your answer sheet has been successfully uploaded and is awaiting instructor review. You will be notified once it has been checked.' });
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAnswersheet = async (req: Request, res: Response) => {
    const userId = (req.user as any)?._id as string || '';

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "User not found"
        });
    }

    try {
        const answerSheetList = await AnswerSheet.find({ studentId: userId });
        if (answerSheetList.length > 0) {
            return res.status(200).json({
                success: true,
                data: answerSheetList
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No answer sheets found"
            });
        }
    } catch (error: any) {
        console.error('Error getting answersheet', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch answer sheets' });
    }
};

const deleteAnswersheet = async (req: Request, res: Response) => {
    const { id, publicId } = req.params
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication failed:You are not logged in or invalid session' });
    }
    try {
        // Delete answer sheet from cloudinary
        const result = await cloudinary.v2.uploader.destroy(publicId);
        if (result.result !== 'ok') {
            return res.status(500).json({ success: false, message: 'Failed to delete answer sheet. Please try again later.' });
        }

        const isDeleted = await AnswerSheet.findByIdAndDelete(id)
        if (!isDeleted) {
            return res.status(200).json({
                success: false,
                message: 'Failed to delete answer sheet. Please try again later.'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Answer sheet has been deleted successfully.'
        });


    } catch (error) {

        return res.status(500).json({ success: false, message: 'An error occurred while deleting the answer sheet. Please try again later.' });
    }


}
const updateStatusAnsReply = (req: Request, res: Response) => {
    const userId = (req.user as any)?._id as string || '';
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "User not found"
        });
    }


}

export { uploadAnswerSheet, getAnswersheet, deleteAnswersheet, updateStatusAnsReply };
