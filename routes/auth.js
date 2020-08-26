const express = require("express")
const AuthController = require("./../controller/AuthController")

const router = express.Router()

router.post(`/login`, AuthController.loginByCredentials)
router.post(`/signup`, AuthController.createUser)

module.exports = router