<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let value = '';

    function handleInput(e) {
        value = e.target.value;
        dispatch('input', value);
    }
</script>

<input class="p-2 text-base rounded border-x border-y mb-4" type="text" placeholder="Search for LEGO items..." bind:value on:input={handleInput} />

<style>
    input {
        width: 245px;
    }
</style>