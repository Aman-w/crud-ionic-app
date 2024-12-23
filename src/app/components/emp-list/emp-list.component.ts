import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/emp.model';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-emp-list',
  templateUrl: './emp-list.component.html',
  styleUrls: ['./emp-list.component.scss']
})
export class EmpListComponent {
  public employees = this.employeeService.employees;
  private currentDate: Date = new Date(); 

  constructor(private employeeService: EmployeeService,private router: Router) {}

  ngOnInit(): void {
    this.employeeService.initDB();
  }

  public isEmpPrev(endDate: string): boolean {
    const employeeEndDate = new Date(endDate);
    return employeeEndDate < this.currentDate;
  }
  
  public editEmployee(employee: Employee) {
    this.employeeService.setSelectedEmployee(employee);
    this.router.navigate(['/form']);
  }

  public confirmDelete(id: number, name: string) {
    Swal.fire({
      title: `Delete ${name}?`,
      text: "Are you sure you want to delete ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteEmployee(id);
        Swal.fire(
          'Deleted!',
          `${name} has been deleted.`,
          'success'
        );
      }
    });
  }

  public deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id);
  }

  public navigateToForm() {
    this.router.navigate(['/form']);
  }
}
