const toCamelCase = (obj) => {
  const newObj = {};
  for (const key in obj) {
    const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    newObj[camelCaseKey] = obj[key];
  }
  return newObj;
};

module.exports = {
  toCamelCase,
};
