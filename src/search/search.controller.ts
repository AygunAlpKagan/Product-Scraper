import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor( private searchService: SearchService) {
    }
    @Get('color/:value')
    async colorProductSearch(@Param('value') value: string) {
     return this.searchService.getColorProductSearch(value)
        .catch((error) => console.log(error));
    }

    @Get('id')
    async searchForProductId(@Body() value: any) {
     return this.searchService.getSearchForProductId(value.filePath)
        .catch((error) => console.log(error));
    }

    @Get('query-color/:value')
    async productSearchQueryByColor(@Param('value') value: string) {
     return this.searchService.getProductSearchQueryByColor(value)
        .catch((error) => console.log(error));
    }

    @Get('cheap-products/:price')
    async lowPricedProductsQuery(@Param('price') price: number) {
     return this.searchService.getLowPricedProductsQuery(price)
        .catch((error) => console.log(error));
    }

    @Get('expensive-products/:price')
    async highPricedProductsQuery(@Param('price') price: number) {
     return this.searchService.getHighPricedProductsQuery(price)
        .catch((error) => console.log(error));
    }

    @Get('query-instock')
    async productSearchQueryByInstock() {
     return this.searchService.getProductSearchQueryByInstock()
        .catch((error) => console.log(error));
    }

    @Get('query-outstock')
    async productSearchQueryByOutstock() {
     return this.searchService.getProductSearchQueryByOutstock()
        .catch((error) => console.log(error));
    }

    @Get('query-includes/:word')
    async searchForWord(@Param('word') word: string) {
     return this.searchService.getSearchForWord(word)
        .catch((error) => console.log(error));
    }

    @Get('price-range/:low/:high')
    async priceRangeOfProduct(@Param('low') low: number,@Param('high') high: number) {
     return this.searchService.getPriceRangeOfProduct(low, high)
        .catch((error) => console.log(error));
    }

    @Get('size-products/:size')
    async searchByProductSize(@Param('size') size: number) {
     return this.searchService.getSearchByProductSize(size)
        .catch((error) => console.log(error));
    }

    @Get('filter-product/:size/:low/:high')
    async productFilter(@Param('size') size: number,@Param('low') low: number,@Param('high') high: number) {
     return this.searchService.getProductFilter(size, low, high)
        .catch((error) => console.log(error));
    }
}



