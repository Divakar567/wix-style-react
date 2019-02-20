const load = path => {
  const MODULE_META_KEYS = ['__esModule'];

  const item = require(path);
  const moduleFields = Object.keys(item).reduce((total, key) => {
    if (!MODULE_META_KEYS.includes(key)) {
      return total.concat(item[key]);
    }
    return total;
  }, []);

  let defaultOrFirstExport;
  if (item.default) {
    defaultOrFirstExport = item.default;
  } else if (moduleFields.length === 1) {
    defaultOrFirstExport = moduleFields[0];
  } else {
    defaultOrFirstExport = item;
  }
  return defaultOrFirstExport;
};
