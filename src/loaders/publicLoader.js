const path = require('path')
const favicon = require('serve-favicon');

exports.publicLoader = (app) => {
    app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')))
    app.use(express.static(path.join(__dirname, '../../', 'views/assets'), { maxAge: 31557600000 }))
     // A favicon is a visual cue that client software, like browsers, use to identify a site
    app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')))
};
