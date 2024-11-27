<script>
    import {onMount} from "svelte";
    import page from 'page';
    import {API_ROOT} from "../constants.js";

    export let id;

    let name = '';
    let price = '';
    let deadline = '';
    let interestTheme = '';
    let url = '';

    let token = sessionStorage.getItem('token');
    if (!token) {
        page('/login');
    }

    async function fetchCurrentLego(id) {
        token = sessionStorage.getItem('token');

        try {
            const response = await fetch(`${API_ROOT}/legos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const lego = await response.json();
                name = lego.name;
                price = lego.price;
                deadline = lego.deadline;
                interestTheme = lego.interestTheme;
                url = lego.url;
            } else {
                console.error('Failed to fetch lego:', await response.json());
            }
        } catch (error) {
            console.error('Error fetching lego data:', error);
        }
    }

    onMount(async () => {
        await fetchCurrentLego(id);
    });

    async function handleSubmit(event) {
        const token = sessionStorage.getItem('token');
        event.preventDefault();

        const updatedLego = {
            name,
            price: parseFloat(price),
            deadline,
            interestTheme,
            url
        };

        try {
            const response = await fetch(`${API_ROOT}/legos/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedLego)
            });

            if (response.ok) {
                name = '';
                price = '';
                deadline = '';
                interestTheme = '';
                url = '';

                page.redirect('/');
            } else {
                const errorMessage = await response.text();
                console.error('Failed to update lego:', errorMessage);
            }
        } catch (error) {
            console.error('Error while updating lego: ', error);
        }
    }
</script>

<form class="flex flex-col gap-4 p-4 bg-gray-100 rounded-md shadow-md max-w-lg mx-auto mt-20" on:submit={handleSubmit}>
    <h2 class="font-bold text-center">Update Lego</h2>
    <label for="legoName" class="text-gray-700">
        Name:
        <input class="border border-gray-300 rounded-md p-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
               type="text" name="legoName" bind:value={name} autocomplete="off" placeholder="Enter LEGO set name">
    </label>
    <label for="price" class="text-gray-700">
        Price:
        <input class="border border-gray-300 rounded-md p-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
               type="text" name="price" bind:value={price} autocomplete="off" placeholder="Enter price">
    </label>

    <label for="deadline" class="text-gray-700">
        Deadline:
        <input class="border border-gray-300 rounded-md p-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
               type="text" name="deadline" bind:value={deadline} autocomplete="off" placeholder="Enter deadline">
    </label>

    <label for="theme" class="text-gray-700">
        Theme:
        <input class="border border-gray-300 rounded-md p-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
               type="text" name="theme" bind:value={interestTheme} autocomplete="off" placeholder="Enter theme">
    </label>

    <label for="url" class="text-gray-700">
        URL:
        <input class="border border-gray-300 rounded-md p-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
               type="text" name="url" bind:value={url} autocomplete="off" placeholder="Enter URL">
    </label>

    <button type="submit"
            class="bg-blue-600 hover:bg-blue-400 text-white font-semibold py-2 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400">
        Update
    </button>
</form>