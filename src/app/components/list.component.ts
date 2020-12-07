import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RsvpValues } from '../models';
import { RsvpService } from '../rsvp.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  rsvpList: RsvpValues[] = [];

  constructor(private router: Router, private rsvpService: RsvpService) { }

  ngOnInit(): void {
    this.retrieveRsvpList();
  }

  async retrieveRsvpList() {
    const retrievedValues = await this.rsvpService.getRsvps();
    // console.info('-> ListComponent Values: ', retrievedValues);
    
    for(let r of retrievedValues) {
      const newValue = {
        name: r.name,
        email: r.email,
        phone: r.phone,
        status: r.status
      }
      this.rsvpList.push(newValue);
    }
    // console.info('--> ListComponent rsvpList: ', this.rsvpList);
  }

  onClickNewRSVP() {
    this.router.navigate(['/form']);
  }

}
