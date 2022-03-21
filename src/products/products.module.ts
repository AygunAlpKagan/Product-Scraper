import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { SearchController } from 'src/search/search.controller';
import { SearchService } from 'src/search/search.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports:[ProductsModule,FirebaseModule],
    controllers:[ProductsController, SearchController],
    providers:[ProductsService, SearchService]
})
export class ProductsModule {}
