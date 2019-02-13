module.exports = function claculateHypotenuse([a, b]) {
  return {
    width: `${Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)).toFixed(2)}px`,
  };
};
