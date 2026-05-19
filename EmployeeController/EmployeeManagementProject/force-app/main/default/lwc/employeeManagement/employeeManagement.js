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
        { label: 'Sales', value: 'Sales' }
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