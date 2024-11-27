<script>
    import page from 'page';
    import {API_ROOT} from "../constants.js";

    let email = '';
    let password = '';

    let token = sessionStorage.getItem('token');
    if (token) {
        page('/');
    }

    async function handleLoginSubmit(event) {
        event.preventDefault();

        const user = {
            email,
            password
        };

        try {
            const response = await fetch(`${API_ROOT}/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();

            if (response.ok) {
                const token = data.token;
                const isAdmin = data.isAdmin;
                ;
                const userID = data.userID;

                if (isAdmin === undefined) {
                    console.error("isAdmin is not defined in the response.");
                } else {
                    sessionStorage.setItem('token', token);
                    sessionStorage.setItem('isAdmin', isAdmin);
                    sessionStorage.setItem('userId', userID);

                    page.redirect('/');
                }
            } else {
                console.error('Login failed:', data);
                alert('Login failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again.');
        }
    }
</script>

<form on:submit={handleLoginSubmit} class="text-center flex flex-col items-center mt-20">
    <h1 class="text-3xl pb-10">Login</h1>

    <div class="input-group mb-4">
        <label for="email" class="block text-left">
            Email:
        </label>
        <input bind:value={email}
               class="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
               type="email" name="email" autocomplete="off" placeholder="Enter email...">
    </div>

    <div class="input-group mb-4">
        <label for="password" class="block text-left">
            Password:
        </label>
        <input bind:value={password}
               class="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
               type="password" name="password" autocomplete="off" placeholder="Enter password...">
    </div>

    <button class="border-x border-y p-3 px-10 border-black mt-10">Login</button>
</form>

<div class="mt-10 text-center">
    <p class="inline">Don't have an account?</p>
    <a href="/register" class="text-blue-500">Register</a>
</div>

