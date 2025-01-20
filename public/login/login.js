const express = require('express');
const path = require('path');
const router = express.Router();
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library');

const root_dir = process.cwd();
const hasher = require(path.join(root_dir, './resources/js/password_hashing.js'));
const database = require(path.join(root_dir, './resources/js/database.js'));

router.get('/', async function (req, res, next)
{

});

router.post('/', async function (req, res, next)
{
    const { username, password } = req.body;

    let status = 200;
    let message = "";
    let success = false;

    /* Invalid */
    if (!username || !password)
    {
        message = "Error, please fill in all the fields"
        return res.status(400).json({ message: message });
    }
    else if (username.trim() == "" || password.trim() == "")
    {
        message = "Error, a field is having only empty space"
        return res.status(400).json({ message: message });
    }

    /* Database */
    if (!(await database.isUsernameExist(username)))
    {
        status = 401;
        message = "Username doesn't exist";
    }
    else
    {
        const password_fromdb = await database.getPasswordFromUsername(username);

        const isTheSame = await hasher.compare(password, password_fromdb);
        if (isTheSame)
        {
            status = 200;
            message = "Logged in";
            success = true;
        }
        else
        {
            status = 401;
            message = "Wrong password";
        }
    }

    res.status(status).json({ message: message, success: success });
});

// /login/google
router.post('/google', async function (req, res, next)
{
    const { idToken } = req.body;
    let message = "";
    let success = false;

    if (!idToken)
    {
        console.log("No idToken");
        message = "ID Token is required"
        return res.status(400).json({ message: message, success: success });
    }

    let email = "";
    try
    {
        const client = new OAuth2Client('502671157835-1bovdk3cu8qai5q288cejogiajmii8ge.apps.googleusercontent.com');

        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: '502671157835-1bovdk3cu8qai5q288cejogiajmii8ge.apps.googleusercontent.com',  // Replace with your Google Client ID
        });

        const payload = ticket.getPayload();
        email = payload.email;
    }
    catch (error)
    {
        console.log("idToken error");
        message = "Authentication failed, incorrect token";
        return res.status(400).json({ message: message, success: success });
    }

    // no error with token
    if (email != "")
    {
        const isExist = await database.isEmailExist(email)
        if (!isExist)
        {
            console.log("Email doesn't exist");
            message = "Please register with this email first";
            return res.status(200).json({ message: message, success: success });
        }
    }
    
    console.log("Authenticated");
    message = "Authenticated";
    success = true;
    res.status(200).json({ message: message, success: success });
});

module.exports = router;
