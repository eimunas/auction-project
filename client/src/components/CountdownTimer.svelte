<script>
    import { onDestroy } from "svelte";

    export let lego;
    let countdown = '';

    function calculateTimeLeft() {
        const now = new Date().getTime();
        const deadline = new Date(lego.deadline).getTime();
        const timeLeft = deadline - now;

        if (timeLeft <= 0) {
            countdown = 'Expired';
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    calculateTimeLeft();
    const interval = setInterval(() => {
        calculateTimeLeft();
    }, 1000);

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

<h5 class="text-s font-sans">{countdown}</h5>