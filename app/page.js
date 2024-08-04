'use client';

import { Button } from '@mui/material';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, provider } from '../firebase'; // Adjust the path as needed

export default function SignIn() {
    const router = useRouter();

    // Function to handle Google login
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            // User signed in successfully
            router.push('/app/inventory'); // Redirect to /inventory page
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    return (
        <div>
            <Button variant="contained" onClick={handleLogin}>
                Sign in with Google
            </Button>
        </div>
    );
}