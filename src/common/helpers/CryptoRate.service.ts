
//Miracle Boniface
import { Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import fetch from 'node-fetch';
// OnModuleInit

@Injectable()
export class CryptoService {
  private async getCoinIdById(symbol: string): Promise<string | null> {
    try {
      // Use search API instead of full list - much smaller response
      const res = await fetch(`https://api.coingecko.com/api/v3/search?query=${symbol}`);
      const data = await res.json();

      const coin = data.coins?.find(
        (c) => c.id.toLowerCase() === symbol.toLowerCase() ||
          c.symbol.toLowerCase() === symbol.toLowerCase()
      );

      return coin ? coin.id : null;
    } catch (error) {
      console.error('Failed to search coin:', error);
      return null;
    }
  }

  async getPriceUSD(symbol: string): Promise<number> {
    const coinId = await this.getCoinIdById(symbol);
    if (!coinId) {
      throw new NotAcceptableException(`Coin symbol "${symbol}" is not supported.`);
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
  )
  // : Promise<{
  //   result: number;
  //   fromSymbol: string;
  //   toSymbol: string;
  //   fromPrice: number;
  //   toPrice: number;
  //   timestamp: string;
  // }> 
  {
    const fromId = await this.getCoinIdById(from);
    const toId = await this.getCoinIdById(to);

    if (!fromId) {
      throw new NotAcceptableException(`Coin symbol ${from} is not supported.`);
    }
    if (!toId) {
      throw new NotAcceptableException(`Coin symbol ${to} is not supported.`);
    }

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${fromId},${toId}&vs_currencies=usd`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const fromPrice = data?.[fromId]?.usd;
      const toPrice = data?.[toId]?.usd;
      return { fromPrice, toPrice, data}

      // if (!fromPrice || !toPrice) {
      //   throw new InternalServerErrorException('Failed to retrieve prices for swap');
      // }

      // const result = (amount * fromPrice) / toPrice;

      // return {
      //   result,
      //   fromSymbol: from.toLowerCase(),
      //   toSymbol: to.toLowerCase(),
      //   fromPrice,
      //   toPrice,
      //   timestamp: new Date().toISOString(),
      // };
    } catch (err) {
      console.error('Error fetching prices from CoinGecko:', err);
      throw new InternalServerErrorException('Failed to perform swap');
    }
  }
}
