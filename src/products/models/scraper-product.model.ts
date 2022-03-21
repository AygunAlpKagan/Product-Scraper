
export class ScraperProductEntities implements IProducts {
    id: string
    title?: string
    description?: string
    images?: any
    datePublished?: DatePublished[]
    productCategory?: string
    color?: string
    prices?: Prices[]
    discount?: boolean
    sizes?: Sizes[]
    inStock?: boolean

}

export interface IProducts  {
    id: string
    title?: string
    description?: string
    images?: Images[]
    datePublished?:DatePublished[]
    productCategory?: string
    color?: string
    prices?: Prices[]
    discount?: boolean
    sizes?: Sizes[]
    inStock?: boolean
  }

  export interface IProductsModel extends IProducts { }
export class Images {
   uri: string
  }
  export class DatePublished {
    value: any
   }
   export class Prices {
    price: any
    currency: any

   }
   export class Sizes {
    sizeName: any
    inStock: any
   }