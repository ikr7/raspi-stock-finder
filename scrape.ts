import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

type RaspberryPiModel = {
    sku: string,
    description: string,
};

type ShopName = 'switch_science' | 'akizuki' | 'eleshop' | 'marutsu';

type ShopPage = {
    model: RaspberryPiModel,
    url: string,
    shopName: ShopName,
};

type PriceInfo = {
    model: RaspberryPiModel,
    shopPage: ShopPage,
    inStock: boolean,
    price: number,
}

const shopPages: ShopPage[] = [
    {
        model: {
            sku: 'RPI4-MODBP-1GB',
            description: 'RPi 4 Model B - 1GB RAM',
        },
        url: 'https://www.switch-science.com/products/5682',
        shopName: 'switch_science',
    },
    {
        model: {
            sku: 'RPI4-MODBP-2GB',
            description: 'RPi 4 Model B - 2GB RAM',
        },
        url: 'https://www.switch-science.com/products/5681',
        shopName: 'switch_science',
    },
    {
        model: {
            sku: 'RPI4-MODBP-4GB',
            description: 'RPi 4 Model B - 4GB RAM',
        },
        url: 'https://www.switch-science.com/products/5947',
        shopName: 'switch_science',
    },
    {
        model: {
            sku: 'RPI4-MODBP-8GB',
            description: 'RPi 4 Model B - 8GB RAM',
        },
        url: 'https://www.switch-science.com/products/6370',
        shopName: 'switch_science',
    },
    {
        model: {
            sku: 'RPI4-MODBP-4GB',
            description: 'RPi 4 Model B - 4GB RAM',
        },
        url: 'https://www.switch-science.com/products/5680',
        shopName: 'switch_science',
    },
    {
        model: {
            sku: 'SC0510',
            description: 'Raspberry Pi Zero 2 W',
        },
        url: 'https://www.switch-science.com/products/7600',
        shopName: 'switch_science',
    },
    {
        model: {
            sku: 'CM4001032',
            description: 'RPi CM4 - 1GB RAM, 32GB MMC, No Wifi',
        },
        url: 'https://www.switch-science.com/products/6693',
        shopName: 'switch_science',
    },
    {
        model: {
            sku: 'CM4002032',
            description: 'RPi CM4 - 2GB RAM, 32GB MMC, No Wifi',
        },
        url: 'https://www.switch-science.com/products/6701',
        shopName: 'switch_science',
    },
    {
        model: {
            sku: 'CM4102032',
            description: 'RPi CM4 - 2GB RAM, 32GB MMC, With Wifi',
        },
        url: 'https://www.switch-science.com/products/6705',
        shopName: 'switch_science',
    },
    {
        model: {
            sku: 'CM4104032',
            description: 'RPi CM4 - 4GB RAM, 32GB MMC, With Wifi',
        },
        url: 'https://www.switch-science.com/products/6713',
        shopName: 'switch_science',
    },
    {
        model: {
            sku: 'RPI4-MODBP-4GB',
            description: 'RPi 4 Model B - 4GB RAM',
        },
        url: 'https://akizukidenshi.com/catalog/g/gM-14778',
        shopName: 'akizuki',
    },
    {
        model: {
            sku: 'RPI4-MODBP-4GB',
            description: 'RPi 4 Model B - 4GB RAM',
        },
        url: 'https://eleshop.jp/shop/g/gK3U313',
        shopName: 'eleshop',
    },
    {
        model: {
            sku: 'RPI4-MODBP-8GB',
            description: 'RPi 4 Model B - 8GB RAM',
        },
        url: 'https://eleshop.jp/shop/g/gK77311',
        shopName: 'eleshop',
    },
    {
        model: {
            sku: 'RPI4-MODBP-4GB',
            description: 'RPi 4 Model B - 4GB RAM',
        },
        url: 'https://www.marutsu.co.jp/pc/i/1559116',
        shopName: 'marutsu',
    },
    {
        model: {
            sku: 'RPI4-MODBP-8GB',
            description: 'RPi 4 Model B - 8GB RAM',
        },
        url: 'https://www.marutsu.co.jp/pc/i/2193565',
        shopName: 'marutsu',
    },
];

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0 automated access from ikr7 (https://github.com/ikr7). contact: kunpei.ikuta*gmail.com';

const extractors = {
    switch_science: async (shopPage: ShopPage): Promise<PriceInfo | undefined> => {
        const html = await (await fetch(shopPage.url, {
            headers: {
                'User-Agent': userAgent,
            }
        })).text();
        const doc = (new DOMParser()).parseFromString(html, 'text/html')!;
        const priceStr = doc.querySelector('div.product-pricing > div.price > div.price__current > span.money')?.textContent.trim();
        if (!priceStr) {
            return;
        }
        const price = parseInt(priceStr.replace(/\u00a5|\,/g, '')); // 半角の円記号とカンマを削除
        const soldOutBadge = doc.querySelector('div.product-pricing > span.product__badge--soldout');
        const inStock = !soldOutBadge;
        const priceInfo: PriceInfo = {
            model: shopPage.model,
            shopPage: shopPage,
            inStock: inStock,
            price: price,
        };
        return priceInfo;
    },
    akizuki: async (shopPage: ShopPage): Promise<PriceInfo | undefined> => {
        const sjisHtmlBuf = await (await fetch(shopPage.url, {
            headers: {
                'User-Agent': userAgent,
            }
        })).arrayBuffer();
        const decoder = new TextDecoder('sjis');
        const html = decoder.decode(sjisHtmlBuf);
        const doc = (new DOMParser()).parseFromString(html, 'text/html')!;
        const priceStr = doc.querySelector('div.order_g > table > tbody > tr > td:nth-child(1) > span:nth-child(2)')?.textContent.trim();
        if (!priceStr) {
            return;
        }
        const price = parseInt(priceStr.replace(/\uffe5|\,/g, '')); // 全角の円記号とカンマを削除
        const soldOutBadge = doc.querySelector('div.order_g > table > tbody > tr > td:nth-child(3) > img[alt=\'売り切れ中\']');
        const inStock = !soldOutBadge;
        const priceInfo: PriceInfo = {
            model: shopPage.model,
            shopPage: shopPage,
            inStock: inStock,
            price: price,
        };
        return priceInfo;
    },
    eleshop: async (shopPage: ShopPage): Promise<PriceInfo | undefined> => {
        const sjisHtmlBuf = await (await fetch(shopPage.url, {
            headers: {
                'User-Agent': userAgent,
            }
        })).arrayBuffer();
        const decoder = new TextDecoder('sjis');
        const html = decoder.decode(sjisHtmlBuf);
        const doc = (new DOMParser()).parseFromString(html, 'text/html')!;
        const priceStr = doc.querySelector('table.goodsspec_ span.price_')?.childNodes[0].textContent.trim();
        if (!priceStr) {
            return;
        }
        const price = parseInt(priceStr.replace(/\uffe5|\,/g, '')); // 全角の円記号とカンマを削除
        const inStock = !doc.querySelector('td#spec_stock_msg')?.textContent.trim().includes('なし');
        const priceInfo: PriceInfo = {
            model: shopPage.model,
            shopPage: shopPage,
            inStock: inStock,
            price: price,
        };
        return priceInfo;
    },
    marutsu: async (shopPage: ShopPage): Promise<PriceInfo | undefined> => {
        const html = await (await fetch(shopPage.url, {
            headers: {
                'User-Agent': userAgent,
            }
        })).text();
        const doc = (new DOMParser()).parseFromString(html, 'text/html')!;
        const priceStr = doc.querySelector('span.stepPriceIncludeTax > span')?.textContent.trim();
        let price: number;
        if (priceStr) {
            price = parseInt(priceStr);
        } else {
            price = 0
        }
        const inStock = doc.querySelector('div.item_stock_number')?.textContent.trim().length !== 0;
        const priceInfo: PriceInfo = {
            model: shopPage.model,
            shopPage: shopPage,
            inStock: inStock,
            price: price,
        };
        return priceInfo;
    },
};

const priceInfos: PriceInfo[] = [];

for (const shopPage of shopPages) {
    const extract = extractors[shopPage.shopName];
    const priceInfo = await extract(shopPage);
    if (priceInfo) {
        priceInfos.push(priceInfo);
    }
    await (() => new Promise(r => setTimeout(r, 1000)))();
}

const now = new Date();

console.log(JSON.stringify({
    extractedAtStr: now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
    extractedAt: now.getTime(),
    prices: priceInfos,
}, null, 2));
