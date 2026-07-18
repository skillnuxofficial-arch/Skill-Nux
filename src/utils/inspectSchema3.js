import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findColumns() {
  // Let's perform a select * from projects limit 0 to read metadata columns
  const { data, error } = await supabase.from('projects').select('*').limit(0);
  if (error) {
    console.error("Error fetching projects metadata:", error);
  } else {
    // If empty array, does it contain columns or how do we obtain fields?
    // Let's try inserting a completely empty object or check error messages
    const { error: err2 } = await supabase.from('projects').insert([{}]).select();
    console.log("Empty insert error:", err2 ? err2.message : "Succeeded!");
  }
}

findColumns();
