import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MaterialModule } from './materials.component';
import { FormComponent } from './components/form.component';
import { ListComponent } from './components/list.component';
import { RsvpService } from './rsvp.service';

const ROUTES: Routes = [
  { path: "", component: FormComponent },
  { path: "home", component: FormComponent },
  { path: "form", component: FormComponent },
  { path: "list", component: ListComponent },
  { path: "**", redirectTo: "/", pathMatch: "full"}
];

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule
  ],
  providers: [
    RsvpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
