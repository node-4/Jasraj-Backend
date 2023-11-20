var multer = require("multer");
require('dotenv').config()
const authConfig = require("../configs/auth.config");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: authConfig.cloud_name, api_key: authConfig.api_key, api_secret: authConfig.api_secret, });



const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "Pawan-Sharma-Backend/profileImage", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const profileImage = multer({ storage: storage });
const storage1 = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "Pawan-Sharma-Backend/categoryImage", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const categoryImage = multer({ storage: storage1 });
const storage2 = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "Pawan-Sharma-Backend/subCategoryImage", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const subCategoryImage = multer({ storage: storage2 });
const storage3 = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "Pawan-Sharma-Backend/productImage", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const productImage = multer({ storage: storage3 });
const storage4 = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "Pawan-Sharma-Backend/productImage", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const offerImage = multer({ storage: storage4 });
const storage5 = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "Pawan-Sharma-Backend/productImage", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const couponImage = multer({ storage: storage5 });



module.exports = { profileImage, categoryImage, subCategoryImage, productImage, offerImage, couponImage }