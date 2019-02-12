export const validateHex = hex => {
  const RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  if (hex === '' || !hex) {
    return hex;
  }
  if (hex.match(RE_HEX)) {
    if (hex.replace('#', '').length === 3) {
      const hexArray = hex.split('');
      return (
        hexArray[0] +
        hexArray[1] +
        hexArray[1] +
        hexArray[2] +
        hexArray[2] +
        hexArray[3] +
        hexArray[3]
      );
    }
    return hex;
  }

  return '';
};
