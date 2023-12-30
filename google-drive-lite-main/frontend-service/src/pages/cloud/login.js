import AuthContext from '@/contexts/AuthContext';
import { Router, useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { user, loginUser } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
          router.push("/cloud");
        }
      }, [user, router]);

    const handleLogin = (e) => {
        console.log('BABABOI');
        loginUser(e);
    };

    return (
        <div>
            <div>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} name="username" />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" />

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;