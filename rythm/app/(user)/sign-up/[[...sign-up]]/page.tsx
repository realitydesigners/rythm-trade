import { SignUp } from '@clerk/nextjs';

export default function Page() {
   return (
      <div className="w-full h-screen  -mt-12 flex justify-center items-center p-8 ">
         <SignUp />;
      </div>
   );
}
