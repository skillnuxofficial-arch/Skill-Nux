import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  // Let's create a test business
  const { data: bizData } = await supabase.from('businesses').select('*').limit(1);
  const bizId = bizData[0].id;
  
  // Try inserting a message
  console.log("Inserting a message into messages table...");
  const dummyMsg = {
    project_id: 'b302a0d7-7672-4c74-8a3c-d60cb81a94bf', // Use business ID as mock project UUID
    sender_id: bizId,
    message: 'Hello, this is a test message!'
  };

  const { data, error } = await supabase.from('messages').insert([dummyMsg]).select();
  if (error) {
    console.error("Message insert failed:", error.message);
  } else {
    console.log("Message insert succeeded! Row:", data[0]);
    // Clean up
    await supabase.from('messages').delete().eq('id', data[0].id);
  }
}

check();
