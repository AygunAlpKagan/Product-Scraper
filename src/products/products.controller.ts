import { Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) {}

    @Get('scrapToCsv')
    getProductScrapeToCsv(){
      return this.productsService.getProductScrapeToCsv();
    }

    @Post('scrapToFirestore')
    getProductScrapeToFirestore(){
      return this.productsService.getProductScrapeToFirestore();
    }

    @Get('searchProduct')
    getSearchProduct(){
      return this.productsService.getSearchProduct();
    }

}
