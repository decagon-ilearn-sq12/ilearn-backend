"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCourse = exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getStudentHistory = exports.getAllCourse = void 0;
const courseModel_1 = require("../model/courseModel");
const addCourse = async (req, res) => {
    try {
        const { name, description, category, price } = req.body;
        const course = await courseModel_1.courseInstance.create({
            name,
            description,
            category,
            price,
        });
        return res.status(200).json({
            message: "Course created successfully",
            course: course,
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/add-course",
            err,
        });
    }
};
exports.addCourse = addCourse;
//const getAllCourses = async () => {};
const getStudentHistory = async (req, res) => {
    try {
        const id = req.user?.id;
        const courses = await courseModel_1.courseInstance.findAll({
            where: { tutorId: id },
        });
        return res.status(200).json({
            courses: courses,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
    console.log(req.user);
};
exports.getStudentHistory = getStudentHistory;
const getAllCourse = async (req, res) => {
    try {
        //const userId = req.user?.id;
        const course = await courseModel_1.courseInstance.findAndCountAll(); //{ where: { id: userId } }
        return res.status(200).json({
            message: "You have successfully retrieved all courses",
            course: course,
        });
    }
    catch (err) {
        return res.status(500).json({
            route: "/users/get-all-courses",
            error: err.message,
        });
    }
};
exports.getAllCourse = getAllCourse;
const createCourse = async (req, res) => {
    try {
        //const userId = req.user?.id;
        const { title, description, category, pricing } = req.body;
        const newCourse = await courseModel_1.courseInstance.create({
            title,
            description,
            course_image: req.files.course_image[0].path,
            pricing: pricing.toLocaleString(),
            category,
            tutorId: req.user?.id,
            course_material: req.files.course_material[0].path,
        });
        return res.status(200).json({
            message: "You have successfully created a course",
            course: newCourse,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            route: "/users/create-courses",
            error: error.message,
        });
    }
};
exports.createCourse = createCourse;
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, pricing, category, course_image, tutorId, tutor_Name, } = req.body;
        // updating course
        const updateCourse = await courseModel_1.courseInstance.update({
            title,
            description,
            course_image,
            pricing: pricing.toLocaleString(),
            category,
            tutorId: req.user?.id,
            tutor_Name,
        }, {
            where: { id: id },
        });
        return res.status(200).json({
            message: "You have successfully updated a course",
            course: updateCourse,
        });
        const courses = await courseModel_1.courseInstance.findAll();
        console.log(courses);
        //jggj
        res.send(courses);
    }
    catch (error) {
        res.send(error);
    }
};
exports.updateCourse = updateCourse;
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteCourse = await courseModel_1.courseInstance.destroy({
            where: { id: id },
        });
        return res.status(200).json({
            message: "You have successfully deleted a course",
            course: deleteCourse,
        });
        //jggj
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/delete-courses",
        });
    }
};
exports.deleteCourse = deleteCourse;
