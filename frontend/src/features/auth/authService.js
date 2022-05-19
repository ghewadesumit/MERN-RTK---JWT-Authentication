import axios from 'axios';

const API_URL = '/api/users/';

// Register user
const register = async (userData) => {
	const response = await axios.post(API_URL, userData);

	if (response.data) {
		localStorage.setItem('user', JSON.stringify(response.data));
	}

	return response.data;
};

// Login user
const login = async (userData) => {
	const response = await axios.post(API_URL + 'login', userData);

	if (response.data) {
		localStorage.setItem('user', JSON.stringify(response.data));
	}

	return response.data;
};

// Logout user
const logout = async () => {
	const response = await axios.get(API_URL + 'logout');
	localStorage.removeItem('user');
	return response.data;
};

// Refresh User Access Token
const refresh = async () => {
	// withCredentials allows us to send secure cookies in the request
	const response = await axios.get(API_URL + 'refresh', {
		withCredentials: true,
	});
	console.log('AuthService: refresh response is', response.data.accessToken);
	return response.data.accessToken;
};
// const refresh = async()

const authService = {
	register,
	logout,
	login,
	refresh,
};

export default authService;
