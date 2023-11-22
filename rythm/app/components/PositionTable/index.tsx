import React, { useEffect, useState, useContext } from 'react';
import { OandaApiContext } from '../../api/OandaApi';
import styles from './styles.module.css';
interface PositionData {
  commission: string;
  dividendAdjustment: string;
  financing: string;
  guaranteedExecutionFees: string;
  instrument: string;
  long: PositionDetails;
  short: PositionDetails;
  unrealizedPL: string;
  marginUsed: string;
}
interface PositionDetails {
  averagePrice?: string;
  dividendAdjustment: string;
  financing: string;
  guaranteedExecutionFees: string;
  pl: string;
  resettablePL: string;
  units: string;
  unrealizedPL?: string;
  tradeIDs?: string[];
}
interface PositionSummaryProps {
  pair: string;
}
const PositionTable: React.FC<PositionSummaryProps> = ({ pair }) => {
  const [position, setPosition] = useState<PositionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const api = useContext(OandaApiContext);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchPositionData = async () => {
      try {
        const newPositionData = await api?.getPairPositionSummary(pair);
        setPosition(newPositionData);
        setIsLoading(false);
      } catch (error) {
        console.error(`Error fetching position data for pair ${pair}`, error);
        setIsLoading(false);
      }
    };

    fetchPositionData(); 
    intervalId = setInterval(fetchPositionData, 5000); 

    return () => clearInterval(intervalId); 
  }, [api, pair]);
  
  return (
    <div className={styles.tableContainer}>
      {isLoading ? (
        <p>Loading...</p>
      ) : position ? (
        <table className={styles.dataTable}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Instrument</th>
              <th>Long Units</th>
              <th>Short Units</th>
              <th>Unrealized P/L</th>
              <th>Margin Used</th>
              {}
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            <tr>
              <td>{position.instrument}</td>
              <td>{position.long.units}</td>
              <td>{position.short.units}</td>
              <td>{position.unrealizedPL}</td>
              <td>{position.marginUsed}</td>
              {}
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No position data available for {pair}.</p>
      )}
    </div>
  );
};
export default PositionTable;
