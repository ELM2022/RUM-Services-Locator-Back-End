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

// const adminExists = (admin_id = undefined, admin_email = undefined) => {
//     try {
//         const sql = (admin_id === undefined) ? `SELECT * FROM Administrator WHERE admin_email = ${admin_email}` : `SELECT * FROM Administrator WHERE admin_id = ${admin_id}`;

//         db.query(sql, (error, results) => {
//             if (error) {
//                 throw error;
//             } else {
//                 return results[0] !== undefined;
//             }
//         });

//     } catch (error) {
//         console.log(error);
//     }
// }

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
                        admin: results[0]
                    }
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const getActiveAdmins = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Administrator WHERE admin_active_status = true",
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

const updateAdmin = async(req, res) => {
    try {
        const { admin_email, admin_name, admin_last_name } = req.body;
        db.query(
            "UPDATE Administrator SET admin_email = ?, admin_name = ?, admin_last_name = ? WHERE admin_id = ?",
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

const deleteAdmin = async(req, res) => {
    try {
        db.query(
            "UPDATE Administrator SET admin_active_status = 0 WHERE admin_id = ?",
            [req.params.aid],
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
    getActiveAdmins,
    updateAdmin,
    deleteAdmin,
    // adminExists
}