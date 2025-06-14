export interface Product {
  id?: string;        // ID do produto (opcional para criação)
  name?: string;
  description?: string;
  price?: number;       // BigDecimal do Java será convertido para number
  quantityP?: number;
  active?: boolean;
  imageUrl?: string;   // URL da imagem do produto
}
