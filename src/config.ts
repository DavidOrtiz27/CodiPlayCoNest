import { registerAs } from '@nestjs/config';

const getDatabaseUrl = () => {
  const value = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!value) return undefined;

  try {
    return new URL(value);
  } catch {
    return undefined;
  }
};

const shouldUseSsl = (databaseUrl?: URL) => {
  if (process.env.POSTGRES_SSL === 'true') {
    return { rejectUnauthorized: false };
  }

  if (databaseUrl) {
    return { rejectUnauthorized: false };
  }

  return false;
};

export default registerAs('config', () => {
  const databaseUrl = getDatabaseUrl();
  const urlPath = databaseUrl?.pathname.replace(/^\/+/, '') ?? '';

  return {
    dataBase: {
      name: process.env.POSTGRES_DB ?? (urlPath || undefined),
      port: parseInt(process.env.POSTGRES_PORT || databaseUrl?.port || '5432', 10),
      user: process.env.POSTGRES_USER ?? (databaseUrl?.username || undefined),
      password: process.env.POSTGRES_PASSWORD ?? (databaseUrl?.password || undefined),
      host: process.env.POSTGRES_HOST ?? (databaseUrl?.hostname || undefined),
      ssl: shouldUseSsl(databaseUrl),
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'codiplayco-prod-default-secret-change-me',
      expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '3600', 10),
    },
    mail: {
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587', 10),
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
    },
    stripe: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      currency: process.env.STRIPE_CURRENCY || 'usd',
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  };
});