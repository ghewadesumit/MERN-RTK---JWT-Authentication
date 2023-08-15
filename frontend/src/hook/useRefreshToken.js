import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/users/refresh', {
            withCredentials: true,
        });

        console.log(`Refresh token response is ${response}`);
        setAuth((prev) => {
            console.log('Previous token value is', JSON.stringify(prev));
            console.log(`new token value is ${response.data.token}`);
            return { ...prev, accesstoken: response.data.token };
        });
        return response.data.token;
    };
    return refresh;
};

export default useRefreshToken;
