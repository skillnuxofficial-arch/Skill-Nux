import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const colsToTest = [
  'skill_id', 'project_type', 'category_id', 'requirements', 'whatsapp', 'phone', 'email',
  'gig_type', 'work_type', 'job_type', 'skills_needed', 'required_skills'
];

async function check() {
  for (let col of colsToTest) {
    const { error } = await supabase.from('projects').select(col).limit(1);
    if (error && error.code === '42703') {
      // Column does not exist
    } else if (error) {
      console.log(`Column ${col}: ${error.message} (${error.code})`);
    } else {
      console.log(`Column ${col}: SUCCESS`);
    }
  }
}

check();
