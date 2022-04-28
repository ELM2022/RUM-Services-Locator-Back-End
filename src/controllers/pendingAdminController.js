const db = require('../configs/db').pool;
// const { adminExists } = require('../controllers/adminController');

const addPendingAdmin = async(req, res) => {
    try {
        const { admin_id, pending_email } = req.body.pending_admin;

        db.query(
            "INSERT INTO Pending_Admin (admin_id, pending_email, pending_status) VALUES (?, ?, ?)", [admin_id, pending_email, 1],
            (error, results) => {
                if (error) {
                    if (error.code === "ER_DUP_ENTRY") {
                        res.status(404).json("Pending administrator account already exists.");
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

// const pendingAdminExists = async(pending_email) => {
//     try {
//         await db.promise().query("SELECT * FROM Pending_Admin WHERE pending_email = ?", [pending_email])
//             .then((results) => {
//                 console.log(results[0] !== undefined);
//                 return results[0] === undefined;
//             })
//             .catch((error) => res.status(500).json({ message: error.message }));

//     } catch (error) {
//         console.log(error);
//     }
// }

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
    deletePendingAdmin
}