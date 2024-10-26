# Project Bootstrap

npm install

Create necessary table
node ace migration:run

Dump dummy records
node ace db:seed

// TODO Tests cases

// auth
login with wrong email & password
login with wrong password correct email
login with correct credentials

// student
call list api as student
call list api as admin
call list api as admin with filter
call list api with empty result

get student as student
get sutnde tas admin
get student with invalid id
get student with id AND CUSTOM POPULATE

EDIT STUDENT AS STUDENT
EDIT STUDENT AS ADMIN
EDTIR STUDENT WITH INVALID FIELD
EDITR STUDENT WITH INVALID VALUE
EDIT STUDENT WITH SINGLE FIELD
EDIT STUDENT WITHOUT ANY FIELD
EDIT STUDENT WITH MULTIPLE FIELD
