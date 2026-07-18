import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRest() {
  const response = await fetch(`${supabaseUrl}/rest/v1/projects`, {
    method: 'OPTIONS',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  });
  
  console.log("Status:", response.status);
  const text = await response.text();
  console.log("Response text length:", text.length);
  if (text.length > 0) {
    try {
      console.log(JSON.parse(text));
    } catch(e) {
      console.log("Raw Response:", text);
    }
  } else {
    // PostgREST options outputs columns in headers or OpenAPI format.
    // Let's print headers!
    for (let pair of response.headers.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  }
}

checkRest();
