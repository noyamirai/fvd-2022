const key = '20d879ddcd1940eabc1babb11790c2e4';

const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

const topRatedCollection = document.querySelector('#top-rated');
const topRatedItems = topRatedCollection.getElementsByTagName('li');

const filterForm = document.querySelector('.filters');
const filterElContainer = filterForm.querySelector('.filters__container');
const filterElement = filterForm.getElementsByTagName('fieldset');

const bodyEl = document.querySelector('body');
const checkBoxes = document.querySelectorAll('.filters__option');

const mainHeader = document.querySelector('#main-header');

const filterContainer = document.querySelector('.filters');
const mobileFilterContainer = document.querySelector('.filters__menu');

const filterBtn = document.querySelector('#filter-btn');

const openFilterBtn = document.querySelector('#open-filters');
const applyFiltersBtn = document.querySelector('#apply-filters');
const applyFiltersDesktopBtn = document.querySelector('#apply-filters-desktop');

const resetFilterBtn = document.querySelector('.reset-filters');

for (let i = 0; i < 9; i++) {
    let nodeCopy = topRatedItems[0].cloneNode(true);
    topRatedCollection.appendChild(nodeCopy);
}

const addCheckListeners = (cloneEl) => {
    const checkbox = cloneEl.querySelector('.filters__option');

    checkbox.addEventListener('change', () => {
        const allCheckboxes = document.querySelectorAll('.filters__option');
        let checkedValues = [];

        allCheckboxes.forEach((box) => {
            if (box.checked) {
                checkedValues.push(box.checked);
            }
        });

        if (checkedValues.length) {
            applyFiltersBtn.classList.remove('hide');
            applyFiltersDesktopBtn.classList.remove('hide');
            applyFiltersBtn.textContent = `Apply filters (${checkedValues.length})`;
            applyFiltersDesktopBtn.textContent = `Apply filters (${checkedValues.length})`;
        } else {
            applyFiltersBtn.classList.add('hide');
            applyFiltersDesktopBtn.classList.add('hide');
        }
    });
};

const addRatingColors = (rating, stars, ratingEl) => {
    if (rating >= 4) {
        ratingEl.classList.add('rating--green');

        for (let i = 0; i < 4; i++) {
            stars[i].classList.add('star--green');
        }

    } else if (rating >= 3 && rating < 4) {
        ratingEl.classList.add('rating--yellow');

        for (let i = 0; i < 3; i++) {
            stars[i].classList.add('star--yellow');
        }

    } else if (rating >= 2 && rating < 3) {

        ratingEl.classList.add('rating--yellow');

        for (let i = 0; i < 2; i++) {
            stars[i].classList.add('star--yellow');
        }

    } else if (rating >= 1 && rating < 2) {
        ratingEl.classList.add('rating--red');

        for (let i = 0; i < 1; i++) {
            stars[i].classList.add('star--red');
        }

    } else {
        ratingEl.classList.add('rating--red');

        for (let i = 0; i < 2; i++) {
            stars[i].classList.add('star--red');
        }
    }
};

const getRating = (metacritic) => {
    return Math.round((metacritic * 5 / 100) * 10) / 10;
};

// Top Rated since 2019
const getTopRated = () => {
    // https://api.rawg.io/api/games?metacritic=80,100

    // https://api.rawg.io/api/games?key=${key}&page_size=2&dates=2022-01-01,2022-03-20&ordering=-added

    fetch(`https://api.rawg.io/api/games?key=${key}&page_size=10&metacritic=80,100&dates=2019-01-01,2022-01-01&ordering=-metacritic`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            let gameObject = {};
            let gameArray = [];

            // Create own game object
            result.results.forEach((game) => {
                gameObject.id = game.id;
                gameObject.slug = game.slug;
                gameObject.name = game.name;
                gameObject.background_image = game.background_image;
                gameObject.rating_top = game.rating_top;
                gameObject.metacritic = game.metacritic;
                gameObject.parent_platforms = game.parent_platforms;
                gameObject.genres = game.genres;

                gameArray.push(gameObject);
                // reset
                gameObject = {};
            });

            let index = 0;
            topRatedCollection.classList.remove('dummy');

            // Use game object to fill site with content
            gameArray.forEach((game) => {

                let listItem = topRatedItems[index];
                let gameCover = listItem.querySelector('img');
                let gameTitle = listItem.querySelector('h3');
                let metaRating = listItem.querySelector('.rating');
                let stars = listItem.querySelectorAll('svg');

                const rating = getRating(game.metacritic);

                stars.forEach((star) => {
                    star.removeAttribute('class');
                    star.classList.add('star');
                });

                metaRating.removeAttribute('class');
                metaRating.classList.add('rating');

                gameTitle.textContent = game.name;
                listItem.id = game.slug;
                gameCover.src = game.background_image;

                addRatingColors(rating, stars, metaRating);
                metaRating.textContent = rating;

                index++;
            });
        })
        .catch(error => console.log('error', error));
};

