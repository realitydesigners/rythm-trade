import React, { useEffect, useState, useContext } from 'react';
import { OandaApiContext } from '../page'; 

const MasterProfile: React.FC = () => {
  const [accountSummary, setAccountSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const api = useContext(OandaApiContext);

  useEffect(() => {
    const fetchAccount = async () => {
      if (api) {
        const summary = await api.getAccountSummary();
        setAccountSummary(summary);
      }
      setLoading(false);
    };
    fetchAccount();
  }, [api]);

  return (
    <div>
      { !accountSummary ? (
        <p>Loading...</p>
      ) : (
        <div className='w-full pl-10 pr-10 pt-2 pb-2 bg-black text-sm space-y-1 font-mono text-gray-200'>
          <h2 className='text-gray-400 font-bold'>Account Summary</h2>
          <div><span className='text-gray-400 font-bold'>ID:</span> {accountSummary.id}</div>
          <div><span className='text-gray-400 font-bold'>Balance:</span> {accountSummary.balance}</div>
          <div><span className='text-gray-400 font-bold'>Currency:</span> {accountSummary.currency}</div>
          <div><span className='text-gray-400 font-bold'>Unrealized Profit:</span> {accountSummary.unrealizedPL}</div>
          <div><span className='text-gray-400 font-bold'>NAV:</span> {accountSummary.NAV}</div>
          <div><span className='text-gray-400 font-bold'>Financing:</span> {accountSummary.financing}</div>
          <div><span className='text-gray-400 font-bold'>Margin Available:</span> {accountSummary.marginAvailable}</div>
          <div><span className='text-gray-400 font-bold'>Margin Closeout Percent:</span> {accountSummary.marginCloseoutPercent}</div>
          <div><span className='text-gray-400 font-bold'>Open Position Count:</span> {accountSummary.openPositionCount}</div>
          <div><span className='text-gray-400 font-bold'>Open Trade Count:</span> {accountSummary.openTradeCount}</div>
          <div><span className='text-gray-400 font-bold'>PL (Profit/Loss):</span> {accountSummary.pl}</div>
        </div>
      )}
    </div>
  );
};

export default MasterProfile;