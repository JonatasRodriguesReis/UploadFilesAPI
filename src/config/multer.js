require('dotenv').config();
const multer = require('multer');
const path = require("path");
const crypto = require("crypto");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const s3Config = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region:process.env.AWS_DEFAULT_REGION
  });

const storageTypes = {
    local: multer.diskStorage({
        destination:(req,file,cb) => {
            cb(null,path.resolve(__dirname,'..','..','temp','uploads'));
        },
        filename:(req,file,cb)=>{
            crypto.randomBytes(16,(err,hash)=>{
                if(err) cb(err);

                file.key = `${hash.toString("hex")}-${file.originalname}`;

                cb(null,file.key); 
            })
        }
    }),

    s3: multerS3({
        s3: s3Config,
        bucket: "uploadtestelide",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl:"public-read",
        key:(req,file,cb)=>{
            crypto.randomBytes(16,(err,hash)=>{
                if(err) cb(err);

                const filename = `${hash.toString("hex")}-${file.originalname}`;

                cb(null,filename); 
            })
        }
    })
}

module.exports = {
    dest: path.resolve(__dirname,'..','..','temp','uploads'),
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits:{
        filesize: 2 * 1024 * 1024,
    },
    fileFilter:(req,file,cb)=>{
        const allowedMimes = [
            'image/png',
            'image/jpeg',
            'image/pjpeg',
            'image/gif',
            'image/jpg',
            'video/quicktime',
        ];

        if(allowedMimes.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb(new Error("Invalid file type."));
        }
    }
};