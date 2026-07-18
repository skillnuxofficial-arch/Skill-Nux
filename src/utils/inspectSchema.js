import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  const { data, error } = await supabase.from('projects').select('*').limit(1);
  if (error) {
    console.error("Error fetching projects:", error);
  } else {
    console.log("Project columns:", data.length > 0 ? Object.keys(data[0]) : "No projects found to inspect columns");
  }
  
  const { data: students, error: err2 } = await supabase.from('students').select('*').limit(1);
  if (err2) {
    console.error("Error fetching students:", err2);
  } else {
    console.log("Student columns:", students.length > 0 ? Object.keys(students[0]) : "No students found");
  }
}

inspect();
