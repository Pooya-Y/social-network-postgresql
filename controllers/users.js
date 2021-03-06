const db = require('../db');
const sha256 = require('sha256');
const jwt = require("jsonwebtoken");


// @desc  Get users
// @route GET /api/users/
// @access Private
exports.getUsers = async(req, res)=>{
    try {
        const {rows} = await db.query(
        'SELECT * FROM users',
        );
        res.send(rows);
    } catch(err){
        res.send(err.stack)
    }
}
// @desc  Get user by id
// @route GET /api/users/:id
// @access Public
exports.getUserById = async(req, res)=>{
    try {
        const {rows} = await db.query(
        'SELECT username, avatar, bio FROM users WHERE username = $1',[req.params.username]
        );
        res.send(rows[0]);
    } catch(err){
        res.send(err.stack)
    }
}
// @desc  Register a user
// @route Post /api/users/register
// @access Public
exports.registerUser = async (req, res) => {
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
}
// @desc  Login a user
// @route Post /api/users/login
// @access Public
exports.loginUser = async(req, res) => {
    try {
        const {rows} = await db.query('SELECT * FROM users WHERE (email = $1 OR username = $2) AND password = $3',
        [req.body.email, req.body.username,sha256(req.body.password)]);
        const secretkey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({username: rows[0].username, isAdmin: rows[0].is_admin}, secretkey, {expiresIn: "1d"})
        res.status(200).send({username:rows[0].username,email: rows[0].email, token});
    } catch(err){
        res.send(err.stack);
    }
}
// @desc  Delete a user
// @route DELETE /api/users/:id
// @access Private
exports.deleteUser = async (req, res)=>{
    try {
        const {rows} = await db.query(
            'DELETE FROM users WHERE username = $1',[req.params.username]
        );
        res.send(rows[0]);
    } catch(err){
        res.send(err.stack)
    }
}

// @desc  Follow a user
// @route Post /api/users/folow
// @access Private
exports.followUser = async (req, res) =>{
    (async () => {
        const client = await db.client();
        try {
            await client.query('BEGIN')
            await db.query(
                'INSERT INTO following (user_id, following_id) VALUES($1,$2)',
                [req.body.user_id, req.body.following_id ]
            );
            await db.query(
                'INSERT INTO follower(user_id, follower_id) VALUES($1,$2)',
                [req.body.following_id ,req.body.user_id]
            );
            await client.query('COMMIT')
            res.send();
        } catch (e) {
            await client.query('ROLLBACK')
            res.send(e.stack);
        } finally {
            client.release()
        }
      })().catch(e => console.error(e.stack))
}

// @desc  Unfollow a user
// @route Post /api/users/unfolow
// @access Private
exports.unfollowUser = async (req, res) =>{
    (async () => {
        const client = await db.client();
        try {
            await client.query('BEGIN')
            await db.query(
                'DELETE FROM following WHERE following_id = $1',
                [req.body.unfollowing_id ]
            );
            await db.query(
                'DELETE FROM follower WHERE user_id = $1',
                [req.body.unfollowing_id]
            );
            await client.query('COMMIT')
            res.send();
        } catch (e) {
            await client.query('ROLLBACK')
            res.send(e.stack);
        } finally {
            client.release();
        }
      })().catch(e => console.error(e.stack));
}