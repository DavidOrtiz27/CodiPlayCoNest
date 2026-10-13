import { DataSource } from 'typeorm';
import config from '../config';
import * as dotenv from 'dotenv';
import { getEnvironmentFile } from '../enviroments';

import { join } from 'path';

const envFile = getEnvironmentFile(process.env.NODE_ENV);
dotenv.config({ path: envFile });
const configuration = config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configuration.dataBase.host,
  port: configuration.dataBase.port,
  username: configuration.dataBase.user,
  password: configuration.dataBase.password,
  database: configuration.dataBase.name,
  synchronize: false,
  logging: true,
  ssl: configuration.dataBase.ssl,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  ssl: process.env.NODE_ENV === 'prod' ? { rejectUnauthorized: false } : false,
});