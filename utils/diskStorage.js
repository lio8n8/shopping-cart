const multer = require('multer');

module.exports.avatarsStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/users');
    },
    limits: { fileSize: 100000, files: 1 },
    fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Not allowed format!'), false)
        }

        callback(null, true);
    },
    filename: function (req, file, callback) {
        callback(null, (new Date()).toISOString() + file.originalname);
    }
});
