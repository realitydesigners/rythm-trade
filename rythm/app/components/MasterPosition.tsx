import React from 'react';
import { PositionData } from '@/types';

interface MasterPositionProps {
   positionData: PositionData[];
}

function MasterPosition({ positionData }: MasterPositionProps) {
   return (
      <div className="w-full overflow-x-auto  border-gray-600 rounded-lg border shadow-2xl ">
         <table className="min-w-full table-auto border-collapse bg-black shadow-lg">
            <thead className="border-b border-gray-600">
               <tr>
                  <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-gray-300 text-xs font-mono">ID</th>
                  <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-gray-300 text-xs font-mono">Pair</th>
                  <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-gray-300 text-xs font-mono">Position</th>
                  <th className="px-4 py-4 text-right font-bold uppercase tracking-wider text-gray-300 text-xs font-mono">Units</th>
                  <th className="px-4 py-4 text-right font-bold uppercase tracking-wider text-gray-300 text-xs font-mono">Price</th>
                  <th className="px-4 py-4 text-right font-bold uppercase tracking-wider text-gray-300 text-xs font-mono">P&L</th>
               </tr>
            </thead>
            <tbody className="text-xs font-mono">
               {positionData.map((position, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-black' : 'bg-black'} hover:bg-gray-600/50 text-gray-200`}>
                     <td className="px-4 py-2 text-left border-b border-gray-600">{position.long.units !== '0' ? position.long.tradeIDs?.join(', ') ?? 'N/A' : position.short.units !== '0' ? position.short.tradeIDs?.join(', ') ?? 'N/A' : 'N/A'}</td>
                     <td className="px-4 py-2 text-left border-b border-gray-600">{position.instrument}</td>
                     <td className="px-4 py-2 text-left border-b border-gray-600">{position.long.units !== '0' ? 'Long' : position.short.units !== '0' ? 'Short' : 'N/A'}</td>
                     <td className="px-4 py-2 text-right border-b border-gray-600">{position.long.units !== '0' ? position.long.units : position.short.units !== '0' ? position.short.units : 'N/A'}</td>
                     <td className="px-4 py-2 text-right border-b border-gray-600">{position.long.units !== '0' ? position.long.averagePrice : position.short.units !== '0' ? position.short.averagePrice : 'N/A'}</td>
                     <td className="px-4 py-2 text-right border-b border-gray-600">{position.unrealizedPL}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default MasterPosition;
