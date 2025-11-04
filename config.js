// Configuration for Opento
// In production, these should come from environment variables

const config = {
  clerk: {
    publishableKey: 'pk_live_Y2xlcmsub3BlbnRvLmNvJA'
  },
  supabase: {
    url: 'https://axoycualmoxygizjkuof.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4b3ljdWFsbW94eXFpemprdW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODQxNjQsImV4cCI6MjA3Nzg2MDE2NH0.nJvFmXz07m4jquKqKbZxAWZV-aY6vh6KUeiBG46Aazg'
  },
  app: {
    url: window.location.origin
  }
};

// Export for use in other files
window.opentoConfig = config;
