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

const checkBoxes = document.querySelectorAll('.filters__option');

const mainHeader = document.querySelector('#main-header');

const filterContainer = document.querySelector('.filters');
const mobileFilterContainer = document.querySelector('.filters__menu');

const desktopFilterBtn = document.querySelector('#filter-btn');
const mobileFilterBtn = document.querySelector('#open-filters');

const mobileApplyFiltersBtn = document.querySelector('#apply-filters');
const desktopApplyFiltersBtn = document.querySelector('#apply-filters-desktop');

let filtered = false;

// Create 19 game items
for (let i = 0; i < 19; i++) {
    let nodeCopy = topRatedItems[0].cloneNode(true);
    topRatedCollection.appendChild(nodeCopy);
}

const getCheckedValues = () => {
    const allCheckboxes = document.querySelectorAll('.filters__option');
    let values = [];

    allCheckboxes.forEach((box) => {
        if (box.checked) {
            values.push(box.checked);
        }
    });

    return values;
};

const toggleApplyButtons = (isFiltered, checkedValues) => {

    // If user has filtered on genre
    if (isFiltered) {
        mobileApplyFiltersBtn.classList.remove('hide');
        desktopApplyFiltersBtn.classList.remove('hide');

        // When filter menu has been opened, check what is being selected 
        if (!checkedValues.length) {
            mobileApplyFiltersBtn.textContent = `Reset filters`;
            desktopApplyFiltersBtn.textContent = `Reset filters`;
        } else {
            mobileApplyFiltersBtn.textContent = `Apply filters (${checkedValues.length})`;
            desktopApplyFiltersBtn.textContent = `Apply filters (${checkedValues.length})`;
        }
    } else {
        // When filter menu has been opened by default (on home), check what is being selected 
        if (checkedValues.length) {
            mobileApplyFiltersBtn.classList.remove('hide');
            desktopApplyFiltersBtn.classList.remove('hide');
            mobileApplyFiltersBtn.textContent = `Apply filters (${checkedValues.length})`;
            desktopApplyFiltersBtn.textContent = `Apply filters (${checkedValues.length})`;
        } else {
            mobileApplyFiltersBtn.classList.add('hide');
            desktopApplyFiltersBtn.classList.add('hide');
        }
    }

};

// Add event listener to checkboxes for cloned items
const addCheckListeners = (cloneEl) => {
    const checkbox = cloneEl.querySelector('.filters__option');

    checkbox.addEventListener('change', () => {
        const checkedValues = getCheckedValues();
        toggleApplyButtons(filtered, checkedValues);
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
        ratingEl.textContent = 'null';
        ratingEl.classList.add('rating--null');
    }
};

const getRating = (metacritic) => {
    return Math.round((metacritic * 5 / 100) * 10) / 10;
};

const pushGameItems = (gameArray) => {

    // Use game objects from array to fill site with content
    let index = 0;
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

        metaRating.textContent = rating;
        addRatingColors(rating, stars, metaRating);

        index++;
    });
};

const createGameObject = (data) => {
    let newObject = {};
    let newArray = [];

    // Create own game object based on api results
    data.forEach((object) => {
        newObject.id = object.id;
        newObject.slug = object.slug;
        newObject.name = object.name;
        newObject.background_image = object.background_image;
        newObject.rating_top = object.rating_top;
        newObject.metacritic = object.metacritic;
        newObject.parent_platforms = object.parent_platforms;
        newObject.genres = object.genres;

        newArray.push(newObject);

        // reset
        newObject = {};
    });

    return newArray;
};

// Get top rated games since 2019
const getTopRated = () => {
    fetch(`https://api.rawg.io/api/games?key=${key}&page_size=20&metacritic=80,100&dates=2019-01-01,2022-01-01&ordering=-metacritic`, requestOptions)
        .then(response => response.json())
        .then((result) => {

            const gameArray = createGameObject(result.results);
            topRatedCollection.classList.remove('dummy');
            pushGameItems(gameArray);

        })
        .catch(error => console.log('error', error));
};

// Get all available genres for filtering
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

            // Create filter checkboxes based on available amount
            for (let i = 0; i < genreArray.length - 1; i++) {
                let filterCopy = filterElement[0].cloneNode(true);
                filterElContainer.appendChild(filterCopy);
                addCheckListeners(filterCopy);
            }

            // Use object fill site with content
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

// Find all games based on selected genres
const getGamesWithGenres = (selectedGenres) => {
    fetch(`https://api.rawg.io/api/games?key=${key}&page_size=20&genres=${selectedGenres.toString()}`, requestOptions)
        .then(response => response.json())
        .then((result) => {

            // Reset filter styling
            topRatedCollection.closest('section').querySelector('h2').textContent = 'Filter results';
            filterContainer.classList.remove('filters--open');
            mobileFilterContainer.classList.remove('filters__menu--open');
            mobileApplyFiltersBtn.classList.add('hide');
            desktopApplyFiltersBtn.classList.add('hide');

            if (window.innerWidth >= 950) {
                mainHeader.classList.remove('filters--open');
                mainHeader.querySelector('.active').classList.remove('active');
                mainHeader.querySelector('#filter-btn').textContent = 'Filters';
            }

            mobileFilterBtn.textContent = 'Open filters';

            // User has filtered
            filtered = true;

            const gameArray = createGameObject(result.results);
            topRatedCollection.classList.remove('dummy');
            pushGameItems(gameArray);

            // get new elements and force focus
            const updatedCollection = document.querySelector('#top-rated');
            const firstItem = updatedCollection.getElementsByTagName('a')[0];
            firstItem.focus();

        })
        .catch(error => console.log('error', error));
};

// Desktop nav button
desktopFilterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const checkedValues = getCheckedValues();

    if (checkedValues.length) {
        mobileApplyFiltersBtn.classList.remove('hide');
        desktopApplyFiltersBtn.classList.remove('hide');
        mobileApplyFiltersBtn.textContent = `Apply filters (${checkedValues.length})`;
        desktopApplyFiltersBtn.textContent = `Apply filters (${checkedValues.length})`;
    } else {
        mobileApplyFiltersBtn.classList.add('hide');
        desktopApplyFiltersBtn.classList.add('hide');
    }

    if (desktopFilterBtn.closest('li').classList.contains('active') && checkedValues.length) {
        e.target.textContent = 'Filters';

        desktopApplyFiltersBtn.classList.add('hide');
    } else {
        e.target.textContent = 'Close';
    }

    filterContainer.classList.toggle('filters--open');
    desktopFilterBtn.closest('li').classList.toggle('active');
    mainHeader.classList.toggle('filters--open');
});

mobileFilterBtn.addEventListener('click', (e) => {
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
        const checkedValues = getCheckedValues();

        toggleApplyButtons(filtered, checkedValues);
    });
});

filterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const selectedGenres = formData.getAll('filter-option');

    const checkedValues = getCheckedValues();

    // If filtered and no genres selected -> reset filters
    if (filtered && !checkedValues.length) {
        location.reload();
    } else {
        getGamesWithGenres(selectedGenres);
    }
});

getAllGenres();
getTopRated();

//   https://api.rawg.io/docs/#tag/games
// https://rawg.io/apidocs