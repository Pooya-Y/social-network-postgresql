const db = require('../db');
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {auth, isAdmin} = require("../middlewares/jwt");
const multer = require("multer");
const { query } = require('../db');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(" ").join("-");
      cb(null, Date.now().toString()+"-"+fileName)
    },
});


   
const upload = multer({ 
    storage: storage ,
    limits:{fileSize: 1024*1024*10},
    fileFilter: function (req, file, cb) {
        if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
            cb(new Error("Wrong file type"), false);
        }
        cb(null, true);
    },
})

router.get("/user/:username",auth, async (req, res) => {

});

router.get("/post/:post_id", async (req, res) => {
        const post = await db.query(
            'SELECT * FROM post WHERE id = $1',
            [req.params.post_id]
        );
        const image = await db.query(
            'SELECT * FROM images WHERE images.post_id = $1',
            [req.params.post_id]
        );
        res.send({post: post.rows[0], images: image.rows});
});

router.get("/timeline", async (req, res) => {
    // const {rows} = await db.query('');
});

router.post('/',async (req,res)=>{
    try {
        const {rows} = await db.query(
        'INSERT INTO post'
        +'(author_id, text)'
        +'VALUES($1,$2)',[req.body.author_id, req.body.text]);
        res.send(rows[0]);
    } catch(err){
        res.send(err.stack)
    }

});
router.post('/images/',upload.array("images", 4), async (req,res)=>{
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
});
router.post("/like/:id", async (req, res) =>{
    try {
        const {rows} = await db.query(
        'INSERT INTO likes'
        +'(user_id, post_id)'
        +'VALUES($1,$2)',[req.body.user,req.params.id]);
        res.send(rows[0]);
    } catch(err){
        res.send(err.stack)
    }
});

router.delete("/unlike/:id", async (req, res) =>{
    try {
        const {rows} = await db.query(
        'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',[req.body.user,req.params.id]);
        res.send(rows[0]);
    } catch(err){
        res.send(err.stack)
    }
});


module.exports = router;