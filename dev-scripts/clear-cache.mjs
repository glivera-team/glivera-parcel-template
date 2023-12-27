import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);
const parcelCache = path.resolve(__dirname, '../.parcel-cache');
const build = path.resolve(__dirname, '../build');
const dist = path.resolve(__dirname, '../dist');

fs.rm(parcelCache, { recursive: true }, () => null);
fs.rm(build, { recursive: true }, () => null);
fs.rm(dist, { recursive: true }, () => null);
