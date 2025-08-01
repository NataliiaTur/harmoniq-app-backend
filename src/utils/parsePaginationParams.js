const parseNumber = (number, defaultValue) => {
  const isString = typeof number === 'string';
  if (!isString) return defaultValue;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }

  return parsedNumber;
};

export const parsePaginationParams = (query, defPerPage) => {
  const { page, perPage } = query;
  if (!defPerPage) {
    defPerPage = 10;
  }
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, defPerPage);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
