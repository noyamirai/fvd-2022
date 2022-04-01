const key = '20d879ddcd1940eabc1babb11790c2e4';

const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

const topRatedCollection = document.querySelector('#top-rated');
const topRatedItems = topRatedCollection.getElementsByTagName('li');

for (let i = 0; i < 9; i++) {
    let nodeCopy = topRatedItems[0].cloneNode(true);
    topRatedCollection.appendChild(nodeCopy);
}

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
            // // Use game object to fill site with content
            gameArray.forEach((game) => {

                let listItem = topRatedItems[index];
                let gameCover = listItem.querySelector('img');

                listItem.id = game.slug;
                gameCover.src = game.background_image;
                index++;
            });
        })
        .catch(error => console.log('error', error));
};

getTopRated();



//   https://api.rawg.io/docs/#tag/games
// https://rawg.io/apidocs