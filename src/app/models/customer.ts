import { User } from "./user";

export class Customer extends User {
    Customer_Id!: string;
    Agent_Id!: string;
    Region!: string;
    Type!: string;
    Discount!: number;
}