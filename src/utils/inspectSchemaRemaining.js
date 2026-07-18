import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Checking tables...");
  
  const { data: mData, error: mErr } = await supabase.from('messages').select('*').limit(1);
  if (mErr) {
    console.error("Messages error:", mErr.message);
  } else {
    console.log("Messages columns:", mData.length > 0 ? Object.keys(mData[0]) : "Empty table, but exists!");
  }

  const { data: rData, error: rErr } = await supabase.from('reviews').select('*').limit(1);
  if (rErr) {
    console.error("Reviews error:", rErr.message);
  } else {
    console.log("Reviews columns:", rData.length > 0 ? Object.keys(rData[0]) : "Empty table, but exists!");
  }
}

check();
