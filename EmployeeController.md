Step 1: Create Custom Object

Go to:
Setup → Object Manager → Create → Custom Object

Fill:
Property	Value
Label	Employee
Plural Label	Employees
Object Name	Employee
Record Name	Employee Record

Save.

Object API:

Employee__c
========================================================
Step 2: Create Fields

Go to:
Employee → Fields & Relationships → New

Create these fields:

Label	Type	API Name
Employee Name	Text	Employee_Name__c
Employee ID	Number	Employee_ID__c
Salary	Number	Salary__c
Email	Email	Email__c
Department	Picklist	Department__c
Joining Date	Date	Joining_Date__c

Department Picklist Values
Add:
HR
IT
Sales
Finance
Marketing
Important

For Employee ID:
✅ Mark as:
Unique

This automatically enforces uniqueness in Salesforce.
================================================================================
Step 3: Create Apex Controller

Open:
Developer Console → File → New → Apex Class

Class Name:
EmployeeController

Paste:

public with sharing class EmployeeController {

    @AuraEnabled
    public static String saveEmployee(
        String empName,
        Integer empId,
        Decimal salary,
        String email,
        String department,
        Date joiningDate
    ) {

        // Name Validation
        if(String.isBlank(empName) || empName.length() < 3) {
            return 'Employee Name must contain at least 3 characters';
        }

        // Employee ID Validation
        if(empId == null || empId <= 0) {
            return 'Employee ID must be greater than 0';
        }

        // Salary Validation
        if(salary < 10000 || salary > 500000) {
            return 'Salary must be between 10,000 and 500,000';
        }

        // Email Validation
        String emailPattern =
            '^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$';

        if(
            email == null ||
            !Pattern.matches(emailPattern, email)
        ) {
            return 'Invalid Email Format';
        }

        // Department Validation
        if(String.isBlank(department)) {
            return 'Please select a Department';
        }

        // Joining Date Validation
        if(joiningDate > Date.today()) {
            return 'Joining Date cannot be a future date';
        }

        // Check Unique Employee ID
        List<Employee__c> existingEmployees = [
            SELECT Id
            FROM Employee__c
            WHERE Employee_ID__c = :empId
            LIMIT 1
        ];

        if(!existingEmployees.isEmpty()) {
            return 'Employee ID already exists';
        }

        // Save Employee
        Employee__c emp = new Employee__c();

        emp.Employee_Name__c = empName;
        emp.Employee_ID__c = empId;
        emp.Salary__c = salary;
        emp.Email__c = email;
        emp.Department__c = department;
        emp.Joining_Date__c = joiningDate;

        insert emp;

        return 'Employee Record Saved Successfully';
    }
}

Save.
============================================================================
Step 4: Create Lightning Web Component

Go to:
VS Code → force-app/main/default/lwc

Create component:

employeeManagement
employeeManagement.html
<template>

    <lightning-card title="Employee Management System">

        <div class="slds-p-around_medium">

            <lightning-input
                label="Employee Name"
                value={empName}
                onchange={handleName}>
            </lightning-input>

            <lightning-input
                type="number"
                label="Employee ID"
                value={empId}
                onchange={handleId}>
            </lightning-input>

            <lightning-input
                type="number"
                label="Salary"
                value={salary}
                onchange={handleSalary}>
            </lightning-input>

            <lightning-input
                type="email"
                label="Email"
                value={email}
                onchange={handleEmail}>
            </lightning-input>

            <lightning-combobox
                label="Department"
                value={department}
                options={departmentOptions}
                onchange={handleDepartment}>
            </lightning-combobox>

            <lightning-input
                type="date"
                label="Joining Date"
                value={joiningDate}
                onchange={handleJoiningDate}>
            </lightning-input>

            <br/>

            <lightning-button
                label="Save Employee"
                variant="brand"
                onclick={saveEmployee}>
            </lightning-button>

        </div>

    </lightning-card>

</template>
=================================================================================
employeeManagement.js

import { LightningElement, track } from 'lwc';

import saveEmployee from
'@salesforce/apex/EmployeeController.saveEmployee';

import { ShowToastEvent }
from 'lightning/platformShowToastEvent';

export default class EmployeeManagement extends LightningElement {

    @track empName;
    @track empId;
    @track salary;
    @track email;
    @track department;
    @track joiningDate;

    departmentOptions = [
        { label: 'HR', value: 'HR' },
        { label: 'IT', value: 'IT' },
        { label: 'Sales', value: 'Sales' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Marketing', value: 'Marketing' }
    ];

    handleName(event) {
        this.empName = event.target.value;
    }

    handleId(event) {
        this.empId = event.target.value;
    }

    handleSalary(event) {
        this.salary = event.target.value;
    }

    handleEmail(event) {
        this.email = event.target.value;
    }

    handleDepartment(event) {
        this.department = event.target.value;
    }

    handleJoiningDate(event) {
        this.joiningDate = event.target.value;
    }

    saveEmployee() {

        saveEmployee({
            empName: this.empName,
            empId: parseInt(this.empId),
            salary: parseFloat(this.salary),
            email: this.email,
            department: this.department,
            joiningDate: this.joiningDate
        })

        .then(result => {

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: result,
                    variant: 'success'
                })
            );
        })

        .catch(error => {

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }
}
=====================================================================================

employeeManagement.js-meta.xml

<?xml version="1.0" encoding="UTF-8"?>

<LightningComponentBundle
    xmlns="http://soap.sforce.com/2006/04/metadata">

    <apiVersion>60.0</apiVersion>

    <isExposed>true</isExposed>

    <targets>

        <target>lightning__AppPage</target>
        <target>lightning__HomePage</target>
        <target>lightning__RecordPage</target>

    </targets>

</LightningComponentBundle>
============================================================================
Step 5: Deploy Component

Use:

SFDX: Deploy This Source to Org
=================================================================================
Step 6: Add Component to Lightning Page

Go to:
Setup → Lightning App Builder

Open a page and drag:

employeeManagement

onto the page.

Save → Activate.