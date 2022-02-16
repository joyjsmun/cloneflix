const API_KEY = "e11764caf2aa106737a0d02f13e03708";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => {response.json(); 
            console.log("type is...",typeof(response))}
       
    );
}