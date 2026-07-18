import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const bizId = 'b302a0d7-7672-4c74-8a3c-d60cb81a94bf'; // Valid business UUID
  
  const potentialCols = [
    'skill', 'skills', 'skill_needed', 'required_skill', 'project_skill', 'category', 'tags', 'type', 'role', 'work_needed',
    'student_skill', 'subject', 'industry', 'service', 'task', 'job_type', 'gig_type'
  ];

  for (let col of potentialCols) {
    const item = { title: 'Test Col', budget: 1000, status: 'open', business_id: bizId };
    item[col] = 'UI/UX Design';
    const { error } = await supabase.from('projects').insert([item]).select();
    if (error && error.message.includes('schema cache')) {
      // Column does NOT exist
    } else {
      console.log(`Column '${col}' EXISTS! Result:`, error ? error.message : 'SUCCESS');
    }
  }
}

test();
