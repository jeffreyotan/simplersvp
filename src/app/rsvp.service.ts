import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RsvpValues } from './models';

@Injectable()
export class RsvpService {

    rsvpGetSvrUrl: string = 'http://localhost:3000/api/rsvps';
    rsvpPostSvrUrl: string = "http://localhost:3000/api/rsvp";

    constructor(private http: HttpClient) {}

    async submitRsvp(answers: RsvpValues) {
        return await this.http.post<any>(this.rsvpPostSvrUrl, answers).toPromise();
    }

    async getRsvps(): Promise<any> {
        return await this.http.get(this.rsvpGetSvrUrl).toPromise();
    }
}