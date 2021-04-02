import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { BehaviorSubject } from "rxjs";

import { Item } from "../models/item";

@Injectable()
export class CartService {
  private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private localMemoryItemsString!: string;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(auth => {
      this.isLoggedIn.next(auth != null ?? false);
      if (this.isLoggedIn.getValue() == true && this.localMemoryItemsString) {
        this.storeInLocalStorage(this.localMemoryItemsString);
      }
      else if (this.isLoggedIn.getValue() == false) {
        this.cleanLocalStorage();
      }
    }, error => {
      console.log(error);
      this.isLoggedIn.next(false);
    });
  }

  getCart() {
    return this.loadCart();
  }

  getLength() {
    return this.getCart().length;
  }

  isInCart(item: Item): boolean {
    return this.getCart().findIndex(p => (p.Barcode == item.Barcode) && (p.Size == item.Size) && (p.Quantity == item.Quantity)) !== -1;
  }

  addItem(item: Item): Promise<string> {
    return new Promise((resolve, reject) => {
      let itemsInCart = this.getCart();
      if (!this.isInCart(item)) {
        itemsInCart.push(item);
        let store = JSON.stringify(itemsInCart);
        this.isLoggedIn.getValue() == true ? this.storeInLocalStorage(store) : this.storeInMemory(store);
        resolve("Item has been added successfully");
      }

      reject("Item could not be added");
    });
  }

  removeItem(item: Item): Promise<void> {
    return new Promise((resolve, reject) => {
      let store = JSON.stringify(this.getCart().filter(p => (p.Barcode !== item.Barcode) && (p.Size !== item.Size) && (p.Quantity !== item.Quantity)));
      this.isLoggedIn.getValue() == true ? this.storeInLocalStorage(store) : this.storeInMemory(store);
      resolve();
    });
  }

  removeCart() {
    this.cleanLocalStorage();
  }

  private loadCart(): Array<Item> {
    if (this.isLoggedIn.getValue() == true || localStorage.getItem('itemsInCart')) {
      let load = localStorage.getItem('itemsInCart'); 
      return load ? JSON.parse(load) : Array<Item>(); 
    }

    return this.localMemoryItemsString ? JSON.parse(this.localMemoryItemsString) : Array<Item>(); 
  }

  private cleanLocalStorage() {
    localStorage.removeItem('itemsInCart');
  }

  private storeInLocalStorage(store: string) {
    localStorage.setItem('itemsInCart', store);
  }

  private storeInMemory(store: string) {
    this.localMemoryItemsString = store;
  }
}