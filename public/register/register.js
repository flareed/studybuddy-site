const express = require('express');
const path = require('path');
const router = express.Router();

const root_dir = process.cwd();
const hasher = require(path.join(root_dir, './resources/js/password_hashing.js'));
const database = require(path.join(root_dir, './resources/js/database.js'));


/* GET home page. */
router.get('/', async function (req, res, next)
{

});

router.post('/', async function (req, res, next)
{
    const { username, email, password } = req.body;
    let status = 200;
    let message = "";
    let success = false;

    /* Invalid */
    if (!username || !email || !password)
    {
        message = "Error, please fill in all the fields"
        return res.status(400).json({ message: message });
    }
    else if (username.trim() == "" || email.trim() == "" || password.trim() == "")
    {
        message = "Error, a field is having only empty space"
        return res.status(400).json({ message: message });
    }

    /* Database */
    if (await database.isUsernameExist(username))
    {
        status = 200;
        message = "Username already existed";
    }
    else if (await database.isEmailExist(email))
    {
        status = 200;
        message = "Email already existed";
    }
    else
    {
        const hashed_password = await hasher.hash(password);

        const isSuccess = await database.insertUser(username, email, hashed_password)
        if (isSuccess)
        {
            status = 200;
            message = "Account created";
            success = true;
        }
        else
        {
            status = 500;
            message = "Server error, please try again";
        }
    }

    res.status(status).json({ message: message, success: success });
});

module.exports = router;
