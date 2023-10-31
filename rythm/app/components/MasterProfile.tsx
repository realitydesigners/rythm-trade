import React, { useEffect, useState } from 'react';
import { OandaApi } from '../api/masterPi'; // Assuming OandaApi is in the same directory

const MasterProfile: React.FC = () => {
  const [accountSummary, setAccountSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const api = new OandaApi();
      const summary = await api.getAccountSummary('your_account_id_here');
      setAccountSummary(summary);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Master Profile</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Account Summary</h2>
          <pre>{JSON.stringify(accountSummary, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MasterProfile;
