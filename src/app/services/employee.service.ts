import { Injectable, signal } from '@angular/core';
import { openDB } from 'idb';

interface Employee {
  [x: string]: any;
  id: number;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private dbName = 'employeeDB';
  public employees = signal<Employee[]>([]);
  private selectedEmployee: Employee | null = null;

  constructor() {
    this.initDB();
  }

  public async initDB() {
    const db = await openDB(this.dbName, 1, {
      upgrade(db) {
        db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
      },
    });
    const allEmployees = await db.getAll('employees');
    this.employees.set(allEmployees as Employee[]);
  }

  public async addEmployee(employee: Employee) {
    const db = await openDB(this.dbName, 1);
    await db.add('employees', employee);
    this.initDB();
  }
  
  public getEmployees() {
    return this.employees;
  }
  
  
  public async updateEmployee(employee: Employee) {
    const db = await openDB(this.dbName, 1);
    await db.put('employees', employee);
    this.initDB();
  }

  public setSelectedEmployee(employee: Employee | null): void {
    this.selectedEmployee = employee;
  }

  public getSelectedEmployee(): Employee | null {
    return this.selectedEmployee;
  }

  public async deleteEmployee(id: number) {
    const db = await openDB(this.dbName, 1);
    await db.delete('employees', id);
    this.initDB();
  }
}
