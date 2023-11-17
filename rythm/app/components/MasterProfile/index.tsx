import React, { useEffect, useState, useContext } from 'react';
import { OandaApiContext } from '../../api/OandaApi';

import { Label } from '@/components/ui/label';

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
    <div>
      {accountSummary ? (
        <div>
          <h2 className="title text-white font-mono mb-4 uppercase font-bold">
            Account Summary
          </h2>
          <div className="flex-col gap-2 flex flex-wrap">
            <Label>
              ID: <span>{accountSummary.id}</span>
            </Label>
            <Label>
              Balance: <span>{accountSummary.balance}</span>
            </Label>
            <Label>
              Currency: <span>{accountSummary.currency}</span>
            </Label>
            <Label>
              Unrealized Profit: <span>{accountSummary.unrealizedPL}</span>
            </Label>
            <Label>
              NAV: <span>{accountSummary.NAV}</span>
            </Label>
            <Label>
              Financing: <span>{accountSummary.financing}</span>
            </Label>
            <Label>
              Margin Available: <span>{accountSummary.marginAvailable}</span>
            </Label>
            <Label>
              Margin Closeout Percent:{' '}
              <span>{accountSummary.marginCloseoutPercent}</span>
            </Label>
            <Label>
              Open Position Count:{' '}
              <span>{accountSummary.openPositionCount}</span>
            </Label>
            <Label>
              Open Trade Count: <span>{accountSummary.openTradeCount}</span>
            </Label>
            <Label>
              PL (Profit/Loss): <span>{accountSummary.pl}</span>
            </Label>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg
            width="60"
            height="60"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              stroke="#333"
              strokeWidth="5"
              fill="none"
              strokeDasharray="31.415, 31.415"
              strokeDashoffset="0"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      )}
    </div>
  );
};

export default MasterProfile;
