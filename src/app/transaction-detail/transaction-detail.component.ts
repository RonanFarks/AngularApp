import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css']
})
export class TransactionDetailComponent {
  transaction: any = {};  // To store the fetched person's details
  code: string | null = '';  // To store the ID passed in the URL
  transactions: any[] = [];

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the person ID from the URL
    this.code = this.route.snapshot.paramMap.get('id');

    if (this.code) {
      // Fetch the person's details using the ID from the API
      this.http.get(`http://localhost:7000/api/transactiondetails/${this.code}`).subscribe(
        (data) => {
          console.log('Fetched Transaction details:', data);  // Log the fetched data
          this.transaction = data;  // Store the data in the person object
        },
        (error) => {
          console.error('Error fetching person details:', error);
        }
      );
    }
    this.fetchTransactions();
  }

  onSubmit(): void {
    if (this.transaction.account_code != null && this.transaction.transaction_date != null && this.transaction.capture_date != null && this.transaction.amount != null && this.transaction.description != null && this.transaction.code != null) {
      // Include 'this.transaction' as the body of the request
      this.http.put(`http://localhost:7000/api/transactiondetailsupdate/${this.transaction.code}`, this.transaction).subscribe(
        (response) => {
          console.log('Transaction added successfully:', response);
          alert('Transaction added successfully!');
          this.router.navigate([`/accountdetails/${this.transaction.account_code}`]); // Navigate to the listing screen after submission
        },
        (error) => {
          console.error('Error adding account:', error);
          alert('There was an error while adding the account.');
        }
      );
    } else {
            // Include 'this.transaction' as the body of the request
            this.http.put(`http://localhost:7000/api/transactiondetailsinsert`, this.transaction).subscribe(
              (response) => {
                console.log('Transaction added successfully:', response);
                alert('Transaction added successfully!');
                this.router.navigate([`/accountdetails`]);
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
      this.http.get<any[]>('http://localhost:7000/api/transactions').subscribe({
        next: (data) => {
          this.transactions = data;
        },
        error: (err) => {
          console.error('Error fetching transactions:', err);
        }
      });
    }

      // Method for viewing account details
  viewTransaction(transaction: any): void {
    console.log('Viewing account details for:', transaction);
    this.router.navigate(['/transactiondetail', transaction.account_code]);
  }

  // Method for deleting an account
  deletetransaction(code: string): void {
    const confirmation = confirm('Are you sure you want to delete this transaction?');
    if (confirmation) {
      // Call the delete API to remove the transaction
      this.http.delete(`http://localhost:7000/api/transactiondetailsdelete/${code}`).subscribe({
        next: () => {
          // On success, reload the transaction list
          this.fetchTransactions();
          alert('Transaction deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting transaction:', err);
          alert('Failed to delete the transaction.');
        }
      });
    }
  }
}

