const db = require('../configs/db').pool;
const { adminExists } = require('../controllers/adminController');

const addPendingAdmin = async(req, res) => {
    try {
        const { admin_id, pending_email } = req.body;
        await pendingAdminExists(pending_email).then((duplicate) => {
            if (duplicate) {
                res.status(400).json("Pending administrator already exists.");
            } else {
                await adminExists(admin_id).then((exists) => {
                    if (exists) {
                        await db.promise().query("INSERT INTO Pending_Admin (admin_id, pending_email, pending_status) VALUES (?, ?, ?)", [admin_id, pending_email, 1])
                            .then((results) => {
                                res.status(201).json({
                                    status: "success",
                                    result: results
                                });
                            })
                            .catch(error => res.status(500).json({ message: error.message }));
                    } else {
                        res.status(404).json("Source administrator is not in the system.");
                    }
                })
                .catch(error => res.status(500).json({ message: error.message }));
            }
        })
        .catch(error => res.status(500).json({ message: error.message }));
        // const duplicate = await pendingAdminExists(pending_email).valueOf();
        // const admin_exists = await adminExists(admin_id).valueOf();

        // if (duplicate === undefined && admin_exists === undefined) {
        //     const newPendingAdmin = await db.query(
        //         "INSERT INTO Pending_Admin (admin_id, pending_email, pending_status) VALUES (?, ?, ?)",
        //         [admin_id, pending_email, 1],
        //         (error, results, fields) => {
        //             if (error) throw error;
        //             res.status(201).json({
        //                 status: "success",
        //                 result: results
        //             });
        //         }
        //     );
        // }
        // else {
        //     res.status(404).json("Pending admin already exists.");
        // }

    } catch (error) {
        console.log(error);
    }
}

const pendingAdminExists = async(pending_email) => {
    try {
        await db.promise().query("SELECT * FROM Pending_Admin WHERE pending_email = ?", [pending_email])
            .then((results) => {
                console.log(results[0] === undefined);
                return results[0] === undefined;
            })
            .catch((error) => res.status(500).json({ message: error.message }));

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