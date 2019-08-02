var fs = require('fs');
fs.writeFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, process.env.GOOGLE_CLOUD_CRED, err => {});
