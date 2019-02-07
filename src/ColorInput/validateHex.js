export const validateHex = hex => {
  const RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  if (hex === '') {
    return hex;
  }

  if (hex.match(RE_HEX)) {
    if (hex.length === 3) {
      const hexArray = hex.split('');
      return (
        hexArray[0] +
        hexArray[0] +
        hexArray[1] +
        hexArray[1] +
        hexArray[2] +
        hexArray[2]
      );
    }
    return hex;
  }

  return '000000';
};
