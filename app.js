const inquirer = require('inquirer');
const mysql = require('mysql');
const connection = mysql.createConnection({

    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Baseball14',
    database: 'companydb'
});
connection.connect(function(err) {

    if (err) console.log(err);
    console.log('Connected as id ' + connection.threadId + '\n');
    startApp();
})
const startApp = () => {

    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'Add Employee',
                'View Employees',
                'Add Role',
                'View Roles',
                'Add Department',
                'View Departments',
                'Update Employee Role',
                'EXIT'            
            ]
        })
        .then(answer => {
            switch (answer.action) {
              case 'Add Employee':
                addEmployee();
                break;
              case 'View Employees':
                viewEmployees();
                break;
              case 'Add Role':
                addRole();
                break;
              case 'View Roles':
                viewRoles();
                break;
              case 'Add Department':
                addDepartment();
                break;
              case 'View Departments':
                viewDepartments();
                break;
              case 'Update Employee Role':
                updateEmployeeRole();
                break;
              default:
                connection.end();
            }
          });
      };

const viewEmployees = () => {
    const query = connection.query(
        `SELECT employees.id, first_name, last_name, role_id, salary
        FROM employees 
        INNER JOIN roles
        ON employees.role_id = roles.id`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
        }
    )
}
const addEmployee = () => {
    let currentRoles = [];
    connection.query(
        'select title from roles',
        function (err, res) {
            if (err) throw err;
            res.forEach(title => currentRoles.push(title.title))
        }
    )
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter employee\'s first name (required):',
            name: 'firstName'
        },
        {
            type: 'input',
            message: 'Enter employee\'s last name (required):',
            name: 'lastName'
        },
        {
            type: 'input',
            message: 'What is the employees role ID ? (required)',
            name: 'roleID'
        },
        {
            type: 'input',
            message: 'Enter managers ID if applicable (required)',
            name: 'managerID',
        }
    ])
    .then( (responses) => {
        connection.query(
            "insert into employees set ?",
            {
              first_name: responses.firstName,
              last_name: responses.lastName,
              role_id: responses.roleID,
              manager_id: responses.managerID
            }
        ), 
        (err, res) => {
            if (err) console.log(err);
        }
        startApp();    
    })
}
const updateEmployeeRole = () => {

  connection.query('select first_name, last_name from employees', (err, res) => {
    if (err) throw err;
    const employeeListRoles = [];
    for (let i = 0; i < res.length; i++) {
      const firstNameEmployee = res[i].first_name;
      const lastNameEmployee = res[i].last_name;
      employeeListRoles.push(`${firstNameEmployee} ${lastNameEmployee}`);
    }
    connection.query('select * from roles', (err, res2) => {
      if (err) throw err;
      const rolesListUpdate = [];
      for (let i = 0; i < res2.length; i++) {
        rolesListUpdate.push(res2[i].title);
      }
      inquirer.prompt(
        [{
          name: 'employee',
          message: 'Which empoyee needs their role updated?',
          type: 'list',
          choices: employeeListRoles
        },
        {
          name: 'role',
          message: 'Which role should the employee have now?',
          type: 'list',
          choices: rolesListUpdate
        }])
        .then(answer => {
            const nameAdjust = answer.employee.split(' ');
            const adjustFirstName = nameAdjust[0];
            const adjustLastName = nameAdjust.join(nameAdjust.shift());
            connection.query('select id from roles where ?', { title: answer.role }, (err, res) => {
              if (err) throw err;
              connection.query('update employees set ?',
              {role_id: res[0].id, first_name: adjustFirstName, last_name: adjustLastName},
              (err) => {
                if (err) throw err;
                console.log('Employee role successfully updated!');
                startApp();
              });
        });
        });
    });
  });
}
const viewRoles = () => {

    connection.query(
        'select * from roles',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            startApp();
        }
    )
}
const addRole = () => {

    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the title of the new role:',
            name: 'title'
        },
        {
            type: 'input',
            message: 'Enter the salary value (50000) for this role:',
            name: 'salary'
        },
        {
            type: 'input',
            message: 'Enter the department ID for this role:',
            name: 'department_id'
        }
    ])
    .then ((responses) => {
        connection.query(
            'insert into roles set ?',
            {
                title: responses.title,
                salary: responses.salary,
                department_id: responses.department_id
            }
        ),
        (err, res) => {
            if (err) throw err;
        }
        console.log(`Added ${responses.newRole} role with salary of ${responses.salaryVal} in department ${responses.deptID}`)
        startApp();
    })
}
const addDepartment = () => {

    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the name of the new department:',
            name: 'title'
        }
    ])
    .then ((responses) => {
        connection.query(
            'insert into departments set ?',
            {
                name: responses.title
            }
        ),
        (err, res) => {
            if (err) throw err;
        }
        console.log(`\nAdded department: ${responses.title}\n`);
        startApp();    
    })
}
const viewDepartments = () => {

    connection.query(
        'select * from departments',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            startApp();
        }
    )
}