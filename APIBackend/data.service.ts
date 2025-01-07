import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service.spec';

@Component({
    selector: 'app-data',
    template: `
        <div *ngFor="let item of data">
            {{ item | json }}
        </div>
    `,
})
export class DataComponent implements OnInit {
    data: any[] = [];

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        const username = 'your-username';
        const password = 'your-password';

        // Call getData with the required arguments (username and password)
        this.dataService.getData(username, password).subscribe(
            (response) => {
                this.data = response;
            },
            (error) => {
                console.error('Error fetching data', error);
            }
        );
    }
}
