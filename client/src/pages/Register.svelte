<script>
    import page from "page";
    import {API_ROOT} from "../constants.js";

    let name = '';
    let email = '';
    let password = '';
    let isAdmin = false;
    let confirmPassword = '';

    let token = sessionStorage.getItem('token');
    if (token) {
        page('/');
    }

    async function handleRegisterSubmit(event) {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const newUser = {
            name,
            email,
            password,
            isAdmin
        };

        try {
            const registerResponse = await fetch(`${API_ROOT}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser)
            });

            const registerData = await registerResponse.json();

            if (registerResponse.ok) {
                const loginResponse = await fetch(`${API_ROOT}/tokens`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email, password})
                });

                const loginData = await loginResponse.json();

                if (loginResponse.ok) {
                    const token = loginData.token;
                    const isAdmin = loginData.isAdmin;
                    const userID = loginData.userID;

                    if (isAdmin === undefined) {
                        console.error("isAdmin is not defined in the response.");
                    } else {
                        sessionStorage.setItem('token', token);
                        sessionStorage.setItem('isAdmin', isAdmin);
                        sessionStorage.setItem('userId', userID);

                        page.redirect('/');
                    }
                } else {
                    console.error('Login after registration failed:', loginData);
                    alert('Login after registration failed: ' + (loginData.error || 'Unknown error'));
                }
            } else {
                console.error('Register failed:', registerData);
                alert('Register failed: ' + (registerData.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error during register:', error);
            alert('An error occurred during register. Please try again.');
        }
    }
</script>

<form on:submit={handleRegisterSubmit} class="text-center flex flex-col items-center mt-20">
    <h1 class="text-3xl pb-10">Register</h1>

    <div class="input-group mb-4">
        <label for="name" class="block text-left">
            Username:
        </label>
        <input bind:value={name}
               class="border border-gray-300 rounded-md p-2 mt-1 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
               type="text" name="name" autocomplete="off" placeholder="Enter name..." required>
    </div>

    <div class="input-group mb-4">
        <label for="email" class="block text-left">
            Email:
        </label>
        <input bind:value={email}
               class="border border-gray-300 rounded-md p-2 mt-1 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
               type="email" name="email" autocomplete="off" placeholder="Enter email..." required>
    </div>

    <div class="input-group mb-4">
        <label for="password" class="block text-left">
            Password:
        </label>
        <input bind:value={password}
               class="border border-gray-300 rounded-md p-2 mt-1 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
               type="password" name="password" autocomplete="off" placeholder="Enter password..." required>
    </div>

    <div class="input-group mb-4">
        <label for="confirmPassword" class="block text-left">
            Confirm Password:
        </label>
        <input bind:value={confirmPassword}
               class="border border-gray-300 rounded-md p-2 mt-1 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
               type="password" name="confirmPassword" autocomplete="off" placeholder="Confirm password*" required>
    </div>

    <button type="submit" class="border-x border-y p-3 border-black mt-10">Register</button>
</form>

<div class="mt-10 text-center">
    <p class="inline">Already have an account?</p>
    <a href="/login" class="text-blue-500">Login</a>
</div>

