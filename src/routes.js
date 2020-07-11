const routes = require('express').Router();
const multer = require("multer");
const multerConfig = require("./config/multer");
const Post = require("./models/Post");

routes.get("/",(req,res)=>{
    res.status(200).send("API Upload Midias");
})

routes.post("/posts",multer(multerConfig).single('file'), async (req,res)=>{
    const {originalname:name,size,key,location:url} = req.file;
    const post = await Post.create({
        name:name,
        size:size,
        key:key,
        url:url,
    });

    return res.status(200).json(post);
})

routes.get('/posts',async (req,res)=>{
    const posts = await Post.find({})
    return res.status(200).json(posts)
});

routes.delete('/posts/:id',async (req,res)=>{
    const post = await Post.findById(req.params.id);
    await post.remove()
    return res.status(200).send()
});

module.exports = routes;