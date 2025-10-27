-- ===================================
-- SCHOLARSHIP DATABASE INITIALIZATION
-- ===================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'Asia/Ho_Chi_Minh';

-- Create custom types (will be overridden by Prisma migrations)
-- This is just for initial setup

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'Database initialized successfully!';
  RAISE NOTICE 'Timezone: %', current_setting('timezone');
  RAISE NOTICE 'Timestamp: %', now();
END $$;
