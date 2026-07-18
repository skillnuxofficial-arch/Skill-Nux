import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRest() {
  const { data, error } = await supabase.from('projects').select('*').limit(5);
  if (error) {
    console.error("Select failed:", error.message);
  } else {
    console.log("Successfully fetched. Total rows:", data.length);
    if (data.length > 0) {
      console.log("Columns present in projects:", Object.keys(data[0]));
      console.log("Row contents:", data[0]);
    }
  }
}

checkRest();
