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
            <th>Instrument</th>
            <th>Long Units</th>
            <th>Short Units</th>
            <th>Unrealized P/L</th>
            <th>Margin Used</th>
            {/* Add more headers as needed */}
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {positionData.map((position, index) => (
            position ? (
              <tr key={index}>
                <td>{position.instrument}</td>
                <td>{position.long?.units || 'N/A'}</td>
                <td>{position.short?.units || 'N/A'}</td>
                <td>{position.unrealizedPL || 'N/A'}</td>
                <td>{position.marginUsed || 'N/A'}</td>
                {/* Render other data fields as needed */}
              </tr>
            ) : (
              <tr key={index}>
                <td colSpan={5}>No position available</td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MasterPosition;
