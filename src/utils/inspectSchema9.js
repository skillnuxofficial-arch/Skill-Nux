import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRest() {
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'GET',
    headers: {
      'apikey': supabaseAnonKey
    }
  });
  
  if (response.ok) {
    const text = await response.text();
    console.log("Returned size:", text.length);
    const data = JSON.parse(text);
    if (data.definitions) {
      console.log("Def Keys:", Object.keys(data.definitions));
      console.log("Projects Schema properties:", data.definitions.projects ? data.definitions.projects.properties : "None");
    }
  } else {
    const text = await response.text();
    console.log("GET OpenAPI failed:", response.status, response.statusText, "Body:", text);
  }
}

checkRest();
