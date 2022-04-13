const db = require('../configs/db').pool;
const { adminExists } = require('../controllers/adminController');

const addPendingAdmin = async(req, res) => {
    try {
        const { admin_id, pending_email } = req.body;
        const duplicate = await pendingAdminExists(pending_email).valueOf();
        const admin_exists = await adminExists(admin_id).valueOf();

        if (duplicate === undefined && admin_exists === undefined) {
            const newPendingAdmin = await db.query(
                "INSERT INTO Pending_Admin (admin_id, pending_email, pending_status) VALUES (?, ?, ?)",
                [admin_id, pending_email, 1],
                (error, results, fields) => {
                    if (error) throw error;
                    res.status(201).json({
                        status: "success",
                        result: results
                    });
                }
            );
        }
        else {
            res.status(404).json("Pending admin already exists.");
        }

    } catch (error) {
        console.log(error);
    }
}

const pendingAdminExists = async(pending_email) => {
    try {
        const pendingAdmin = await db.query(
            "SELECT * FROM Pending_Admin WHERE pending_email = ?",
            [pending_email],
            (error, results) => {
                if (error) throw error;
                return results[0] === undefined;
            }
        );
    } catch (error) {
        console.log(error);
    }
}

const getAllPendingAdmins = async(req, res) => {
    try {
        const pending_admins = await db.query(
            "SELECT * FROM Pending_Admin",
            (error, results, fields) => {
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
        const pending_admin = await db.query(
            "SELECT * FROM Pending_Admin WHERE pending_admin_id = ?",
            [req.params.paid],
            (error, results, fields) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        pending_admin: results
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
        const result = await db.query(
            "UPDATE Pending_Admin SET pending_status = 0",
            (error, results, fields) => {
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
    deletePendingAdmin
}