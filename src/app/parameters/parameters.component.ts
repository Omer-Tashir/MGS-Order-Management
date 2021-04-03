import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { DatabaseService } from '../core/database.service';
import { AlgoParameters } from '../models/algo-parameters';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
  animations: [fadeInOnEnterAnimation()],
})
export class ParametersComponent implements OnInit {

  uid!: string;

  form = new FormGroup({
    CustomerQuality: new FormControl(0, [Validators.min(0), Validators.max(1)]),
    CustomerObligo: new FormControl(0, [Validators.min(0), Validators.max(1)]),
    CustomerSeniority: new FormControl(0, [Validators.min(0), Validators.max(1)]),
    OrderTotalPrice: new FormControl(0, [Validators.min(0), Validators.max(1)]),
    OrderItemsQuantity: new FormControl(0, [Validators.min(0), Validators.max(1)]),
    OrderTimeInSystem: new FormControl(0, [Validators.min(0), Validators.max(1)]),
  });

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {
    this.db.getAlgoParameters().subscribe(data=>{
      this.uid = data.uid;
      this.form.controls['CustomerQuality'].setValue(data.CustomerQuality);
      this.form.controls['CustomerObligo'].setValue(data.CustomerObligo);
      this.form.controls['CustomerSeniority'].setValue(data.CustomerSeniority);
      this.form.controls['OrderTotalPrice'].setValue(data.OrderTotalPrice);
      this.form.controls['OrderItemsQuantity'].setValue(data.OrderItemsQuantity);
      this.form.controls['OrderTimeInSystem'].setValue(data.OrderTimeInSystem);
    });
  }

  update() {
    let algoParameters = new AlgoParameters;
    algoParameters.CustomerQuality = this.form.controls['CustomerQuality'].value;
    algoParameters.CustomerObligo = this.form.controls['CustomerObligo'].value;
    algoParameters.CustomerSeniority = this.form.controls['CustomerSeniority'].value;
    algoParameters.OrderTotalPrice = this.form.controls['OrderTotalPrice'].value;
    algoParameters.OrderItemsQuantity = this.form.controls['OrderItemsQuantity'].value;
    algoParameters.OrderTimeInSystem = this.form.controls['OrderTimeInSystem'].value;

    if(algoParameters.CustomerQuality + algoParameters.CustomerObligo + algoParameters.CustomerSeniority +
      algoParameters.OrderTotalPrice + algoParameters.OrderItemsQuantity + algoParameters.OrderTimeInSystem !== 1) {
        alert('לא ניתן לעדכן את ערכי המשקלים, סה״כ הערכים חייב להיות שווה ל-1');
      }
      else {
        this.db.putAlgoParameters(this.uid, algoParameters);
        alert('ערכי הפרמטרים עודכנו בהצלחה');
      }
  }
}
