import xss from 'xss';

export const sanitizeText = (input) => {
  if (typeof input !== 'string') return '';

  let cleaned = input.trim(); //invisible symbols
  cleaned = cleaned.replace(/['"\\;]/g, ''); //sql-injection
  cleaned = cleaned.replace(/<[^>]*>?/gm, ''); //html-injection
  cleaned = xss(cleaned);

  return cleaned;
};
