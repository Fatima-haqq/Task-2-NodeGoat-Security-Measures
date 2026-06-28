const bcrypt = require("bcrypt-nodejs");

/* The UserDAO must be constructed with a connected database object */
function UserDAO(db) {
    "use strict";

    if (!(this instanceof UserDAO)) {
        console.log("Warning: UserDAO constructor called without 'new' operator");
        return new UserDAO(db);
    }

    const usersCol = db.collection("users");

    // =======================
    // ADD USER (SECURE VERSION)
    // =======================
    this.addUser = (userName, firstName, lastName, password, email, callback) => {

        // hash password before saving
        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        const user = {
            userName,
            firstName,
            lastName,
            benefitStartDate: this.getRandomFutureDate(),
            password: hashedPassword
        };

        if (email) {
            user.email = email;
        }

        this.getNextSequence("userId", (err, id) => {
            if (err) return callback(err, null);

            user._id = id;

            usersCol.insertOne(user, (err, result) => {
                if (err) return callback(err, null);
                callback(null, result.ops ? result.ops[0] : user);
            });
        });
    };

    // =======================
    // LOGIN VALIDATION FIXED
    // =======================
    this.validateLogin = (userName, password, callback) => {

        const validateUserDoc = (err, user) => {
            if (err) return callback(err, null);

            if (!user) {
                const noSuchUserError = new Error("User does not exist");
                noSuchUserError.noSuchUser = true;
                return callback(noSuchUserError, null);
            }

            // compare hashed password
            const isValid = bcrypt.compareSync(password, user.password);

            if (isValid) {
                return callback(null, user);
            } else {
                const invalidPasswordError = new Error("Invalid password");
                invalidPasswordError.invalidPassword = true;
                return callback(invalidPasswordError, null);
            }
        };

        usersCol.findOne({ userName }, validateUserDoc);
    };

    // =======================
    // RANDOM DATE GENERATOR
    // =======================
    this.getRandomFutureDate = () => {
        const today = new Date();
        const day = (Math.floor(Math.random() * 10) + today.getDate()) % 29;
        const month = (Math.floor(Math.random() * 10) + today.getMonth()) % 12;
        const year = Math.ceil(Math.random() * 30) + today.getFullYear();

        return `${year}-${("0" + (month + 1)).slice(-2)}-${("0" + day).slice(-2)}`;
    };

    // =======================
    // GET USER BY ID
    // =======================
    this.getUserById = (userId, callback) => {
        usersCol.findOne({ _id: parseInt(userId) }, callback);
    };

    // =======================
    // GET USER BY USERNAME
    // =======================
    this.getUserByUserName = (userName, callback) => {
        usersCol.findOne({ userName }, callback);
    };

    // =======================
    // COUNTER SEQUENCE FIXED
    // =======================
    this.getNextSequence = (name, callback) => {
        db.collection("counters").findOneAndUpdate(
            { _id: name },
            { $inc: { seq: 1 } },
            { returnDocument: "after", upsert: true },
            (err, result) => {
                if (err) return callback(err, null);
                callback(null, result.value.seq);
            }
        );
    };
}

module.exports = { UserDAO };