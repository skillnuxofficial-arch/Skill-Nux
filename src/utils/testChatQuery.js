import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const myEmail = 'student@test.com';
  const peerEmail = 'biz@test.com';

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_email.eq.${myEmail},recipient_email.eq.${peerEmail}),and(sender_email.eq.${peerEmail},recipient_email.eq.${myEmail})`)
    .order('created_at', { ascending: true })
    .limit(10);

  if (error) {
    console.error("OR/AND query failed:", error.message);
  } else {
    console.log("OR/AND query succeeded! Messages found:", data.length);
  }
}

check();
