document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/api/auth/me');
  const authData = await res.json();
  if (!authData.authenticated) {
    window.location.href = '/login.html';
    return;
  }

  loadSuppliers();
  fetchProducts();
});

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login.html';
}

async function fetchProducts() {
  const search = document.getElementById('searchInput').value;
  const supplierId = document.getElementById('supplierFilter').value;

  try {
    const res = await fetch(`/api/products?search=${encodeURIComponent(search)}&supplierId=${supplierId}`);
    const data = await res.json();

    if (data.success) {
      renderProductsTable(data.data);
      updateKPIs(data.data);
    }
  } catch (err) {
    console.error('Error fetching products:', err);
  }
}

// Renders product list and highlights stock < 5 in red
function renderProductsTable(products) {
  const tbody = document.getElementById('productTableBody');
  tbody.innerHTML = '';

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No products found.</td></tr>`;
    return;
  }

  products.forEach(p => {
    const isLowStock = p.quantity < 5;
    const rowClass = isLowStock ? 'low-stock-row' : '';

    const row = `
      <tr class="${rowClass}">
        <td><img src="${p.imageUrl}" alt="${p.name}" width="40" height="40" class="rounded object-fit-cover" /></td>
        <td class="fw-semibold">${p.name}</td>
        <td>${p.supplier ? p.supplier.name : 'N/A'}</td>
        <td>$${p.price.toFixed(2)}</td>
        <td><strong>${p.quantity}</strong></td>
        <td>
          ${isLowStock 
            ? '<span class="badge bg-danger">Low Stock Alert</span>' 
            : '<span class="badge bg-success">In Stock</span>'}
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" onclick="viewProduct('${p._id}')">View Details</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// View Single Product Modal
async function viewProduct(id) {
  try {
    const res = await fetch(`/api/products/${id}`);
    const result = await res.json();
    if (result.success) {
      const p = result.data;
      document.getElementById('viewImage').src = p.imageUrl;
      document.getElementById('viewName').textContent = p.name;
      document.getElementById('viewDescription').textContent = p.description || 'No description.';
      document.getElementById('viewPrice').textContent = `$${p.price.toFixed(2)}`;
      document.getElementById('viewQuantity').textContent = `${p.quantity} units`;
      document.getElementById('viewSupplier').textContent = p.supplier ? `${p.supplier.name} (${p.supplier.email})` : 'N/A';

      const modal = new bootstrap.Modal(document.getElementById('viewModal'));
      modal.show();
    }
  } catch (err) {
    console.error(err);
  }
}

// Submit Product Form
async function handleProductSubmit(e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append('name', document.getElementById('prodName').value);
  formData.append('description', document.getElementById('prodDescription').value);
  formData.append('price', document.getElementById('prodPrice').value);
  formData.append('quantity', document.getElementById('prodQuantity').value);
  formData.append('supplier', document.getElementById('prodSupplier').value);
  formData.append('image', document.getElementById('prodImage').files[0]);

  try {
    const res = await fetch('/api/products', { method: 'POST', body: formData });
    const data = await res.json();

    if (data.success) {
      location.reload();
    } else {
      const errorDiv = document.getElementById('productError');
      errorDiv.textContent = data.error;
      errorDiv.classList.remove('d-none');
    }
  } catch (err) {
    console.error(err);
  }
}

// Submit Supplier Form
async function handleSupplierSubmit(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('suppName').value,
    email: document.getElementById('suppEmail').value,
    phone: document.getElementById('suppPhone').value
  };

  try {
    const res = await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      location.reload();
    } else {
      const errorDiv = document.getElementById('supplierError');
      errorDiv.textContent = data.error;
      errorDiv.classList.remove('d-none');
    }
  } catch (err) {
    console.error(err);
  }
}

// Populate Supplier Options
async function loadSuppliers() {
  try {
    const res = await fetch('/api/suppliers');
    const result = await res.json();
    if (result.success) {
      const filterSelect = document.getElementById('supplierFilter');
      const formSelect = document.getElementById('prodSupplier');

      result.data.forEach(s => {
        filterSelect.innerHTML += `<option value="${s._id}">${s.name}</option>`;
        formSelect.innerHTML += `<option value="${s._id}">${s.name}</option>`;
      });
    }
  } catch (err) {
    console.error(err);
  }
}

// Update Top Dashboard Counters
function updateKPIs(products) {
  const totalVal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const lowCount = products.filter(p => p.quantity < 5).length;

  document.getElementById('kpiTotalValue').textContent = `$${totalVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  document.getElementById('kpiLowStock').textContent = lowCount;
  document.getElementById('kpiTotalProducts').textContent = products.length;
}