import { Request, Response } from "express";
import TestSubject from "../models/testSeries/subjectSchema";
import Topic from "../models/testSeries/topicSchema";
import mongoose from "mongoose";
import Questions from "../models/testSeries/questionsSchema";
// Get all Subject
const getAllTestSeriesList = async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user._id as string || "";
    if (!userId) {
        return res.status(4001).json({
            succes: false,
            message: "Unauthorized Access Please login first"
        })
    }

    const testSeriesList = await TestSubject.find().populate("instructor")
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
const deleteSubject = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req?.user

    try {
        if (!user) {
            return res.status(4001).json({
                succes: false,
                message: "User not found🤕"
            })
        }
        // Find all topics related to subject and delete all
        const deleteTopics = await Topic.deleteMany({ subjectId: id })
        if (!deleteTopics) {
            return res.status(500).json({
                success: false,
                message: 'Failed to  delete topics related to the subject.'
            });
        }
        //Find subject and delete 
        const isDelete = await TestSubject.findOneAndDelete({ _id: id })
        if (!isDelete) {
            return res.status(401).json({
                success: false,
                message: `Subject not found with id ${id}`
            })
        }

        return res.status(200).json({
            isDelete,
            deleteTopics,
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
    if (!subjectId) {
        return res.status(400).json({
            success: false,
            messsage: 'Subject ID is required'
        })
    }
    const isExist = await Topic.findOne({ title: req.body.title })
    const subject = await TestSubject.findOne({ _id: subjectId })
    if (subject) {
        subject.totalTopic = subject.totalTopic + 1;
        await subject.save();
    }
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

// Update Topic
const updateTopic = async (req: Request, res: Response) => {
    const { topicId } = req.params;
    const { title, duration, totalMark, totalQuestion } = req.body;

    if (!topicId) {
        return res.status(400).json({
            success: false,
            message: 'Topic ID is required'
        });
    }

    try {
        const topic = await Topic.findById(topicId);

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: 'Topic not found'
            });
        }

        // Update only the fields that are provided in the request body
        if (title) topic.title = title;
        if (duration) topic.duration = duration;
        if (totalMark) topic.totalMark = totalMark;
        if (totalQuestion) topic.totalQuestion = totalQuestion;

        await topic.save();

        return res.status(200).json({
            success: true,
            data: topic,
            message: 'Topic has been updated successfully'
        });
    } catch (error) {
        console.error('Error updating topic:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update topic'
        });
    }
};


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
// Update question
const updateQuestion = async (req: Request, res: Response) => {
    const topicId = req.params.id
    const payload = req.body
    const questionId = req.body._id
    const user = req?.user;
    // Check if user is authenticated
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated 🤕"
        });
    }
    // Check if question ID is provided
    if (!questionId) {
        return res.status(400).json({
            success: false,
            message: "Question not found!"
        });
    }
    try {
        // find and update the question
        const updatedQuestion = await Questions.findByIdAndUpdate(questionId, payload, { new: true })
        // If the question was not found
        if (!updatedQuestion) {
            return res.status(404).json({
                success: false,
                message: "Question not found!"
            });
        }
        // Respond with the updated question
        return res.status(200).json({
            success: true,
            message: "Question updated successfully",
            data: updatedQuestion
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the question",
            error: error?.message
        });

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
// {sujectId}Get single   subject and topic and questions 
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
            $unwind: {
                path: "$topics",
                preserveNullAndEmptyArrays: true
            }
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
    console.log('data', data)
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
// Publish Subject
const publishSubject = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req?.user
    console.log('subject id', id)
    // Check if user is authenticated
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated. Please log in to publish the subject."
        });
    }
    // // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Subject ID. Please provide a valid ID."
        });
    }
    try {
        // Find topic
        const topicList = await Topic.find({ subjectId: id })
        console.log('topicList', topicList)
        // Find Subject
        const subjectData = await TestSubject.findById({ _id: id });

        if (!topicList) {
            return res.status(401).json({
                success: false,
                message: 'To publish the course, a minimum of one topic is required.'
            });
        }
        if (subjectData) {
            subjectData.isPublish = true;
            await subjectData.save();
            return res.status(200).json({
                success: false,
                message: 'The Test Series has been successfully published.'
            });
        }

    } catch (error: any) {
        console.error("Error deleting question:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });

    }


}
// Private  Subject
const privateSubject = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req?.user
    console.log('subject id', id)
    // Check if user is authenticated
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated. Please log in to publish the subject."
        });
    }
    // // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Subject ID. Please provide a valid ID."
        });
    }
    try {
        // Find Subject
        const subjectData = await TestSubject.findById({ _id: id });
        if (subjectData) {
            subjectData.isPublish = false;
            await subjectData.save();
            return res.status(200).json({
                success: true,
                message: 'The Series has been private successfully'
            });
        }

    } catch (error: any) {
        console.error("Error deleting question:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });

    }


}

