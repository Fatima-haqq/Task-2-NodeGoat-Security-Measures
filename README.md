# Task-2-NodeGoat-Security-Measures
Implementation of security measures in NodeGoat including Input Validation, Password Hashing, JWT Authentication, and Helmet.js.



# Week 2: Implementing Security Measures in NodeGoat

## Objective

The objective of this task was to improve the security of the vulnerable NodeGoat application by implementing various security mechanisms.

## Security Enhancements Implemented

### 1. Input Validation

* Installed and configured the `validator` library.
* Implemented server-side email validation using `validator.isEmail()`.

### 2. Password Hashing

* Implemented password hashing using `bcrypt-nodejs`.
* Passwords are securely stored in hashed format.

### 3. JWT Authentication

* Implemented token-based authentication using `jsonwebtoken`.
* JWT tokens are generated after successful login.

### 4. Helmet.js

* Added Helmet middleware to secure HTTP headers.
* Removed the `X-Powered-By` header.

## Tools Used

* Node.js
* Express.js
* MongoDB
* Validator
* bcrypt-nodejs
* JSON Web Token (JWT)
* Helmet.js

## Screenshots

Screenshots demonstrating implementation and testing are available in the `screenshots` folder.

## Author

Fatima Haq
