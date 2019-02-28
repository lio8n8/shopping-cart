const router = require('express').Router();

router.get('/', (req, res) => {
    const html = `
    <html>
        <head>
            <style>
                .emoji-wrap {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                }
                .emoji {
                    font-size: 50px;
                }
            </style>
        </head>
        <body>
            <div class="emoji-wrap">
                <span class="emoji">(｡◕‿‿◕｡)</span>
            </div>
        </body>
    </html>`;

    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': html.length
    });
    res.end(html);
});

module.exports = router;
