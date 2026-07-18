import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const msgCols = ['id', 'created_at', 'project_id', 'sender_id', 'message', 'text', 'sender_email', 'recipient_email', 'timestamp', 'content'];
const revCols = ['id', 'created_at', 'project_id', 'rating', 'comment', 'student_id', 'business_id', 'reviewer_id', 'reviewee_id', 'created_by', 'review_text'];

async function check() {
  console.log("--- MESSAGES ---");
  for (let col of msgCols) {
    const { error } = await supabase.from('messages').select(col).limit(1);
    if (error) {
      console.log(`Column ${col}: ${error.message} (${error.code})`);
    } else {
      console.log(`Column ${col}: SUCCESS`);
    }
  }

  console.log("\n--- REVIEWS ---");
  for (let col of revCols) {
    const { error } = await supabase.from('reviews').select(col).limit(1);
    if (error) {
      console.log(`Column ${col}: ${error.message} (${error.code})`);
    } else {
      console.log(`Column ${col}: SUCCESS`);
    }
  }
}

check();
