<script>
    import {createEventDispatcher} from 'svelte';
    import CountdownTimer from "./CountdownTimer.svelte";
    import {API_ROOT} from "../constants.js";
    import page from 'page';

    export let lego;
    export let isAdmin = false;

    export let startingPrice;

    const dispatch = createEventDispatcher();

    async function deleteLego() {
        const token = sessionStorage.getItem('token');
        if (!token) {
            return;
        }

        try {
            const response = await fetch(`${API_ROOT}/legos/${lego.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                dispatch('deleted', { id: lego.id });
            } else {
                alert('error on item deletion');
            }
        } catch (error) {
            console.error('Failed to delete item.', error);
        }
    }

    function navigateToDetails() {
        page(`/legos/${lego.id}?startingPrice=${startingPrice}`);
    }
</script>

<div class="lego-card h-72 border-x border-y rounded-lg overflow-hidden bg-white shadow-md transition-all flex flex-col justify-between hover:-translate-y-1.5">
    <section class="image-container object-contain h-35">
        <a href={`/legos/${lego.id}`} on:click={navigateToDetails}>
            <img src={lego.url} alt="lego-img" class="lego-img w-full h-full object-cover">
        </a>
    </section>
    <section class="info p-4 align-middle">
        <h2 class="lego-name text-2x1 mb-1 truncate">{lego.name}</h2>
        <h5 class="price text-xs font-sans">Starting price: ${lego.price}</h5>
        <CountdownTimer {lego}/>
        {#if isAdmin}
            <button on:click={deleteLego} class="delete-btn text-xs text-red-400">Delete</button>
            <a class="update-btn text-xs text-green-500" href={`/updateLego/${lego.id}`}>Update</a>
        {/if}
    </section>
</div>

<style>
    .price {
        font-family: "Work Sans", sans-serif;
        font-weight: 500;
    }

    @media (max-width: 428px) {
        .lego-card {
            height: auto;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
        }

        .image-container {
            height: 150px;
        }

        .lego-img {
            object-fit: contain;
        }

        .info {
            padding: 0.5rem;
        }

        .lego-name {
            font-size: 1rem;
            white-space: normal;
        }

        .price {
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
        }

        .delete-btn, .update-btn {
            width: 100%;
        }
    }

    @media (min-width: 768px) {
        .lego-card {
            height: 300px;
        }

        .image-container {
            height: 180px;
        }
    }

    @media (min-width: 1024px) {
        .lego-card {
            height: 350px;
        }

        .image-container {
            height: 200px;
        }
    }
</style>

