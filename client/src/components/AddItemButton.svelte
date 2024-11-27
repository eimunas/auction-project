<script>
    export let isNotAdminUsername;
</script>

{#if !isNotAdminUsername}
<div class="w-30 p-2.5 pr-5 transition bg-blue-400 hover:bg-blue-200">
    <a class="text-white ml-2" href="/addLego">Add Lego</a>
</div>
{/if}