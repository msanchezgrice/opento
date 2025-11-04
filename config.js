// Configuration for Opento
// In production, reads from Vercel environment variables

const config = {
  clerk: {
    // Use environment variable if available (Vercel), otherwise fallback to hardcoded key
    publishableKey: window.ENV_CLERK_PUBLISHABLE_KEY || 'pk_live_Y2xlcmsub3BlbnRvLmNvJA'
  },
  supabase: {
    // Use environment variables if available (Vercel), otherwise fallback to hardcoded values
    url: window.ENV_SUPABASE_URL || 'https://axoycualmoxyqizjkuof.supabase.co',
    anonKey: window.ENV_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4b3ljdWFsbW94eXFpemprdW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODQxNjQsImV4cCI6MjA3Nzg2MDE2NH0.nJvFmXz07m4jquKqKbZxAWZV-aY6vh6KUeiBG46Aazg'
  },
  app: {
    url: window.location.origin
  }
};

// Export for use in other files
window.opentoConfig = config;
