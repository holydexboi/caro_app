const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dyw9ms10v",
    api_key: "418922614784811",
    api_secret: "qZ3nprRSl6klmVJ5eG151M3g3rs"
  });

  
module.export = cloudinary.uploader.upload()