const UserModel = require('../models/users.model');

exports.insert = (req, res) => {
    req.body.permissionLevel = 1;

    if (req.body.hasOwnProperty('firstName') && req.body.hasOwnProperty('lastName') && req.body.hasOwnProperty('email') && req.body.hasOwnProperty('password')) {
        UserModel.findByEmail(req.body.email).then((result) => {
            if (result.length <= 0) {
                UserModel.createUser(req.body)
                    .then((result) => {
                        res.status(201).send({
                            id: result._id
                        });
                    });
            } else {
                res.status(403).send({
                    success: false,
                    message: 'Email Already exists'
                });
            }
        })
    } else {
        res.status(403).send({
            success: false,
            message: 'Required fields are set to empty'
        });
    }
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    UserModel.list(limit, page)
        .then((result) => {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send('No data found');
            }
        })
};

exports.getById = (req, res) => {
    UserModel.findById(req.params.userId)
        .then((result) => {
            if (result) {
                res.status(200).send(result);
            } else {
                const err = {
                    success: false,
                    message: 'No Data Found'
                }
                res.status(404).send(err);
            }
        });
};

exports.patchById = (req, res) => {
    UserModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        });
};

exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then((result) => {
            res.status(204).send({});
        });
};

exports.login = (req, res) => {
    UserModel.findByEmail(req.body.email)
        .then((result) => {
            if (req.body.password == result[0].password) {
                const data = {
                    success: true,
                    message: 'Success'
                }
                res.status(200).send(data);
            } else {
                const err = {
                    success: false,
                    message: 'Invalid Credentials'
                }
                res.status(404).send(err);
            }
        });
};

exports.searchUser = (req, res) => {
    UserModel.searchUser(req.body)
        .then((result) => {
            if (result.length > 0) {
                const data = {
                    data: result,
                    success: true
                }
                res.status(200).send(data);
            } else {
                const err = {
                    success: false,
                    message: 'No User found'
                }
                res.status(404).send(err);
            }
        });
}

exports.changePassword = (req, res) => {
    UserModel.changePassword(req.body)
        .then((result) => {
            if (result) {
                const data = {
                    success: true,
                    message: 'Password changed succesfully'
                }
                res.status(201).send(data);
            } else if (result == '') {
                const data = {
                    success: false,
                    message: 'Incorrect Current Password'
                }
                res.status(401).send(data);
            }
        })
}