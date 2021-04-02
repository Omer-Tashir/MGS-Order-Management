import { Item } from "./item";

export class Order {
  Order_Id!: string;
  Customer_Id!: string;
  Status!: string;
  Date_Received!: Date;
  Order_Rate!: number;

  // helper
  items!: Item[];
  total!: number;
}
