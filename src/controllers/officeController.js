const db = require('../configs/db').pool;

const addOffice = async(req, res) => {
    try {
        const { building_id, office_name, office_description, office_schedule, office_latitude, office_longitude, office_floor_number, 
                office_room_code, office_email, office_phone_number, office_extension_number, office_website } = req.body;

        db.query(
            "INSERT INTO Office (building_id, office_name, office_description, office_schedule, office_latitude, office_longitude, office_floor_number, office_room_code, office_email, office_phone_number, office_extension_number, office_website, office_active_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [building_id, office_name, office_description, office_schedule, office_latitude, office_longitude, office_floor_number, 
                office_room_code, office_email, office_phone_number, office_extension_number, office_website, 1],
            (error, results) => {
                if (error) {
                    if (error.code === "ER_DUP_ENTRY") {
                        res.status(404).json("Office already exists.");
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

const officeExists = async(office_name) => {
    try {
        await db.promise().query("SELECT * FROM Office WHERE office_name = ?", [office_name])
            .then((results) => {
                console.log(results[0] === undefined);
                return results[0] === undefined;
            })
            .catch((error) => res.status(500).json({ message: error.message }));

    } catch (error) {
        console.log(error);
    }
}

const getAllOffices = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Office",
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        offices: results
                    }
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const getActiveOffices = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Office WHERE office_active_status = true",
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        offices: results
                    }
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const getOfficeById = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Office WHERE office_id = ?",
            [req.params.oid],
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        office: results[0]
                    }
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const updateOffice = async(req, res) => {
    try {
        const { building_id, office_name, office_description, office_schedule, office_latitude, office_longitude, office_floor_number, 
            office_room_code, office_email, office_phone_number, office_extension_number, office_website, office_active_status } = req.body;
        
        db.query(
            "UPDATE Office SET building_id = ?, office_name = ?, office_description = ?, office_schedule = ?, office_latitude = ?, office_longitude = ?, office_floor_number = ?, office_room_code = ?, office_email = ?, office_phone_number = ?, office_extension_number = ?, office_website = ?, office_active_status = ? WHERE office_id = ?",
            [building_id, office_name, office_description, office_schedule, office_latitude, office_longitude, office_floor_number, 
                office_room_code, office_email, office_phone_number, office_extension_number, office_website, office_active_status, req.params.oid],
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

const deleteOffice = async(req, res) => {
    try {
        db.query(
            "UPDATE Office SET office_active_status = 0 WHERE office_id = ?",
            [req.params.oid],
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
    addOffice,
    getOfficeById,
    getAllOffices,
    getActiveOffices,
    updateOffice,
    deleteOffice,
    officeExists
}

