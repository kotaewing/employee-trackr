const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
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

// initialize function to select options
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

    // uses a switch to route each answer to their respective function for handling
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
    // selects all rows from the department table
    const departments = await db.promise().query(`SELECT * FROM department`)

    // formats these as a table and puts them in the console
    console.table(departments[0]);
    actions();
}

async function selectRoles() {
    // selects columns from the role table and joins the department name with it
    const roles = await db.promise().query(`SELECT role.id, role.title, role.salary, department.name AS department
                  FROM role 
                  INNER JOIN department 
                  ON role.department_id = department.id
                  `)

    console.table(roles[0]);
    actions();
}

async function selectEmployees() {
    // selects columns from the employee, role, and department tables, joining each of them together to display as a complete table
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
    // uses inquirer to ask for new department name
    const deptQuestion = await inquirer.prompt(
        {
            type: 'input',
            name: 'department',
            message: "What is the new department's name?"
        }
    );

    // inserts new department into department table
    await db.promise().query(`INSERT INTO department (name)
                  VALUES (?)
        `, [deptQuestion.department]);

    actions();
}

async function addRole() {
    // selects all from the department table
    const departmentQuery = await db.promise().query(`SELECT * FROM department`)
    // maps through the returned query and creates on object for each with the properties name and value
    // this is used to display the correct name in the inquirer prompt 
    // but passes the id into the insert statement below
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

    // inserts the answers from inquirer into the rolw table
    // This is where we utilize that value: id property from above
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

    // here, we select all from the employee table where the manager_id is null because those employees are managers
    // this way, we can only show the list of managers and keep the options more specific for the user
    const managerQuery = await db.promise().query(`SELECT * FROM employee WHERE manager_id IS NULL`)

    const managers = managerQuery[0].map((manager) => {
        return {
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id
        }
    })


    // this adds another option to choose from in case the new employee is a manager and does not need a manager value
    managers.unshift({ name: 'N/A', value: 'NULL' })

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


