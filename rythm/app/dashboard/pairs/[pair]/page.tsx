'use client';
import { useUser } from '@clerk/nextjs';

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'next/navigation';
import Stream from '@/app/components/Stream';
import MasterPosition from '@/app/components/MasterPosition';
import { OandaApiContext, api } from '@/app/api/OandaApi';
import ElixrModel from '@/app/components/ElixrModel';
import ThreeDModel from '@/app/components/ThreeDModel';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { BOX_SIZES } from '@/app/utils/constants';
import { closeWebSocket, connectWebSocket } from '@/app/api/websocket';
import { fetchPairPositionSummary } from '@/app/api/rest';

const PairPage = () => {
  const { user } = useUser();

  const params = useParams();
  let pair = Array.isArray(params.pair) ? params.pair[0] : params.pair || '';
  const [streamData, setStreamData] = useState<{ [pair: string]: any }>({});
  const [positionData, setPositionData] = useState(null);
  // State for selected box array type
  const [selectedBoxArrayType, setSelectedBoxArrayType] = useState<string>('d');

  // Function to handle change in selected box array type
  const handleBoxArrayTypeChange = (newType: string) => {
    setSelectedBoxArrayType(newType);
  };
  useEffect(() => {
    const handleWebSocketMessage = (message: any) => {
      const { data, pair } = message;
      if (data.type !== 'HEARTBEAT') {
        setStreamData(prevData => ({
          ...prevData,
          [pair]: data,
        }));
      }
    };
    const handleWebSocketError = (event: any) => {
      console.error('WebSocket Error:', event);
    };

    const handleWebSocketClose = () => {
      console.log('WebSocket Disconnected');
    };

    if (user) {
      connectWebSocket(user.id, handleWebSocketMessage, handleWebSocketError, handleWebSocketClose);
    }

    return () => {
      closeWebSocket();
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchPosition = async () => {
        const position = await fetchPairPositionSummary(user.id, pair);
        console.log(position)
        setPositionData(position);
      };

      fetchPosition();
      const intervalId = setInterval(fetchPosition, 60000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [pair, user]);

  return (
    <OandaApiContext.Provider value={api}>
      <div className="w-full relative z-0">
        {/* Top component */}
        <div className="w-full top-20 absolute z-30 pl-6 pr-6">
          <Stream pair={pair} data={streamData[pair]} />
        </div>

        {/* 3D Model component */}
        <div id="three" className="w-full flex h-screen absolute z-20">
          <ThreeDModel pair={pair} streamData={streamData[pair]} selectedBoxArrayType={selectedBoxArrayType} />
        </div>

        {/* Selection and Elixr Model component */}
        <div className="w-auto  flex-rows  gap-2 flex absolute left-0 top-40 p-4" style={{ zIndex: 1001 }}>
          <Select value={selectedBoxArrayType} onValueChange={handleBoxArrayTypeChange}>
            <SelectTrigger>
              <SelectValue>{selectedBoxArrayType}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.keys(BOX_SIZES).map(arrayKey => (
                <SelectItem key={arrayKey} value={arrayKey}>
                  {arrayKey}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div id="elixr" className="w-full flex h-full">
            <ElixrModel pair={pair} streamData={streamData[pair]} />
          </div>
        </div>

        {/* Master Position component */}
        <div className="w-full fixed bottom-0 bg-black" style={{ zIndex: 1000 }}>
          {positionData && <MasterPosition positionData={[positionData]} />}
          {!positionData && <p>No position data available for {pair}</p>}
        </div>

        {/* Buttons for hyperlinks */}
        <div className="fixed bottom-20 right-20 p-4">
          <a href="#three" className="m-2 btn">
            Go to Three
          </a>
          <a href="#elixr" className="m-2 btn">
            Go to Elixr
          </a>
        </div>
      </div>
    </OandaApiContext.Provider>
  );
};

export default PairPage;
