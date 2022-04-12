const db = require('../configs/db').pool;

const addOffice = async(req, res) => {
    try {
        const { building_id, office_name, office_description, office_schedule, office_latitude, office_longitude, office_floor_number, 
                office_room_code, office_email, office_phone_number, office_extension_number, office_website } = req.body;
        const duplicate = await officeExists(office_name).valueOf();

        if (duplicate !== undefined) {
            const newOffice = await db.query(
                "INSERT INTO Office (building_id, office_name, office_description, office_schedule, office_latitude, office_longitude, office_floor_number, office_room_code, office_email, office_phone_number, office_extension_number, office_website, office_active_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [building_id, office_name, office_description, office_schedule, office_latitude, office_longitude, office_floor_number, 
                    office_room_code, office_email, office_phone_number, office_extension_number, office_website, 1],
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
            res.status(404).json("Office already exists.");
        }

    } catch (error) {
        console.log(error);
    }
}

const officeExists = async(office_name) => {
    try {
        const office = await db.query(
            "SELECT * FROM Office WHERE office_name = ?",
            [office_name],
            (error, results) => {
                if (error) throw error;
                return results[0] === undefined;
            }
        );
    } catch (error) {
        console.log(error);
    }
}

const getAllOffices = async(req, res) => {
    try {
        const offices = await db.query(
            "SELECT * FROM Office",
            (error, results, fields) => {
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
        const office = await db.query(
            "SELECT * FROM Office WHERE office_id = ?",
            [req.params.oid],
            (error, results, fields) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        office: results
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
        const office = await db.query(
            "UPDATE Office SET building_id = ?, office_name = ?, office_description = ?, office_schedule = ?, office_latitude = ?, office_longitude = ?, office_floor_number = ?, office_room_code = ?, office_email = ?, office_phone_number = ?, office_extension_number = ?, office_website = ?, office_active_status = ? WHERE office_id = ?",
            [building_id, office_name, office_description, office_schedule, office_latitude, office_longitude, office_floor_number, 
                office_room_code, office_email, office_phone_number, office_extension_number, office_website, office_active_status, req.params.oid],
            (error, results, fields) => {
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
        const result = await db.query(
            "UPDATE Office SET office_active_status = 0",
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
    addOffice,
    getOfficeById,
    getAllOffices,
    updateOffice,
    deleteOffice,
    officeExists
}

