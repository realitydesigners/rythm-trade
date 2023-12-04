'use client';
import React, { useState } from 'react';

export default function AccountForm() {
   const [accountId, setAccountId] = useState('');
   const [apiKey, setApiKey] = useState('');

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Process accountId and apiKey, e.g., send to your API or backend
      console.log(accountId, apiKey); // Placeholder for actual submission logic
   };

   return (
      <div className="flex justify-center items-center w-full">
         <form onSubmit={handleSubmit} className="w-full max-w-xl bg-black rounded-lg shadow-md p-6 mt-6">
            <div className="mb-4">
               <label htmlFor="accountId" className="block font-mono text-gray-600 text-sm font-bold mb-2">
                  Account ID
               </label>
               <input id="accountId" name="accountId" type="text" value={accountId} onChange={e => setAccountId(e.target.value)} placeholder="Enter your Account ID" className=" font-mono shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="mb-4">
               <label htmlFor="apiKey" className="block font-mono text-gray-600 text-sm font-bold mb-2">
                  API Key
               </label>
               <input id="apiKey" name="apiKey" type="text" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Enter your API Key" className="font-mono shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <button type="submit" className="w-full font-mono bg-white hover:bg-gray-200/50 text-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
               Save
            </button>
         </form>
      </div>
   );
}
