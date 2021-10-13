# Anime-API

An API created with animes of MyAnimeList from a JSON source file : <https://github.com/manami-project/anime-offline-database>  
This API is auto-updated each week on Monday morning if running.  
You can create Users and add animes in their favorites to fill the progression and the broadcaster. Try it with the `api.http` file, you need to replace the **authorization header** with your own token.  

## Stack

- NodeJS
- Express
- PostgreSQL
- Sqitch
- Redis

## Installation

Clone the repository locally :  

```bash
git clone <repo url>
```

Install the dependencies via NPM :  

```bash
npm i
```

Create a postgresql database :  

```bash
createdb anime
```

/!\ You need to configure PostgreSQL or provide the environment variables to run the `createdb` command.  

Deploy the DB migrations :  

```bash
sqitch deploy function
```

Enable the launch of the bash scripts by running the following commands from the "/data" directory :  

```bash
chmod +x init.sh
chmod +x script.sh
```

Fill the DB with animes :  

```bash
npm run dataset
```

Around 15 minutes is needed to import them (over 21K animes).  

Rename the `.env.example` file to `.env` and provide the correct environment variables.  

## Launch

```bash
npm start
```

Access the API on `http://localhost:3000/v1/` (change the PORT if needed).
