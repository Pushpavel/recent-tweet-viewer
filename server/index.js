import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import {authHeader} from "./secret.js";

const app = express()

// fetch user data from twitter
async function fetchUserData(username) {
    const response = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
        method: 'GET',
        headers: authHeader
    });
    return await response.json();
}

// fetch 5 most recent tweets of a user
async function fetchRecentTweets(username) {
    try {
        const user = await fetchUserData(username);
        if (user.errors)
            throw new Error(JSON.stringify(user.errors));

        const response = await fetch(`https://api.twitter.com/2/users/${user.data.id}/tweets?max_results=5`, {
            method: 'GET',
            headers: authHeader
        })
        const json = await response.json()

        if (json.errors)
            throw new Error(JSON.stringify(json.errors));

        console.log(`Fetched ${json.meta.result_count} tweets for user ${username}`)

        let tweets = [];
        if (json.meta.result_count !== 0)
            tweets = json.data.map(tweet => tweet.text)
        return {tweets, name: user.data.name}
    } catch (e) {
        console.error(e)
        return {error: e.message}
    }
}


// accepts requests from any origin
app.use(cors({origin: true}))

app.get('/', async (req, res) => {
    const username = req.query.username;
    const tweets = await fetchRecentTweets(username);
    res.send(tweets);
})

app.listen(3000, () => console.log('Listening on port 3000'))