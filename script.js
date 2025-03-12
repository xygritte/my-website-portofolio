const hero = document.querySelector('.hero');
const hero1 = document.querySelector('.hero1');
const hero2 = document.querySelector('.hero2');

hero.addEventListener('click', function () {
    hero.classList.toggle('active');
});

hero1.addEventListener('click', function () {
    hero1.classList.toggle('active');
});

hero2.addEventListener('click', function () {
    hero2.classList.toggle('active');
});

function copyText() {
    navigator.clipboard.writeText("ahfura70@gmail.com");
    alert("Teks telah disalin!");
}