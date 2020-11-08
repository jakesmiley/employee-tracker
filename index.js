const consoleTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require("mysql");
const promiseMySql = require('promise-mysql');

function mainMenu() {
    inquirer
    .prompt({
        name: 'action',
        type: 'list',
        message: 'Main Menu',
        choices: [
            'View all employees',
            'View all roles',
            'View all departments',
            'Add an employee',
            'Add a role',
            'Add a department',
            'Update an employee role',
            'Quit'
        ]
    })
    
    .then((answer) => {

        switch (answer.action) {
            case 'View all employees':
                return viewAllEmployees();
                break;
            case 'View all roles':
                return viewAllRoles();
                break;
            case 'View all departments':
                return viewAllDepartments();
                break;
            case 'Add an employee':
                return addAnEmployee();
                break;
            case 'Add a role':
                return addARole();
                break;
            case 'Add a department':
                return addADepartment();
                break;
            case 'Update an employee role':
                return updateAnEmployeeRole();
                break;
            case 'Quit':
                return quitMenu();
                break;
        }
    });
}

function viewAllEmployees() {


    mainMenu();
};



function quitMenu() {
	process.exit();
};
