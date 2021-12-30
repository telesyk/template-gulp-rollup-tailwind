const customJs = require('./custom');
const echo = require('./customEcho');

echo.log('this is Info console');
echo.warn('this is Warning console');
echo.err('this is Error console');
// echo.warn(testFun2())

customJs();
