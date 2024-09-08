import apiClient from "./apiClient";
import {post} from "./apiClient";
import axios from "axios";

class UserService {
    getById(id) {
        return apiClient.get(`/users/getById/${id}`);
    }

    getAllUsers(){
        return apiClient.get('/users/getAll');
    }

    updateUser(id, userData) {
        return apiClient.put(`/users/update/${id}`, userData);
    }

    deleteUser(id) {
        return apiClient.delete(`/users/delete/${id}`);
    }
    createUser(userData) {
        return axios.post("http://localhost:8080/api/register", userData);
    }



}

export default UserService;
