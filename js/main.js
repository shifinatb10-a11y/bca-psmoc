async function startApp() {
  try {
    const { data, error } = await sb.auth.getUser();
    if (error) {
      console.error('Auth startup error:', error);
      alert('Authentication setup failed. Please refresh the page.');
    } else {
      state.user = data?.user || null;
      state.isAdmin = false;
      state.role = null;
      if (state.user) {
        const roleResult = await loadUserRole();
        if (!roleResult.ok && roleResult.reason === 'missing_role') {
          await sb.auth.signOut({ scope: 'local' });
          state.user = null;
          alert('Signed-in user is not configured in admin_users.');
        }
      }
    }
  } catch (err) {
    console.error('Startup auth check failed:', err);
    alert('Could not restore login session. Please try again.');
  } finally {
    await loadAll();
  }
}

sb.auth.onAuthStateChange(async (_event, session) => {
  state.user = session?.user || null;
  state.isAdmin = false;
  state.role = null;

  if (state.user) {
    const roleResult = await loadUserRole();
    if (!roleResult.ok && roleResult.reason === 'missing_role') {
      await sb.auth.signOut({ scope: 'local' });
      state.user = null;
    }
  }

  if (!canViewPage(state.page)) state.page = 'home';
  await loadAll();
});

startApp();
