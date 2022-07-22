const express = require('express');
const router = express.Router();

const { requireAuth, restoreUser, setTokenCookie } = require("../utils/auth.js");
const { User, Song } = require('../db/models');

// Get Current User
router.get('/', requireAuth, async (req, res, next) => {
    const { user, cookies } = req;
    const jToken = await setTokenCookie(res, user);
    const me = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id","firstName", "lastName","email"]
    });

    if (me) {
        me.dataValues.token = jToken;
        return res.json(me);
    } else {
        me.dataValues.token = "";
        return res.json({});
    }
});

// Get all Songs created by Current User
router.get('/songs', requireAuth, async (req, res) => {
    const { user } = req;

    const songs = await Song.findAll({
        where: {
            userId: user.id
        }
    })
    res.json(songs);
})


module.exports = router;