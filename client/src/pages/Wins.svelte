<script>
    import {API_ROOT} from "../constants.js";
    import page from "page";

    export let id;
    let token = sessionStorage.getItem('token');
    let totalAmountToPay = 0;
    let userWins = [];

    if (!token) {
        page.redirect('/login');
    }

    let promise = fetchUserWins(id);

    async function fetchUserWins(userID) {
        try {
            const response = await fetch(`${API_ROOT}/users/${userID}/wins`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                userWins = result.wins;
                totalAmountToPay = result.totalAmount;
                return userWins;

            } else {
                console.error('Failed to fetch user wins.');
            }
        } catch (error) {
            console.error('Error fetching user wins: ', error);
        }
    }
</script>

<h1 class="font-bold mt-10 text-center text-2xl mb-10">Your Won Bids</h1>
{#await promise}
    <p>Loading wins...</p>
{:then userWins}
    {#if userWins.length > 0}
        <ul class="m-auto mt-5 text-center winListWidth">
            {#each userWins as win}
                <li class="border p-2 mt-2">
                    <p>You won: <strong class="text-green-600">{win.legoName} </strong> for: <strong>${win.legoPrice}</strong></p>
                </li>
            {/each}
        </ul>
    {:else}
        <p>No wins yet.</p>
    {/if}

    <div class="text-center mt-10">
        <p>Total amount of all won bids: <strong>${totalAmountToPay}</strong></p>
    </div>
{:catch error}
    <p>Failed to fetch wins: {error}</p>
{/await}
<div class="mt-10 text-center">
    <a class="border-x border-y border-black pt-5 pb-5 pl-10 pr-10 transition-0.3 ease-in hover:bg-amber-50"
       href={`/`}>Back</a>
</div>

<style>
    .winListWidth {
        max-width: 600px;
    }
</style>


