<script>

    import {fetchRecentTweets} from "./api_interface";

    let timer = null
    let promise = null
    let value = ""

    $ : if (!value) {
        promise = null
    }

    function debounce() {
        clearTimeout(timer)
        timer = setTimeout(() => {
            promise = fetchRecentTweets(value)
        }, 200)
    }

</script>
<input bind:value on:input={debounce} placeholder="Enter your Twitter username">

{#await promise}
    Loading...
{:then result}
    {#if result == null || (result.error != null && JSON.parse(result.error)[0]?.code === 34)}
        Enter your Twitter username to get your 5 most recent tweets
    {:else if result.error != null}
        {result.error}
    {:else}
        <p> Recent Tweets of <b>{result.name}</b></p>

        {#each result.tweets as tweet}
            <div class="tweet">{tweet}</div>
        {/each}

        {#if result.tweets.length === 0}
            No tweets found
        {/if}
    {/if}
{/await}

<style>
    input {
        width: 75%;
        margin: 2rem;
        padding: 1rem;
        border: 1px solid var(--gray-400);
        border-radius: 1rem;
    }

    input:hover {
        border-color: var(--blue-300);
    }

    input:focus {
        outline: 2px solid var(--blue-500);
    }

    .tweet {
        margin: 1rem;
        padding: 1rem;
        border: 1px solid var(--gray-400);
        border-radius: 1rem;
        width: 75%;
    }

</style>