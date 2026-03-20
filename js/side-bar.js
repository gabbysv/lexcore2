const NAV_ITEMS = {
  admin:    [{ label: 'Dashboard', href: 'dashboard-admin.html', icon: '⊞' }, { label: 'Cases', href: 'cases.html', icon: '⊟' }, { label: 'Documents', href: 'documents.html', icon: '⊡' }, { label: 'Messages', href: 'messages.html', icon: '◷' }],
  attorney: [{ label: 'Dashboard', href: 'dashboard-attorney.html', icon: '⊞' }, { label: 'My Cases', href: 'cases.html', icon: '⊟' }, { label: 'Documents', href: 'documents.html', icon: '⊡' }, { label: 'Messages', href: 'messages.html', icon: '◷' }],
  staff:    [{ label: 'Dashboard', href: 'dashboard-staff.html', icon: '⊞' }, { label: 'Cases', href: 'cases.html', icon: '⊟' }, { label: 'Documents', href: 'documents.html', icon: '⊡' }, { label: 'Upload', href: 'upload.html', icon: '↑' }],
  client:   [{ label: 'Dashboard', href: 'dashboard-client.html', icon: '⊞' }, { label: 'My Case', href: 'cases.html', icon: '⊟' }, { label: 'Documents', href: 'documents.html', icon: '⊡' }, { label: 'Messages', href: 'messages.html', icon: '◷' }],
};
function buildSidebar(profile) {
  const container = document.getElementById('sidebar-container');
  if (!container) return;
  const items = NAV_ITEMS[profile.role] || [];
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = items.map(item => `<a href="${item.href}" class="${item.href === currentPage ? 'active' : ''}">${item.icon} ${item.label}</a>`).join('');
  container.innerHTML = `<aside class="sidebar"><div class="sidebar-logo">LexCore<span>${profile.firm_name || 'Law Firm'}</span></div><nav class="sidebar-nav">${navLinks}</nav><div class="sidebar-footer"><strong>${profile.full_name || 'User'}</strong><span class="badge badge-${profile.role}" style="margin-top:6px;">${profile.role}</span><br/><br/><button class="btn btn-secondary btn-sm" style="width:100%;margin-top:8px;" data-action="logout">Sign out</button></div></aside>`;
  container.querySelector('[data-action="logout"]').addEventListener('click', async () => {
    const { default: supabase } = await import('./supabase.js');
    await supabase.auth.signOut();
    window.location.href = '/pages/login.html';
  });
}
document.addEventListener('authReady', () => { buildSidebar(window.currentProfile); });