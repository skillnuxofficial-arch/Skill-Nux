import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  const { data: businesses, error: err1 } = await supabase.from('businesses').select('*').limit(1);
  if (err1) {
    console.error("Error fetching businesses:", err1);
  } else {
    console.log("Business columns:", businesses.length > 0 ? Object.keys(businesses[0]) : "No businesses found");
  }

  // Insert dummy project to see columns if allowed
  const dummyProject = {
    title: 'Dummy Project',
    skill: 'Web Development',
    budget: 5000,
    description: 'Dummy',
    deadline: 'week',
    status: 'open',
    business_email: 'dummy@business.com'
  };

  const { data: inserted, error: err2 } = await supabase.from('projects').insert([dummyProject]).select();
  if (err2) {
    console.log("Insert failed:", err2.message);
  } else {
    console.log("Dummy insert succeeded. Columns:", Object.keys(inserted[0]));
    // Clean up
    await supabase.from('projects').delete().eq('id', inserted[0].id);
  }
}

checkTables();
