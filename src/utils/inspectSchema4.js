import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRest() {
  // Let's call supabase rest endpoint or RPC to see open schema
  // In PostgREST, we can request /rest/v1/ with a OPTIONS request
  const response = await fetch(`${supabaseUrl}/rest/v1/projects`, {
    method: 'OPTIONS',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log("Projects Table Schema Details:", data);
  } else {
    console.log("OPTIONS request failed:", response.status, response.statusText);
  }
}

checkRest();
