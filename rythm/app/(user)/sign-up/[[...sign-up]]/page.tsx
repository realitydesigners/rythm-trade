'use client';
import React, { useCallback, useEffect } from 'react';
import { SignUp, useUser } from '@clerk/nextjs';

export default function Page() {
   const { user } = useUser();

   const handleSignUpSuccess = useCallback(async () => {
      const serverBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      console.log('sign up');
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
   }, [user]); // Dependency on `user`

   useEffect(() => {
      if (user) {
         handleSignUpSuccess();
      }
   }, [user, handleSignUpSuccess]);

   return (
      <div className="w-full h-screen -mt-12 flex justify-center items-center p-8">
         <SignUp />
      </div>
   );
}
