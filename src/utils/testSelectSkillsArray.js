import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const skillVal = 'UI/UX Design';
  
  // Try querying using .contains
  const { data, error } = await supabase
    .from('students')
    .select('id, name, skills')
    .contains('skills', [skillVal])
    .limit(5);

  if (error) {
    console.error("Query failed:", error.message);
  } else {
    console.log("Query succeeded! Found rows matching skills array:", data.length);
    if (data.length > 0) {
      console.log("Row example:", data[0]);
    }
  }
}

check();
