import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import * as request from 'supertest';
import { json } from 'stream/consumers';
import { SearchService } from './search.service';

describe('SearchController', () => {
  let controller: SearchController;
  let service: SearchService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: {

            getSearchForProductId: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id: id,
                title: "ad",
                description: "data.get('description')",
                images: [],
                datePublished: [],
                productCategory: "Kadın",
                color: "Siyah",
                prices: [],
                discount: true,
                sizes: [],
                inStock: true
              }),
            ),



          },
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchForProductId', () => {
    it('should get a single cat', () => {
      expect(controller.searchForProductId('a strange id')).resolves.toEqual({
        title: "ad",
        description: "data.get('description')",
        images: [],
        datePublished: [],
        productCategory: "Kadın",
        color: "Siyah",
        prices: [],
        discount: true,
        sizes: [],
        inStock: true,
        id: 'a strange id',
      });
      expect(controller.searchForProductId('a different id')).resolves.toEqual({
        title: "ad",
        description: "data.get('description')",
        images: [],
        datePublished: [],
        productCategory: "Kadın",
        color: "Siyah",
        prices: [],
        discount: true,
        sizes: [],
        inStock: true,
        id: 'a different id',
      });
    });
  });
});
