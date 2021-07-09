const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {auth, isAdmin} = require("../middlewares/jwt");
const {upload} = require("../middlewares/multer");
const {
    getUsers,
    getUserById,
    registerUser,
    loginUser,
    deleteUser,
    followUser,
    unfollowUser
} = require("../controllers/users");

router.get('', auth, isAdmin, getUsers);

router.get('/:username', getUserById);

router.post('/register', upload.single('image'), registerUser);

router.post('/login', loginUser);

router.delete('/:username', auth, isAdmin, deleteUser);

router.post("/follow/", auth, followUser);

router.post("/unfollow/", auth, unfollowUser);


module.exports = router;