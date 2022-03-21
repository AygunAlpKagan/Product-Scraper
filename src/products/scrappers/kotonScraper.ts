import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';
import { isBoolean } from 'class-validator';
import { CsvWriter } from "csv-writer/src/lib/csv-writer";
import { Images, ScraperProductEntities, Sizes } from '../models/scraper-product.model';



export class KotonScrapper {
  constructor(public csvWriter: CsvWriter<ScraperProductEntities>) {
  }
  private config: AxiosRequestConfig = {
    method: 'get',
    url: 'https://www.koton.com/tr/kadin/giyim/dis-giyim/kaban/c/M01-C02-N01-AK104-K100071'
  };
  async getProductScrape() {

    let totalRecords = 0
    try {
      const starterPromise = Promise.resolve(null)

      let pageList = await this.getKotonCategoryPageList(this.config)
      if (pageList.length) {
        const lastPage = pageList[pageList.length - 1]
        const pages = (new Array(Number(lastPage))).fill(undefined).map((_, i) => i + 1)
        await pages.reduce((p, page) => p.then(async () => {
          let records = await this.getKotonProductsOnThePage(page)
          if (records && records.length) {
            totalRecords += records.length
            await this.csvWriter.writeRecords(records)
          }
        }), starterPromise)
      } else {
        let records = await this.getKotonProductsOnThePage(1)
        if (records && records.length) {
          totalRecords += records.length
          await this.csvWriter.writeRecords(records)
          console.log(totalRecords)
          return records
        }
      }


    } catch (error) {
      console.log(error)
    }


  }

  private async getKotonCategoryPageList(config: any) {
    try {
      const req = await axios(config)
      const $ = cheerio.load(req.data)
      const pages: number[] = []
      const pageNavigator = $('.paging').find('ul').children('li')
      pageNavigator.each((i: any, el: any) => {
        const pageNumberMatch = $(el).find('a').text()
        if (pageNumberMatch) {
          pages.push(Number(pageNumberMatch))
        }
      })
      return pages
    }
    catch (error) {
      console.log(error)
    }
  }

  private async getKotonProductsOnThePage(page: number) {
    try {
      if (page > 1) {
        this.config.url = `${this.config}&page=${page}`
      }
      const req = await axios(this.config)
      const $ = cheerio.load(req.data)
      const products = $('.productGrid.col-xs-12').children('div')
      const records: ScraperProductEntities[] = []
      const productLinks: ScraperProductEntities[] = []
      products.each((i: any, el: any) => {
        let products = new ScraperProductEntities
        products.id = "https://www.koton.com".concat($(el).find('.wrapper').find('a').attr('href')).replace(/\ /g, '%20')
        productLinks.push(products)
      })
      await Promise.all(productLinks.map(async link => {
        let url = link.id
        let record = await this.getProductDetailsFromProductPage(url)
        if (record)
          records.push(record)
      }))
      return records

    } catch (error) {
      console.log(error)
    }


  }
  private async getProductDetailsFromProductPage(link: string): Promise<any> {
    try {
      const url = encodeURI(link)
      const req = await axios(url)
      const $ = cheerio.load(req.data)
      const products = $('#content').find('.fullpage').find('.product-content-wrap')
      const categoryName = $('#content').find('.fullpage').find('.col-xs-12.breadcrumb').find('ul').find('li').find('a')
      let record = new ScraperProductEntities()
      products.each((i: any, el: any) => {
        record.id = link
        record.title = $(el).find('.productDetailDescription').find('h1').text()
        record.description = $(el).find('.col-lg-12.padding-0').find('.product-details').find('.left-content').find('.alt-text').text().trim().replace(/\s\s+/g, ' ')
        record.color = $(el).find('.color').find('span').text().split(': ')[1]
        let images = $(el).find('.col-xs-7.detailShowcaseContainer.clearfix').find('.productDetailShowcase.main-cont.clearfix').find('.productDetailImageContainer.prod-pics-sect.clearfix').find('div').find('a')
        let imagesList: Images[] = [];
        images.each((_in: any, ele: any) => {
          let productImage = { uri: "" };
          productImage.uri = $(ele).find('.current').attr('alt-src')
          imagesList.push(productImage);
        });
        record.images = imagesList
        record.datePublished = []
        let date = { value: "" }
        let today = new Date().toLocaleDateString()
        date.value = today
        record.datePublished.push(date)
        const categories: any[] = []
        categoryName.each((i: any, el: any) => {
          var subCategory = $(el).text().trim()
          categories.push(subCategory)
        })
        record.productCategory = categories[categories.length - 1].toString().toLocaleUpperCase("tr-TR")
        record.prices = []
        let priceInfo = { price: "", currency: "" }
        let normalPrice = $(el).find('.price').find('.normalPrice').text().trim()
        if (normalPrice) {
          record.discount = false
          priceInfo.price = normalPrice.split('₺')[1].replace(",", ".")
          if (normalPrice.includes('₺')) {
            priceInfo.currency = "Türk Lirası"
          } else {
            priceInfo.currency = "Another Currency"
          }
          record.prices.push(priceInfo)

        } else {
          let newPrice = $(el).find('.price').find('.price-contain').find('.newPrice').text().trim()
          priceInfo.price = newPrice.split('₺')[1].replace(",", ".")
          record.discount = true
          if (newPrice.includes('₺')) {
            priceInfo.currency = "Türk Lirası"
          } else {
            priceInfo.currency = "Another Currency"
          }
          record.prices.push(priceInfo)

        }
        let size = $(el).find('.size.clearfix').find('.size-items').find('li')
        let sizeList: Sizes[] = [];
        size.each((_in: any, ele: any) => {
          var productSize = { sizeName: "", inStock: true };
          productSize.sizeName = $(ele).find('a').text()
          let inStock = Number($(size[i]).find('a').attr('stocklevel'))
          if(inStock>0)
            productSize.inStock = true
          sizeList.push(productSize);
        });
        record.sizes = sizeList
        if(size.length){
          record.inStock = true
        }else{
          record.inStock= false
        }

      })
      return record
    } catch (onerror) {
      throw onerror
    }
  }





}

