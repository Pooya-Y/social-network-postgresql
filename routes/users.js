const db = require('../db');
const express = require('express');
const sha256 = require('sha256');

const router = express.Router();

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
        // db.query(
        //     'INSERT INTO users'
        //     +'(name,username,password,bio,avatar,location,website,date_of_birth,email,is_admin)'
        //     +'VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
        //     [req.body.name, req.body.username,sha256(req.body.password),req.body.bio,"basePath+fileName",req.body.location,
        //     req.body.website, req.body.date_of_birth, req.body.email, req.body.is_admin ],
        //     (err, result) => {
        //         if (err) {
        //           res.send(err.stack);
        //         } else {
        //           res.send(result.rows[0]);
        //         }
        //     })
});

module.exports = router;