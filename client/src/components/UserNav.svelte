<script>
    import AddItemButton from "./AddItemButton.svelte";
    import LogoutButton from "./LogoutButton.svelte";
    import WinButton from "./WinButton.svelte";

    export let username;
    export let isNotAdminUsername;
    export let id;
</script>

<header class="header flex justify-between">
    <div class="header-left">
        <h1 class="welcome-text text-3xl font-bold">Welcome, {username}</h1>
        <h5 class="sub-title text-gray-600">Lego Auction List</h5>
    </div>
    <div class="header-buttons mt-10 flex gap-5">
        <WinButton {id} />
        <AddItemButton isNotAdminUsername={isNotAdminUsername} />
        <LogoutButton />
    </div>
</header>

<style>
    @media (max-width: 428px) {
        .header {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1rem;
        }

        .welcome-text {
            font-size: 1.75rem;
            line-height: 2rem;
        }

        .sub-title {
            font-size: 0.875rem;
            color: #4B5563;
        }

        .header-buttons {
            margin-top: 0;
            flex-direction: column;
            gap: 0.75rem;
            width: 100%;
            justify-content: center;
        }
    }

    @media (min-width: 768px) {
        .welcome-text {
            font-size: 2rem;
        }
    }
</style>
