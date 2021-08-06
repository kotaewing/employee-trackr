const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const { text } = require('express');
require('dotenv').config()

// Connect to database
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME
    },
    console.log('Connected to the Employee Trackr database.')
);

console.log('Welcome to Employee Trakr')

async function actions() {
    const { actionList } = await inquirer.prompt(
        {
            type: 'list',
            name: 'actionList',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add A Department',
                'Add A Role',
                'Add An Employee',
                'Update An Employee Role',
                'Exit Application'
            ]
        }
    );

    switch (actionList) {
        case 'View All Departments':
            selectDepartments();
            break;
        case 'View All Roles':
            selectRoles();
            break;
        case 'View All Employees':
            selectEmployees();
            break;
        case 'Add A Department':
            addDepartment();
            break;
        case 'Add A Role':
            addRole();
            break;
        case 'Add An Employee':
            addEmployee();
            break;
        case 'Update An Employee Role':
            updateEmployeeRole();
            break;
        case 'Exit Application':
            exit();
            break;
    }
}

async function selectDepartments() {
    const departments = await db.promise().query(`SELECT * FROM department`)
    console.table(departments[0]);
    actions();
}

async function selectRoles() {
    const roles = await db.promise().query(`SELECT role.id, role.title, role.salary, department.name AS department
                  FROM role 
                  INNER JOIN department 
                  ON role.department_id = department.id
                  `)

    console.table(roles[0]);
    actions();
}

async function selectEmployees() {
    const employees = await db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary, CONCAT(manager.first_name, '', manager.last_name) AS manager
                  FROM employee
                  LEFT JOIN employee manager 
                  ON manager.id = employee.manager_id
                  LEFT JOIN role
                  ON employee.role_id = role.id
                  LEFT JOIN department
                  ON department.id = role.department_id
                  `)
    console.table(employees[0]);
    actions();
}

async function addDepartment() {
    const deptQuestion = await inquirer.prompt(
        {
            type: 'input',
            name: 'department',
            message: "What is the new department's name?"
        }
    );

    const newDept = deptQuestion.department

    await db.promise().query(`INSERT INTO department (name)
                  VALUES (?)
        `, [newDept]);

    actions();
}

async function addRole() {
    const departmentQuery = await db.promise().query(`SELECT * FROM department`)
    const departments = departmentQuery[0].map((dep) => {
        return {
            name: dep.name,
            value: dep.id
        }
    })

    const roleQuestion = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: "What is the new role's title?"
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the new role's salary?"
        },
        {
            type: 'list',
            name: 'department',
            message: "What is the new role's department?",
            choices: departments
        }
    ])

    await db.promise().query(`INSERT INTO role (title, salary, department_id)
                  VALUES (?,?,?)
        `, [roleQuestion.title, roleQuestion.salary, roleQuestion.department]);

    actions();
}

async function addEmployee() {
    const roleQuery = await db.promise().query(`SELECT * FROM role`)
    const roles = roleQuery[0].map((role) => {
        return {
            name: role.title,
            value: role.id
        }
    })
    const managerQuery = await db.promise().query(`SELECT * FROM employee WHERE manager_id IS NULL`)

    const managers = managerQuery[0].map((manager) => {
        return {
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id
        }
    })


    managers.unshift({ name: 'N/A', value: 'NULL' })
    console.log(managers);

    const employeeQuestions = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the new employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the new employee's last name?"
        },
        {
            type: 'list',
            name: 'role',
            message: "What is the new employee's role?",
            choices: roles
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who is the new employee's manager?",
            choices: managers
        }
    ])

    await db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [employeeQuestions.firstName, employeeQuestions.lastName, employeeQuestions.role, employeeQuestions.manager])
    actions();
}

async function updateEmployeeRole() {
    const employeeQuery = await db.promise().query(`SELECT * FROM employee`)
    const employees = employeeQuery[0].map((emp) => {
        return {
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }
    })

    const roleQuery = await db.promise().query(`SELECT * FROM role`)
    const roles = roleQuery[0].map((role) => {
        return {
            name: role.title,
            value: role.id
        }
    })

    const updateQuestions = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: "Which employee's role would you like to update?",
            choices: employees
        },
        {
            type: 'list',
            name: 'role',
            message: "Which role would you like to assign?",
            choices: roles
        }
    ])

    await db.promise().query(`UPDATE employee SET role_id = ? WHERE id = ?`, [updateQuestions.role, updateQuestions.employee])
    actions();
}

function exit() {
    console.log('Goodbye')
    process.exit();
}

actions();


