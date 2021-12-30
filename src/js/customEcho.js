/**
 * Custom console
 * @returns custom console methods: log, warn, err
 */
const echo = function () {
  const displayConsole = function (prefix, css, message, value) {
    if (message === undefined) console.error;
    if (typeof message !== 'string') {
      value = message;
      message = null;
    }

    console.group(prefix, css.prefix);
    if (message) console.log('%c' + message, css.message);
    if (value) console.log(value);
    console.groupEnd();
  };

  const log = function (message, value = null) {
    const prefix = '%clog';
    const styles = {
      prefix: 'background-color: #218E94 ; color: #ffffff ; font-weight: bold ; padding: 4px ;',
      message: 'color: #218E94 ;'
    };

    return displayConsole(prefix, styles, message, value);
  };
  const warn = function (message, value = null) {
    const prefix = '%cwarning';
    const styles = {
      prefix: 'background-color: #DEBD1B ; color: #ffffff ; font-weight: bold ; padding: 4px ;',
      message: 'color: #DEBD1B ;'
    };

    return displayConsole(prefix, styles, message, value);
  };
  const err = function (message, value = null) {
    const prefix = '%cerror';
    const styles = {
      prefix: 'background-color: #E04929 ; color: #ffffff ; font-weight: bold ; padding: 4px ;',
      message: 'color: #E04929 ;'
    };

    return displayConsole(prefix, styles, message, value);
  };

  return {
    log,
    warn,
    err,
  };
};

module.exports = echo();
