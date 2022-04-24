const db = require('../configs/db').pool;

const addAdminUpdate = async(req, res) => {
    try {
        const { editor_admin_id, updated_admin_id, update_datetime, update_justification } = req.body;
        db.query(
            "INSERT INTO Admin_Record_Updates (editor_admin_id, updated_admin_id, update_datetime, update_justification) VALUES (?, ?, ?, ?)",
            [editor_admin_id, updated_admin_id, update_datetime, update_justification],
            (error, results) => {
                if (error) throw error;
                res.status(201).json({
                    status: "success",
                    result: results
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const getAllAdminUpdates = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Admin_Record_Updates",
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        admin_updates: results
                    }
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const getAdminUpdateById = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Admin_Record_Updates WHERE update_admin_id = ?",
            [req.params.auid],
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        admin_update: results[0]
                    }
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addAdminUpdate,
    getAdminUpdateById,
    getAllAdminUpdates,

}