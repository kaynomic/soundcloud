const express = require('express');
const router = express.Router();

const { requireAuth, restoreUser, setTokenCookie } = require("../utils/auth.js");
const { Album, User, Song } = require('../db/models');

// Get All Albums
router.get('/', async (req, res) => {
    const albums = await Album.findAll({
        attributes: [
            "id", "userId", "title", "description", "createdAt", "updatedAt", "previewImage"
        ]
    })
    res.json(albums);
})


// Create an Album
router.post('/', requireAuth, async (req, res) => {
    const { user } = req;
    const { title, description, imageUrl } = req.body;

    const album = await Album.create({
        userId: user.id,
        title,
        description,
        previewImage: imageUrl
    })
    res.json(album);
})

// Create a Song for an Album based on Album's Id
router.post('/:albumId/songs', requireAuth, async (req, res) => {
    const { user } = req;
    const { albumId } = req.params;
    const { title, description, url, imageUrl } = req.body;

    const album = await Album.findByPk(albumId);

    if (album) {
        if (album.userId === user.id) {
            const song = await Song.create({
                title,
                description,
                url,
                previewImage: imageUrl,
                userId: user.id,
                albumId
            })

            res.json(song);
        }
    } else {
        const err = new Error("Album not found");
        err.status = 404;
        throw err;
    }
})






module.exports = router;