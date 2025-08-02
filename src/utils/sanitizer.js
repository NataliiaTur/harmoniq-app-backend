import xss from 'xss';

const options = {
  whiteList: {
    p: ['style'],
    h1: ['style'],
    h2: ['style'],
    ul: [],
    ol: [],
    li: [],
    strong: [],
    em: [],
    s: [],
    a: ['href', 'target', 'rel', 'tooltip'],
    span: ['style'],
  },
  css: {
    whiteList: {
      color: true,
      'text-align': true,
    },
  },
  stripIgnoreTag: true, // remove tags
  stripIgnoreTagBody: ['script'], // remove scripts
};

export const sanitizeText = (input) => {
  if (typeof input !== 'string') return '';

  let cleaned = input.trim(); // remove invisible symbols
  cleaned = xss(cleaned, options); // remove suspicios tags, except whitelisted

  return cleaned;
};
