const db = require('../configs/db').pool;
const { emailPendingAdmin } = require('../services/emailService');

const addPendingAdmin = async(req, res) => {
    try {
        const { admin_id, pending_email } = req.body;

        db.query('SELECT * FROM Administrator WHERE admin_email = ? AND admin_active_status = ?', [pending_email, 1],
        (error, result) => {
            if (error) throw error;
            if (result[0] === undefined) {
                db.query('SELECT * FROM Pending_Admin WHERE pending_email = ? AND pending_status = ?', [pending_email, 1],
                (error, result) => {
                    if (error) throw error;
                    if (result[0] === undefined) {
                        db.query(
                            "INSERT INTO Pending_Admin (admin_id, pending_email, pending_status) VALUES (?, ?, ?)", [admin_id, pending_email, 1],
                            (error, results) => {
                                if (error) throw error;
                                else {
                                    emailPendingAdmin(pending_email).then(() => {
                                        res.status(201).json({
                                            status: "success",
                                            result: results
                                        });
                                    });
                                }
                            }
                        );
                    } else {
                        res.status(400).json('Administrator is already active.');
                    }
                });

            } else {
                res.status(400).json('Administrator is already active.');
            }
        });

    } catch (error) {
        console.log(error);
    }
}

const getAllPendingAdmins = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Pending_Admin",
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        pending_admins: results
                    }
                }); 
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const getUnresolvedPendingAdmins = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Pending_Admin WHERE pending_status = true",
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        pending_admins: results
                    }
                }); 
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const getPendingAdminById = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Pending_Admin WHERE pending_admin_id = ?",
            [req.params.paid],
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        pending_admin: results[0]
                    }
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const getPendingAdminByEmail = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Pending_Admin WHERE pending_email = ?",
            [req.params.email],
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        pending_admin: results[0]
                    }
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const deletePendingAdmin = async(req, res) => {
    try {
        db.query(
            "UPDATE Pending_Admin SET pending_status = 0 WHERE pending_admin_id = ?",
            [req.params.paid],
            (error) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addPendingAdmin,
    getPendingAdminById,
    getAllPendingAdmins,
    getUnresolvedPendingAdmins,
    getPendingAdminByEmail,
    deletePendingAdmin
}