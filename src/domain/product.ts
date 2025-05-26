export class Product {
  name?: string;
  description?: string;
  price?: number;       // BigDecimal do Java será convertido para number
  quantity?: number;
  active?: boolean;
}