import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  //apiUrl = "http://localhost:8080/api/v1/dashboard"
  apiUrl="https://studenthub-backend-azure.vercel.app/api/v1/dashboard"
  dashboardres: any;


  constructor(private http: HttpClient,private cdr: ChangeDetectorRef) {
    this.getAllDashboard()
  }

  totalStudents = 0;
  totalFees = 0;
  totalClasses = 0;

  recentStudents: any[] = [];

  getAllDashboard() {
    this.http.get(this.apiUrl + "/getAllDashbord").subscribe({
      next: (res: any) => {

        console.log('GET API response:', res);
        this.dashboardres = res.data
        this.recentStudents=res.data.recentStudents
        console.log(this.dashboardres)

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('GET API error:', err);
      }
    })
  }
}
