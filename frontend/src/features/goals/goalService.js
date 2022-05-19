import axios from 'axios';

const API_URL = '/api/goals/';

// Create new goal
const createGoal = async (goalData, token) => {
	/**const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};*/
	const { axiosPrivate, goal } = goalData;

	// console.log(goalData);
	// const response = await axiosPrivate.post(API_URL, goal, config);
	const response = await axiosPrivate.post(API_URL, goal);

	return response.data;
};

// Get user goals
const getGoals = async (axiosPrivate, token) => {
	const response = await axiosPrivate.get(API_URL);
	// console.log('Goal Service -> get goals: Response is', response);
	return response.data;
};

// Delete user goal
const deleteGoal = async (goalData, token) => {
	const { axiosPrivate, id } = goalData;
	const response = await axiosPrivate.delete(API_URL + id);
	return response.data;
};

const goalService = {
	createGoal,
	getGoals,
	deleteGoal,
};

export default goalService;
