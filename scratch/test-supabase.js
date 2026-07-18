import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  try {
    const { data, error } = await supabase.from('students').select('*').limit(1);
    console.log('Success!', data, error);
  } catch (e) {
    console.error('Error!', e);
  }
}

test();
