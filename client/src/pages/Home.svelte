<script>
    import AuctionItem from "../components/AuctionItem.svelte";
    import SearchBar from '../components/SearchBar.svelte';
    import Filter from "../components/Filter.svelte";
    import UserNav from "../components/UserNav.svelte";
    import page from 'page';
    import { API_ROOT } from "../constants.js";

    let legos = [];
    let searchText = '';
    let currentFilter = { selectedPriceRanges: [], selectedThemes: [], selectedInterests: [] };
    let username = '';
    let userID = '';
    let isNotAdminUsername;
    let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

    let legoPromise = fetchLegos();

    function isTokenExpired(token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp;
        const now = Math.floor(Date.now() / 1000);
        return now > expiry;
    }

    function decodeNameFromToken(token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.name || "Undefined";
    }

    function decodeIDFromToken(token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id || "Undefined";
    }

    function checkIfNameIsAdmin(name) {
        return name !== ('Admin' || 'admin');
    }

    export async function fetchLegos() {
        const token = sessionStorage.getItem('token');
        if (!token || isTokenExpired(token)) {
            alert('Session expired, please log in again.');
            page.redirect('/login');
            return;
        }

        username = decodeNameFromToken(token);
        userID = decodeIDFromToken(token);
        isNotAdminUsername = checkIfNameIsAdmin(username);

        try {
            const queryParams = new URLSearchParams();
            if (searchText) queryParams.append('searchText', searchText);
            if (currentFilter.selectedPriceRanges.length > 0) {
                queryParams.append('selectedPriceRanges', currentFilter.selectedPriceRanges.join(','));
            }
            if (currentFilter.selectedThemes.length > 0) {
                queryParams.append('selectedThemes', currentFilter.selectedThemes.join(','));
            }
            if (currentFilter.selectedInterests.length > 0) {
                queryParams.append('selectedInterests', currentFilter.selectedInterests.join(','));
            }

            const response = await fetch(`${API_ROOT}/legos?${queryParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                legos = data.filteredLegos || [];
                return legos;
            } else {
                console.error('Failed to fetch legos:', await response.json());
            }
        } catch (error) {
            console.error('Error fetching legos:', error);
        }
    }

    function handleSearch() {
        legoPromise = fetchLegos();
    }

    function handleFilter(event) {
        currentFilter = event.detail;
        legoPromise = fetchLegos();
    }

    function handleLegoDeleted(e) {
        legos = legos.filter(lego => lego.id !== e.detail.id);
        legoPromise = fetchLegos();
    }
</script>

<main>
    <UserNav username={username} id={userID} isNotAdminUsername={isNotAdminUsername} />
    <SearchBar bind:value={searchText} on:input={handleSearch} />
    <div class="main-container flex justify-between gap-5 mt-10">
        <Filter on:filter={handleFilter} />
        {#await legoPromise}
            <p>Loading legos...</p>
        {:then legos}
            <div class="lego-grid w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#if legos.length > 0}
                    {#each legos as lego}
                        <AuctionItem startingPrice={lego.price} {lego} {isAdmin} on:deleted={handleLegoDeleted} />
                    {/each}
                {:else}
                    <p>No legos were uploaded...</p>
                {/if}
            </div>
        {:catch error}
            <p>Failed to fetch legos: {error}</p>
        {/await}
    </div>
</main>

<style>
    @media (min-width: 768px) {
        .lego-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 1024px) {
        .lego-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 428px) {
        .main-container {
            flex-direction: column;
            gap: 1rem;
        }

        .lego-grid {
            width: 100%;
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        p {
            font-size: 0.875rem;
            line-height: 1.5;
            word-wrap: break-word;
        }
    }
</style>

