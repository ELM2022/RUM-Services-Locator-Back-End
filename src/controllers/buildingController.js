const db = require('../configs/db').pool;

const addBuilding = async(req, res) => {
    try {
        const { building_name, building_latitude, building_longitude } = req.body;
        db.query(
            "INSERT INTO Building (building_name, building_latitude, building_longitude) VALUES (?, ?, ?)",
            [building_name, building_latitude, building_longitude],
            (error, results) => {
                if (error) {
                    if (error.code === "ER_DUP_ENTRY") {
                        res.status(404).json("Building already exists.");
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

const getAllBuildings = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Building",
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        buildings: results
                    }
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const getBuildingById = async(req, res) => {
    try {
        db.query(
            "SELECT * FROM Building WHERE building_id = ?",
            [req.params.bid],
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        building: results[0]
                    }
                });
            }
        );

    } catch (error) {
        console.log(error);
    }
}

const updateBuilding = async (req, res) => {
    try {
        const { building_name, building_latitude, building_longitude } = req.body;
        db.query(
            "UPDATE Building SET building_name = ?, building_latitude = ?, building_longitude = ? WHERE building_id = ?",
            [building_name, building_latitude, building_longitude, req.params.bid],
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

module.exports = {
    getBuildingById,
    getAllBuildings,
    addBuilding,
    updateBuilding
}

