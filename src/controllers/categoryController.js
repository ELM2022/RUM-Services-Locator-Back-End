const res = require('express/lib/response');

const db = require('../configs/db').pool;

const addCategory = async (req, res) => {
    try {
        const { category_name } = req.body;

        db.query(
            "INSERT INTO Category (category_name) VALUES (?)",
            [category_name],
            (error, results) => {
                if (error) {
                    if (error.code === "ER_DUP_ENTRY") {
                        res.status(404).json("Category already exists.");
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

const getAllCategories = async (req, res) => {
    try {
        db.query(
            "SELECT * FROM Category",
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        categories: results
                    }
                });
            }
        );
    } catch (error) {
        console.log(error);
    }
}

const getCategoryById = async (req, res) => {
    try {
        db.query(
            "SELECT * FROM Category WHERE category_id = ?",
            [req.params.cid],
            (error, results) => {
                if (error) throw error;
                res.status(200).json({
                    status: "success",
                    data: {
                        category: results[0]
                    }
                });
            }
        );
    } catch (error) {
        console.log(error);
    }
}

const addOfficeCategories = async (req, res) => {
    try {
        
        const categories = req.body.categories;

        categories.map((category) => {
            const { category_id } = category;

            db.query(
                "INSERT INTO Office_Category (category_id, office_id) VALUES (?, ?)",
                [category_id, req.params.oid],
                (error) => {
                    if (error) {
                        console.log(error);
                        res.status(400).json("An error occurred.");
                    }
                }
            );
        });

        res.status(200).json("Office categories inserted.");

    } catch (error) {
        console.log(error);
    }
}

const getAllOfficeCategories = async (req, res) => {
    try {
        const sql = `SELECT category_name, office_name FROM Office_Category
                    INNER JOIN Category ON Category.category_id = Office_Category.category_id
                    INNER JOIN Office ON Office.office_id = Office_Category.office_id`;

        db.query(sql, (error, results) => {
            if (error) throw error;
            res.status(200).json({
                status: "success",
                data: {
                    categories: results
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
}

const getCategoriesByOfficeId = async (req, res) => {
    try {
        const sql = `SELECT category_name FROM Category
                    INNER JOIN Office_Category ON Category.category_id = Office_Category.category_id
                    WHERE office_id = ?`;

        db.query(sql, [req.params.oid], (error, results) => {
            if (error) throw error;
            res.status(200).json({
                status: "success",
                data: {
                    categories: results
                }
            });
        }); 

    } catch (error) {
        console.log(error);
    }
}

const deleteOfficeCategoriesById = async (req, res) => {
    try {
        const categories = req.body.categories;

        categories.map((category) => {
            const { category_id } = category;

            db.query(
                "DELETE FROM Office_Category WHERE category_id = ? AND office_id = ?",
                [category_id, req.params.oid],
                (error) => {
                    if (error) {
                        console.log(error);
                        res.status(400).json("An error occurred.");
                    }
                }
            );
        });

        res.status(200).json("Office categories deleted.");

    } catch (error) {
        console.log(error);
    }
}

const deleteAllOfficeCategories = async (req, res) => {
    try {
        db.query(
            "DELETE FROM Office_Category WHERE office_id = ?",
            [req.params.oid],
            (error, results) => {
                if (error) throw error;
                res.status(200).json("Office categories deleted");
            }
        );
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addCategory,
    getAllCategories,
    getCategoryById,
    addOfficeCategories,
    getAllOfficeCategories,
    getCategoriesByOfficeId,
    deleteOfficeCategoriesById,
    deleteAllOfficeCategories
}