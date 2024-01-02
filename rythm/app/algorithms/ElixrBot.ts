import { OandaApi } from "../api/OandaApi";

class ElixrBot {
	private symbol: string;
	private apiContext: OandaApi;
	private dataFetchIntervalId: NodeJS.Timeout | null = null;
	private unrealizedPL: number | null = null;
	private realizedPL: number | null = null;
	private equity: number | null = null;
	private tradeCount: number | null = null;
	private marginCloseoutPercent: number | null = null;
	private unitsLong: number | null = null;
	private unitsShort: number | null = null;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private accountSummary: any = null;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private pairPositionSummary: any = null;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private positionSummary: any = null;
	private isProcessingTrade = false;
	private isActive = false;

	constructor(symbol: string, apiContext: OandaApi) {
		this.symbol = symbol;
		this.apiContext = apiContext;
	}

	toggleActive() {
		this.isActive = !this.isActive;
	}
	public async startDataCollection(interval = 10000) {
		this.stopDataCollection();

		await this.fetchData();

		this.dataFetchIntervalId = setInterval(() => this.fetchData(), interval);
	}

	private async fetchData() {
		try {
			this.pairPositionSummary = await this.apiContext.getPairPositionSummary(
				this.symbol,
			);
			this.accountSummary = await this.apiContext.getAccountSummary();

			if (this.accountSummary) {
				this.unrealizedPL = parseFloat(this.accountSummary.unrealizedPL);
				this.realizedPL = parseFloat(this.accountSummary.pl);
				this.equity = parseFloat(this.accountSummary.NAV);
				this.marginCloseoutPercent = parseFloat(
					this.accountSummary.marginCloseoutPercent,
				);
			}

			if (this.pairPositionSummary) {
				const longUnits = parseInt(this.pairPositionSummary.long?.units ?? "0");
				const shortUnits = parseInt(
					this.pairPositionSummary.short?.units ?? "0",
				);
				const positionCount = longUnits !== 0 || shortUnits !== 0 ? 1 : 0;
				const longTradeCount =
					this.pairPositionSummary.long?.tradeIDs?.length ?? 0;
				const shortTradeCount =
					this.pairPositionSummary.short?.tradeIDs?.length ?? 0;
				const tradeCount = longTradeCount + shortTradeCount;

				this.positionSummary = {
					lastTransactionID: this.pairPositionSummary?.lastTransactionID ?? "",
					instrument: this.symbol,
					long: this.pairPositionSummary?.long ?? {},
					short: this.pairPositionSummary?.short ?? {},
					positionCount: positionCount,
					tradeCount: tradeCount,
				};
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	}

	public stopDataCollection() {
		if (this.dataFetchIntervalId) {
			clearInterval(this.dataFetchIntervalId);
			this.dataFetchIntervalId = null;
		}
	}

	onData(
		currentPrice: number,
		priceToElixrRatio: number,
		intersectingPrice: number,
	) {
		if (!this.isActive || this.isProcessingTrade) {
			return;
		}

		const longUnits = this.positionSummary?.long?.units
			? parseInt(this.positionSummary.long.units)
			: 0;
		const shortUnits = this.positionSummary?.short?.units
			? parseInt(this.positionSummary.short.units)
			: 0;
		const tradeCount = this.positionSummary?.tradeCount ?? 0;
		const positionUnrealizedPL =
			longUnits > 0
				? parseFloat(this.positionSummary.long.unrealizedPL)
				: shortUnits < 0
				  ? parseFloat(this.positionSummary.short.unrealizedPL)
				  : 0;

		console.log(this.positionSummary);
		if (this.equity !== null) {
			const profitTarget = this.equity * 0.001;
			const stopLoss = this.equity * -0.001;
			const tradeSize = this.equity * 1;

			if (tradeCount > 0) {
				const closeAndFetchData = async (units: number) => {
					this.isProcessingTrade = true;
					console.log(`Closing position for ${this.symbol}:`, { units });

					const closeResult = await this.apiContext.closePosition(
						this.symbol,
						units,
					);
					console.log(`Position closed for ${this.symbol}:`, closeResult);

					await this.fetchData();
					this.isProcessingTrade = false;
				};

				if (
					positionUnrealizedPL !== null &&
					(positionUnrealizedPL > profitTarget ||
						positionUnrealizedPL < stopLoss)
				) {
					if (longUnits > 0) {
						closeAndFetchData(longUnits);
					} else if (shortUnits < 0) {
						closeAndFetchData(shortUnits);
					}
				}
			}

			const placeTradeAndUpdate = async (size: number, direction: number) => {
				this.isProcessingTrade = true;
				console.log(`Placing trade for ${this.symbol}:`, { size, direction });

				const tradeResult = await this.apiContext.placeTrade(
					this.symbol,
					size,
					direction,
				);
				console.log(`Trade placed for ${this.symbol}:`, tradeResult);

				await this.fetchData();
				this.isProcessingTrade = false;
			};

			if (tradeCount === 0) {
				if (
					this.shouldSell(
						currentPrice,
						priceToElixrRatio,
						intersectingPrice,
						shortUnits,
					)
				) {
					placeTradeAndUpdate(tradeSize, -1);
				} else if (
					this.shouldBuy(
						currentPrice,
						priceToElixrRatio,
						intersectingPrice,
						longUnits,
					)
				) {
					placeTradeAndUpdate(tradeSize, 1);
				}
			}
		}
	}

	shouldBuy(
		currentPrice: number,
		priceToElixrRatio: number,
		intersectingPrice: number,
		longUnits: number,
	): boolean {
		const result =
			(priceToElixrRatio === 0.0 || currentPrice < intersectingPrice) &&
			longUnits === 0;
		console.log("shouldBuy decision:", {
			currentPrice,
			priceToElixrRatio,
			intersectingPrice,
			longUnits,
			result,
		});
		return result;
	}

	shouldSell(
		currentPrice: number,
		priceToElixrRatio: number,
		intersectingPrice: number,
		shortUnits: number,
	): boolean {
		const result =
			(priceToElixrRatio === 1.0 || currentPrice > intersectingPrice) &&
			shortUnits === 0;
		console.log("shouldSell decision:", {
			currentPrice,
			priceToElixrRatio,
			intersectingPrice,
			shortUnits,
			result,
		});
		return result;
	}
}

export default ElixrBot;
