export interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  unit: string;
  stock?: number;
}

export interface QuoteItem {
  id?: string;
  quoteId?: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product?: Product;
}

export interface Quote {
  id: string;
  clientName?: string;
  createdAt: string;
  total: number;
  margin: number;
  items: QuoteItem[];
}
