USE companydb;

INSERT INTO departments (name)
VALUES ("Accounting"), ("Service"), ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("Junior Full-Stack Dev", 50000, 1), 
("Repair Technician", 35000, 2), ("Regional Sales Representative", 100000, 3);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Bill", "Paxton", 1), ("Jill", "Hazel", 3), ("Bill", "Hill", 2);