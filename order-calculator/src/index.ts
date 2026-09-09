const DISCOUNT_RATE = 0.1;
const DISCOUNT_THRESHOLD = 100;

type CategoryItem = {
    name: string;
    taxRate: number;
};

class Food implements CategoryItem {
    readonly name: string = "food";
    readonly taxRate: number = 0.03;
}

class Clothing implements CategoryItem {
    readonly name: string = "clothing";
    readonly taxRate: number = 0.05;
};

class Electronics implements CategoryItem {
    readonly name: string = "electronics";
    readonly taxRate: number = 0.08;
}

type Category = Food | Clothing | Electronics

type OrderItem = {
    name: string;
    unitPrice: number;
    quantity: number;
    category: Category;
}

const hotDog : OrderItem = {
    name: "Hot Dog",
    unitPrice: 3.5,
    quantity: 1,
    category: new Food
};

const shirt : OrderItem = {
    name: "Shirt",
    unitPrice: 35,
    quantity: 2,
    category: new Clothing
};

const phone : OrderItem = {
    name: "iPhone",
    unitPrice: 900,
    quantity: 1,
    category: new Electronics
};

const orderItems: OrderItem[] = [hotDog, shirt, phone];

const emptyOrder: OrderItem[] = [];

const getOrderSubTotal = (orderItems: readonly OrderItem[]) : number => {
    return orderItems
            .map(i => i.quantity * i.unitPrice)
            .reduce((accumulator, current) => accumulator + current, 0);
};

const getOrderDiscount = (orderSubTotal: number) : number => {
    return orderSubTotal > DISCOUNT_THRESHOLD ? orderSubTotal * DISCOUNT_RATE : 0
};

const getOrderSalesTax = (orderItems: readonly OrderItem[]) : number => {
    const orderSubTotal = getOrderSubTotal(orderItems);
    const discountedRate = orderSubTotal > DISCOUNT_THRESHOLD ? 0.9 : 1;

    return orderItems
            .map(i => i.quantity * i.unitPrice * discountedRate * i.category.taxRate)
            .reduce((accumulator, current) => accumulator + current, 0);
}

const getOrderTotal = (orderItems: readonly OrderItem[]) : number => {
    const orderSubTotal = getOrderSubTotal(orderItems);
    const orderDiscount = getOrderDiscount(orderSubTotal);
    const orderSalesTax = getOrderSalesTax(orderItems);

    return orderSubTotal - orderDiscount + orderSalesTax;
}

const orderItemsSubTotal = getOrderSubTotal(orderItems);
const orderItemsDiscount = getOrderDiscount(orderItemsSubTotal);
const orderItemsTotal = getOrderTotal(orderItems);

const emptyOrderSubTotal = getOrderSubTotal(emptyOrder);
const emptyOrderDiscount = getOrderDiscount(emptyOrderSubTotal);
const emptyOrderTotal = getOrderTotal(emptyOrder);

console.log(`Order sub-total: ${orderItemsSubTotal}, order discount: ${orderItemsDiscount}, order total: ${orderItemsTotal}`);
console.log(`Empty order sub-total: ${emptyOrderSubTotal}, empty order discount: ${emptyOrderDiscount}, empty order total: ${emptyOrderTotal}`);