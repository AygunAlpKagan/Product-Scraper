import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ScraperProductEntities } from 'src/products/models/scraper-product.model';
import config from '../config/keys';
import { initializeApp } from 'firebase/app';


@Injectable()
export class SearchService {
  private readonly products: ScraperProductEntities[] = [];

  constructor(private firebaseService: FirebaseService) {

  }

  async getAllData() {
    const firestore = new admin.firestore.Firestore();
    const allProducts = [];
    (await firestore.collection('/products').get()).docs.map(data => {
      this.products.push({
        id: data.get('id'),
        title: data.get('title'),
        description: data.get('description'),
        images: data.get('images'),
        datePublished: data.get('datePublished'),
        productCategory: data.get('productCategory'),
        color: data.get('color'),
        prices: data.get('prices'),
        discount: data.get('discount'),
        sizes: data.get('sizes'),
        inStock: data.get('inStock')
      });
    });
    allProducts.push(this.products)
    return allProducts
  }


  async getColorProductSearch(value: string) {
    console.log("Searching for color: " + value)
    let products: ScraperProductEntities[] = [];
    const starterPromise = Promise.resolve(null)
    const allProducts = await this.getAllData();
    await allProducts.reduce((p, product) => p.then(async () => {
      products = product.filter(e => e.color == value);
    }), starterPromise)
    return products
  }


  public async getSearchForProductId(value: string) {
    console.log("Searching for products: " + value.trim())
    let products: ScraperProductEntities[] = [];
    const starterPromise = Promise.resolve(null)
    const allProducts = await this.getAllData();
    await allProducts.reduce((p, product) => p.then(async () => {
      products = product.filter(e => e.id == value.trim());
    }), starterPromise)
    return products
  }

  async getProductSearchQueryByColor(value: string) {
    let products = [];
    const firestore = new admin.firestore.Firestore();
    const db = firestore;
    const productDb = db.collection('products');
    const queryRef = await productDb.where('color', '==', value).get();
    queryRef.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      products.push(doc.data())
    });
    return products
  }

  async getLowPricedProductsQuery(price: number) {
    console.log("Searching for products with prices less than " + price)
    let lowProducts: ScraperProductEntities[] = [];
    const allProducts = await this.getAllData();
    allProducts.forEach(function (products) {
      products.forEach(function (product) {
        product.prices.forEach(function (el) {
          if (el.price < price) {
            lowProducts.push(product)
          }
        });
      });
    });
    console.log(lowProducts)
    return lowProducts
  }

  async getHighPricedProductsQuery(price: number) {
    console.log("Searching for products with prices higher than " + price)
    let highProducts: ScraperProductEntities[] = [];
    const allProducts = await this.getAllData();
    allProducts.forEach(function (products) {
      products.forEach(function (product) {
        product.prices.forEach(function (el) {
          if (el.price > price) {
            highProducts.push(product)
          }
        });
      });
    });
    console.log(highProducts)
    return highProducts
  }


  async getProductSearchQueryByInstock() {
    let products = [];
    const firestore = new admin.firestore.Firestore();
    const db = firestore;
    const productDb = db.collection('products');
    const queryRef = await productDb.where('inStock', '==', true).get();
    queryRef.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      products.push(doc.data())
    });
    return products
  }

  async getProductSearchQueryByOutstock() {
    let products = [];
    const firestore = new admin.firestore.Firestore();
    const db = firestore;
    const productDb = db.collection('products');
    const queryRef = await productDb.where('inStock', '==', false).get();
    queryRef.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      products.push(doc.data())
    });
    return products
  }

  async getSearchForWord(word: string) {
    console.log("Searching for word: " + word)
    let products: ScraperProductEntities[] = [];
    const starterPromise = Promise.resolve(null)
    const allProducts = await this.getAllData();
    await allProducts.reduce((p, product) => p.then(async () => {
      products = product.filter(e => e.description.includes(word));
    }), starterPromise)
    return products
  }

  async getPriceRangeOfProduct(low: number, high: number) {
    console.log("Searching for products between "+low+ "-"+ high)
    let searchProducts: ScraperProductEntities[] = []; 
    const allProducts = await this.getAllData();
    allProducts.forEach(function (products) {
      products.forEach(function (product) {
        product.prices.forEach(function (el) {
          if (el.price < high && el.price > low) {
            searchProducts.push(product)
          }
        });
      });
    });
    console.log(searchProducts)
    return searchProducts
  }
  
  async getSearchByProductSize(size: number) {
    console.log("Searching for size "+ size+ " product")
    let sizeProducts: ScraperProductEntities[] = [];
    const allProducts = await this.getAllData();
    allProducts.forEach(function (products) {
      products.forEach(function (product) {
        product.sizes.forEach(function (el) {
          if (el.sizeName == size) {
            sizeProducts.push(product)
          }
        });
      });
    });
    return sizeProducts
  }
  
  async getProductFilter(size:number,low: number, high: number) {
    console.log("Searching for products between "+low+ "-"+ high +" and "+size+" size")
    let searchProducts: ScraperProductEntities[] = []; 
    const a =[]
    const allProducts = await this.getSearchByProductSize(size);
    a.push(allProducts)
    a.forEach(function (products) {
      products.forEach(function (product) {
        product.prices.forEach(function (el) {
          if (el.price < high && el.price > low) {
            searchProducts.push(product)
          }
        });
      });
    });
    console.log(searchProducts)
    return searchProducts
  }

}


