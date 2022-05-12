const db = require('../configs/db').pool;

const addOffice = async(req, res) => {
    try {
        const { office_name, office_description, office_schedule, office_latitude, office_longitude, office_entrance_latitude, office_entrance_longitude, 
                office_route_instructions, office_search_description , office_floor_number, office_room_code, office_email, office_phone_number, 
                office_extension_number, office_website } = req.body.office;

        db.query('SELECT * FROM Office WHERE office_name = ? AND office_active_status = ?', [office_name, 1],
        (error, result) => {
            if (error) throw error;
            if (result[0] === undefined) {
                db.query(
                    `INSERT INTO Office (office_name, office_description, office_schedule, office_latitude, office_longitude, office_entrance_latitude, office_entrance_longitude, 
                    office_route_instructions, office_search_description, office_floor_number, office_room_code, office_email, office_phone_number, office_extension_number, 
                    office_website, office_active_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [office_name, office_description, office_schedule, office_latitude, office_longitude, office_entrance_latitude, office_entrance_longitude, office_route_instructions, 
                    office_search_description, office_floor_number, office_room_code, office_email, office_phone_number, office_extension_number, office_website, 1],
                    (error, results) => {
                        if (error) throw error;
                        else {
                            res.status(201).json({
                                status: "success",
                                result: results
                            });
                        }
                    }
                );
            } else {
                res.status(404).json("Office already exists.");
            }
        });

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

const getInactiveOffices = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Office WHERE office_active_status = false",
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

const getOfficesWithCategory = async (req, res) => {
    try {
        const sql = `SELECT * FROM Office_Category
                    INNER JOIN Category ON Category.category_id = Office_Category.category_id
                    INNER JOIN Office ON Office.office_id = Office_Category.office_id
                    WHERE office_active_status = true`;

        db.query(sql, (error, results) => {
            if (error) throw error;
            res.status(200).json({
                status: "success",
                data: {
                    offices: results
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
}

const getOfficeByCategory = async (req, res) => {
    try {
        const sql = `SELECT * FROM Office_Category
                    INNER JOIN Category ON Category.category_id = Office_Category.category_id
                    INNER JOIN Office ON Office.office_id = Office_Category.office_id
                    WHERE category_name = ?`;

        db.query(sql, [req.query.category_name], (error, results) => {
            if (error) throw error;
            res.status(200).json({
                status: "success",
                data: {
                    offices: results
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
}

const updateOffice = async(req, res) => {
    try {
        const { office_name, office_description, office_schedule, office_latitude, office_longitude, office_entrance_latitude, office_entrance_longitude, 
            office_route_instructions, office_search_description , office_floor_number, office_room_code, office_email, office_phone_number, 
            office_extension_number, office_website } = req.body.office;
        
        db.query(
            `UPDATE Office SET office_name = ?, office_description = ?, office_schedule = ?, office_latitude = ?, office_longitude = ?, office_entrance_latitude = ?, 
            office_entrance_longitude = ?, office_route_instructions = ?, office_search_description = ?, office_floor_number = ?, office_room_code = ?, office_email = ?, 
            office_phone_number = ?, office_extension_number = ?, office_website = ?, office_active_status = ? WHERE office_id = ?`,
            [office_name, office_description, office_schedule, office_latitude, office_longitude, office_entrance_latitude, office_entrance_longitude, office_route_instructions, 
                office_search_description, office_floor_number, office_room_code, office_email, office_phone_number, office_extension_number, office_website, 1, req.params.oid],
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

const activateOffice = async(req, res) => {
    try {
        db.query(
            "UPDATE Office SET office_active_status = true WHERE office_id = ?",
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

const getAllOfficeCategoryMemberships = async (req, res) => {
    try {
        const category_memberships = [];
        const sql = `SELECT * FROM Category
                    INNER JOIN Office_Category ON Office_Category.category_id = Category.category_id
                    INNER JOIN Office ON Office.office_id = Office_Category.office_id
                    WHERE Category.category_id = ? AND Office.office_active_status = ?`;

        db.query('SELECT * FROM Category ORDER BY category_name ASC', (error, categories) => {
            if (error) throw error;
            categories.map((category) => {
                const {category_id, category_name} = category;
                db.query(sql, [category_id, 1], (error, offices) => {
                    if (error) throw error;
                    category_memberships.push({
                        category_name: category_name,
                        offices: offices
                    });
                });
            });
        });

        setTimeout(() => res.status(200).json(category_memberships), 100);

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addOffice,
    getOfficeById,
    getAllOffices,
    getActiveOffices,
    getInactiveOffices,
    getOfficesWithCategory,
    getOfficeByCategory,
    updateOffice,
    deleteOffice,
    activateOffice,
    getAllOfficeCategoryMemberships
}

