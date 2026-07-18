import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRest() {
  // Let's insert a project with only the fields we know are safe (title, skill, budget, status)
  const { data, error } = await supabase.from('projects').insert([{
    title: 'Test Inspect Project',
    skill: 'Web Development',
    budget: 3500,
    status: 'open'
  }]).select();
  
  if (error) {
    console.error("Insert failed:", error.message);
  } else {
    console.log("Successfully inserted. Columns list:", Object.keys(data[0]));
    console.log("Row details:", data[0]);
    // Clean up
    await supabase.from('projects').delete().eq('id', data[0].id);
  }
}

checkRest();
