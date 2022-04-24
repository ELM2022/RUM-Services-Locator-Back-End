const db = require('../configs/db').pool;

const addOfficeUpdate = async(req, res) => {
    try {
        const { office_id, admin_id, update_datetime, update_justification } = req.body;
        db.query(
            "INSERT INTO Office_Record_Updates (office_id, admin_id, update_datetime, update_justification) VALUES (?, ?, ?, ?)",
            [office_id, admin_id, update_datetime, update_justification],
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

const getAllOfficeUpdates = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Office_Record_Updates",
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        office_updates: results
                    }
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const getOfficeUpdateById = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Office_Record_Updates WHERE update_office_id = ?",
            [req.params.ouid],
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        office_update: results[0]
                    }
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addOfficeUpdate,
    getOfficeUpdateById,
    getAllOfficeUpdates,

}