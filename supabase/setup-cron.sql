-- ============================================================
-- BITCOIN PLATFORM - CRON JOB SETUP
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Step 1: Enable the pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Step 2: Store the service role key as a setting
-- Replace the key below with your actual service role key
ALTER DATABASE postgres SET app.service_role_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11c3BybW9sYXVzcWdpeGtvbnhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5MTY1MywiZXhwIjoyMDg4OTY3NjUzfQ.v2y8k-Y8bDn6VjYiF-mXopzEtit-nejxSZGgPgYMx_w';

-- Step 3: Schedule the daily payout cron job (runs every day at 00:05 UTC)
SELECT cron.schedule(
  'daily-investment-payouts',
  '5 0 * * *',
  $$
  SELECT net.http_post(
    url := 'https://musprmolausqgixkonxq.supabase.co/functions/v1/daily-payouts',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11c3BybW9sYXVzcWdpeGtvbnhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5MTY1MywiZXhwIjoyMDg4OTY3NjUzfQ.v2y8k-Y8bDn6VjYiF-mXopzEtit-nejxSZGgPgYMx_w'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- Step 4: Verify the cron job was created
SELECT * FROM cron.job WHERE jobname = 'daily-investment-payouts';

-- ============================================================
-- To manually trigger a payout (for testing):
-- ============================================================
-- SELECT net.http_post(
--   url := 'https://musprmolausqgixkonxq.supabase.co/functions/v1/daily-payouts',
--   headers := jsonb_build_object(
--     'Content-Type', 'application/json',
--     'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11c3BybW9sYXVzcWdpeGtvbnhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5MTY1MywiZXhwIjoyMDg4OTY3NjUzfQ.v2y8k-Y8bDn6VjYiF-mXopzEtit-nejxSZGgPgYMx_w'
--   ),
--   body := '{}'::jsonb
-- );
