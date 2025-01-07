import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent {
  account: any = {};  // To store the fetched person's details
  account_number: string | null = '';  // To store the ID passed in the URL
  transactions: any[] = [];

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the person ID from the URL
    this.account_number = this.route.snapshot.paramMap.get('id');

    if (this.account_number) {
      // Fetch the person's details using the ID from the API
      this.http.get(`http://localhost:7000/api/accountdetails/${this.account_number}`).subscribe(
        (data) => {
          console.log('Fetched person details:', data);  // Log the fetched data
          this.account = data;  // Store the data in the person object
        },
        (error) => {
          console.error('Error fetching person details:', error);
        }
      );
    }
    this.fetchTransactions();
  }

  onSubmit(): void {
    if (this.account.person_code != null && this.account.account_number != null && this.account.outstanding_balance != null && this.account.code != null) {
      // Include 'this.person' as the body of the request
      this.http.put(`http://localhost:7000/api/accountdetailsupdate/${this.account.code}`, this.account).subscribe(
        (response) => {
          console.log('Account added successfully:', response);
          alert('Account added successfully!');
          this.router.navigate([`/personsdetails/${this.account.person_code}`]); // Navigate to the listing screen after submission
        },
        (error) => {
          console.error('Error adding account:', error);
          alert('There was an error while adding the account.');
        }
      );
    } else {
            // Include 'this.account' as the body of the request
            this.http.post(`http://localhost:7000/api/accountdetailsinsert`, this.account).subscribe(
              (response) => {
                console.log('Account added successfully:', response);
                alert('Account added successfully!');
              },
              (error) => {
                console.error('Error adding account:', error);
                alert('There was an error while adding the account.');
              }
            );
    }
  }

    // Fetch transactions from the backend
    fetchTransactions(): void {
      this.http.get<any[]>(`http://localhost:7000/api/transactions/${this.account_number}`).subscribe({
        next: (data) => {
          this.transactions = data;
        },
        error: (err) => {
          console.error('Error fetching transactions:', err);
        }
      });
    }

      // Method for viewing transaction details
  viewTransaction(transaction: any): void {
    console.log('Viewing account details for:', transaction);
    this.router.navigate(['/transactiondetail', transaction.account_code]);
  }

  // Method for deleting an transaction
  deleteTransaction(transaction: any): void {
    const confirmation = confirm('Are you sure you want to delete this account?');
    if (confirmation) {
      // Call the delete API to remove the transaction
      this.http.delete(`http://localhost:7000/api/transactiondetailsdelete/${this.account.code}`).subscribe({
        next: () => {
          // On success, reload the transaction list
          this.fetchTransactions();
          alert('Transaction deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting transaction:', err);
          alert('Failed to delete the account.');
        }
      });
    }
  }

  // Method for adding an transaction
  addTransaction(): void {
    this.router.navigate(['/transactiondetails']);
  }
}

