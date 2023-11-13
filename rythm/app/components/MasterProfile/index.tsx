import React, { useEffect, useState, useContext } from 'react';
import { OandaApiContext } from '../../api/OandaApi';
import styles from './styles.module.css';

const MasterProfile: React.FC = () => {
  const [accountSummary, setAccountSummary] = useState<any>(null);
  const api = useContext(OandaApiContext);

  useEffect(() => {
    const fetchAccount = async () => {
      if (api) {
        const summary = await api.getAccountSummary();
        setAccountSummary(summary);
      }
    };
    fetchAccount();
  }, [api]);

  return (
    <div className={styles.masterProfileContainer}>
      {accountSummary ? (
        <div className={styles.accountSummary}>
          <h2 className={styles.title}>Account Summary</h2>
          <div><span className={styles.label}>ID:</span> {accountSummary.id}</div>
          <div><span className={styles.label}>Balance:</span> {accountSummary.balance}</div>
          <div><span className={styles.label}>Currency:</span> {accountSummary.currency}</div>
          <div><span className={styles.label}>Unrealized Profit:</span> {accountSummary.unrealizedPL}</div>
          <div><span className={styles.label}>NAV:</span> {accountSummary.NAV}</div>
          <div><span className={styles.label}>Financing:</span> {accountSummary.financing}</div>
          <div><span className={styles.label}>Margin Available:</span> {accountSummary.marginAvailable}</div>
          <div><span className={styles.label}>Margin Closeout Percent:</span> {accountSummary.marginCloseoutPercent}</div>
          <div><span className={styles.label}>Open Position Count:</span> {accountSummary.openPositionCount}</div>
          <div><span className={styles.label}>Open Trade Count:</span> {accountSummary.openTradeCount}</div>
          <div><span className={styles.label}>PL (Profit/Loss):</span> {accountSummary.pl}</div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MasterProfile;
