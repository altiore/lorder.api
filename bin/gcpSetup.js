var fs = require('fs');
if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.GOOGLE_CLOUD_CRED) {
    fs.writeFile(
      process.cwd() + '/' + process.env.GOOGLE_APPLICATION_CREDENTIALS,
      process.env.GOOGLE_CLOUD_CRED,
      err => {}
    );
  } else {
    console.error(
      'Environment variables GOOGLE_APPLICATION_CREDENTIALS and GOOGLE_CLOUD_CRED was not set'
    );
    process.exit(1);
  }
}
