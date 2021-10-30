import {Request} from "./requests"
import {Ui} from "./ui";

const form = document.getElementById("employee-form")
const nameInput = document.getElementById("name")
const departmentInput = document.getElementById("department")
const salaryInput = document.getElementById("salary")
const employeesList = document.getElementById("employees")
const updateEmployeeButton = document.getElementById("update")


const request = new Request("http://localhost:3000/employees")
const ui = new Ui();

let updateState = null;
eventListeners();

function eventListeners() {
    document.addEventListener("DOMContentLoaded", getAllEmployees);
    form.addEventListener("submit", addEmployee);
    employeesList.addEventListener("click", updateOrDelete);
    updateEmployeeButton.addEventListener("click", updateEmployee);
}

function getAllEmployees() {
    request.get()
        .then(emp => {
            ui.addAllEmployeesToUI(emp)
        })
        .catch(err => console.log(err))
}

function addEmployee(e) {
    const empName = nameInput.value.trim()
    const empSalary = salaryInput.value.trim()
    const empDepartment = departmentInput.value.trim();

    if (empName === "" || empSalary === "" || empDepartment === "") {
        alert("this input field is required !!");
    } else {
        request.post({name: empName, department: empDepartment, salary: Number(empSalary)})
            .then(emp => {
                ui.addEmployeeToUI(emp);
            })
            .catch(err => alert(err))
    }
    ui.clearInputs();
    e.preventDefault();
}

function updateOrDelete(e) {
    if (e.target.id === "delete-employee") {
        deleteEmployee(e.target)

    } else if (e.target.id === "update-employee") {
        updateEmployeeController(e.target.parentElement.parentElement)
    }
}

function updateEmployeeController(targetEmployee) {
    ui.toggleUpdateButton(targetEmployee);
    if (updateState === null) {
        updateState = {
            updateId: targetEmployee.children[3].textContent,
            updateParent: targetEmployee
        }
    } else {
        updateState = null;
    }
}

function updateEmployee() {
    if (updateState) {
        const data = {
            name: nameInput.value.trim(),
            department: departmentInput.value.trim(),
            salary: Number(salaryInput.value.trim())
        }
        request.put(updateState.updateId, data)
            .then(updatedEmp => {
                ui.updatedEmployeeOnUI(updatedEmp, updateState.updateParent)

            })
            .catch(err => alert(err))
    }
}

function deleteEmployee(targetEmployee) {
    const id = targetEmployee.parentElement.previousElementSibling.previousElementSibling.textContent;
    request.delete(id).then(msg => {
        ui.deleteEmployeeFromUI(targetEmployee.parentElement.parentElement);
    }).catch(err => alert(err))
}


// request.post({name: "atiye", department: "kuafor", salary: 5678})
//     .then(emp => console.log(emp))
//     .catch(err => console.log(err))

// request.put(1, {name: "rum", salary: 3456, department: "CompEng"})
//     .then(emp => console.log(emp))
//     .catch(err => console.log(err))

// request.delete(3)
//     .then(msg => console.log(msg))
//     .catch(err => console.log(err))
