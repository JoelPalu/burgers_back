import multer from 'multer';

/*
  Multer storage configuration for handling file uploads.
  Files are stored in the 'uploads/' directory with unique filenames.
  The filename is generated using the current timestamp and a random number,
  along with the appropriate file extension based on the MIME type.
*/

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

const storageProducts = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb){
    console.log(req.body)
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

    cb(null, req.body.name + extension);
  },
});

export {storage, storageProducts};
