// fetch tweets from http://localhost:3000/ with userId
export async function fetchRecentTweets(username: String) {
    const response = await fetch(`http://localhost:3000/?username=${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await response.json()
}