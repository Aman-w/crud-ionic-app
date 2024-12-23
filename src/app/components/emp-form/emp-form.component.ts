import { Component } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/emp.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-emp-form',
  templateUrl: './emp-form.component.html',
  styleUrls: ['./emp-form.component.scss']
})
export class EmpFormComponent {
  public startDate: string = new Date().toISOString();
  public endDate: string = new Date().toISOString();
  public employee: Employee = {
    id: 0,
    name: '',
    role: '',
    startDate: '',
    endDate: ''
  };
  public isEditMode = false;
  public today: string = new Date().toISOString();
  public selectedDate!: string;
  public clickedButton!: number;

  constructor(private employeeService: EmployeeService, private router: Router) { }

  ngOnInit() {
    const selectedEmployee = this.employeeService.getSelectedEmployee();
    if (selectedEmployee) {
      this.employee = selectedEmployee;
      this.isEditMode = true;
    }
  }

  public onStartDateChange(event: any) {
    const selectedDate = event.detail.value;
    this.employee.startDate = selectedDate;
  }

  public onEndDateChange(event: any) {
    const selectedDate = event.detail.value;
    this.employee.endDate = selectedDate;
    const startDate = new Date(this.employee.startDate);
    const endDate = new Date(event.detail.value);
    if (endDate < startDate) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: 'End date cannot be earlier than start date.',
        confirmButtonText: 'OK',
      });
      this.employee.endDate = '';
    } else {
      this.employee.endDate = event.detail.value;
    }
  }

  public async saveEmployee() {
    if (this.employee.name && this.employee.name.length < 3) {
      Swal.fire({
        title: 'Error!',
        text: 'Employee name must be at least 3 characters long.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.employee.name && this.employee.role && this.employee.startDate && this.employee.endDate) {
      if (this.employee.id) {
        await this.employeeService.updateEmployee(this.employee);
        Swal.fire({
          title: 'Success!',
          text: 'Employee details updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        const newEmployee = {
          ...this.employee,
          id: Date.now(),
        };
        await this.employeeService.addEmployee(newEmployee);
        Swal.fire({
          title: 'Success!',
          text: 'Employee added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
      this.resetForm();
      this.router.navigate(['/']);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill out all fields before saving.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  public resetForm() {
    this.router.navigate(['/']);
    this.isEditMode = false;
    this.employeeService.setSelectedEmployee(null);
  }

  public async openModal(type: 'start' | 'end') {
    const modalId = type === 'start' ? 'start-modal' : 'end-modal';
    const modal = document.getElementById(modalId);
    if (modal) {
      await modal;
    }
  }

  public async closeModal() {
    const modals = document.querySelectorAll('ion-modal');
    modals.forEach((modal) => modal.dismiss());
  }

  public selectDate(option: string, type: 'start' | 'end', buttonIndex: number): void {
    this.clickedButton = buttonIndex;
    const selectedDate = this.calculateDate(option);
    if (type === 'start') {
      this.startDate = selectedDate;
    } else {
      this.endDate = selectedDate;
    }
  }

  private calculateDate(option: string): string {
    const today = new Date();
    switch (option) {
      case 'today':
        return today.toISOString();
      case 'nextMonday':
        return this.getNextDay(today, 1);
      case 'nextTuesday':
        return this.getNextDay(today, 2);
      case 'afterOneWeek':
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        return nextWeek.toISOString();
      default:
        return today.toISOString();
    }
  }

  private getNextDay(date: Date, dayOfWeek: number): string {
    const resultDate = new Date(date);
    const diff = (dayOfWeek + 7 - resultDate.getDay()) % 7 || 7;
    resultDate.setDate(resultDate.getDate() + diff);
    return resultDate.toISOString().split('T')[0];
  }

  public saveDate(type: 'start' | 'end') {
    this.closeModal();
  }
}
