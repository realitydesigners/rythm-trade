import React from 'react';
import { PositionData } from '@/types';
import styles from './styles.module.css';

interface MasterPositionProps {
  positionData: PositionData[];
}

function MasterPosition({ positionData }: MasterPositionProps) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.dataTable}>
        <thead className={styles.tableHeader}>
          <tr>
            <th>Trade IDs</th>
            <th>Pair</th>
            <th>Position</th>
            <th>Avg Price</th>
            <th>Unrealized</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {positionData.map((position, index) => (
            position ? (
              <tr key={index}>
                <td>
                  {position.long.units !== '0' ? position.long.tradeIDs?.join(', ') ?? 'N/A' : 
                   position.short.units !== '0' ? position.short.tradeIDs?.join(', ') ?? 'N/A' : 'N/A'}
                </td>
                <td>{position.instrument}</td>
                <td>{position.long.units !== '0' ? 'Long' : (position.short.units !== '0' ? 'Short' : 'N/A')}</td>
                <td>{position.long.units !== '0' ? position.long.averagePrice : 
                     position.short.units !== '0' ? position.short.averagePrice : 'N/A'}</td>
                <td>{position.unrealizedPL}</td>
              </tr>
            ) : (
              <tr key={index}>
                <td colSpan={6}>No position available</td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MasterPosition;
