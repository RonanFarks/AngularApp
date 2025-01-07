import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  emailAddress: string = 'ronanf1201@gmail.com'; // Replace with your email address

  // Generates a mailto link dynamically
  getMailtoLink(): string {
    return `mailto:${this.emailAddress}`;
  }
}