const getAllGenres = () => {
    fetch(`https://api.rawg.io/api/genres?key=${key}`, requestOptions)
        .then(response => response.json())
        .then((result) => {

            let genreObject = {};
            let genreArray = [];

            result.results.forEach((genre) => {
                genreObject.id = genre.id;
                genreObject.slug = genre.slug;
                genreObject.name = genre.name;

                genreArray.push(genreObject);
                // reset
                genreObject = {};
            });

            let index = 0;

            for (let i = 0; i < genreArray.length - 1; i++) {
                let filterCopy = filterElement[0].cloneNode(true);
                filterElContainer.appendChild(filterCopy);
                addCheckListeners(filterCopy);
            }

            genreArray.forEach((genre) => {
                let listItem = filterElement[index];
                let inputEl = listItem.querySelector('input');
                let labelEl = listItem.querySelector('label');
                let labelText = listItem.querySelector('.filters__text');

                inputEl.value = genre.slug;
                inputEl.id = genre.slug;

                labelText.textContent = genre.name;
                labelEl.htmlFor = genre.slug;

                index++;
            });

        })
        .catch(error => console.log('error', error));
};

const getGamesWithGenres = (selectedGenres) => {

    fetch(`https://api.rawg.io/api/games?key=${key}&page_size=10&genres=${selectedGenres.toString()}`, requestOptions)
        .then(response => response.json())
        .then((result) => {

            topRatedCollection.closest('section').querySelector('h2').textContent = 'Filter results';
            filterContainer.classList.remove('filters--open');
            mobileFilterContainer.classList.remove('filters__menu--open');
            applyFiltersBtn.classList.add('hide');
            applyFiltersDesktopBtn.classList.add('hide');



            // mainHeader.classList.remove('filters--open');
            // mainHeader.querySelector('.active').classList.remove('active');
            // mainHeader.querySelector('#filter-btn').textContent = 'Filters';

            resetFilterBtn.classList.remove('hide');
            

            let gameObject = {};
            let gameArray = [];

            // Create own game object
            result.results.forEach((game) => {
                gameObject.id = game.id;
                gameObject.slug = game.slug;
                gameObject.name = game.name;
                gameObject.background_image = game.background_image;
                gameObject.rating_top = game.rating_top;
                gameObject.metacritic = game.metacritic;
                gameObject.parent_platforms = game.parent_platforms;
                gameObject.genres = game.genres;

                gameArray.push(gameObject);
                // reset
                gameObject = {};
            });

            let index = 0;
            topRatedCollection.classList.remove('dummy');

            // Use game object to fill site with content
            gameArray.forEach((game) => {

                let listItem = topRatedItems[index];
                let gameCover = listItem.querySelector('img');
                let gameTitle = listItem.querySelector('h3');
                let metaRating = listItem.querySelector('.rating');
                let stars = listItem.querySelectorAll('svg');

                const rating = getRating(game.metacritic);

                stars.forEach((star) => {
                    star.removeAttribute('class');
                    star.classList.add('star');
                });

                metaRating.removeAttribute('class');
                metaRating.classList.add('rating');

                gameTitle.textContent = game.name;
                listItem.id = game.slug;
                gameCover.src = game.background_image;

                addRatingColors(rating, stars, metaRating);
                metaRating.textContent = rating;

                index++;
            });

        })
        .catch(error => console.log('error', error));
};

// Desktop nav button
filterBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (filterBtn.closest('li').classList.contains('active')) {
        e.target.textContent = 'Filters';
    } else {
        e.target.textContent = 'Close';
    }

    const allCheckboxes = document.querySelectorAll('.filters__option');
    let checkedValues = [];

    allCheckboxes.forEach((box) => {
        if (box.checked) {
            checkedValues.push(box.checked);
        }
    });

    if (checkedValues.length) {
        applyFiltersBtn.classList.remove('hide');
        applyFiltersDesktopBtn.classList.remove('hide');
        applyFiltersBtn.textContent = `Apply filters (${checkedValues.length})`;
        applyFiltersDesktopBtn.textContent = `Apply filters (${checkedValues.length})`;
    } else {
        applyFiltersBtn.classList.add('hide');
        applyFiltersDesktopBtn.classList.add('hide');
    }

    filterContainer.classList.toggle('filters--open');

    filterBtn.closest('li').classList.toggle('active');

    mainHeader.classList.toggle('filters--open');
});

openFilterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    mobileFilterContainer.classList.toggle('filters__menu--open');

    if (mobileFilterContainer.classList.contains('filters__menu--open')) {
        e.target.textContent = 'Close filters';
    } else {
        e.target.textContent = 'Open filters';
    }
});

checkBoxes.forEach(box => {
    box.addEventListener('change', () => {
        const allCheckboxes = document.querySelectorAll('.filters__option');
        let checkedValues = [];

        allCheckboxes.forEach((box) => {
            if (box.checked) {
                checkedValues.push(box.checked);
            }
        });

        if (checkedValues.length) {
            applyFiltersBtn.classList.remove('hide');
            applyFiltersDesktopBtn.classList.remove('hide');
            applyFiltersBtn.textContent = `Apply filters (${checkedValues.length})`;
            applyFiltersDesktopBtn.textContent = `Apply filters (${checkedValues.length})`;
        } else {
            applyFiltersBtn.classList.add('hide');
            applyFiltersDesktopBtn.classList.add('hide');
        }
    });
});

filterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const selectedGenres = formData.getAll('filter-option');

    getGamesWithGenres(selectedGenres);

});

getAllGenres();
getTopRated();

//   https://api.rawg.io/docs/#tag/games
// https://rawg.io/apidocs