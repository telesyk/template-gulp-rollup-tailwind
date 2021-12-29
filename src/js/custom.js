const customJs = () => {
  const doc = document.body;

  console.debug('[debug]', doc.clientWidth);

  return doc;
};

module.exports = customJs;
