import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let extension;
    if (file.mimetype === 'image/png') {
      extension = '.png';
    }
    if (file.mimetype === 'image/jpeg') {
      extension = '.jpg';
    }
    if (file.mimetype === 'image/svg+xml'){
      extension = '.svg';
    }

    cb(null, uniqueSuffix + extension);
  },
});

export {storage};
