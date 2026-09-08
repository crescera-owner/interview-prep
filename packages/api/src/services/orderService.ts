export interface OrderLineItem {
  price: number;
  quantity: number;
}

export const calculateOrderTotal = (items: OrderLineItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
