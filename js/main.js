async function startApp() {
  state.loading = true;
  render();

  const {
    data: { user }
  } = await sb.auth.getUser();

  state.user = user || null;
  await loadUserRole();

  if (!canViewPage(state.page)) state.page = 'home';

  await loadAll();
}

sb.auth.onAuthStateChange(async (_event, session) => {
  state.user = session?.user || null;
  await loadUserRole();

  if (!canViewPage(state.page)) state.page = 'home';

  state.loading = true;
  render();
  await loadAll();
});

startApp();
