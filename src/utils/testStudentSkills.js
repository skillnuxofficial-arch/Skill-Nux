import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data } = await supabase.from('students').select('*').limit(1);
  if (!data || data.length === 0) {
    console.log("No student found to test.");
    return;
  }

  const s = data[0];
  console.log("Testing array insertion for skills column...");
  const { error: err1 } = await supabase.from('students').update({
    skills: ['UI/UX Design', 'Web Development']
  }).eq('id', s.id);
  
  if (err1) {
    console.log("Array failed:", err1.message);
    
    console.log("Testing text/string insertion for skills column...");
    const { error: err2 } = await supabase.from('students').update({
      skills: 'UI/UX Design, Web Development'
    }).eq('id', s.id);
    
    if (err2) {
      console.log("Text failed:", err2.message);
    } else {
      console.log("Text/String insertion SUCCEEDED!");
    }
  } else {
    console.log("Array insertion SUCCEEDED!");
  }
}

check();
