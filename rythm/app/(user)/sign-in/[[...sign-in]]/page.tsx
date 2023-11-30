'use client';
import { SignIn, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function Page() {
  const { user } = useUser();

  /**
   * Handles the sign-in process by verifying if the user exists in the database.
   * @returns {Promise<void>} A promise that resolves when the sign-in process is complete.
   */
  const handleSignIn = async (): Promise<void> => {
    const serverBaseUrl = 'http://localhost:8080';
    console.log('sign in')
    if (!user) return;

    try {
      const response = await fetch(`${serverBaseUrl}/user/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to verify user');
      }
      const userData = await response.json();
      if (userData) {
        console.log('User verified:', userData);
      } else {
        console.log('User not found in the database');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Runs the handleSignIn function when the user object changes
  useEffect(() => {
    if (user) {
      handleSignIn();
    }
  }, [user]);

  return <SignIn />;
}
