import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ScraperProductEntities } from 'src/products/models/scraper-product.model';
describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
