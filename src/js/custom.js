const echo = require('./customEcho');

const customJs = () => {
  const doc = document.body;

  echo.log(doc.clientWidth);

  return doc;
};

module.exports = customJs;
