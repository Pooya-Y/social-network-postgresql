const express = require('express');
const router = express.Router();
const {auth} = require("../middlewares/jwt");
const {upload} = require("../middlewares/multer");
const {
    getPostsById,
    getTimeline,
    newPost,
    addImages,
    likePost,
    unlikePost,
} = require("../controllers/posts");

router.get("/post/:post_id", getPostsById);

router.get("/timeline/:id", auth, getTimeline);

router.post('/', auth, newPost);

router.post('/images/', auth, upload.array("images", 4), addImages);

router.post("/like/:id", auth, likePost);

router.delete("/unlike/:id", auth, unlikePost);


module.exports = router;