// Test aggrate
const getPipeline = async (req: Request, res: Response) => {
    try {
        const testSeriesList = await TestSubject.aggregate([
            {
                $match: {
                    isPublish: true
                }
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
                $lookup: {
                    from: "users", // Assuming the collection name is 'users'
                    localField: "instructor",
                    foreignField: "_id",
                    as: "instructor"
                }
            },
            {
                $unwind: "$instructor"
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    price: 1,
                    isPublish: 1,
                    totalTopic: { $size: "$topics" },
                    topics: 1,
                    instructor: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        profilePic: 1
                    }
                }
            }
        ]);

        if (!testSeriesList || testSeriesList.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No published test series found."
            });
        }

        return res.status(200).json({
            success: true,
            data: testSeriesList
        });
    } catch (error) {
        // console.error("Error fetching published test series:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            // error: error.message
        });
    }
    // const testSeriesList = await TestSubject.aggregate([
    //     {
    //         $match: {
    //             isPublish: true
    //         }
    //     },
    //     {
    //         $facet: {
    //             totalCount: [
    //                 {
    //                     $count: 'TotalPublishCourse'
    //                 }
    //             ],
    //             documents: [
    //                 {
    //                     $match: {
    //                         isPublish: true
    //                     }
    //                 },
    //                 {
    //                     $lookup: {
    //                         from: 'instructor', // The collection name for instructors
    //                         localField: 'instructor', // The field in the TestSubject collection
    //                         foreignField: '_id', // The field in the instructors collection
    //                         as: 'instructorDetails'
    //                     }
    //                 },
    //                 {
    //                     $unwind: {
    //                         path: '$instructorDetails',
    //                         preserveNullAndEmptyArrays: true // In case there are documents without a matching instructor
    //                     }
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         $project: {
    //             totalCount: { $arrayElemAt: ["$totalCount.TotalPublishCourse", 0] },
    //             documents: 1
    //         }
    //     }
    // ]);

    // return res.status(200).json({
    //     success: true,
    //     data: testSeriesList
    // });
};


const getPublishTestSeries = async (req: Request, res: Response) => {

    try {
        const testSeriesList = await TestSubject.aggregate([
            {
                $match: {
                    isPublish: true
                }
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
                $lookup: {
                    from: "users", // Assuming the collection name is 'users'
                    localField: "instructor",
                    foreignField: "_id",
                    as: "instructor"
                }
            },
            {
                $unwind: "$instructor"
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    price: 1,
                    isPublish: 1,
                    totalTopic: { $size: "$topics" },
                    topics: 1,
                    instructor: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        profilePic: 1
                    }
                }
            }
        ]);

        if (!testSeriesList || testSeriesList.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No published test series found."
            });
        }

        return res.status(200).json({
            success: true,
            data: testSeriesList
        });
    } catch (error) {
        // console.error("Error fetching published test series:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            // error: error.message
        });
    }
}
export { addTestSubject, addTopicSet, addQuestions, deleteSubject, deleteSingleTopic, getSubjectAndTopicAndQuestion, deleteQuesion, getAllQuestion, getAllTestSeriesList, publishSubject, privateSubject, getPipeline, updateQuestion, updateTopic, getPublishTestSeries }