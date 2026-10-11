/* ==========================================================================
   DIGITALLY KOLKATA - JAVASCRIPT MASTER LOGIC
   Features:
   - Sticky Glass Navbar with Active Section Highlighting
   - Mobile Drawer Menu
   - Interactive Portfolio Filtering
   - Real-time Project Cost & Timeline Calculator
   - Service & Case Study Modals
   - Contact Form Lead Processing with WhatsApp Redirection
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Effect & Active Section Tracking
  const navbar = document.getElementById('mainNavbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    const scrollPos = window.pageYOffset + 120;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinksContainer = document.getElementById('navLinks');

  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
      mobileToggle.textContent = navLinksContainer.classList.contains('active') ? '✕' : '☰';
    });

    // Close when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        mobileToggle.textContent = '☰';
      });
    });
  }

  // 3. Portfolio Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Interactive Project Cost & Timeline Calculator
  const serviceCheckboxes = document.querySelectorAll('.service-calc');
  const pageRange = document.getElementById('pageRange');
  const pageCountDisplay = document.getElementById('pageCountDisplay');
  const estimatedPriceDisplay = document.getElementById('estimatedPrice');
  const estimatedTimelineDisplay = document.getElementById('estimatedTimeline');
  const lockInQuoteBtn = document.getElementById('lockInQuoteBtn');
  const clientMessage = document.getElementById('clientMessage');

  function calculateQuote() {
    let baseSum = 0;
    let selectedCount = 0;

    serviceCheckboxes.forEach(cb => {
      const parentLabel = cb.closest('.check-card');
      if (cb.checked) {
        baseSum += parseInt(cb.value, 10);
        selectedCount++;
        if (parentLabel) parentLabel.classList.add('checked');
      } else {
        if (parentLabel) parentLabel.classList.remove('checked');
      }
    });

    const pages = parseInt(pageRange.value, 10);
    pageCountDisplay.textContent = pages === 1 ? '1 Page (Landing)' : `${pages} Pages`;

    // Multiplier for page scope beyond base 5 pages
    let pageCost = 0;
    if (pages > 5) {
      pageCost = (pages - 5) * 1800;
    }

    const totalEstimate = Math.max(12000, baseSum + pageCost);
    estimatedPriceDisplay.textContent = `₹${totalEstimate.toLocaleString('en-IN')}`;

    // Calculate timeline
    let timelineWeeks = '1 to 2 Weeks';
    if (pages > 15 || selectedCount >= 4) {
      timelineWeeks = '4 to 6 Weeks';
    } else if (pages > 7 || selectedCount >= 2) {
      timelineWeeks = '2 to 3 Weeks';
    }
    estimatedTimelineDisplay.textContent = timelineWeeks;
  }

  serviceCheckboxes.forEach(cb => cb.addEventListener('change', calculateQuote));
  if (pageRange) pageRange.addEventListener('input', calculateQuote);

  // Trigger initial calculation
  calculateQuote();

  // "Lock In This Quote" transfers details to contact form
  if (lockInQuoteBtn && clientMessage) {
    lockInQuoteBtn.addEventListener('click', () => {
      const price = estimatedPriceDisplay.textContent;
      const timeline = estimatedTimelineDisplay.textContent;
      const pages = pageRange.value;

      const selectedServices = Array.from(serviceCheckboxes)
        .filter(c => c.checked)
        .map(c => c.nextElementSibling.textContent.trim())
        .join(', ');

      clientMessage.value = `I generated an instant estimate of ${price} (${timeline}) for ~${pages} pages.\nServices chosen: ${selectedServices}.\nI would like to schedule a discovery call to review my project.`;
    });
  }

  // 5. Modal System (Services & Case Studies)
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCta = document.getElementById('modalCta');

  function openModal(title, text) {
    if (!modal) return;
    modalTitle.textContent = title;
    modalDescription.textContent = text;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Open from service links
  document.querySelectorAll('.open-service-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.dataset.title, btn.dataset.details);
    });
  });

  // Open from portfolio cards
  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      openModal(card.dataset.title, card.dataset.details);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCta) modalCta.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // 6. Lead Contact Form Processing & WhatsApp Action
  const leadForm = document.getElementById('leadContactForm');
  const toast = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(msg) {
    if (!toast) return;
    toastMessage.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 4500);
  }

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const interest = document.getElementById('projectInterest').value;
      const message = document.getElementById('clientMessage').value.trim();

      // Show instant confirmation
      showToast(`Thank you, ${name}! Your project brief has been recorded. Redirecting to WhatsApp...`);

      // Save lead to localStorage for Admin Portal
      try {
        const existingLeads = JSON.parse(localStorage.getItem('dk_leads') || '[]');
        const newLead = {
          id: 'lead_' + Date.now(),
          name,
          email,
          phone: phone || 'Not provided',
          interest,
          message,
          timestamp: new Date().toISOString()
        };
        existingLeads.unshift(newLead);
        localStorage.setItem('dk_leads', JSON.stringify(existingLeads));
      } catch (err) {
        console.error('Failed to save lead locally:', err);
      }

      // WhatsApp formatted message payload
      const waText = encodeURIComponent(
        `*New Inquiry - Digitally Kolkata*\n` +
        `👤 Name: ${name}\n` +
        `✉️ Email: ${email}\n` +
        `📞 Phone: ${phone || 'Not provided'}\n` +
        `🎯 Service: ${interest}\n` +
        `📝 Details: ${message}`
      );

      // Open WhatsApp after brief delay for smooth UX
      setTimeout(() => {
        window.open(`https://wa.me/919830000000?text=${waText}`, '_blank');
      }, 1200);

      leadForm.reset();
      calculateQuote();
    });
  }
});
