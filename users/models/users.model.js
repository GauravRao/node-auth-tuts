const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rest');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    permissionLevel: Number
});


const User = mongoose.model('Users', userSchema);


exports.findByEmail = (email) => {
    return User.find({
        email: email
    });
};
exports.findById = (id) => {
    return User.findById(id, {
            email: 1,
            firstName: 1,
            lastName: 1,
            password: 1
        })
        .then((result) => {
            if (result) {
                result = result.toJSON();
                delete result.__v;
                return result;
            } else {
                return result;
            }
        });
};

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find({}, {
                email: 1,
                firstName: 1,
                lastName: 1
            })
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.patchUser = (id, userData) => {
    return new Promise((resolve, reject) => {
        User.findById(id, function (err, user) {
            if (err) reject(err);
            for (let i in userData) {
                user[i] = userData[i];
            }
            user.save(function (err, updatedUser) {
                if (err) return reject(err);
                resolve(updatedUser);
            });
        });
    })

};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.remove({
            _id: userId
        }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

exports.searchUser = (data) => {
    return User.find({
        firstName: data.firstName,
        _id: data._id
    }, {
        email: 1,
        firstName: 1,
        _id: 1,
        lastName: 1
    });
};
