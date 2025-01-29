// its used for parsing multipart/formdata
const multer = require('multer');
// its a cloud
const cloudinary = require('../config/cloudinary')
// this package is used integrate with multer and cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// create a storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'productsShoe', // Folder to store images in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;