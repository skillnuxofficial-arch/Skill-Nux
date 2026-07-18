import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data: bizData } = await supabase.from('businesses').select('*').limit(1);
  console.log("Biz row count:", bizData ? bizData.length : 0);
  if (!bizData || bizData.length === 0) {
    console.log("No business found. Creating a test business...");
    const { data: newBiz, error: bizErr } = await supabase.from('businesses').insert([{
      business_name: 'Test Biz',
      owner_name: 'Test Owner',
      email: 'test@biz.com',
      phone: '1234567890',
      business_type: 'Tech',
      city: 'Delhi',
      password: 'password123'
    }]).select();
    if (bizErr) {
      console.error("Failed to create business:", bizErr.message);
      return;
    }
    console.log("Created business:", newBiz[0]);
    bizData.push(newBiz[0]);
  }

  const bizId = bizData[0].id;
  console.log("Using business ID:", bizId);

  // Let's try inserting a project with various combinations
  const cols = [
    { title: 'Project Title', budget: 1000, status: 'open', business_id: bizId },
    { title: 'Project Title', budget: 1000, status: 'open', business_id: bizId, description: 'hello' },
    { title: 'Project Title', budget: 1000, status: 'open', business_id: bizId, skill_needed: 'Design' },
    { title: 'Project Title', budget: 1000, status: 'open', business_id: bizId, category: 'Design' },
    { title: 'Project Title', budget: 1000, status: 'open', business_id: bizId, skills: ['Design'] }
  ];

  for (let item of cols) {
    console.log("\nTesting insert with columns:", Object.keys(item));
    const { data, error } = await supabase.from('projects').insert([item]).select();
    if (error) {
      console.log("Error:", error.message);
    } else {
      console.log("SUCCESS! Columns:", Object.keys(data[0]));
      console.log("Row values:", data[0]);
      // Clean up
      await supabase.from('projects').delete().eq('id', data[0].id);
    }
  }
}

test();
