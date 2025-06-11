import {Product} from '../../domain/product';
import {User} from '../../domain/user';

export interface Cart {
  id?: number;
  userId: number;
  user?: User;
  productId: number;
  productName?: string;
  product?: Product;
  quantity: number;
  total?: number;     // Total (price * quantity)
}
