import React, { useEffect, useState, useContext } from 'react';
import { OandaApiContext } from '../../api/OandaApi'; 
import { CandleData } from "@/types";
import styles from './styles.module.css';

interface DataTableProps {
    pair: string;
  }
  
function DataTable({ pair }: DataTableProps) {
    const [data, setData] = useState<CandleData[]>([]);
    const [loading, setLoading] = useState(true);
    const api = useContext(OandaApiContext);
    
    useEffect(() => {
        const getData = async () => {
            try {
                const candles = await api?.fetchCandles(pair, 300, 'M1');
                setData(candles || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data for pair", pair, error);
                setLoading(false);
            }
        };

        getData();
    }, [api, pair]);

    return (
        <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
                <thead className={styles.tableHeader}>
                    <tr>
                        <th>Time</th>
                        <th>Open</th>
                        <th>Close</th>
                        <th>High</th>
                        <th>Low</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {loading ? (
                        <tr>
                            <td colSpan={5}>Loading...</td>
                        </tr>
                    ) : (
                        data.map((candle, index) => (
                            <tr key={index}>
                                <td>{new Date(candle.time).toLocaleString()}</td>
                                <td>{candle.mid.o}</td>
                                <td>{candle.mid.c}</td>
                                <td>{candle.mid.h}</td>
                                <td>{candle.mid.l}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;
