import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-persons-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './persons-details.component.html',
  styleUrls: ['./persons-details.component.css']
})
export class PersonsDetailsComponent {
  person: any = {};  // To store the fetched person's details
  id_number: string | null = '';  // To store the ID passed in the URL
  accounts: any[] = [];

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the person ID from the URL
    this.id_number = this.route.snapshot.paramMap.get('id');

    if (this.id_number) {
      // Fetch the person's details using the ID from the API
      this.http.get(`http://localhost:7000/api/personsdetails/${this.id_number}`).subscribe(
        (data) => {
          console.log('Fetched person details:', data);  // Log the fetched data
          this.person = data;  // Store the data in the person object
        },
        (error) => {
          console.error('Error fetching person details:', error);
        }
      );
    }
    this.fetchAccounts();
  }

  onSubmit(): void {
    if (this.person.id_number != null && this.person.surname != null && this.person.account_number != null && this.person.code != null) {
      // Include 'this.person' as the body of the request
      this.http.put(`http://localhost:7000/api/personsdetailsupdate/${this.person.id_number}`, this.person).subscribe(
        (response) => {
          console.log('Person added successfully:', response);
          alert('Person added successfully!');
          this.router.navigate(['/listing']); // Navigate to the listing screen after submission
        },
        (error) => {
          console.error('Error adding person:', error);
          alert('There was an error while adding the person.');
        }
      );
    } else {
      // Include 'this.person' as the body of the request
       this.http.post(`http://localhost:7000/api/personsdetailsinsert`, this.person).subscribe(
         (response) => {
          console.log('Person added successfully:', response);
          alert('Person added successfully!');
          this.router.navigate(['/listing']); // Navigate to the listing screen after submission
          },
          (error) => {
          console.error('Error adding person:', error);
          alert('There was an error while adding the person.');
        }
      );
    }
  }
  

    // Fetch accounts from the backend
    fetchAccounts(): void {
      this.http.get<any[]>(`http://localhost:7000/api/accounts/${this.id_number}`).subscribe({
        next: (data) => {
          this.accounts = data;
        },
        error: (err) => {
          console.error('Error fetching accounts:', err);
        }
      });
    }

      // Method for viewing account details
  viewAccount(account: any): void {
    console.log('Viewing account details for:', account);
    this.router.navigate(['/accountdetail', account.account_number]);
  }

        // Method for adding account details
  addAccount(): void {
  this.router.navigate(['/accountdetails']);
  }

  // Method for deleting an account
  deleteAccount(code: string): void {
    const confirmation = confirm('Are you sure you want to delete this account?');
    if (confirmation) {
      // Call the delete API to remove the account
      this.http.delete(`http://localhost:7000/api/accountdetailsdelete/${this.person.person_code}`).subscribe({
        next: () => {
          // On success, reload the accounts list
          this.fetchAccounts();
          alert('Account deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting account:', err);
          alert('Cannot delete as there are transactions still open for account.');
        }
      });
    }
  }
}
