import { Router, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ListingComponent } from './listing/listing.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PersonsDetailsComponent } from './persons-details/persons-details.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';

NgModule({
  declarations: [
    ListingComponent  // Declare your component here
    , PersonsDetailsComponent
  ],
  imports: [
    CommonModule,  // Import CommonModule here (for directives like ngFor)
  ],
  exports: [Router]
})

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent},
  { path: 'listing', component: ListingComponent},
  { path: 'personsdetails/:id', component: PersonsDetailsComponent},
  { path: 'accountdetail/:id', component: AccountDetailComponent},
  { path: 'transactiondetail/:id', component: TransactionDetailComponent},
  { path: 'personsdetails', component: PersonsDetailsComponent},
  { path: 'transactiondetails', component: TransactionDetailComponent},
  { path: 'accountdetails', component: AccountDetailComponent}
];
