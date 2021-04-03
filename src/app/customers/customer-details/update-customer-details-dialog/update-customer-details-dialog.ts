import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'update-customer-details-dialog',
    templateUrl: 'update-customer-details-dialog.html',
    styleUrls: ['./update-customer-details-dialog.scss']
  })
  export class UpdateCustomerDetailsDialog {
    form!: FormGroup;

    constructor(
      public dialogRef: MatDialogRef<UpdateCustomerDetailsDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.form = this.fb.group({
          name: new FormControl('', []),
          region: new FormControl('', []),
        });

        if(this.data.type == 'details') {
          this.form.controls['name'].setValidators([Validators.required]);
        }
        else if(this.data.type == 'region') {
          this.form.controls['region'].setValidators([Validators.required]);
        }
      }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }