import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hook/useDaveAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import useRefreshToken from '../../hook/useRefreshToken';

const Users = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const refresh = useRefreshToken();

    useEffect(() => {
        let isMounted = true;

        // for cancelling the request
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users/info', {
                    signal: controller.signal,
                });
                console.log(`User info is ${response.data}`);
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        };

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <article>
            <h2>Users List</h2>
            {users?.length ? (
                <ul>
                    {users.map((user, i) => (
                        <li key={i}>{user?.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No users to display</p>
            )}

            <button onClick={() => refresh()}>Refresh</button>
        </article>
    );
};

export default Users;
