// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({ path: path.join(process.cwd(), '.env') });

// export default {
//   port: process.env.PORT,
//   database_url: process.env.DATABASE_URL,
// };

// ! after payment integration, we need to export more config values

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  ssl: {
    storeId: process.env.SSL_STORE_ID as string,
    storePassword: process.env.SSL_STORE_PASSWORD as string,
    isLive: process.env.SSL_IS_LIVE === 'true',
  },
  frontendUrl: process.env.FRONTEND_URL as string,
  backendUrl: process.env.BACKEND_URL as string,
};
