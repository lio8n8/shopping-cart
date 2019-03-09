const router = require('express').Router();
const fs = require('fs');

router.get('/', (req, res, next) => {
    try {
        const filePath = 'public/docs/index.html';

        fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                return next(err);
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
