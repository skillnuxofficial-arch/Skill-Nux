import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInserts() {
  const testCases = [
    { title: 'Test 1', business_email: 'test@biz.com' },
    { title: 'Test 2', business_id: '123' },
    { title: 'Test 3', student_id: '123' },
    { title: 'Test 4', assigned_student_email: 'student@test.com' },
    { title: 'Test 5', skill: 'UI/UX Design' },
    { title: 'Test 6', skills: ['UI/UX Design'] }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const item = testCases[i];
    console.log(`\nTesting case ${i + 1}:`, item);
    const { data, error } = await supabase.from('projects').insert([item]).select();
    if (error) {
      console.log(`Result: Failed - ${error.message}`);
    } else {
      console.log(`Result: Success! Columns:`, Object.keys(data[0]));
      // Clean up
      await supabase.from('projects').delete().eq('id', data[0].id);
    }
  }
}

testInserts();
