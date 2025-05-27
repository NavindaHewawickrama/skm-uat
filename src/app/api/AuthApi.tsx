import axios from 'axios';

//Login API
export const Login = async (details: {
    usernameOrEmail: any;
    password: any;
    rememberme: boolean;
}) => {
    try {
        const response = await axios.post(`http://173.212.233.90:8090/api/User/login`, {
            usernameOrEmail: details.usernameOrEmail,
            password: details.password,
            rememberme: details.rememberme

        }, {
            validateStatus: (status) => status < 500
        });
        return response;
    } catch (error) {
        throw error;
    }
}