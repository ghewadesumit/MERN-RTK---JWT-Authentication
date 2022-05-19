import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { refresh } from '../features/auth/authSlice';

const axiosPrivate = axios.create({
	// baseURL: `http://localhost:6000`,
	headers: { 'Content-Type': 'application/json' },
	// withCredentials: true,
});

const useAxiosPrivate = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	// console.log('I have been called axiosPrivate');
	useEffect(() => {
		const requestInterceptor = axiosPrivate.interceptors.request.use(
			(config) => {
				if (!config.headers['Authorization']) {
					config.headers['Authorization'] = `Bearer ${user?.token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);
		const responseInterceptor = axiosPrivate.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error?.config;
				if (error?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await dispatch(refresh());
					console.log('New Access Token is', newAccessToken);
					console.log('Previous request', prevRequest);
					prevRequest.headers[
						'Authorization'
					] = `Bearer ${newAccessToken.payload}`;
					return axiosPrivate(prevRequest);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosPrivate.interceptors.response.eject(responseInterceptor);
			axiosPrivate.interceptors.request.eject(requestInterceptor);
		};
	}, [dispatch, user]);
	return axiosPrivate;
};

export default useAxiosPrivate;
