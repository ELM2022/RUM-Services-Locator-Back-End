const db = require('../configs/db').pool;
const genPassword = require('../utils/passwordUtils').getHashPassword;

const addAdmin = async(req, res) => {
    try {
        const { admin_email, admin_name, admin_last_name } = req.body;
        const admin_password = genPassword(req.body.admin_password);

        db.query(
            "INSERT INTO Administrator (admin_email, admin_password, admin_name, admin_last_name, admin_active_status) VALUES (?, ?, ?, ?, ?)",
            [admin_email, admin_password, admin_name, admin_last_name, 1],
            (error, results) => {
                if (error) {
                    if (error.code === "ER_DUP_ENTRY") {
                        res.status(404).json("Administrator account already exists.");
                    }
                    else throw error;
                }
                else {
                    res.status(201).json({
                        status: "success",
                        result: results
                    });
                }
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const adminExists = async(admin_id = undefined, admin_email = undefined) => {
    try {
        if (admin_id === undefined) {
            db.query(
                "SELECT * FROM Administrator WHERE admin_email = ?",
                [admin_email],
                (error, results) => {
                    if (error) throw error;
                    console.log(results[0] !== undefined);
                    return results[0] !== undefined;
                }
            );
        }
        else {
            db.query(
                "SELECT * FROM Administrator WHERE admin_id = ?",
                [admin_id],
                (error, results) => {
                    if (error) throw error;
                    console.log(results[0] !== undefined);
                    return results[0] !== undefined;
                }
            );
        }

    } catch (error) {
        console.log(error);
    }
}

const getAllAdmins = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Administrator",
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        admins: results
                    }
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const getAdminById = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Administrator WHERE admin_id = ?",
            [req.params.aid],
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        admin: results
                    }
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const updateAdmin = async(req, res) => {
    try {
        const { admin_email, admin_name, admin_last_name } = req.body;
        db.query(
            "UPDATE Administrator SET admin_email = ?, admin_name = ?, admin_last_name = ?, WHERE admin_id = ?",
            [admin_email, admin_name, admin_last_name, req.params.aid],
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    result: results
                });

            }
        );

    } catch (error) {
        console.log(error);
    }
}

const updateAdminPassword = async(req, res) => {
    try {
        const { admin_password } = req.body;
        db.query(
            "UPDATE Administrator SET admin_password = ?, reset_passw_token = ?, reset_passw_expires = ? WHERE admin_id = ?",
            [admin_password, undefined, undefined, req.params.aid],
            (error, result) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    result: result
                });
            }
        );
    } catch (error) {
        console.log(error);
    }
}

const deleteAdmin = async(req, res) => {
    try {
        db.query(
            "UPDATE Administrator SET admin_active_status = 0",
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
    addAdmin,
    getAdminById,
    getAllAdmins,
    updateAdmin,
    updateAdminPassword,
    deleteAdmin,
    adminExists
}