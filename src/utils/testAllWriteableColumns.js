import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  // Let's find or create a business
  let biz = null;
  const { data: bizData } = await supabase.from('businesses').select('*').limit(1);
  if (bizData && bizData.length > 0) {
    biz = bizData[0];
  } else {
    const { data: newBiz } = await supabase.from('businesses').insert([{
      business_name: 'Auth test biz',
      owner_name: 'Owner',
      email: 'auth_test@biz.com',
      phone: '9876543210',
      business_type: 'Design Agency',
      city: 'Delhi',
      password: 'password123'
    }]).select();
    biz = newBiz[0];
  }

  console.log("Biz email:", biz.email, "Biz ID:", biz.id);

  // Let's test inserting a project with both business_id AND business_email
  const proj = {
    title: 'Design Logo for brand',
    description: 'We need a highly skilled student designer.',
    budget: 2000,
    status: 'open',
    business_id: biz.id,
    business_email: biz.email,
    skill: 'Logo & Brand Design',
    category: 'Design & Creative',
    deadline: 'week'
  };

  const { data, error } = await supabase.from('projects').insert([proj]).select();
  if (error) {
    console.error("INSERT failed:", error.message);
  } else {
    console.log("INSERT succeeded!", data[0]);
    // Clean up
    await supabase.from('projects').delete().eq('id', data[0].id);
  }
}

run();
