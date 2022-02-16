const API_KEY = "e11764caf2aa106737a0d02f13e03708";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
    id:number,
    backdrop_path:string;
    poster_path:string;
    title:string;
    overview:string;
    release_date:string;
    vote_average:number;
}


export interface IGetMoviesResult{
    date:{
        maximum:string;
        minimum:string;
    };
    page:number,
    results:IMovie[],
    total_pages:number,
    totatl_results:number,
}


export function getMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}