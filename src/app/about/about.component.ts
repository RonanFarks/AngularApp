import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  imports: [CommonModule],
})
export class AboutComponent {
  // Example data for the about screen
  title = 'About Us';
  description = `
    My name is Ronan Farquharson. I am learning Angular a I am coding at this moment.
    I have been coding for 2 years now and very much enjoying it.
    My hobbies include anything fitness related but mainly lifting weights is what I enjoy most.
    I work very well in a team environment and never hesitate to help others out when the help is needed.
    I have mainly coded in C# and very efficient in SQL and Flutter/Dart.
    I have never coded in Angular so as I am typing I am learning too. I learn new languages very fast and 
    adapt to situations very fast as the IT industry is always changing therefore I need to learn the new skills needed fast.
  `;
  team = [
    { name: 'Ronan Farquharson', role: 'CEO', image: 'assets/ai_me.jpg' }
  ];
  ngOnInit() {
    console.log(this.team); // This will log the team array to check for the image path
  }
  
}
