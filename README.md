# I INFO
- Nodejs 20 LTS

- Nodejs framework: expressjs 4

- Node modules: pg, bcrypt, hbs (handlebars),... (all can be viewed from package.json)
`these will be installed when doing npm install`

- Posgresql 15

# II NEED TO SETUP REVERSE PROXY (like nginx) FOR SSL

# III CONFIG
### 1. Change ".env.example" to ".env"
### 2. Change the content of ".env"
Example: you want to host on port 3500, make it like this: PORT=3500

# IV RUNNING
### 0.5 The versions are in `I INFO` (nodejs, postgresql)

### 1. Download and navigate to folder with app.js
Either download everything through github or use `git clone` command

Extract the .zip if you download everything then go go where the app.js is and open the terminal (cmd/powershell for windows)

### 2. Installing nodejs dependency ↓↓↓
```npm install```

This command will also install dev dependencies (but you can run in production later, don't worry ;) )

### 2.5. Making posgresql database & tables ↓↓↓
Use the provided SQL file(s) to make your database for the site (run from 0 to 2 then to the last number)
Schema won't be needed if pgAdmin already creates a "public" schema

### 3. Production ↓↓↓
```npm start```

Use this if you only want to run the site
### 3. Development ↓↓↓
```npm run dev```

In case you want to run with nodemon for development (nodemon is a module to monitor the changes then reload your nodejs server)

By default: I configured it to restart on every .js .html .hbs file change

# V DEVELOPMENT
- Want to generate a password to be input manually in database?
```
node gen.js <your password>
```
```
node gen.js passwordSomething

Hashed password for "passwordSomething" is:
$2b$10$1J2zwTtduWzLG4pPQUbjN.Pmr4AOjprAiSQ22zE16n9apLeGOd3Ga
```