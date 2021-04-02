import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';

@Component({
    selector: 'add-to-cart-dialog',
    templateUrl: 'add-to-cart-dialog.html',
    styleUrls: ['./add-to-cart-dialog.scss']
  })
  export class AddToCartDialog {
    form!: FormGroup;

    constructor(
      public dialogRef: MatDialogRef<AddToCartDialog>,
      @Inject(MAT_DIALOG_DATA) public data: Item, private fb: FormBuilder) {
        this.form = this.fb.group({
          size: new FormControl('', [Validators.required]),
          quantity: new FormControl('', [Validators.required])
        });
      }
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    setDefaultPic(item: Item) {
      item.Image = 'assets/default.jpeg';
    }  
  }