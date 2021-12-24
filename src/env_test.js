const envIs = process.env.NODE_ENV === 'production';
console.debug(
  "process.env.NODE_ENV === 'production'",
  process.env.NODE_ENV === 'production'
);
const notProd = false;

const isProduction = envIs || notProd;
// console.debug('!envIs', !envIs);

console.log('Environment is production', isProduction);
