<script>
    import CountdownTimer from "../components/CountdownTimer.svelte";
    import {API_ROOT} from "../constants.js";
    import page from "page";
    import {onMount} from "svelte";

    export let id;
    let newBidAmount;
    let highestBidAmount = 0;
    let startingPrice;
    let token = sessionStorage.getItem('token');

    let isExpired = false;
    let itemData;

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has('startingPrice')) {
        startingPrice = parseFloat(queryParams.get('startingPrice'));
    }

    let fetchItemDataPromise = fetchItemData(id);
    let fetchBidsPromise = fetchBids(id);

    if (!token) {
        page('/login');
    }

    async function fetchUserForBid(bid) {
        token = sessionStorage.getItem('token');
        try {
            const response = await fetch(`${API_ROOT}/users/${bid.userID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                bid.username = userData.name;
                return bid;
            } else {
                console.error('Failed to fetch user.');
                return bid;
            }
        } catch (error) {
            console.error('Error fetching user: ', error);
            return bid;
        }
    }

    async function fetchItemData(id) {
        try {
            const response = await fetch(`${API_ROOT}/legos/${id}`);
            return await response.json();
        } catch (error) {
            console.log('Error fetching lego with id ', error);
            throw error;
        }
    }

    async function fetchBids(id) {
        try {
            const response = await fetch(`${API_ROOT}/legos/${id}/bids`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const bids = await response.json();

                if (bids.length > 0) {
                    highestBidAmount = Math.max(...bids.map(bid => bid.amount));
                }

                return Promise.all(bids.map(fetchUserForBid));
            } else {
                console.error('Failed to fetch bids.');
                return [];
            }
        } catch (error) {
            console.error('Error fetching bids: ', error);
            throw error;
        }
    }

    async function placeBid() {
        const token = sessionStorage.getItem('token');
        if (isNaN(newBidAmount) || newBidAmount <= 0) {
            alert('Please enter a valid bid amount.');
            return;
        }

        if (newBidAmount <= startingPrice) {
            alert(`The bid amount must be greater than the starting price of $${startingPrice}.`);
            return;
        }

        if (newBidAmount <= highestBidAmount) {
            alert('The bid amount is too low!');
            return;
        }

        try {
            const response = await fetch(`${API_ROOT}/legos/${id}/bids`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({amount: newBidAmount})
            });

            if (response.ok) {
                newBidAmount = 0;
                fetchBidsPromise = fetchBids(id);
            } else {
                const errorMessage = await response.text();
                console.error(errorMessage);
            }
        } catch (error) {
            console.error("Error while adding bid: ", error);
            alert('An error occurred while placing the bid.');
        }
    }

    fetchItemDataPromise = fetchItemData(id);
    fetchBidsPromise = fetchBids(id);

    /*
        The reason why I used onMount here is to get a global itemData variable,
        so I could use it to get the deadline for condition checking
     */
    onMount(async () => {
        itemData = await fetchItemData(id);
        const deadline = new Date(itemData.deadline).getTime();
        const now = new Date().getTime();
        isExpired = deadline < now;

        fetchBidsPromise = fetchBids(id);
    });

    onMount(() => {
        const eventSource = new EventSource(`http://localhost:3000/legos/${id}/monitor`);

        eventSource.addEventListener("message", event => {
            fetchBidsPromise = fetchBids(id);
        });

        return () => {
            eventSource.close();
        };
    })
</script>

<h1 class="text-center pt-10 font-bold text-3xl">Lego Set Details</h1>

{#await fetchItemDataPromise then itemData}
    <div class="container flex justify-center gap-20 mt-20 border-x border-y shadow-lg shadow-grey p-10">
        <img class="max-w-1/2 max-h-96" src={itemData.url} alt={itemData.name}>
        <section class="item-details">
            <h1 class="font-bold mt-20">Lego Set: <span class="font-normal">{itemData.name}</span></h1>
            <h1 class="font-bold">Deadline: <span class="font-normal inline-block"><CountdownTimer lego={itemData}/></span></h1>
            <h1 class="font-bold mb-20">Theme: <span class="font-normal">{itemData.interestTheme.toUpperCase()}</span></h1>

            {#if !isExpired}
                <input type="number" bind:value={newBidAmount} placeholder="Enter bid amount" class="border p-2 mt-5"/>
                <button on:click={placeBid} class="border-x border-y border-black p-2 mt-5">Place A New Bid</button>
            {:else}
                <p class="text-red-500">The item is already expired...</p>
            {/if}

            <h2 class="font-bold mt-10">Bids:</h2>
            {#await fetchBidsPromise then bids}
                {#if bids.length > 0}
                    <ul class="mt-5">
                        {#each bids as bid}
                            <li class="border p-2 mt-2">
                                <p><strong>{bid.username}</strong> placed a bid of <strong>${bid.amount}</strong></p>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p>No bids yet.</p>
                {/if}
            {:catch error}
                <p>Error loading bids: {error.message}</p>
            {/await}
        </section>
    </div>
    <div class="mt-20 mb-10 text-center">
        <a class="btn-back border-x border-y border-black pt-5 pb-5 pl-10 pr-10 transition-0.3 ease-in hover:bg-amber-50"
           href={`/`}>Back</a>
    </div>
{:catch error}
    <p>Error loading item data: {error.message}</p>
{/await}

<style>
    @media (max-width: 428px) {
        .container {
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        img {
            max-width: 80%;
            max-height: 200px;
        }
        .item-details {
            width: 100%;
            padding: 0 10px;
        }
        h1 {
            font-size: 1.5rem;
        }
        input {
            width: 100%;
        }
        .btn-back {
            width: 90%;
        }
    }
</style>