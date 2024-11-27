<script>
    import Home from './pages/Home.svelte'; 
    import ItemDetails from './pages/ItemDetails.svelte'; 
    import Login from './pages/Login.svelte'; 
    import Register from './pages/Register.svelte';
    import TailwindCss from "./lib/TailwindCSS.svelte";
    import router from 'page';
    import AddLego from "./pages/AddLego.svelte";
    import UpdateLego from "./pages/UpdateLego.svelte";
    import Wins from "./pages/Wins.svelte";

    let currentPage;
    let currentParams = {};

    router("/", () => {
        currentPage = Home;
        currentParams = {};
    });

    router("/legos/:id", (ctx) => {
        currentPage = ItemDetails;
        currentParams = { id: ctx.params.id };
    });

    router("/addLego", () => {
        currentPage = AddLego;
    });

    router("/updateLego/:id", (ctx) => {
        currentPage = UpdateLego;
        currentParams = { id: ctx.params.id };
    })

    router("/login", () => {
        currentPage = Login;
        currentParams = {};
    });

    router("/register", () => {
        currentPage = Register;
        currentParams = {};
    });

    router("/users/:id/wins", (ctx) => {
       currentPage = Wins;
       currentParams = { id: ctx.params.id };
    });

    router();
</script>

<TailwindCss />

<main class="p-4 max-w-5xl mx-auto">
    {#if currentPage}
        <svelte:component this={currentPage} {...currentParams} />
    {/if}
</main>




