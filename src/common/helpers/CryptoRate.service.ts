import { Injectable, InternalServerErrorException, NotAcceptableException, OnModuleInit } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class CryptoService implements OnModuleInit {
  private coinList: { id: string; symbol: string; name: string }[] = [];

  async onModuleInit() {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/coins/list');
      const coins = await res.json();

      if (!Array.isArray(coins)) {
        console.error('Unexpected response from CoinGecko:', coins);
        return;
      }

      this.coinList = coins;
      console.log(`Loaded ${coins.length} coins from CoinGecko`);
    } catch (error) {
      console.error('Failed to load CoinGecko coin list:', error);
    }
  }

  private getCoinIdById(id: string): string | null {
    const coin = this.coinList.find(
      (c) => c.id.toLowerCase() === id.toLowerCase()
    );
    return coin ? coin.id : null;
  }

  async getCoinList(): Promise<{ id: string; symbol: string; name: string }[]> {
    return this.coinList;
  }

  async getPriceUSD(symbol: string): Promise<number> {
    const coinId = this.getCoinIdById(symbol);
    if (!coinId) {
      throw new Error(`Coin symbol "${symbol}" is not supported.`);
    }

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const price = data?.[coinId]?.usd;
      if (!price) {
        throw new InternalServerErrorException(`Unable to retrieve price for ${symbol}`);
      }

      return price;
    } catch (err) {
      console.error('Error fetching price from CoinGecko:', err);
      throw new InternalServerErrorException('Failed to fetch price');
    }
  }

  async swap(
    from: string,
    to: string,
    amount: number
  ): Promise<{
    result: number;
    fromSymbol: string;
    toSymbol: string;
    fromPrice: number;
    toPrice: number;
    timestamp: string;
  }> {
    const fromId = this.getCoinIdById(from);
    const toId = this.getCoinIdById(to);

    if (!fromId || !toId) {
      throw new NotAcceptableException('Invalid coin symbol');
    }

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${fromId},${toId}&vs_currencies=usd`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const fromPrice = data?.[fromId]?.usd;
      const toPrice = data?.[toId]?.usd;

      if (!fromPrice || !toPrice) {
        throw new InternalServerErrorException('Failed to retrieve prices for swap');
      }

      const result = (amount * fromPrice) / toPrice;

      return {
        result,
        fromSymbol: from.toLowerCase(),
        toSymbol: to.toLowerCase(),
        fromPrice,
        toPrice,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Error fetching prices from CoinGecko:', err);
      throw new InternalServerErrorException('Failed to perform swap');
    }
  }
}
