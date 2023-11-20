import React from 'react';
import styles from './styles.module.css';
import { Label } from '@/app/components/Shadcn/label';
import { StreamData } from '@/types';

interface StreamProps {
   pair: string;
   data: StreamData | null;
}

const Stream: React.FC<StreamProps> = ({ pair, data }) => {
   const bid = data?.bids?.[0]?.price ?? 'N/A';
   const ask = data?.asks?.[0]?.price ?? 'N/A';

   return (
      <div className="w-full justify-center flex">
         <div className="w-full ">
            <Label className="font-bold">
               {pair}:
               {data ? (
                  <>
                     <br />
                     <Label className="text-teal-400 font-bold">Bid:</Label> <Label>{bid}</Label>
                     <br />
                     <Label className="text-red-400 font-bold">Ask:</Label> <Label>{ask}</Label>{' '}
                  </>
               ) : (
                  <div className="w-full h-full flex p-2">
                     <svg width="20" height="20" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="25" cy="25" r="20" stroke="#333" strokeWidth="5" fill="none" strokeDasharray="31.415, 31.415" strokeDashoffset="0">
                           <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
                        </circle>
                     </svg>
                  </div>
               )}
            </Label>
         </div>
      </div>
   );
};

export default Stream;
