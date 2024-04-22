import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import Course, { ICourseDocument } from '../models/courseModels';
export const addNewCourse = async (req: Request, res: Response) => {
  const { title, shortDescription, description, slug, courseLevel, category } = req.body;
  const files = req?.files?.image;
  const file = Array.isArray(files) ? files[0] : files;

  // Check if file is not null and has tempFilePath
  const tempFilePath = file?.tempFilePath || '';
  console.log(req.user)
  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication failed:You are not logged in or invalid session' });
  }

  try {
    const result = await cloudinary.v2.uploader.upload(tempFilePath, { folder: 'courses' });
    const course = await Course.create({
      title,
      description,
      shortDescription,
      courseLevel,
      category,
      slug: slug,
      instructor: (req.user as any)?._id,
      image: { url: result.secure_url, public_id: result.public_id },
    });
    console.log('course', course)
    await course.save();
    return res.status(200).json({ success: true, message: 'New course added' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminAllCourse = async (req: Request, res: Response) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication failed:You are not logged in or invalid session' });
  }
  // TODO::Pending populate lessons 
  try {
    const course = await Course.find({ instructor: (req.user as any)?._id }).populate(
      'instructor'
    );

    res.json({ success: true, course });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// export const addLesson = async (req: Request, res: Response) => {
//   let { id } = req.params;
//   const { title, slug, link } = req.body;
//   const file = (req.files?.video as Express.Multer.File)?.tempFilePath;

//   const course = await Course.findById(id).populate('lessons');
//   if (!course) return;

//   const result = await cloudinary.v2.uploader.upload(file, {
//     resource_type: 'video',
//     public_id: `course/lessons/${title}`,
//     chunk_size: 6000000,
//     eager: [
//       { crop: 'pad', audio_codec: 'none' },
//       {
//         crop: 'crop',
//         gravity: 'south',
//         audio_codec: 'none',
//       },
//     ],
//     eager_async: true,
//     eager_notification_url: 'https://mysite.example.com/notify_endpoint',
//   });

//   try {
//     let lessonExist = -1;

//     course.lessons.forEach(async (element, index) => {
//       if (element.title == title) {
//         lessonExist = index;
//         element.title = title;
//         element.link = { url: result.secure_url, public_id: result.public_id };
//       }
//     });

//     if (lessonExist !== -1) {
//       await course.save();
//       return res.status(200).json({
//         success: true,
//         message: 'Lessons updated successfully',
//       });
//     }

//     const lesson = await Lesson.create({
//       slug: slugify(title),
//       title,
//       link: { url: result.secure_url, public_id: result.public_id },
//     });

//     await lesson.save();
//     const lessonId = lesson._id;

//     course.lessons.push(lessonId);
//     await course.save();

//     res.json({ success: true, message: 'New lessons added' });
//   } catch (error: any) {
//     res.json({ message: error.message });
//   }
// };

// export const deleteLessons = async (req: Request, res: Response) => {
//   const { id, lessonId } = req.params;

//   const course = await Course.findById(id).populate('lessons');

//   course.lessons.forEach((item, index) => {
//     if (lessonId.toString() === item._id.toString()) {
//       course.lessons.splice(index, 1);
//       return res.status(200).json('Lessons deleted successfully');
//     }
//   });

//   await course.save();

//   res.status(200).json({ success: true, message: 'Lessons deleted' });
// };

// export const demo = async (req: Request, res: Response) => {
//   const file = (req.files?.photo as Express.Multer.File)?.tempFilePath;

//   const { result } = await cloudinary.v2.uploader.upload(file, { folder: 'videos' });
//   return res.json(result);
// };

// export const getSingleCourse = async (req: Request, res: Response) => {
//   try {
//     const singleCourse = await Course.findOne({ title: req.params.title }).populate(
//       'lessons instructor'
//     );

//     if (!singleCourse) return;

//     return res.status(200).json({ success: true, singleCourse });
//   } catch (error: any) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// Search Course by Name
export const searchCourse = async (req: Request, res: Response) => {
  try {
    const searchTerm: string = req.query.name as string;
    // Use a case-insensitive regular expression for a partial match on course names
    const regex = new RegExp(searchTerm, 'i');
    console.log(regex)
    const courses: ICourseDocument[] = await Course.find({ title: regex });

    return res.status(200).json({ success: true, courses });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
// Search Course by Name
export const filterCourse = async (req: Request, res: Response) => {
  try {
    const filterTerm: string = req.query.category as string;
    const sortBy: string = req.query.sortBy as string;


    // Use a case-insensitive regular expression for a partial match on course names
    const regex = new RegExp(filterTerm, 'i');
    let query = { category: regex };
    // // Add filtering by level
    // if (level) { 
    //   query.courseLevel = level.toLowerCase(); // Assuming level is stored in lowercase in the database
    // }
    console.log('query', query)
    // Add sorting options
    let sortOptions: Record<string, any> = {};
    if (sortBy === 'asc') {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === 'desc') {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === 'latest') {
      sortOptions = { createdAt: -1 };
    }

    const courses: ICourseDocument[] = await Course.find(query).sort(sortOptions);

    return res.status(200).json({ success: true, courses });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getAllCourse = async (req: Request, res: Response) => {
  console.log('user', req.user)
  try {
    const courses = await Course.find();
    return res.status(200).json({ success: true, courses });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
