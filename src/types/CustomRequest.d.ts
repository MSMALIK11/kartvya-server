// // import { Request, Response } from 'express';
// // import { IUserModel } from '../models/userModal';
// // interface User {
// //     _id?: string
// // }
// // interface ImageFile {
// //     tempFilePath: File;
// // }
// // export interface CustomRequest extends Request {
// //     files?: {
// //         image?: ImageFile
// //     };
// //     user?: IUserModel;
// //     _id?: string
// // }


// import { Request, Response } from 'express';
// import { IUserModel } from '../models/userModal';
// import { FileArray } from 'express-fileupload';


// interface ImageFile {
//     image: FileArray
// }

// export interface CustomRequest extends Request {
//     files?: {
//         image: {
//             tempFilePath: string
//         }
//     };
//     user?: IUserModel;
// }

// import { Request, Response } from 'express';
// import { IUserModel } from '../models/userModal';
// import { FileArray, UploadedFile } from 'express-fileupload';

// interface ImageFile {
//     image: {
//         tempFilePath: FileArray;
//     }
// }

// export interface CustomRequest extends Request {
//     files?: ImageFile;
//     user?: IUserModel;
//     _id?: string;
// }

import { Request, Response } from 'express';
import { IUserModel } from '../models/userModal';
// import { FileArray, UploadedFile } from 'express-fileupload';

// interface ImageFile {
//     tempFilePath?: string | UploadedFile;
// }

// export interface CustomRequest extends Request {
//     files?: FileArray;
//     user?: IUserModel;
//     _id?: string;
// }
