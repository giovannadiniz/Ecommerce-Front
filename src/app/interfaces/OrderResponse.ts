import {Product} from '../../domain/product';
import {User} from '../../domain/user';

export interface OrderResponse {
  orderId?: number;
  userId: User;
  productId: Product;
  quantity: number;
  total: string;
  qrCode: string;
  qrCodeImage?: string;
  status: string;
}
