const DISCOUNT_RATE = 0.1;
const DISCOUNT_THRESHOLD = 100;

type Category = "food" | "clothing" | "electronics";

const taxRates : Record<Category, number> = {
    food: 0.03,
    clothing: 0.05,
    electronics: 0.08
};

type OrderItem = {
    name: string;
    unitPrice: number;
    quantity: number;
    category: Category;
}

const getSubTotal = (orderItems: readonly OrderItem[]) : number => {
    if (orderItems === null || undefined) return 0;

    return orderItems
            .map(i => i.quantity * i.unitPrice)
            .reduce((accumulator, current) => accumulator + current, 0);
};

const getDiscountRate = (orderSubTotal: number) : number => {
    return orderSubTotal > DISCOUNT_THRESHOLD ? DISCOUNT_RATE : 0
};

const getTaxRate = (category: Readonly<Category>) : number => {
    return taxRates[category];
};

const getOrderSalesTax = (orderItems: readonly OrderItem[]) : number => {
    if (orderItems === null || undefined) return 0;

    return orderItems
            .map(i => i.quantity * i.unitPrice * getTaxRate(i.category))
            .reduce((accumulator, current) => accumulator + current, 0);
};

const getOrderTotal = (orderItems: readonly OrderItem[]) : number => {
    const subTotal: number = getSubTotal(orderItems);
    
    const discountRate: number = getDiscountRate(subTotal);
    const discount: number = subTotal * discountRate;

    const salesTax: number = getOrderSalesTax(orderItems) * (1 - discountRate);

    return subTotal - discount + salesTax;
};

const hotDog : OrderItem = {
    name: "Hot Dog",
    unitPrice: 3.5,
    quantity: 1,
    category: "food"
};

const shirt : OrderItem = {
    name: "Shirt",
    unitPrice: 35,
    quantity: 2,
    category: "clothing"
};

const phone : OrderItem = {
    name: "iPhone",
    unitPrice: 900,
    quantity: 1,
    category: "electronics"
};

const orderItems: OrderItem[] = [hotDog, shirt, phone];

const emptyOrder: OrderItem[] = [];

const orderSubTotal: number = getSubTotal(orderItems);
const orderDiscountRate: number = getDiscountRate(orderSubTotal);
const orderSalesTax: number = getOrderSalesTax(orderItems, orderDiscountRate);
const orderTotal: number = getOrderTotal(orderItems);

let orderStr: string = `[Order] sub-total: ${orderSubTotal}, discount rate: ${orderDiscountRate}, `;
orderStr += `sales tax: ${orderSalesTax}, total: ${orderTotal}`

console.log(orderStr);

const emptyOrderSubTotal: number = getSubTotal(emptyOrder);
const emptyOrderDiscountRate: number = getDiscountRate(emptyOrderSubTotal);
const emptyOrderSalesTax: number = getOrderSalesTax(emptyOrder, emptyOrderDiscountRate);
const emptyOrderTotal: number = getOrderTotal(emptyOrder);

let emptyOrderStr = `[Empty] sub-total: ${emptyOrderSubTotal}, discount rate: ${emptyOrderDiscountRate}, `;
emptyOrderStr += `sales tax: ${emptyOrderSalesTax}, total: ${emptyOrderTotal}`;

console.log(emptyOrderStr);