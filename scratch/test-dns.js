import dns from 'dns';

dns.resolve('google.com', (err, addresses) => {
  if (err) {
    console.error('google.com lookup failed:', err);
  } else {
    console.log('google.com lookup success:', addresses);
  }
});

dns.resolve('mzcbakrhhwdfkhvptmer.supabase.co', (err, addresses) => {
  if (err) {
    console.error('supabase lookup failed:', err);
  } else {
    console.log('supabase lookup success:', addresses);
  }
});
