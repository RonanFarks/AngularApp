import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Import HttpClient to make requests
import { ListingItem } from './listing.model';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
  standalone: true, 
  imports:[CommonModule],
})
export class ListingComponent implements OnInit {
  items: ListingItem[] = [];  // Define the items array, which will hold the data fetched from the API

  // Inject HttpClient to make the API request
  constructor(private http: HttpClient,  private router: Router) { }

  ngOnInit(): void {
    // Fetch data from the /api/listing endpoint
    this.http.get<ListingItem[]>('http://localhost:7000/api/listing').subscribe(
      (data) => {
        console.log('Fetched data:', data);  // Log the fetched data
        if (data && Array.isArray(data)) {
        this.items = data;  // Populate the items array with the data from the API
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  // The deleteItem method
  deleteItem(id_number: number): void {
    if (confirm('Are you sure you want to delete this person?')) {
      this.http.delete(`http://localhost:7000/api/personsdetailsdelete/${id_number}`).subscribe({
        next: () => {
          alert('Person deleted successfully!');
          // Optionally, trigger a UI update or notify the parent component
        },
        error: (err) => {
          console.error('Error deleting person:', err);
          alert('An error occurred while trying to delete the person.');
        }
      });
    }
  }

    // The viewItem method
    viewItem(item: any): void {
      console.log('Viewing item:', item);
      this.router.navigate(['/personsdetails', item.id_number]);  // Navigate with ID
    }

   // The viewItem method
   addPerson(): void {
      this.router.navigate(['/personsdetails']); // Navigate with ID
   }
}
