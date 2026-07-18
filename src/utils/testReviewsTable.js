import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Inserting a review into reviews table...");
  const dummyReview = {
    project_id: 'b302a0d7-7672-4c74-8a3c-d60cb81a94bf', // Mock project UUID
    rating: 5,
    comment: 'Great work! Highly recommended student!'
  };

  const { data, error } = await supabase.from('reviews').insert([dummyReview]).select();
  if (error) {
    console.error("Review insert failed:", error.message);
  } else {
    console.log("Review insert succeeded! Row:", data[0]);
    // Clean up
    await supabase.from('reviews').delete().eq('id', data[0].id);
  }
}

check();
