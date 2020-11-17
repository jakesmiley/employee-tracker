es (28 sloc)  815 Bytes
  
INSERT INTO department (name)
VALUES
    ('Engineering'),
    ('HR'),
    ('Correspondence');


INSERT INTO role (title, department_id)
VALUES
    ('Engineer', 1),
    ('Company Defender', 2),
    ('Writer', 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Viggo', 'Mortenson', 1, 3),
    ('Lara', 'Croft', 2, 1),
    ('Dumbus', 'Dumbledore', 3, 2);