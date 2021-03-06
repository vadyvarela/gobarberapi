import multer from 'multer';

import crypto from 'crypto';
import { extaname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, res, cb) => {},
  }),
};
