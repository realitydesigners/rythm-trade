import { SignIn, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function Page() {
  const { user } = useUser();

  // const handleSignInSuccess = async () => {
  //   const serverBaseUrl = 'http://localhost:3001';
  //   if (!user) return;

  //   try {
  //     const primaryEmail = user.primaryEmailAddress?.emailAddress;
  //     const fullName = user.fullName;

  //     const userDetails = { userId: user.id, email: primaryEmail, name: fullName };
  //     const response = await fetch(`${serverBaseUrl}/user`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(userDetails),
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to create or update user');
  //     }
  //     const updatedUser = await response.json();
  //     console.log('User created or updated:', updatedUser);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  // useEffect(() => {
  //   if (user) {
  //     handleSignInSuccess();
  //   }
  // }, [user]);

  return <SignIn />;
}
