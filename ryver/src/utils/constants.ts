interface CurrencyPairDetails {
	point: number;
	digits: number;
}
export const BOX_SIZES: Record<string, number[]> = {
	// 25%
	1: [
		10, 13, 17, 23, 31, 42, 56, 75, 100, 133, 177, 237, 316, 421, 562, 750,
		1000,
	],

	// 10.0%
	2: [
		10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55,
		61, 67, 74, 81, 89, 98, 108, 119, 131, 144, 158, 174, 191, 211, 232, 255,
		281, 309, 340, 374, 411, 452, 497, 547, 602, 662, 728, 801, 881, 970, 1067,
		1173, 1291, 1420, 1562, 1718, 1890, 2079, 2287, 2516, 2767, 3044,
	],

	// IntraDay
	3: [
		10, 11, 12, 14, 16, 18, 20, 23, 26, 29, 32, 36, 41, 46, 52, 59, 67, 75, 84,
		95, 107, 121, 136, 153, 173, 194, 218,
	],
	// 12.5%
	d: [
		10, 11, 12, 14, 16, 18, 20, 23, 26, 29, 32, 36, 41, 46, 52, 59, 67, 75, 84,
		95, 107, 121, 136, 153, 173, 194, 218, 245, 275, 309, 347, 389, 436, 489,
		548, 614, 687, 769, 860, 959,
	],
};
export interface SymbolsToDigits {
	[key: string]: CurrencyPairDetails;
}

export const symbolsToDigits: SymbolsToDigits = {
	ETH_USD: { point: 0.01, digits: 2 },
	USD_SGD: { point: 0.00001, digits: 5 },
	EUR_SEK: { point: 0.00001, digits: 5 },
	HKD_JPY: { point: 0.001, digits: 5 },
	AUD_USD: { point: 0.00001, digits: 5 },
	USD_CAD: { point: 0.00001, digits: 5 },
	NZD_USD: { point: 0.00001, digits: 5 },
	NZD_SGD: { point: 0.00001, digits: 5 },
	USD_NOK: { point: 0.00001, digits: 5 },
	USD_CNH: { point: 0.00001, digits: 5 },
	SGD_CHF: { point: 0.00001, digits: 5 },
	GBP_JPY: { point: 0.001, digits: 5 },
	USD_TRY: { point: 0.00001, digits: 5 },
	AUD_JPY: { point: 0.001, digits: 5 },
	ZAR_JPY: { point: 0.001, digits: 5 },
	SGD_JPY: { point: 0.001, digits: 5 },
	GBP_ZAR: { point: 0.00001, digits: 5 },
	USD_JPY: { point: 0.001, digits: 5 },
	EUR_TRY: { point: 0.00001, digits: 5 },
	EUR_JPY: { point: 0.001, digits: 5 },
	AUD_SGD: { point: 0.00001, digits: 5 },
	EUR_NZD: { point: 0.00001, digits: 5 },
	GBP_HKD: { point: 0.00001, digits: 5 },
	CHF_JPY: { point: 0.001, digits: 5 },
	EUR_HKD: { point: 0.00001, digits: 5 },
	GBP_CAD: { point: 0.00001, digits: 5 },
	USD_THB: { point: 0.001, digits: 5 },
	GBP_CHF: { point: 0.00001, digits: 5 },
	AUD_CHF: { point: 0.00001, digits: 5 },
	NZD_CHF: { point: 0.00001, digits: 5 },
	AUD_HKD: { point: 0.00001, digits: 5 },
	USD_CHF: { point: 0.00001, digits: 5 },
	CAD_HKD: { point: 0.00001, digits: 5 },
	EUR_CHF: { point: 0.00001, digits: 5 },
	EUR_SGD: { point: 0.00001, digits: 5 },
	NZD_CAD: { point: 0.00001, digits: 5 },
	GBP_AUD: { point: 0.00001, digits: 5 },
	USD_PLN: { point: 0.00001, digits: 5 },
	EUR_ZAR: { point: 0.00001, digits: 5 },
	TRY_JPY: { point: 0.001, digits: 5 },
	EUR_AUD: { point: 0.00001, digits: 5 },
	USD_ZAR: { point: 0.00001, digits: 5 },
	CAD_JPY: { point: 0.001, digits: 5 },
	NZD_HKD: { point: 0.00001, digits: 5 },
	USD_CZK: { point: 0.00001, digits: 5 },
	USD_DKK: { point: 0.00001, digits: 5 },
	USD_SEK: { point: 0.00001, digits: 5 },
	GBP_SGD: { point: 0.00001, digits: 5 },
	EUR_DKK: { point: 0.00001, digits: 5 },
	CHF_ZAR: { point: 0.00001, digits: 5 },
	CAD_CHF: { point: 0.00001, digits: 5 },
	GBP_USD: { point: 0.00001, digits: 5 },
	USD_MXN: { point: 0.00001, digits: 5 },
	USD_HUF: { point: 0.001, digits: 5 },
	USD_HKD: { point: 0.00001, digits: 5 },
	EUR_USD: { point: 0.00001, digits: 5 },
	EUR_CAD: { point: 0.00001, digits: 5 },
	AUD_CAD: { point: 0.00001, digits: 5 },
	GBP_PLN: { point: 0.00001, digits: 5 },
	EUR_PLN: { point: 0.00001, digits: 5 },
	GBP_NZD: { point: 0.00001, digits: 5 },
	EUR_HUF: { point: 0.001, digits: 5 },
	EUR_NOK: { point: 0.00001, digits: 5 },
	CHF_HKD: { point: 0.00001, digits: 5 },
	EUR_GBP: { point: 0.00001, digits: 5 },
	AUD_NZD: { point: 0.00001, digits: 5 },
	CAD_SGD: { point: 0.00001, digits: 5 },
	EUR_CZK: { point: 0.00001, digits: 5 },
	NZD_JPY: { point: 0.001, digits: 5 },
};
