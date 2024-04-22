import { Request, Response } from "express";
import TestSubject from "../models/testSeries/subjectSchema";
import Topic from "../models/testSeries/topicSchema";
import mongoose from "mongoose";
import Questions from "../models/testSeries/questionsSchema";
// Get all Subject
const getAllSubject = async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user._id as string || "";
    if (!userId) {
        return res.status(4001).json({
            succes: false,
            message: "Unauthorized Access Please login first"
        })
    }
    const testSeriesList = await TestSubject.find()
    if (!testSeriesList) {
        return res.status(401).json({
            success: false,
            message: "Subject not found"
        })
    }
    return res.status(200).json({
        success: true,
        data: testSeriesList
    })
}
const getAllQuestion = async (req: Request, res: Response) => {
    const questions = await Questions.find()
    return res.status(200).json({
        succes: true,
        questions

    })

}
const addTestSubject = async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user._id as string || "";
    if (!userId) {
        return res.status(401).json({
            succes: false,
            message: "User not found🤕"
        })
    }
    try {

        const isExist = await TestSubject.findOne({ title: req.body.title })
        if (isExist) {
            return res.status(409).json({
                success: false,
                message: `The Subject '${req.body.title}' already exists. Please choose a different title.`
            })
        }
        const payload = {
            ...req.body,
            instructor: userId
        }
        const subject = await TestSubject.create(payload);
        return res.status(200).json({
            success: true,
            message: 'The subject has been successfully created.',
            data: subject
        });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error adding quiz:', error);
        return res.status(500).json({ success: false, error: 'Failed to add quiz' });
    }
};
// Delete subject and of all its set and all related quest 
// need subject  id set id 
const deleteSubject = async (req: Request, res: Response) => {
    const { subjectId } = req.params
    const user = req?.user

    try {
        if (!user) {
            return res.status(4001).json({
                succes: false,
                message: "User not found🤕"
            })
        }
        //Find subject and delete 
        const isDelete = await TestSubject.findOneAndDelete({ _id: subjectId })
        if (!isDelete) {
            return res.status(401).json({
                success: false,
                message: 'Subject has been deleted successfully.'
            })
        }
        // Find all topics related to subject and delete all
        const deleteTopics = await Topic.deleteMany({ subjectId: subjectId })
        if (deleteTopics.deletedCount === 0) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete topics related to the subject.'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Subject and related topics have been deleted successfully.'
        });

    } catch (error: any) {
        console.error("Error deleting subject and topics:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });

    }
}
// Delete set related course
const deleteSingleTopic = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req?.user
    if (!user) {
        return res.status(4001).json({
            succes: false,
            message: "User not found🤕"
        })
    }
    try {
        // Find all question of associate with topic id and delete
        const deleteResult = await Questions.deleteMany({ topicId: id });

        // Find topic and delete 
        const deleteTopic = await Topic.findOneAndDelete({ _id: id })
        if (!deleteTopic && !deleteResult) {
            return res.status(401).json({
                success: false,
                message: "Topic not found try again!"
            })
        }
        return res.status(200).json({
            succes: true,
            message: `Topic and its associated ${deleteResult.deletedCount} questions have been deleted successfully.`
        })
    } catch (error: any) {
        console.error("Error deleting topics:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });

    }

}
const addTopicSet = async (req: Request, res: Response) => {
    const subjectId = req?.params?.subjectId
    console.log('res', req.body, req?.params)
    if (!subjectId) {
        return res.status(400).json({
            success: false,
            messsage: 'Subject ID is required'
        })
    }
    const isExist = await Topic.findOne({ title: req.body.title })
    if (isExist) {
        return res.status(409).json({
            success: false,
            message: `Topic already exist with title ${req.body.title}`
        })
    }

    try {
        const body = {
            ...req.body,
            subjectId: subjectId,
        }
        const data = await Topic.create(body)
        if (data) {
            return res.status(200).json({
                success: true,
                data: data,
                message: `Topic successfully added to the subject with ID: ${subjectId}`
            })
        }
    } catch (error) {
        console.error('Error adding set:', error);
        return res.status(500).json({ success: false, message: 'Failed to add Topic in subject' });
    }
}

// Add question  associatewith topic id 
const addQuestions = async (req: Request, res: Response) => {
    const user = req?.user
    if (!user) {
        return res.status(4001).json({
            succes: false,
            message: "User not found🤕"
        })
    }
    const topicId = req?.params?.id
    if (!topicId) {
        return res.status(400).json({
            success: false,
            messsage: `Topic Id not found.`
        })
    }

    try {
        const body = {
            ...req.body,
            topicId: topicId,

        }
        console.log(req.body)
        const data = await Questions.create(body)
        if (data) {
            return res.status(200).json({
                success: true,
                data: data,
                message: `Question has been successfully added to the Topic`
            })
        }


    } catch (error) {
        console.error('Error adding set:', error);
        return res.status(500).json({ success: false, error: 'Failed to add set in subject' });
    }

}
// Working Fine
const deleteQuesion = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req?.user;

    try {
        // Check if user is authenticated
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated 🤕"
            });
        }

        // Find the question and delete
        const deletedQuestion = await Questions.findByIdAndDelete(id);

        if (deletedQuestion) {
            return res.status(200).json({
                success: true,
                message: 'Question has been deleted successfully.'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: `Question not found with id ${id}`
            });
        }
    } catch (error) {
        console.error("Error deleting question:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }

}
// Get  subject and topic and questions 

const getSubjectAndTopicAndQuestion = async (req: Request, res: Response) => {
    const { subjectId } = req?.params
    const data = await TestSubject.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(subjectId) }
        },
        {
            $lookup: {
                from: "topics",
                localField: "_id",
                foreignField: "subjectId",
                as: "topics"
            }
        },

        {
            $unwind: "$topics"
        },
        {
            $lookup: {
                from: "questions",
                localField: "topics._id",
                foreignField: "topicId",
                as: "topics.questions"
            }
        },
        {
            $group: {
                _id: "$_id",
                subject: { $first: "$title" },
                topics: { $push: "$topics" }
            }
        }

    ]);

    if (data.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Subject not found'
        });
    }
    return res.status(200).json({
        success: true,
        data
    })

}

export { addTestSubject, addTopicSet, addQuestions, deleteSubject, deleteSingleTopic, getSubjectAndTopicAndQuestion, deleteQuesion, getAllQuestion }