'use client';
import { SignUp, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function Page() {
  const { user } = useUser();

  /**
   * Handles successful sign-up events by creating or updating the user in the database.
   * @returns {Promise<void>} A promise that resolves when the user creation or update process is complete.
   */
  const handleSignUpSuccess = async (): Promise<void> => {
    const serverBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    console.log('sign up')
    if (!user) return;

    try {
      const primaryEmail = user.primaryEmailAddress?.emailAddress;
      const fullName = user.fullName;

      const userDetails = { userId: user.id, email: primaryEmail, name: fullName };
      const response = await fetch(`${serverBaseUrl}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });
      if (!response.ok) {
        throw new Error('Failed to create or update user');
      }
      const updatedUser = await response.json();
      console.log('User created or updated:', updatedUser);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Runs the handleSignUpSuccess function when the user object changes
  useEffect(() => {
    if (user) {
      handleSignUpSuccess();
    }
  }, [user]);

  return (
    <div className="w-full h-screen  -mt-12 flex justify-center items-center p-8 ">
      <SignUp />;
    </div>
  );
}
