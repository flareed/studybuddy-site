const pgSession = require("connect-pg-simple");

const path = require('path');
const root_dir = process.cwd();
require(path.join(root_dir, "load_env.js"));
require(path.join(__dirname, '/database_query.js'));

const { Pool } = require('pg');

// Create a new client instance with your PostgreSQL connection details
const pool = new Pool({
    host: process.env.DB_HOST,    // Your host, usually 'localhost' or IP address
    port: process.env.DB_PORT,           // Default PostgreSQL port
    user: process.env.DB_USER, // Replace with your database username
    password: process.env.DB_PASSWORD,  // Replace with your database password
    database: process.env.DB_NAME   // Replace with your database name
});

function createExpressSession(session)
{
    const express_session_store = pgSession(session);
    return new express_session_store({
        pool: pool,                // Connection pool
        tableName: 'sessions',   // Use another table-name than the default "session" one
        ttl: 24 * 60 * 60, // Session expiration in seconds (24 hours)
        // Insert other connect-pg-simple options here
    });
}

// will return Object
async function query(query, parameters)
{
    let result = "";

    try
    {
        console.log("Getting a client from pool");
        const client = await pool.connect();

        if (parameters !== "undefined")
        {
            result = await client.query(query, parameters);
        }
        else
        {
            result = await client.query(query);
        }

        console.log("Releasing the client to pool");
        client.release()
    }
    catch (err)
    {
        console.error('Error:', err.stack);
    }

    return result;
}

// will return JavaScript Array
async function queryUsers(condition_query = "", parameters)
{
    let result = [];

    sort_query = " ORDER BY USERS.username ASC"
    if (condition_query.trim() === "")
    {
        result = await query(DEFAULT_QUERY_ALL_USERS + sort_query, parameters);
    }
    else
    {
        result = await query(DEFAULT_QUERY_ALL_USERS + condition_query + sort_query, parameters);
    }

    // handle no result from query
    if (result.rows == null)
    {
        result = [];
    }
    else
    {
        result = result.rows; // content returned from postgresql
    }

    result = Array.from(result); // converts to javascript array
    return result;
}

// will return Boolean
async function isUsernameExist(username)
{
    let result = false;

    const data = await queryUsers(" WHERE USERS.username = $1", [username]);

    if (data.length > 0)
    {
        // console.log(data);
        result = true;
    }

    return result;
}

// will return Boolean
async function isEmailExist(email)
{
    let result = false;

    const data = await queryUsers(" WHERE USERS.email ILIKE $1", [email]);

    if (data.length > 0)
    {
        // console.log(data);
        result = true;
    }

    return result;
}

// will return String
async function getPasswordFromUsername(username)
{
    let result = "";

    const data = await queryUsers(" WHERE USERS.username = $1", [username]);

    if (data.length > 0)
    {
        result = data[0].password;
    }

    return result;
}

// will return Object
async function getUserFromUsername(username)
{
    let result = {};

    const data = await queryUsers(" WHERE USERS.username = $1", [username]);

    if (data.length > 0)
    {
        result = data[0];
    }

    return result;
}

// will return Object
async function getUserWithoutPasswordFromUsername(username)
{
    let result = {};

    const data = await query(" WHERE USERS.username = $1", [username]);

    if (data.length > 0)
    {
        result = data[0];
    }

    return result;
}

// will return Boolean
async function insertUser(username, email, password)
{
    let result = false;

    const temp = await query(DEFAULT_INSERT_USER_QUERY, [username, email, password]);

    if (temp.rows.length > 0)
    {
        result = true;
    }

    return result;
}

async function updateUserPassword(username, password)
{
    let result = false;

    const temp = await query(DEFAULT_UPDATE_USER_PASSWORD_QUERY, [username, password]);

    if (temp.rows.length > 0)
    {
        result = true;
    }

    return result;
}

async function updateUserEmail(username, email)
{

}

module.exports =
{
    createExpressSession,
    query,
    queryUsers, insertUser, updateUserPassword,
    isUsernameExist, isEmailExist, getPasswordFromUsername, getUserFromUsername,
};