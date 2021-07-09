const db = require('../db');
const sha256 = require('sha256');
const jwt = require("jsonwebtoken");

// @desc  Get a post of by id
// @route GET /api/posts/post/:id
// @access Public
exports.getPostsById =  async (req, res) => {
    try{
        const post = await db.query(
            'SELECT * FROM post WHERE id = $1',
            [req.params.post_id]
        );
        const image = await db.query(
            'SELECT * FROM images WHERE images.post_id = $1',
            [req.params.post_id]
        );
        res.send({post: post.rows[0], images: image.rows});
    }catch(err){
        res.send(err.stack)
    }
}
// @desc  Get timeline of a user
// @route GET /api/posts/timeline/:id
// @access Private
exports.getTimeline = async (req, res) => {
    try{
        const {rows} = await db.query(
            'SELECT * FROM post WHERE author_id IN (SELECT following_id FROM following WHERE user_id = $1)',
            [req.params.id]
        );
        res.send(rows);
    }catch(err){
        res.send(err.stack)
    }
}
// @desc  Add new post
// @route Post /api/posts/
// @access Private
exports.newPost =  async (req,res)=>{
    try {
        const {rows} = await db.query(
        'INSERT INTO post'
        +'(author_id, text)'
        +'VALUES($1,$2)',[req.body.author_id, req.body.text]);
        res.send(rows[0]);
    } catch(err){
        res.send(err.stack)
    }

}
// @desc  Add images
// @route Post /api/posts/:postId
// @access Private
exports.addImages =  async (req,res)=>{
    basePath = req.protocol + "://" + req.get("host") + "/uploads/";
    let images = [];
    if(req.files){
        req.files.map((file) =>{
            images.push(basePath + file.filename);
        });
    }
    for (let i = 0; i < images.length; i++) {
        try {
            const {rows} = await db.query(
            'INSERT INTO images'
            +'(image, post_id)'
            +'VALUES($1,$2)',[images[i],req.body.post_id]);
            res.send(rows[0]);
        } catch(err){
            res.send(err.stack)
        }
    }
}
// @desc  Like a post
// @route Post /api/posts/like/:id
// @access Private
exports.likePost =  async (req, res) =>{
    try {
        const {rows} = await db.query(
        'INSERT INTO likes'
        +'(user_id, post_id)'
        +'VALUES($1,$2)',[req.body.user,req.params.id]);
        res.send(rows[0]);
    } catch(err){
        res.send(err.stack)
    }
}
// @desc  unlike a post
// @route Post /api/posts/unlike/:id
// @access Private
exports.unlikePost = async (req, res) =>{
    try {
        const {rows} = await db.query(
        'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',[req.body.user,req.params.id]);
        res.send(rows[0]);
    } catch(err){
        res.send(err.stack)
    }
}