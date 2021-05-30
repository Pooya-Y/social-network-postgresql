const db = require('../db');
const express = require('express');
const sha256 = require('sha256');
const { body } = require('express-validator');
const router = express.Router();
const {auth, isAdmin} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
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

router.get('',async(req, res)=>{
    try {
        const {rows} = await db.query(
        'SELECT username,email, avatar, bio FROM users',
        );
        res.send(rows);
    } catch(err){
        res.send(err.stack)
    }
});

router.get('/:username',async(req, res)=>{
    try {
        const {rows} = await db.query(
        'SELECT username, avatar, bio FROM users WHERE username = $1',[req.params.username]
        );
        res.send(rows[0]);
    } catch(err){
        res.send(err.stack)
    }
});

router.post('/register',upload.single('image'), async (req, res) => {
    const fileName = req.file.filename;
    basePath = req.protocol + "://" + req.get("host") + "/uploads/";

    try {
        const {rows} = await db.query(
        'INSERT INTO users'
        +'(name,username,password,bio,avatar,location,website,date_of_birth,email,is_admin)'
        +'VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
        [req.body.name, req.body.username,sha256(req.body.password),req.body.bio,basePath+fileName,req.body.location,
        req.body.website, req.body.date_of_birth, req.body.email, req.body.is_admin 
        ]);
        res.send(rows[0]);
    } catch(err){
        res.send(err.stack)
    }
});

router.post('/login', async(req, res) => {
    try {
        const {rows} = await db.query('SELECT * FROM users WHERE (email = $1 OR username = $2) AND password = $3',
        [req.body.email, req.body.username,sha256(req.body.password)]);
        const secretkey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({username: rows[0].username, isAdmin: rows[0].is_admin}, secretkey, {expiresIn: "1d"})
        res.status(200).send({username:rows[0].username,email: rows[0].email, token});
    } catch(err){
        res.send(err.stack);
    }
});

router.delete('/:username', async (req, res)=>{
    try {
        const {rows} = await db.query(
            'DELETE FROM users WHERE username = $1',[req.params.username]
        );
        res.send(rows[0]);
    } catch(err){
        res.send(err.stack)
    }
});



module.exports = router;