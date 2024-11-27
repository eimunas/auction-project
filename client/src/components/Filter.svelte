<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let selectedPriceRanges = [];
    let selectedThemes = [];
    let selectedInterests = [];

    $: dispatch('filter', { selectedPriceRanges, selectedThemes, selectedInterests });
</script>

<div class="filter-container w-1/4 h-full border-[1px] p-3 flex flex-col gap-5">
    <h1 class="text-xl font-bold">Filters</h1>

    <div class="filter-section flex flex-col">
        <h6 class="text-blue-700">Price</h6>
        <label>
            <input type="checkbox" bind:group={selectedPriceRanges} value="0-20" /> $0 - 20
        </label>
        <label>
            <input type="checkbox" bind:group={selectedPriceRanges} value="20-100" /> $20 - 100
        </label>
        <label>
            <input type="checkbox" bind:group={selectedPriceRanges} value="100-1000" /> $100 - 1000
        </label>
    </div>

    <div class="flex flex-col">
        <h6 class="text-blue-700">Theme</h6>
        <label>
            <input type="checkbox" bind:group={selectedThemes} value="fantasy" /> Fantasy
        </label>
        <label>
            <input type="checkbox" bind:group={selectedThemes} value="medieval" /> Medieval
        </label>
        <label>
            <input type="checkbox" bind:group={selectedThemes} value="ninja" /> Ninja
        </label>
    </div>

    <div class="flex flex-col">
        <h6 class="text-blue-700">Interest</h6>
        <label>
            <input type="checkbox" bind:group={selectedInterests} value="batman" /> Batman
        </label>
        <label>
            <input type="checkbox" bind:group={selectedInterests} value="ninja" /> Ninjago
        </label>
        <label>
            <input type="checkbox" bind:group={selectedInterests} value="indiana" /> Indiana Jones
        </label>
        <label>
            <input type="checkbox" bind:group={selectedInterests} value="lord" /> LOTR
        </label>
        <label>
            <input type="checkbox" bind:group={selectedInterests} value="avatar" /> Avatar
        </label>
        <label>
            <input type="checkbox" bind:group={selectedInterests} value="star" /> Star Wars
        </label>
    </div>
</div>

<style>
    @media (max-width: 428px) {
        .filter-container {
            width: 100%;
            padding: 0.5rem;
            gap: 1rem;
        }

        .filter-section h6 {
            font-size: 1rem;
        }

        .filter-section label {
            font-size: 0.875rem;
        }
    }
</style>