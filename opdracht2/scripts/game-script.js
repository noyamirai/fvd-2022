const key = "20d879ddcd1940eabc1babb11790c2e4";

const requestOptions = {
  method: 'GET',
  redirect: 'follow'
};


fetch(`https://api.rawg.io/api/games?key=${key}&page_size=2&dates=2022-01-01,2022-03-20&ordering=-added`, requestOptions)
  .then(response => response.json())
  .then(result => console.log(result.results))
  .catch(error => console.log('error', error));

//   https://api.rawg.io/docs/#tag/games
// https://rawg.io/apidocs