import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsService } from './products/products.service';
import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';
import { FirebaseModule } from './firebase/firebase.module';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';


@Module({
  imports: [ProductsModule, FirebaseModule],
  controllers: [AppController, ProductsController, SearchController ],
  providers: [AppService, ProductsService, SearchService],
})
export class AppModule {}
