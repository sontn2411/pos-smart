export interface Subvariation {
  _id: string
  name: string
  price?: number
  isDefault?: boolean
}

export interface Variation {
  _id: string
  name: string
  required?: boolean
  subvariations: Subvariation[]
}

export interface Addon {
  _id: string
  name: string
  price: number
}

export interface Product {
  _id: string
  category: string
  name: string
  desc?: string
  price: number
  stock: number
  mainImage: {
    url: string
  }
  variations?: Variation[]
  addons?: Addon[]
}
