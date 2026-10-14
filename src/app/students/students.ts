
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-students',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students {

  totalstudents: number = 0;

  getStudent: any[] = [];

  //apiURL = 'http://localhost:8080/api/v1/student';
  apiURL="https://studenthub-backend-azure.vercel.app/api/v1/student"

  showAddForm = false;

  isEditMode = false;

  editStudentId: number | null = null;

  // Search and filter properties
  searchName: string = '';
  selectedMedium: string = 'All';

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 5;
  get pages(): number[] {
  return Array.from(
    { length: this.totalPages },
    (_, i) => i + 1
  );
}

  // Make Math available in the HTML template
  Math = Math;

  // Form data
  newStudent: any = {
    name: '',
    roll_no: '',
    class: '',
    medium: '',
    fees: ''
  };

  totalFees: number = 0;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.getAllStudent();
  }

  // FILTER STUDENTS BY NAME AND MEDIUM
  get filteredStudents(): any[] {
    return this.getStudent.filter((student: any) => {

      const nameMatch = (student.name ?? '')
        .toLowerCase()
        .includes(this.searchName.trim().toLowerCase());

      const mediumMatch =
        this.selectedMedium === 'All' ||
        (student.medium ?? '').toLowerCase() ===
        this.selectedMedium.toLowerCase();

      return nameMatch && mediumMatch;
    });
  }

  // CALCULATE TOTAL PAGES
  get totalPages(): number {
    return Math.ceil(
      this.filteredStudents.length / this.pageSize
    );
  }

  // GET STUDENTS FOR CURRENT PAGE
  get paginatedStudents(): any[] {
    const startIndex =
      (this.currentPage - 1) * this.pageSize;

    return this.filteredStudents.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  // CHANGE PAGE
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // RESET TO FIRST PAGE
  resetPage(): void {
    this.currentPage = 1;
  }

  // GET ALL STUDENTS
  getAllStudent() {
    this.http.get<any>(this.apiURL + '/getall').subscribe({
      next: (res: any) => {
        console.log('GET API response:', res);

        this.totalstudents =
          res.totalStudent ?? res.data?.length ?? 0;

        this.getStudent = [...(res.data ?? [])];

        // Calculate total fees
        this.totalFees = this.getStudent.reduce(
          (total: number, student: any) =>
            total + Number(student.fees || 0),
          0
        );

        // Keep current page within valid range
        if (this.currentPage > this.totalPages) {
          this.currentPage = Math.max(1, this.totalPages);
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('GET API error:', err);
      }
    });
  }

  // OPEN ADD FORM
  openAddForm() {
    this.isEditMode = false;
    this.editStudentId = null;

    this.newStudent = {
      name: '',
      roll_no: '',
      class: '',
      medium: '',
      fees: ''
    };

    this.showAddForm = true;
  }

  // ADD STUDENT
  addStudent() {

    // If editing, call update API
    if (this.isEditMode && this.editStudentId !== null) {
      this.updateStudent();
      return;
    }

    const data = {
      name: this.newStudent.name,
      roll_no: this.newStudent.roll_no,
      class: this.newStudent.class,
      medium: this.newStudent.medium,
      fees: this.newStudent.fees
    };

    this.http.post<any>(this.apiURL + '/create', data).subscribe({
      next: (res: any) => {
        console.log('Student created:', res);
        alert(res.message || 'Student added successfully');

        this.resetForm();
        this.currentPage = 1;
        this.getAllStudent();
      },
      error: (err) => {
        console.error('CREATE API error:', err);
      }
    });
  }

  // EDIT STUDENT
  editStudent(student: any) {
    this.isEditMode = true;
    this.editStudentId = Number(student.id);

    this.newStudent = {
      name: student.name ?? '',
      roll_no: student.roll_no ?? '',
      class: student.class ?? '',
      medium: (student.medium ?? '').toLowerCase(),
      fees: student.fees ?? ''
    };

    this.showAddForm = true;
  }

  // UPDATE STUDENT
  updateStudent() {
    if (this.editStudentId === null) {
      return;
    }

    const data = {
      name: this.newStudent.name,
      roll_no: this.newStudent.roll_no,
      class: this.newStudent.class,
      medium: this.newStudent.medium,
      fees: this.newStudent.fees
    };

    this.http.put<any>(
      `${this.apiURL}/update/${this.editStudentId}`,
      data
    ).subscribe({
      next: (res: any) => {
        console.log('Student updated:', res);
        alert(res.message || 'Student updated successfully');

        this.resetForm();
        this.getAllStudent();
      },
      error: (err) => {
        console.error('UPDATE API error:', err);
      }
    });
  }

  // DELETE STUDENT
  deleteStudent(id: number) {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    this.http.delete<any>(
      `${this.apiURL}/delete/${id}`
    ).subscribe({
      next: (res: any) => {
        console.log('Delete response:', res);
        alert(res.message || 'Student deleted successfully');

        this.getAllStudent();
      },
      error: (err) => {
        console.error('DELETE API error:', err);
      }
    });
  }

  // RESET FORM
  resetForm() {
    this.newStudent = {
      name: '',
      roll_no: '',
      class: '',
      medium: '',
      fees: ''
    };

    this.showAddForm = false;
    this.isEditMode = false;
    this.editStudentId = null;

    this.cdr.detectChanges();
  }

  // CLEAR SEARCH AND FILTER
  clearFilters() {
    this.searchName = '';
    this.selectedMedium = 'All';
    this.currentPage = 1;
  }

}
