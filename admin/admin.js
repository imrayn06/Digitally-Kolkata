/* ==========================================================================
   DIGITALLY KOLKATA - ADMIN LOGIC ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Live Clock
  const clock = document.getElementById('currentTime');
  function updateClock() {
    if (clock) {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString('en-IN', { hour12: true });
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 2. Authentication Logic
  const loginOverlay = document.getElementById('loginOverlay');
  const adminApp = document.getElementById('adminApp');
  const loginForm = document.getElementById('loginForm');
  const adminPassInput = document.getElementById('adminPass');
  const loginError = document.getElementById('loginError');
  const rememberMe = document.getElementById('rememberMe');
  const togglePassBtn = document.getElementById('togglePassBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  function getSavedPasscode() {
    return localStorage.getItem('dk_admin_pass') || 'admin';
  }

  function checkSession() {
    const isAuth = sessionStorage.getItem('dk_auth') === 'true' || localStorage.getItem('dk_auth') === 'true';
    if (isAuth) {
      loginOverlay.classList.remove('active');
      adminApp.style.display = 'flex';
      loadAllData();
    } else {
      loginOverlay.classList.add('active');
      adminApp.style.display = 'none';
    }
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = adminPassInput.value.trim();
    const correct = getSavedPasscode();

    if (entered === correct) {
      loginError.classList.remove('visible');
      if (rememberMe.checked) {
        localStorage.setItem('dk_auth', 'true');
      } else {
        sessionStorage.setItem('dk_auth', 'true');
      }
      loginOverlay.classList.remove('active');
      adminApp.style.display = 'flex';
      loadAllData();
      showToast('Welcome back to Digitally Kolkata Control Panel!');
    } else {
      loginError.classList.add('visible');
      adminPassInput.focus();
    }
  });

  if (togglePassBtn) {
    togglePassBtn.addEventListener('click', () => {
      adminPassInput.type = adminPassInput.type === 'password' ? 'text' : 'password';
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('dk_auth');
      sessionStorage.removeItem('dk_auth');
      window.location.reload();
    });
  }

  // 3. Navigation / Tab Switching
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanes = document.querySelectorAll('.admin-tab-pane');
  const tabHeaderTitle = document.getElementById('tabHeaderTitle');
  const tabHeaderSubtitle = document.getElementById('tabHeaderSubtitle');

  const tabTitles = {
    'tab-overview': { title: 'Overview & Client Leads', subtitle: 'Real-time inquiries and project requests captured from your website.' },
    'tab-services': { title: 'Services & Pricing Architecture', subtitle: 'Configure base rates powering your interactive quote calculator.' },
    'tab-agency': { title: 'Business Profile & Contacts', subtitle: 'Manage your WhatsApp number, phone, email, and Kolkata headquarters.' },
    'tab-portfolio': { title: 'Portfolio & Case Studies', subtitle: 'Showcase your client work, performance metrics, and deliverables.' },
    'tab-settings': { title: 'Security & Infrastructure', subtitle: 'Manage your admin credentials and review cloud hosting metrics.' }
  };

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.dataset.tab;
      navItems.forEach(n => n.classList.remove('active'));
      tabPanes.forEach(t => t.classList.remove('active'));

      item.classList.add('active');
      const pane = document.getElementById(targetTab);
      if (pane) pane.classList.add('active');

      if (tabTitles[targetTab]) {
        tabHeaderTitle.textContent = tabTitles[targetTab].title;
        tabHeaderSubtitle.textContent = tabTitles[targetTab].subtitle;
      }
    });
  });

  // 4. Leads Management
  const leadsTableBody = document.getElementById('leadsTableBody');
  const totalLeadsCount = document.getElementById('totalLeadsCount');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const clearLeadsBtn = document.getElementById('clearLeadsBtn');

  function renderLeads() {
    const leads = JSON.parse(localStorage.getItem('dk_leads') || '[]');
    totalLeadsCount.textContent = leads.length;

    if (leads.length === 0) {
      leadsTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            No inquiries recorded yet. When clients submit inquiries on your site, they appear here instantly.
          </td>
        </tr>
      `;
      return;
    }

    leadsTableBody.innerHTML = leads.map(l => {
      const date = new Date(l.timestamp).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      const cleanPhone = (l.phone || '').replace(/[^0-9]/g, '');
      const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : '#';

      return `
        <tr>
          <td>${date}</td>
          <td><strong>${escapeHtml(l.name)}</strong></td>
          <td>
            <div>${escapeHtml(l.email)}</div>
            <small style="color: #9CA3AF">${escapeHtml(l.phone)}</small>
          </td>
          <td><span class="badge-service">${escapeHtml(l.interest || 'General')}</span></td>
          <td style="max-width: 280px; white-space: pre-wrap; font-size: 12px;">${escapeHtml(l.message || '-')}</td>
          <td>
            <div class="lead-actions">
              ${cleanPhone ? `<a href="${waLink}" target="_blank" class="btn-chat-wa">💬 WhatsApp</a>` : ''}
              <a href="mailto:${escapeHtml(l.email)}" class="btn-secondary-sm" style="padding: 4px 8px; font-size: 11px;">✉️ Email</a>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Export Leads to CSV
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const leads = JSON.parse(localStorage.getItem('dk_leads') || '[]');
      if (leads.length === 0) {
        showToast('No inquiries to export.');
        return;
      }

      let csv = 'Date,Name,Email,Phone,Service,Message\n';
      leads.forEach(l => {
        csv += `"${l.timestamp}","${l.name}","${l.email}","${l.phone}","${l.interest}","${(l.message || '').replace(/"/g, '""')}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Digitally_Kolkata_Leads_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('CSV Exported successfully!');
    });
  }

  // Clear Leads
  if (clearLeadsBtn) {
    clearLeadsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all inquiries?')) {
        localStorage.removeItem('dk_leads');
        renderLeads();
        showToast('All leads cleared.');
      }
    });
  }

  // 5. Pricing Settings
  const savePricingBtn = document.getElementById('savePricingBtn');
  function loadPricing() {
    const pricing = JSON.parse(localStorage.getItem('dk_pricing') || '{}');
    if (pricing.branding) document.getElementById('priceBranding').value = pricing.branding;
    if (pricing.uiux) document.getElementById('priceUiux').value = pricing.uiux;
    if (pricing.webdev) document.getElementById('priceWebdev').value = pricing.webdev;
    if (pricing.seo) document.getElementById('priceSeo').value = pricing.seo;
    if (pricing.photo) document.getElementById('pricePhoto').value = pricing.photo;
  }

  if (savePricingBtn) {
    savePricingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const pricing = {
        branding: document.getElementById('priceBranding').value,
        uiux: document.getElementById('priceUiux').value,
        webdev: document.getElementById('priceWebdev').value,
        seo: document.getElementById('priceSeo').value,
        photo: document.getElementById('pricePhoto').value
      };
      localStorage.setItem('dk_pricing', JSON.stringify(pricing));
      showToast('Pricing updated successfully!');
    });
  }

  // 6. Agency Business Info
  const saveAgencyBtn = document.getElementById('saveAgencyBtn');
  function loadAgencyInfo() {
    const info = JSON.parse(localStorage.getItem('dk_agency_info') || '{}');
    if (info.name) document.getElementById('agencyName').value = info.name;
    if (info.tagline) document.getElementById('agencyTagline').value = info.tagline;
    if (info.wa) document.getElementById('agencyWhatsApp').value = info.wa;
    if (info.email) document.getElementById('agencyEmail').value = info.email;
    if (info.phone) document.getElementById('agencyPhone').value = info.phone;
    if (info.address) document.getElementById('agencyAddress').value = info.address;
  }

  if (saveAgencyBtn) {
    saveAgencyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const info = {
        name: document.getElementById('agencyName').value,
        tagline: document.getElementById('agencyTagline').value,
        wa: document.getElementById('agencyWhatsApp').value,
        email: document.getElementById('agencyEmail').value,
        phone: document.getElementById('agencyPhone').value,
        address: document.getElementById('agencyAddress').value
      };
      localStorage.setItem('dk_agency_info', JSON.stringify(info));
      showToast('Business details saved!');
    });
  }

  // 7. Security Passcode Update
  const securityForm = document.getElementById('securityForm');
  if (securityForm) {
    securityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const current = document.getElementById('currentPasscode').value;
      const next = document.getElementById('newPasscode').value;

      if (current !== getSavedPasscode()) {
        showToast('Current passcode is incorrect!');
        return;
      }
      if (next.length < 4) {
        showToast('New passcode must be at least 4 characters.');
        return;
      }
      localStorage.setItem('dk_admin_pass', next);
      securityForm.reset();
      showToast('Admin passcode updated successfully!');
    });
  }

  // Helper Functions
  function loadAllData() {
    renderLeads();
    loadPricing();
    loadAgencyInfo();
  }

  function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, function(m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m];
    });
  }

  const toast = document.getElementById('adminToast');
  const toastText = document.getElementById('toastText');
  function showToast(msg) {
    if (!toast) return;
    toastText.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3500);
  }

  // Init
  checkSession();
});
