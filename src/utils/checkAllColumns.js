import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzcbakrhhwdfkhvptmer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Y2Jha3JoaHdkZmtodnB0bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQzMzksImV4cCI6MjA5NDY1MDMzOX0.Opec2RvWcWorsIBDyo1MDSaeAgDf29J6X5pEeKXub68';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const candidateColumns = {
  projects: [
    'id', 'created_at', 'title', 'description', 'budget', 'status', 'business_id', 'student_id',
    'skill', 'skills', 'category', 'deadline', 'assigned_student_id', 'assigned_student_name',
    'business_email', 'assigned_student_email', 'submission_notes', 'submission_url', 'submitted_at',
    'revision_notes'
  ],
  reviews: [
    'id', 'created_at', 'project_id', 'rating', 'comment', 'student_id', 'business_id',
    'reviewer_id', 'reviewee_id', 'created_by', 'review_text'
  ],
  messages: [
    'id', 'created_at', 'project_id', 'sender_id', 'message', 'text', 'sender_email',
    'recipient_email', 'timestamp', 'content'
  ]
};

async function discover() {
  for (let [tableName, cols] of Object.entries(candidateColumns)) {
    console.log(`\nDiscovering columns for table: ${tableName}`);
    const activeCols = [];
    for (let col of cols) {
      const { error } = await supabase.from(tableName).select(col).limit(1);
      if (error && error.message.includes('schema cache')) {
        // Doesn't exist
      } else {
        activeCols.push(col);
      }
    }
    console.log(`Verified columns for ${tableName}:`, activeCols);
  }
}

discover();
