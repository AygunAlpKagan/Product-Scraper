import { Injectable } from '@nestjs/common';
import { IProductsModel, ScraperProductEntities } from './models/scraper-product.model';
import { KotonScrapper } from './scrappers/kotonScraper';
import * as admin from 'firebase-admin';
import { SearchService } from 'src/search/search.service';

@Injectable()
export class ProductsService {

  private readonly products: ScraperProductEntities[] = [];

  constructor( private searchService: SearchService) {
        
  }

  async getProductScrapeToCsv() {
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
      path: 'D:/file.csv',
      header: [
        { id: 'id', title: 'id' },
        { id: 'title', title: 'title' },
        { id: 'description', title: 'description' },
        { id: 'images', title: 'images' },
        { id: 'datePublished', title: 'datePublished' },
        { id: 'productCategory', title: 'productCategory' },
        { id: 'color', title: 'color' },
        { id: 'prices', title: 'prices' },
        { id: 'discount', title: 'discount' },
        { id: 'sizes', title: 'sizes' },
        { id: 'inStock', title: 'inStock' }
      ],
      fieldDelimiter: ';',
    });
    try {
      const scrapper = new KotonScrapper(csvWriter);
      const record = await scrapper.getProductScrape()
      return record

    } catch (error) {
      console.log(error)
    }
  }

  async getProductScrapeToFirestore() {

    const products = await this.getProductScrapeToCsv();
    const firestore = new admin.firestore.Firestore();
    const db = firestore;
    const productDb = db.collection('products');
    const starterPromise = Promise.resolve(null)
    await products.reduce((p, product) => p.then(async () => {
      const availableProduct = await this.searchService.getSearchForProductId(product.id.trim());
      if(!availableProduct.length){
        console.log("New product registration")
        await productDb.add({
          id: product.id,
          title: product.title,
          description: product.description,
          images: product.images,
          datePublished: product.datePublished,
          productCategory: product.productCategory,
          color: product.color,
          prices: product.prices,
          discount: product.discount,
          sizes: product.sizes,
          inStock: product.inStock
        });
      }
    }), starterPromise)

  }


  async getSearchProduct() {

    const firestore = new admin.firestore.Firestore();

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

    return this.products;

  }


}
