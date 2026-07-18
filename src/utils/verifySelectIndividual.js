import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const cols = [
  'id', 'created_at', 'title', 'description', 'budget', 'status', 'business_id', 'student_id',
  'skill', 'skills', 'category', 'deadline', 'assigned_student_id', 'assigned_student_name',
  'business_email', 'assigned_student_email', 'submission_notes', 'submission_url', 'submitted_at',
  'revision_notes'
];

async function check() {
  for (let col of cols) {
    const { error } = await supabase.from('projects').select(col).limit(1);
    if (error) {
      console.log(`Column ${col}: ${error.message} (${error.code})`);
    } else {
      console.log(`Column ${col}: SUCCESS`);
    }
  }
}

check();
