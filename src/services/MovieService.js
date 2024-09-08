import apiClient from './apiClient'; // The configured Axios instance

class MovieService {
    getAllMovies() {
        return apiClient.get('/movies/getAll'); // The token is automatically included
    }


    addMovie(params){
        return apiClient.post('/movies/add');
    }
}

export default MovieService;
