<script>
    import page from 'page';
    function logOut() {
        sessionStorage.removeItem('token');
        page.redirect('/login');
    }
</script>

<button class="w-20 p-2.5 transition bg-blue-600 hover:bg-blue-300 text-white" on:click={logOut}>Logout</button>

