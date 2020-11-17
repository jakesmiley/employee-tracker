const consoleTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require("mysql");
const promisemysql = require('mysql-promise');
const connectify = require('./db/connection');

connectify.connect((err) => {
    if (err) throw err;

    console.log("\n EMPLOYEE TRACKER \n");
    mainMenu();
});

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
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";

    connectify.query(query, function(err, res) {
        if(err) return err;
        console.log("\n");

        console.table(res);

        mainMenu();
    });
};

function viewAllRoles() {


}

function viewAllDepartments() {


}

function addAnEmployee(){ 
    let roleArr = [];
    let managerArr = [];

    promisemysql.createConnection(connectionProperties).then((conn) => {

        return Promise.all([
            conn.query('SELECT id, title FROM role ORDER BY title ASC'), 
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, managers]) => {

        for (i=0; i < roles.length; i++){
            roleArr.push(roles[i].title);
        }

        for (i=0; i < managers.length; i++){
            managerArr.push(managers[i].Employee);
        }

        return Promise.all([roles, managers]);
    }).then(([roles, managers]) => {

        managerArr.unshift('--');

        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "First name: ",
                validate: function(input){
                    if (input === ""){
                        console.log("Please enter their first name.");
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            {
                name: "lastName",
                type: "input",
                message: "Lastname name: ",
                validate: function(input){
                    if (input === ""){
                        console.log("Please enter their last name.");
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            {
                name: "role",
                type: "list",
                message: "What is their role?",
                choices: roleArr
            },
            {
                name: "manager",
                type: "list",
                message: "Who is their manager?",
                choices: managerArr
            }]).then((answer) => {

                let roleID;
                let managerID = null;

                for (i=0; i < roles.length; i++){
                    if (answer.role == roles[i].title){
                        roleID = roles[i].id;
                    }
                }

                for (i=0; i < managers.length; i++){
                    if (answer.manager == managers[i].Employee){
                        managerID = managers[i].id;
                    }
                }

                connectify.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`, (err, res) => {
                    if(err) return err;

                    console.log(`\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `);
                    mainMenu();
                });
            });
    });
};

function addARole(){
    let departmentArr = [];

    promisemysql.createConnection(connectionProperties)
    .then((conn) => {

        return conn.query('SELECT id, name FROM department ORDER BY name ASC');

    }).then((departments) => {
        for (i=0; i < departments.length; i++){
            departmentArr.push(departments[i].name);
        }

        return departments;
    }).then((departments) => {
        inquirer.prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "Role title: "
            },
            {   
                name: "dept",
                type: "list",
                message: "Department: ",
                choices: departmentArr
            }]).then((answer) => {

                let deptID;

                for (i=0; i < departments.length; i++){
                    if (answer.dept == departments[i].name){
                        deptID = departments[i].id;
                    }
                }

                connection.query(`INSERT INTO role (title, department_id)
                VALUES ("${answer.roleTitle}", ${deptID})`, (err, res) => {
                    if(err) return err;
                    console.log(`\n ROLE ${answer.roleTitle} ADDED...\n`);
                    mainMenu();
                });
            });
    });
};

function addADepartment(){

    inquirer.prompt({
            name: "deptName",
            type: "input",
            message: "Department Name: "
        }).then((answer) => {
                
            connectify.query(`INSERT INTO department (name)VALUES ("${answer.deptName}");`, (err, res) => {
                if(err) return err;
                console.log("\n DEPARTMENT ADDED...\n ");
                mainMenu();
            });

        });
};

function updateEmployeeRole(){
    let employeeArr = [];
    let roleArr = [];

    promisemysql.createConnection(connectionProperties).then((conn) => {
        return Promise.all([

            conn.query('SELECT id, title FROM role ORDER BY title ASC'), 
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, employees]) => {

        for (i=0; i < roles.length; i++){
            roleArr.push(roles[i].title);
        }

        for (i=0; i < employees.length; i++){
            employeeArr.push(employees[i].Employee);
        }

        return Promise.all([roles, employees]);
    }).then(([roles, employees]) => {

        inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Who would you like to edit?",
                choices: employeeArr
            }, {
                name: "role",
                type: "list",
                message: "What is their new role?",
                choices: roleArr
            },]).then((answer) => {

                let roleID;
                let employeeID;

                for (i=0; i < roles.length; i++){
                    if (answer.role == roles[i].title){
                        roleID = roles[i].id;
                    }
                }

                for (i=0; i < employees.length; i++){
                    if (answer.employee == employees[i].Employee){
                        employeeID = employees[i].id;
                    }
                }
                
                connectify.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`, (err, res) => {
                    if(err) return err;

                    console.log(`\n ${answer.employee} ROLE UPDATED TO ${answer.role}...\n `);

                    mainMenu();
                });
            });
    });  
};

function quitMenu() {
	process.exit();
};