import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://hwsokdbbjjtiwscldbpr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3c29rZGJiamp0aXdzY2xkYnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTAzOTgsImV4cCI6MjA4OTA4NjM5OH0.PV-f9KCQzlPm5stTxFOSN4sVJDRKqZnqKnFZ6qHWECk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;