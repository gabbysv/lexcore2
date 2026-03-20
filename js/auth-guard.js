// ============================================================
//  auth-guard.js â€” Paste ONE script tag on every protected page
//
//  What it does:
//  1. Checks if a user is logged in (has a Supabase session)
//  2. If NOT logged in â†’ sends them to login.html immediately
//  3. If logged in â†’ checks their role and makes sure they're
//     allowed to view THIS specific page
//
//  Usage: Add this to the <head> of every protected HTML page:
//  <script type="module" src="../js/auth-guard.js"></script>
//
//  Then at the bottom of each page's own script, call:
//  window.currentUser and window.currentProfile to access user data
// ============================================================

import supabase from './supabase.js';

// Which roles are allowed on which pages?
// Add more pages here as you build them
const PAGE_ROLES = {
  'dashboard-admin.html':    ['admin'],
  'dashboard-attorney.html': ['attorney'],
  'dashboard-staff.html':    ['staff'],
  'dashboard-client.html':   ['client'],
  'cases.html':              ['admin', 'attorney', 'staff'],
  'documents.html':          ['admin', 'attorney', 'staff', 'client'],
  'messages.html':           ['admin', 'attorney', 'staff', 'client'],
  'upload.html':             ['admin', 'attorney', 'staff'],
};

async function checkAuth() {
  // Get the current logged-in session from Supabase
  const { data: { session } } = await supabase.auth.getSession();

  // No session = not logged in â†’ redirect to login
  if (!session) {
    window.location.href = '/pages/login.html';
    return;
  }

  // We have a session â€” now fetch this user's profile (name, role, firm)
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !profile) {
    // Profile not found = something went wrong â†’ log them out and redirect
    await supabase.auth.signOut();
    window.location.href = '/pages/login.html';
    return;
  }

  // Check if this role is allowed on this page
  const currentPage = window.location.pathname.split('/').pop();
  const allowedRoles = PAGE_ROLES[currentPage];

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    // Wrong role for this page â†’ send them to their own dashboard
    redirectToDashboard(profile.role);
    return;
  }

  // All good! Store user info on window so every page can access it
  window.currentUser    = session.user;
  window.currentProfile = profile;

  // Dispatch an event so the page knows auth is ready
  document.dispatchEvent(new Event('authReady'));
}

function redirectToDashboard(role) {
  const dashboards = {
    admin:    '/pages/dashboard-admin.html',
    attorney: '/pages/dashboard-attorney.html',
    staff:    '/pages/dashboard-staff.html',
    client:   '/pages/dashboard-client.html',
  };
  window.location.href = dashboards[role] || '/pages/login.html';
}

// Run the check immediately when this script loads
checkAuth();
