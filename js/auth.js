// ============================================================
//  auth.js â€” Handles login and logout
//  Only used on login.html (not on other pages)
// ============================================================

import supabase from './supabase.js';

// â”€â”€ LOGIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Call this when the login form is submitted
async function login(email, password) {
  showMessage('Signing you inâ€¦', 'info');

  const { data, error } = await supabase.auth.signInWithPassword({
    email:    email.trim(),
    password: password,
  });

  if (error) {
    showMessage('Login failed: ' + error.message, 'error');
    return;
  }

  // Login worked â€” now fetch the user's profile to find their role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    showMessage('Account setup incomplete. Please contact your admin.', 'error');
    return;
  }

  // Send user to the right dashboard based on their role
  redirectToDashboard(profile.role);
}

// â”€â”€ LOGOUT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Call this from a "Sign Out" button on any page
async function logout() {
  await supabase.auth.signOut();
  window.location.href = '/pages/login.html';
}

// â”€â”€ HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function redirectToDashboard(role) {
  const dashboards = {
    admin:    '/pages/dashboard-admin.html',
    attorney: '/pages/dashboard-attorney.html',
    staff:    '/pages/dashboard-staff.html',
    client:   '/pages/dashboard-client.html',
  };
  window.location.href = dashboards[role] || '/pages/login.html';
}

function showMessage(text, type) {
  const el = document.getElementById('auth-message');
  if (!el) return;
  el.textContent = text;
  el.className   = 'auth-message ' + type; // style these in CSS
  el.style.display = 'block';
}

// â”€â”€ WIRE UP THE FORM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Runs when the DOM is ready (login.html must have a form with id="login-form")
document.addEventListener('DOMContentLoaded', () => {
  // If user is already logged in, send them to their dashboard right away
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      supabase.from('profiles').select('role').eq('id', session.user.id).single()
        .then(({ data }) => { if (data) redirectToDashboard(data.role); });
    }
  });

  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // stop the page from refreshing
    const email    = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
  });

  // Wire up logout buttons anywhere on the page (if any)
  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', logout);
  });
});

// Export logout so other scripts can call it
export { logout };
