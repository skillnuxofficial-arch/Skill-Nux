import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const skillVal = 'UI/UX Design';
  const { data, error } = await supabase
    .from('students')
    .select('id, name, skill, skills')
    .or(`skill.eq."${skillVal}",skills.cs.{"${skillVal}"}`)
    .limit(5);

  if (error) {
    console.error("OR query failed:", error.message);
  } else {
    console.log("OR query succeeded! Found rows:", data.length);
    if (data.length > 0) {
      console.log("Example:", data[0]);
    }
  }
}

check();
