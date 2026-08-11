function renderShell(activePage) {
  requireAuth();
  const user = getUser() || {};

  document.getElementById('topbar').innerHTML = `
    <button class="mobile-toggle" id="sidebarToggle">☰</button>
    <div class="brand">📦 Track<span>ify</span></div>
    <div class="searchbox">
      <span>🔎</span>
      <input type="text" id="globalSearch" placeholder="Search products..." />
    </div>
    <div class="topbar-right">
      <a href="index.html?add=1" class="btn btn-primary btn-sm">+ Add Product</a>
      <div class="user-chip" id="userChip">
        <div class="avatar">${initials(user.name)}</div>
        <div>
          <div>${user.name || 'User'}</div>
        </div>
        <span class="role-badge">${user.role || 'user'}</span>
      </div>
    </div>
  `;

  const isAdmin = user.role === 'admin';

  document.getElementById('sidebar').innerHTML = `
    <h4>Menu</h4>
    <div class="nav-link ${activePage === 'dashboard' ? 'active' : ''}" onclick="location.href='index.html'">📊 Dashboard</div>
    <div class="nav-link ${activePage === 'products' ? 'active' : ''}" onclick="location.href='products.html'">📦 All Products</div>
    <div class="nav-link ${activePage === 'suppliers' ? 'active' : ''}" onclick="location.href='suppliers.html'">🏭 Suppliers</div>
    <div class="nav-link ${activePage === 'movements' ? 'active' : ''}" onclick="location.href='movements.html'">📋 Stock History</div>
    ${isAdmin ? `<div class="nav-link ${activePage === 'users' ? 'active' : ''}" onclick="location.href='users.html'">👥 Users</div>` : ''}
    <div id="sidebarCategories"></div>
    <div class="nav-divider"></div>
    <div class="nav-link" onclick="logout()">🚪 Logout</div>
  `;

  document.getElementById('userChip').addEventListener('click', () => {
    if (confirm('Log out of Trackify?')) logout();
  });

  const toggle = document.getElementById('sidebarToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
  }

  const search = document.getElementById('globalSearch');
  if (search) {
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && search.value.trim()) {
        window.location.href = `products.html?search=${encodeURIComponent(search.value.trim())}`;
      }
    });
  }
}

async function renderSidebarCategories(activeCategory) {
  const el = document.getElementById('sidebarCategories');
  if (!el) return;
  try {
    const { categories } = await api('/categories');
    const totalCount = categories.reduce((s, c) => s + c.productCount, 0);
    let html = `<h4 style="margin-top:16px">Categories</h4>`;
    html += `<div class="nav-link ${!activeCategory || activeCategory === 'All' ? 'active' : ''}" onclick="location.href='products.html'">🛍 All <span class="cat-count">${totalCount}</span></div>`;
    categories.forEach((c) => {
      html += `<div class="nav-link ${activeCategory === c.name ? 'active' : ''}" onclick="location.href='products.html?category=${encodeURIComponent(c.name)}'">${c.icon} ${c.name} <span class="cat-count">${c.productCount}</span></div>`;
    });
    el.innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}
