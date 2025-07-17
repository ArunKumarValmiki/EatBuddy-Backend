
const jwt = require("jsonwebtoken")  
const bcrypt = require("bcryptjs")
const Vendor = require("../models/Vendor");
const dotEnv = require("dotenv")

dotEnv.config()

const secretKey = process.env.SECRET_CODE; 


const vendorRegister = async(req, res) => {
    const {username, email, password} = req.body;
    try {
        const vendorEmail = await Vendor.findOne({ email });
        if(vendorEmail) {
            return res.status(400).json("Email already taken");
        } 
        
        const hashedPassword = await bcrypt.hash(password, 10);


        const newVendor = new Vendor({
            username, 
            email, 
            password : hashedPassword})

        await newVendor.save()

        res.status(201).json({message : "A new vendor registered successfully"})
        console.log("A new vendor registered")

    } catch(error) {
        console.log(`There is an error : ${error}`)
        res.status(500).json({error: "Internal server error"})
    }
}


const vendorLogin = async(req, res) => {
    const {email, password} = req.body;
    try {
        const vendor = await Vendor.findOne({ email }); 
        if(!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({error : "Invalid username or password"});
        }

        const token = jwt.sign({vendorId : vendor._id }, secretKey, {expiresIn : "1h"})

        const vendorId = vendor._id;

        const vendorName = vendor.username;

        res.status(200).json({success : "Vendor Logged In successfully", token, vendorId, vendorName})  // send the token and vendorId to frontend
        console.log(`Vendor with this email : ${email}, logged in successfully, token : ${token}`);

    } catch(error) {
        console.log(`There is an error : ${error}`)
        res.status(500).json({error: "Internal server error"})
    }
}


const getAllVendors = async(req,res) => {
    try {  
        const vendors = await Vendor.find().populate('firm');
        res.json({vendors})
    } catch(error) {
        console.log(`There is an error : ${error}`)
        res.status(500).json({error: "Internal server error"})
    }
}


const getVendorById = async(req,res) => {
    const vendorId = req.params.id;

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm')
        if(!vendor) {
            return res.status(404).json({error : "Vendor Not Found"})
        }

        const vendorFirmId = vendor.firm[0]._id;     
        res.status(200).json({vendor, vendorFirmId})
        
    } catch(error) { 
        console.log(`There is an error : ${error}`)
        res.status(500).json({error: "Internal server error"})
    }
}

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById}
