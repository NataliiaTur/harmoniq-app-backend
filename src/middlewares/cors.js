export const corsOptions = {
  origin: (
    origin,
    callback,
  ) => {
    if (!origin || process.env.ALLOWED_ORIGINS?.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
