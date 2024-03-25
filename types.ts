export interface User {
	id: string;
}

export interface CandleData {
	time: string;
	mid: {
		o: string;
		c: string;
		h: string;
		l: string;
	};
	symbol: string;
	ask: { c: string };
	bid: { c: string };
	volume: number;
}

interface PriceDetail {
	price: string;
}

export interface StreamData {
	bids?: PriceDetail[];
	asks?: PriceDetail[];
	trend?: "up" | "down";
	closeoutAsk?: any;
	closeoutBid?: any;
}

export interface Price {
	value: any;
	bid: string | null;
	ask: string | null;
}

export interface ForexData {
	[key: string]: Price | undefined;
}

export interface Box {
	high: number;
	low: number;
	boxMovedUp: boolean;
	boxMovedDn: boolean;
	rngSize: number;
}

export interface BoxArrays {
	[key: number]: Box;
}

export interface PositionData {
	lastTransactionID: string;
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
export interface PositionDetails {
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

export interface RangeLineProps {
	boxArrays?: BoxArrays;
	minY: number;
	maxY: number;
}

export interface ChartLineProps {
	closingPrices: number[];
	minY: number;
	maxY: number;
	streamingData?: StreamData | null;
	padding?: number;
}
