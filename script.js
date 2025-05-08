const helloWorldSection = document.getElementById('hello-world');
const heroes = document.querySelectorAll('.hero, .hero1, .hero2');
const navLinks = document.querySelectorAll('.nav-links a');

// Navigation click event
navLinks.forEach(link => {
    link.addEventListener('mouseover', (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        const targetId = event.target.getAttribute('href').substring(1); // Get the target section ID
        const targetSection = document.getElementById(targetId);

        // Hide all sections
        helloWorldSection.style.display = 'none';
        heroes.forEach(hero => {
            hero.style.display = 'none';
        });

        // Show the target section
        if (targetSection) {
            targetSection.style.display = 'flex'; // Show the target section
        }
    });
});

function copyText() {
    navigator.clipboard.writeText("ahfura70@gmail.com").then(() => {
        alert("Text has been copied!");
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert("Failed to copy text.");
    });
}
