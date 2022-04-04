console.log('PROFILE REVEAL SCRIPT: ACTIVE');

const profileBtn = document.querySelector('#profile-btn');
const gamesBtn = document.querySelector('#games-btn');
const profileSection = document.querySelector('.profile');

const toggleActivity = () => {
    profileSection.classList.toggle('profile--open');
    profileBtn.closest('li').classList.toggle('active');
    gamesBtn.closest('li').classList.toggle('active');
};

profileBtn.addEventListener('click', (e) => {
    e.preventDefault();

    toggleActivity();
});

gamesBtn.addEventListener('click', (e) => {
    e.preventDefault();

    toggleActivity();
});