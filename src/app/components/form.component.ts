import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RsvpValues } from '../models';
import { RsvpService } from '../rsvp.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  form: FormGroup;

  statusResponse: string[] = ["Count me in!", "Next time"];

  constructor(private fb: FormBuilder, private rsvpService: RsvpService, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: this.fb.control('', [ Validators.required ]),
      email: this.fb.control('', [ Validators.required ]),
      phone: this.fb.control('', [ Validators.required ]),
      status: this.fb.control('', [ Validators.required ])
    });
  }

  async onClickSubmit() {
    // console.info('=> form values: ', this.form.value);

    // retrieve the values from the form
    const rsvpValues: RsvpValues = this.form.value as RsvpValues;
    console.info('=> updated form values: ', rsvpValues);

    // send the form values to the server via the post method
    const svrRes = await this.rsvpService.submitRsvp(rsvpValues);
    console.info('-> SvrResponse: ', svrRes);

    // after submitting the form, go to the list component
    this.router.navigate(['/list']);
  }

  onClickList(): void {
    this.router.navigate(['/list']);
  }

}
