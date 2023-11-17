import React from 'react';
import styles from './styles.module.css';
import { Label } from '@/components/ui/label';

interface PriceDetail {
  price: string;
}

interface StreamData {
  bids?: PriceDetail[];
  asks?: PriceDetail[];
}

interface StreamProps {
  pair: string;
  data: StreamData | null;
}

const Stream: React.FC<StreamProps> = ({ pair, data }) => {
  const bid = data?.bids?.[0]?.price ?? 'N/A';
  const ask = data?.asks?.[0]?.price ?? 'N/A';

  return (
    <div className="w-full justify-center flex">
      <div className="w-full">
        <Label className="font-bold">
          {pair}:
          {data ? (
            <>
              <br />
              <Label className="text-teal-400 font-bold">Bid:</Label>{' '}
              <Label>{bid}</Label>{' '}
              <Label className="text-red-400 font-bold">Ask:</Label>{' '}
              <Label>{ask}</Label>{' '}
            </>
          ) : (
            <Label className={styles.loadingText}>Loading...</Label>
          )}
        </Label>
      </div>
    </div>
  );
};

export default Stream;
