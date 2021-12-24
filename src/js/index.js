function testFun() {
  const a = 2;
  const b = 3;
  return a * b;
};

const testFun2 = () => {
  const res1 = testFun();
  return res1 * 2;
};

testFun2();
