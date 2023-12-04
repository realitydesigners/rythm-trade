import React from 'react';
import { PositionData } from '@/types';

interface MasterPositionProps {
   positionData: PositionData[];
}

function MasterPosition({ positionData }: MasterPositionProps) {
   return (
      <div className="overflow-auto">
         <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
               <tr>
                  <th className="px-4 py-2">Trade IDs</th>
                  <th className="px-4 py-2">Pair</th>
                  <th className="px-4 py-2">Position</th>
                  <th className="px-4 py-2">Units</th>
                  <th className="px-4 py-2">Avg Price</th>
                  <th className="px-4 py-2">Unrealized</th>
               </tr>
            </thead>
            <tbody>
               {positionData.map((position, index) =>
                  position ? (
                     <tr key={index} className="text-gray-200">
                        <td className="px-4 py-2">{position.long.units !== '0' ? position.long.tradeIDs?.join(', ') ?? 'N/A' : position.short.units !== '0' ? position.short.tradeIDs?.join(', ') ?? 'N/A' : 'N/A'}</td>
                        <td className="px-4 py-2">{position.instrument}</td>
                        <td className="px-4 py-2">{position.long.units !== '0' ? 'Long' : position.short.units !== '0' ? 'Short' : 'N/A'}</td>
                        <td className="px-4 py-2">{position.long.units !== '0' ? position.long.units : position.short.units !== '0' ? position.short.units : 'N/A'}</td>
                        <td className="px-4 py-2">{position.long.units !== '0' ? position.long.averagePrice : position.short.units !== '0' ? position.short.averagePrice : 'N/A'}</td>
                        <td className="px-4 py-2">{position.unrealizedPL}</td>
                     </tr>
                  ) : (
                     <tr key={index}>
                        <td colSpan={6} className="px-4 py-2 text-center">
                           No position available
                        </td>
                     </tr>
                  ),
               )}
            </tbody>
         </table>
      </div>
   );
}

export default MasterPosition;
