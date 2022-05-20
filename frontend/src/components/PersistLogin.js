import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { refresh } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from './Spinner';

export const PersistLogin = () => {
	// const [isLoading, setIsLoading] = useState(true);
	// const [persist, setPersist] = useState(
	// 	JSON.parse(localStorage.getItem('persist')) || false
	// );

	const dispatch = useDispatch();
	const { user, isLoading } = useSelector((state) => state.auth);
	useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				await dispatch(refresh());
			} catch (err) {
				console.error(err);
			} /*finally {
				setIsLoading(false);
			}*/
		};

		if (!user?.token) {
			verifyRefreshToken();
		}
	}, []);

	useEffect(() => {
		console.log(`isLoading: ${isLoading}`);
		console.log(`Access token: ${JSON.stringify(user?.token)}`);
	}, [isLoading, user]);
	return (
		<>{!persist ? <Outlet /> : isLoading ? <Spinner></Spinner> : <Outlet />}</>
	);
};
export default PersistLogin;
