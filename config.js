// Configuration for Opento
// Note: For static sites, Vercel env vars aren't available in browser
// These values are safe to expose (publishable key is public, anon key is public)

const config = {
  clerk: {
    publishableKey: 'pk_live_Y2xlcmsub3BlbnRvLmNvJA'
  },
  supabase: {
    url: 'https://axoycualmoxyqizjkuof.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4b3ljdWFsbW94eXFpemprdW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODQxNjQsImV4cCI6MjA3Nzg2MDE2NH0.nJvFmXz07m4jquKqKbZxAWZV-aY6vh6KUeiBG46Aazg'
  },
  app: {
    url: window.location.origin
  }
};

// Export for use in other files
window.opentoConfig = config;
