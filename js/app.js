// ==========================================================================
// APPLICATION CONTROLLER & UI RENDERER ("SahakariSeva")
// ==========================================================================

const App = {
  init() {
    this.bindEvents();
    appStore.subscribe((state) => this.render(state));
    this.render(appStore);
  },

  bindEvents() {
    // Role switcher events
    document.querySelectorAll('[data-role]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-role');
        appStore.setRole(target);
      });
    });

    // Viewport mode switcher
    const toggleVpBtn = document.getElementById('toggle-viewport-btn');
    if (toggleVpBtn) {
      toggleVpBtn.addEventListener('click', () => {
        appStore.toggleFullScreen();
      });
    }

    // Modal background close
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') {
        appStore.closeModal();
      }
    });
  },

  render(state) {
    this.renderTopBar(state);
    this.renderMainContent(state);
    this.renderBottomNav(state);
    this.renderModal(state);
  },

  // 1. Top Bar
  renderTopBar(state) {
    const wrapper = document.getElementById('viewport-wrapper');
    if (state.isFullScreen) {
      wrapper.classList.add('is-fullscreen');
      document.getElementById('vp-mode-label').textContent = 'Full Width';
    } else {
      wrapper.classList.remove('is-fullscreen');
      document.getElementById('vp-mode-label').textContent = 'Mobile Frame';
    }

    // Role buttons active state
    document.querySelectorAll('[data-role]').forEach(btn => {
      if (btn.getAttribute('data-role') === state.role) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  },

  // 2. Main Content Router
  renderMainContent(state) {
    const screen = document.getElementById('main-screen-container');
    
    if (state.role === 'customer') {
      if (state.activeCustomerTab === 'home') {
        screen.innerHTML = this.renderCustomerHome(state);
      } else if (state.activeCustomerTab === 'bookings') {
        screen.innerHTML = this.renderBookingsTab(state);
      } else if (state.activeCustomerTab === 'services') {
        screen.innerHTML = this.renderServicesDirectory(state);
      } else if (state.activeCustomerTab === 'lifecycle') {
        screen.innerHTML = this.renderLifecycleSimulator(state);
      } else if (state.activeCustomerTab === 'booking-wizard') {
        screen.innerHTML = this.renderBookingWizard(state);
      } else if (state.activeCustomerTab === 'profile') {
        screen.innerHTML = this.renderCustomerProfile(state);
      } else if (state.activeCustomerTab === 'messages') {
        screen.innerHTML = this.renderSupportMessages(state);
      }
    } else if (state.role === 'worker') {
      screen.innerHTML = this.renderWorkerDashboard(state);
    } else if (state.role === 'coop') {
      screen.innerHTML = this.renderCooperativeDashboard(state);
    } else if (state.role === 'admin') {
      screen.innerHTML = this.renderAdminDashboard(state);
    }

    this.attachDynamicListeners(screen, state);
  },

  // ========================================================================
  // CUSTOMER HOME SCREEN
  // ========================================================================
  renderCustomerHome(state) {
    const activeBooking = state.activeBooking;
    const filteredServices = state.selectedCategoryId === 'cat-all' 
      ? state.services.filter(s => s.isPopular)
      : state.services.filter(s => s.categoryId === state.selectedCategoryId);

    return `
      <!-- 1. Header (56px top padding) -->
      <header class="home-header">
        <div class="header-user-info">
          <span class="header-greeting-label">GOOD MORNING</span>
          <h1 class="header-user-name">${INITIAL_DATA.customer.name}</h1>
        </div>
        <div class="header-profile-wrap" id="btn-open-profile-menu">
          <img src="${INITIAL_DATA.customer.avatar}" alt="${INITIAL_DATA.customer.name}" class="profile-avatar-48" />
          <div class="profile-notification-badge-16" title="3 active notifications"></div>
        </div>
      </header>

      <!-- 2. Location Selector -->
      <section class="location-selector-bar">
        <button class="location-pill-btn" id="btn-open-location-modal">
          <div class="location-pin-icon">📍</div>
          <div class="location-text-group">
            <span class="location-type-tag">${state.currentLocation.label}</span>
            <span class="location-address-str">${state.currentLocation.address}</span>
          </div>
          <span class="location-chevron">▼</span>
        </button>
      </section>

      <!-- 3. Service Search -->
      <section class="service-search-section">
        <div class="search-input-wrapper">
          <span class="search-icon-svg">🔍</span>
          <input 
            type="text" 
            id="home-service-search-input" 
            class="main-service-search-input" 
            placeholder="What service do you need?" 
            value="${state.searchQuery}"
          />
          <button class="search-action-btn" id="btn-search-go">Search</button>
        </div>
        <div class="recent-searches-row">
          <span class="chip-label">RECENT:</span>
          <button class="quick-chip" data-quick-search="AC Repair">AC Servicing</button>
          <button class="quick-chip" data-quick-search="Plumber">Tap Leakage</button>
          <button class="quick-chip" data-quick-search="Electrician">Switchboard Spark</button>
          <button class="quick-chip" data-quick-search="Deep Cleaning">Deep Cleaning</button>
        </div>
      </section>

      <!-- 4. Horizontal Service Selector -->
      <section class="category-selector-section">
        <div class="category-scroll-container">
          ${state.categories.map(cat => {
            const isActive = cat.id === state.selectedCategoryId;
            return `
              <div class="category-pill ${isActive ? 'active' : ''}" data-cat-id="${cat.id}">
                <span class="cat-icon">${this.getCategoryIcon(cat.icon)}</span>
                <span class="cat-name">${cat.name}</span>
                ${isActive ? '<span class="cat-accent-dot"></span>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- 7. Active Booking Hero Card (40px Radius) -->
      ${activeBooking ? `
        <section class="active-booking-hero-section">
          <div class="hero-card-main">
            <div class="hero-deco-shape"></div>
            
            <div class="hero-header-row">
              <div class="hero-status-badge">
                <span class="hero-status-pulse"></span>
                <span class="hero-status-text">${this.getStageTitle(activeBooking.currentStageIndex)}</span>
              </div>
              <span class="hero-booking-id">#${activeBooking.id}</span>
            </div>

            <h2 class="hero-service-title">${activeBooking.serviceName}</h2>

            <div class="hero-worker-row">
              <img src="${activeBooking.workerAvatar}" alt="${activeBooking.workerName}" class="hero-worker-avatar" />
              <div class="hero-worker-meta">
                <span class="hero-worker-name">${activeBooking.workerName}</span>
                <span class="hero-worker-coop">${activeBooking.cooperativeName}</span>
              </div>
              <div class="grade-badge-pill grade-${activeBooking.workerGrade}">
                ★ GRADE ${activeBooking.workerGrade}
              </div>
            </div>

            <!-- Bento 2-column metric layout -->
            <div class="hero-bento-grid">
              <div class="bento-metric-card">
                <div class="bento-metric-top">
                  <span class="label-caps">ETA</span>
                  <div class="bento-metric-icon">⏱️</div>
                </div>
                <span class="bento-metric-val">${activeBooking.eta}</span>
              </div>

              <div class="bento-metric-card">
                <div class="bento-metric-top">
                  <span class="label-caps">DISTANCE</span>
                  <div class="bento-metric-icon">📍</div>
                </div>
                <span class="bento-metric-val">${activeBooking.distance}</span>
              </div>
            </div>

            <!-- Contextual Information Box -->
            <div class="hero-context-box">
              <span>🛡️</span>
              <span>Cooperative Verified Artisan • Safety Insured • Genuine Spares</span>
            </div>

            <button class="btn-primary-red" id="btn-open-live-tracking">
              <span>Live GPS Tracking & Progress</span>
              <span>➔</span>
            </button>
          </div>
        </section>
      ` : ''}

      <!-- 6. Quick Booking Action Card -->
      <section>
        <div class="quick-booking-card">
          <div class="qb-content-left">
            <div class="qb-badge">COOPERATIVE GIG NETWORK</div>
            <h3 class="qb-title">Book a Service</h3>
            <p class="qb-desc">Skilled workers with transparent pricing & verified grades.</p>
          </div>
          <button class="qb-action-btn" id="btn-quick-book-start">Book Now ➔</button>
        </div>
      </section>

      <!-- 5. Popular Services Grid -->
      <section class="section-wrapper">
        <div class="section-title-row">
          <h2 class="heading-2">Popular Services</h2>
          <span class="section-link-action" id="btn-view-all-services">View Directory</span>
        </div>

        <div class="popular-services-grid">
          ${filteredServices.slice(0, 8).map(srv => `
            <div class="popular-service-item" data-service-id="${srv.id}">
              <div class="service-icon-box">
                ${this.getServiceEmoji(srv.icon)}
              </div>
              <span class="popular-service-name">${srv.name}</span>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Emergency SOS Strip -->
      <section>
        <div class="emergency-strip-card">
          <div class="emergency-header">
            <div>
              <div class="emergency-badge">🚨 EMERGENCY SOS</div>
              <h3 style="font-size:16px; font-weight:900; margin-top:4px;">Urgent Household Crises</h3>
            </div>
            <span class="label-caps" style="color:var(--vibrant-red);">10-15 MIN DISPATCH</span>
          </div>

          <div class="emergency-grid">
            <button class="emergency-chip-btn" data-emergency="srv-elec">
              <span class="emg-icon">⚡</span>
              <span class="emg-name">Electrical Spark</span>
            </button>
            <button class="emergency-chip-btn" data-emergency="srv-plumb">
              <span class="emg-icon">💧</span>
              <span class="emg-name">Water Burst</span>
            </button>
            <button class="emergency-chip-btn" data-emergency="srv-roadside">
              <span class="emg-icon">🚗</span>
              <span class="emg-name">Car Breakdown</span>
            </button>
          </div>
        </div>
      </section>

      <!-- AI Smart Assistance Card -->
      <section>
        <div class="ai-smart-card" id="btn-open-ai-helper">
          <div class="ai-icon-circle">✨</div>
          <div class="ai-text-meta">
            <h4 class="ai-title">AI Smart Diagnosis</h4>
            <p class="ai-sub">Upload a photo to detect fault & predict parts automatically.</p>
          </div>
          <span class="ai-action-link">Try Now ➔</span>
        </div>
      </section>
    `;
  },

  // ========================================================================
  // SERVICES DIRECTORY VIEW
  // ========================================================================
  renderServicesDirectory(state) {
    const cats = [
      { id: "cat-repair", title: "HOME REPAIR & MAINTENANCE" },
      { id: "cat-appliances", title: "APPLIANCE SERVICES & ELECTRONICS" },
      { id: "cat-clean", title: "HOME & PERSONAL SERVICES" },
      { id: "cat-transport", title: "TRANSPORT & MOBILITY" },
      { id: "cat-security", title: "SECURITY & COMMUNITY" }
    ];

    let searchFiltered = state.services;
    if (state.searchQuery) {
      searchFiltered = state.services.filter(s => 
        s.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        s.shortDesc.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        s.categoryName.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    return `
      <div style="padding: 56px 24px 20px 24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <div>
            <span class="label-caps">SERVICE DIRECTORY</span>
            <h1 class="heading-1">Explore Services</h1>
          </div>
          <button class="btn-outline-pill" id="btn-more-menu-trigger">⋮ More</button>
        </div>

        <!-- Directory Search Bar -->
        <div class="search-input-wrapper" style="margin-bottom:18px;">
          <span class="search-icon-svg">🔍</span>
          <input 
            type="text" 
            id="directory-search-input" 
            class="main-service-search-input" 
            placeholder="Search 30+ cooperative services..." 
            value="${state.searchQuery}"
          />
        </div>

        <!-- Dynamic Service List by Group -->
        ${cats.map(cat => {
          const catServices = searchFiltered.filter(s => s.categoryId === cat.id || (cat.id === 'cat-appliances' && s.categoryName.includes('APPLIANCE')));
          if (catServices.length === 0) return '';
          return `
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 13px; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; color: #576761; margin-bottom: 12px; border-bottom: 1px solid var(--gray-green-border); padding-bottom: 6px;">
                ${cat.title} (${catServices.length})
              </h3>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${catServices.map(srv => `
                  <div class="worker-card-main" style="padding: 16px; margin-bottom: 0;" data-service-id="${srv.id}">
                    <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;">
                      <div style="display: flex; gap: 12px;">
                        <div class="service-icon-box" style="margin-bottom: 0; flex-shrink: 0;">
                          ${this.getServiceEmoji(srv.icon)}
                        </div>
                        <div>
                          <div style="display: flex; align-items: center; gap: 8px;">
                            <h4 style="font-size: 16px; font-weight: 900; color: var(--charcoal);">${srv.name}</h4>
                            ${srv.popularTag ? `<span class="label-caps" style="background:var(--off-white); padding:2px 8px; border-radius:10px; color:var(--vibrant-red); font-size:9px;">${srv.popularTag}</span>` : ''}
                          </div>
                          <p style="font-size: 12.5px; color: #5f6f69; margin: 4px 0 6px 0; line-height: 1.35;">${srv.shortDesc}</p>
                          <div style="display: flex; align-items: center; gap: 10px; font-size: 11.5px; font-weight: 700; color: var(--charcoal);">
                            <span>⏱️ ${srv.duration}</span>
                            <span>•</span>
                            <span>🛡️ Verified Cooperative</span>
                          </div>
                        </div>
                      </div>
                      
                      <div style="display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0;">
                        <span class="label-caps">STARTING</span>
                        <span style="font-size: 17px; font-weight: 900; color: var(--charcoal);">₹${srv.basePrice}</span>
                        <button class="btn-sm-book" style="margin-top: 8px;" data-book-service="${srv.id}">Book</button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // ========================================================================
  // BOOKING WIZARD (STEP-BY-STEP SERVICE BOOKING FLOW)
  // ========================================================================
  renderBookingWizard(state) {
    const wizard = state.wizard;
    const srv = wizard.service;
    const currentGrade = INITIAL_DATA.grades[wizard.selectedGrade];

    return `
      <div style="padding: 56px 24px 30px 24px;">
        <!-- Top Nav & Step Indicators -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
          <button class="btn-outline-pill" id="btn-wizard-back">← Back</button>
          <span class="label-caps">STEP ${wizard.step} OF 4 • BOOKING FLOW</span>
          <button class="btn-outline-pill" id="btn-wizard-cancel">✕</button>
        </div>

        <!-- Service Summary Pill -->
        <div style="background:var(--white); border-radius:var(--radius-nested); padding:16px; border:1px solid var(--gray-green-border); margin-bottom:20px; display:flex; align-items:center; gap:12px;">
          <div class="service-icon-box" style="margin-bottom:0;">${this.getServiceEmoji(srv.icon)}</div>
          <div>
            <span class="label-caps">${srv.categoryName}</span>
            <h2 class="heading-2">${srv.name}</h2>
            <span style="font-size:12px; font-weight:700; color:#55645e;">Starting ₹${srv.basePrice} • Est. ${srv.duration}</span>
          </div>
        </div>

        ${wizard.step === 1 ? `
          <!-- STEP 1: REQUIREMENTS & PHOTO UPLOAD WITH AI AUTO-DIAGNOSIS -->
          <div>
            <h3 class="heading-2" style="margin-bottom: 6px;">1. Describe Your Problem</h3>
            <p class="body-secondary" style="margin-bottom: 16px;">Help the cooperative worker understand your requirements or upload a photo for instant AI diagnosis.</p>

            <div style="background:var(--white); border-radius:var(--radius-nested); padding:18px; border:1px solid var(--gray-green-border); margin-bottom:18px;">
              <label class="label-caps" style="display:block; margin-bottom:8px;">Describe the issue</label>
              <textarea 
                id="wizard-requirement-input" 
                rows="3" 
                style="width:100%; border:1px solid var(--gray-green-border); border-radius:14px; padding:12px; font-family:var(--font-family); font-size:14px; outline:none; resize:none;"
                placeholder="${srv.requirementsPlaceholder}"
              >${wizard.requirementText}</textarea>

              <div style="margin-top:14px;">
                <label class="label-caps" style="display:block; margin-bottom:8px;">Photo / Video Verification (Optional)</label>
                <div style="display:flex; gap:10px;">
                  <button class="btn-outline-pill" id="btn-simulate-photo-ac" style="font-size:11px;">📸 Upload AC Photo (Simulate AI)</button>
                  <button class="btn-outline-pill" id="btn-simulate-photo-leak" style="font-size:11px;">📸 Upload Pipe Leak Photo</button>
                </div>
              </div>

              ${wizard.aiDiagnosis ? `
                <div style="background:rgba(23, 30, 25, 0.04); border-left:3px solid var(--charcoal); border-radius:12px; padding:14px; margin-top:16px;">
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                    <span class="label-caps" style="color:var(--charcoal);">✨ AI AUTO-DIAGNOSIS ENGINE</span>
                    <span class="label-caps" style="color:#059669;">CONFIDENCE: ${wizard.aiDiagnosis.confidence}</span>
                  </div>
                  <h4 style="font-size:14.5px; font-weight:900; color:var(--charcoal); margin-bottom:4px;">${wizard.aiDiagnosis.detectedIssue}</h4>
                  <p style="font-size:12px; color:#52615b; margin-bottom:8px;">Suggested: ${wizard.aiDiagnosis.suggestedGrade}</p>
                  <div style="background:var(--white); padding:8px 12px; border-radius:8px; border:1px solid var(--gray-green-border); font-size:12px; font-weight:800; color:var(--charcoal);">
                    📦 Predicted Spare Part: ${wizard.aiDiagnosis.predictedPart} (~₹${wizard.aiDiagnosis.predictedPartPrice})
                  </div>
                </div>
              ` : ''}
            </div>

            <button class="btn-primary-red" id="btn-wizard-next-1">Continue to Worker Grade ➔</button>
          </div>
        ` : ''}

        ${wizard.step === 2 ? `
          <!-- STEP 2: WORKER GRADE SELECTION -->
          <div>
            <h3 class="heading-2" style="margin-bottom: 6px;">2. Select Worker Grade</h3>
            <p class="body-secondary" style="margin-bottom: 16px;">All cooperative workers are vetted and trained. Choose the service grade that best matches the complexity of your job.</p>

            <div class="grade-selection-grid">
              ${['A', 'B', 'C'].map(gradeKey => {
                const g = INITIAL_DATA.grades[gradeKey];
                const isSelected = wizard.selectedGrade === gradeKey;
                return `
                  <div class="grade-card-item ${isSelected ? 'selected' : ''}" data-select-grade="${gradeKey}">
                    <div class="grade-header-meta">
                      <div class="grade-code-tag">
                        <span>${g.code}</span>
                        <span class="grade-stars-str">${g.starsText}</span>
                      </div>
                      <span class="grade-price-tier">+₹${g.priceAddon} tier</span>
                    </div>
                    <div class="grade-subtitle">${g.badgeTitle} • ${g.experienceText}</div>
                    <p class="grade-desc-p">${g.description}</p>
                    <div class="grade-badges-row">
                      <span class="grade-pill-tag">🛡️ ${g.verificationLevel}</span>
                      <span class="grade-pill-tag">Cooperative Insured</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <button class="btn-primary-red" id="btn-wizard-next-2">View Available Grade ${wizard.selectedGrade} Workers ➔</button>
          </div>
        ` : ''}

        ${wizard.step === 3 ? `
          <!-- STEP 3: AVAILABLE WORKERS & DATE/TIME -->
          <div>
            <h3 class="heading-2" style="margin-bottom: 6px;">3. Available Workers (Grade ${wizard.selectedGrade})</h3>
            <p class="body-secondary" style="margin-bottom: 16px;">Verified cooperative members ready near GLA University.</p>

            <!-- Workers List matching grade -->
            <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
              ${state.workers.filter(w => w.grade === wizard.selectedGrade).map(wrk => {
                const isSelected = wizard.selectedWorker.id === wrk.id;
                return `
                  <div class="worker-card-main ${isSelected ? 'selected' : ''}" style="${isSelected ? 'border-color:var(--charcoal); background:#fcfbf9;' : ''}" data-select-worker="${wrk.id}">
                    <div class="worker-top-row">
                      <div class="worker-portrait-wrap">
                        <img src="${wrk.avatar}" alt="${wrk.name}" class="worker-portrait-img" />
                        <span class="worker-online-dot"></span>
                      </div>
                      <div class="worker-meta-col">
                        <div class="worker-name-title">
                          <span>${wrk.name}</span>
                          <span class="grade-badge-pill">★ GRADE ${wrk.grade}</span>
                        </div>
                        <span class="worker-coop-name">${wrk.cooperativeName}</span>
                        <div class="worker-metrics-line">
                          <span class="worker-rating-badge">★ ${wrk.rating}</span>
                          <span>•</span>
                          <span>${wrk.completedJobs} jobs</span>
                          <span>•</span>
                          <span>${wrk.distance}</span>
                        </div>
                      </div>
                    </div>

                    <div class="worker-card-bottom">
                      <div class="worker-rate-box">
                        <span class="label-caps">HOURLY RATE</span>
                        <span class="rate-amount">₹${wrk.hourlyRate}/hr</span>
                      </div>
                      <div class="worker-actions-pair">
                        <button class="btn-sm-view" data-view-profile="${wrk.id}">Profile</button>
                        <button class="btn-sm-book" data-choose-worker="${wrk.id}">${isSelected ? '✓ Selected' : 'Choose'}</button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Schedule Picker -->
            <div style="background:var(--white); border-radius:var(--radius-nested); padding:18px; border:1px solid var(--gray-green-border); margin-bottom:18px;">
              <h4 style="font-size:15px; font-weight:900; margin-bottom:10px;">Select Date & Time Slot</h4>
              <div style="display:flex; gap:8px; margin-bottom:12px; overflow-x:auto;">
                <button class="filter-pill ${wizard.selectedDate === 'Today' ? 'active' : ''}" data-pick-date="Today">Today</button>
                <button class="filter-pill ${wizard.selectedDate === 'Tomorrow' ? 'active' : ''}" data-pick-date="Tomorrow">Tomorrow</button>
                <button class="filter-pill ${wizard.selectedDate === 'Pick Date' ? 'active' : ''}" data-pick-date="Pick Date">Oct 4 (Sunday)</button>
              </div>
              <div style="display:flex; flex-wrap:wrap; gap:8px;">
                <button class="filter-pill ${wizard.selectedSlot.includes('Immediate') ? 'active' : ''}" data-pick-slot="In 30 Mins (Immediate)">⚡ In 30 Mins (Immediate)</button>
                <button class="filter-pill ${wizard.selectedSlot.includes('2:00 PM') ? 'active' : ''}" data-pick-slot="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</button>
                <button class="filter-pill ${wizard.selectedSlot.includes('5:00 PM') ? 'active' : ''}" data-pick-slot="5:00 PM - 6:00 PM">5:00 PM - 6:00 PM</button>
              </div>
            </div>

            <button class="btn-primary-red" id="btn-wizard-next-3">Review Transparent Price ➔</button>
          </div>
        ` : ''}

        ${wizard.step === 4 ? `
          <!-- STEP 4: TRANSPARENT PRICING & CONFIRMATION -->
          <div>
            <h3 class="heading-2" style="margin-bottom: 6px;">4. Review Price & Confirm</h3>
            <p class="body-secondary" style="margin-bottom: 16px;">100% transparent pricing backed by cooperative society bylaws. No hidden fees.</p>

            <!-- Booking Snapshot -->
            <div style="background:var(--white); border-radius:var(--radius-nested); padding:16px; border:1px solid var(--gray-green-border); margin-bottom:16px;">
              <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                <img src="${wizard.selectedWorker.avatar}" alt="" style="width:44px; height:44px; border-radius:50%; object-fit:cover;" />
                <div>
                  <h4 style="font-size:15px; font-weight:900;">${wizard.selectedWorker.name} (Grade ${wizard.selectedGrade})</h4>
                  <span style="font-size:12px; color:#5b6a65;">${wizard.selectedWorker.cooperativeName}</span>
                </div>
              </div>
              <div style="font-size:12.5px; font-weight:700; color:var(--charcoal); display:flex; flex-direction:column; gap:4px; border-top:1px solid var(--gray-green-border); padding-top:10px;">
                <span>📍 Location: ${wizard.address}</span>
                <span>⏱️ Scheduled: ${wizard.selectedDate} • ${wizard.selectedSlot}</span>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="pricing-breakdown-card">
              <span class="label-caps" style="color:var(--charcoal); margin-bottom:8px; display:block;">ITEMIZED PRICE BREAKDOWN</span>
              
              <div class="price-line-row">
                <span>Base Service Charge (${srv.name})</span>
                <span class="price-val">₹${srv.basePrice}</span>
              </div>
              <div class="price-line-row">
                <span>Worker Grade Fee (${currentGrade.code} ${currentGrade.badgeTitle})</span>
                <span class="price-val">+₹${currentGrade.priceAddon}</span>
              </div>
              <div class="price-line-row">
                <span>Estimated Materials / Spares</span>
                <span class="price-val">₹0 (On Inspection)</span>
              </div>
              <div class="price-line-row">
                <span>Cooperative Labour Welfare Fund (10%)</span>
                <span class="price-val">₹45</span>
              </div>
              <div class="price-line-row">
                <span>Platform Technical Operations</span>
                <span class="price-val">₹30</span>
              </div>
              <div class="price-line-row">
                <span>Applicable Taxes (GST 5%)</span>
                <span class="price-val">₹${Math.round((srv.basePrice + currentGrade.priceAddon) * 0.05)}</span>
              </div>

              <div class="price-line-row total-row">
                <span>TOTAL ESTIMATE</span>
                <span class="price-val">₹${srv.basePrice + currentGrade.priceAddon + 45 + 30 + Math.round((srv.basePrice + currentGrade.priceAddon) * 0.05)}</span>
              </div>

              <div class="fixed-price-guarantee-pill">
                <span>🛡️</span>
                <span>Cooperative Standard Price Guarantee • No Surge Pricing</span>
              </div>
            </div>

            <button class="btn-primary-red" id="btn-confirm-booking-final">
              <span>Confirm & Request Worker</span>
              <span>➔</span>
            </button>
          </div>
        ` : ''}
      </div>
    `;
  },

  // ========================================================================
  // INTERACTIVE LIFECYCLE SIMULATOR (THE COMPLETE FLOW 1-10)
  // ========================================================================
  renderLifecycleSimulator(state) {
    const booking = state.activeBooking;
    if (!booking) {
      return `
        <div style="padding: 56px 24px; text-align: center;">
          <h2 class="heading-2">No Active Booking</h2>
          <p class="body-secondary" style="margin: 12px 0 20px 0;">You have no active bookings right now.</p>
          <button class="btn-primary-red" id="btn-start-new-from-empty">Book a Service ➔</button>
        </div>
      `;
    }

    const stages = [
      "Requested",
      "Accepted",
      "On The Way",
      "Before-Work Verify",
      "Spare Part Required?",
      "Work In Progress",
      "After-Work Verify",
      "Digital Payment",
      "Digital Invoice",
      "Feedback & AI Update"
    ];

    const cur = booking.currentStageIndex;

    return `
      <div class="lifecycle-stepper-wrap" style="padding-top: 56px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <span class="label-caps">LIVE SERVICE LIFECYCLE</span>
            <h1 class="heading-1">Booking Tracker</h1>
          </div>
          <button class="btn-outline-pill" id="btn-back-to-home">✕ Close</button>
        </div>

        <!-- Simulation Controller Bar -->
        <div class="sim-controls-bar">
          <div style="display:flex; flex-direction:column;">
            <span class="sim-label">SIMULATOR CONTROLLER</span>
            <span style="font-size:12px; font-weight:800;">Stage ${cur + 1} of 10</span>
          </div>
          <div class="sim-btn-group">
            <button class="sim-step-btn" id="btn-sim-prev" ${cur === 0 ? 'disabled style="opacity:0.4;"' : ''}>◀ Prev</button>
            <button class="sim-step-btn" id="btn-sim-next" ${cur === 9 ? 'disabled style="opacity:0.4;"' : ''}>Next ▶</button>
          </div>
        </div>

        <!-- Progress Timeline Dots -->
        <div class="stage-tracker-card" style="padding: 16px 20px; margin-bottom: 16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="label-caps" style="color:var(--charcoal);">CURRENT STATUS</span>
            <span class="hero-status-badge">
              <span class="hero-status-pulse"></span>
              <span class="hero-status-text">${stages[cur]}</span>
            </span>
          </div>

          <div class="progress-timeline-bar">
            ${stages.map((stg, i) => {
              let cls = '';
              if (i < cur) cls = 'completed';
              else if (i === cur) cls = 'active';
              return `<div class="timeline-step-node ${cls}" title="${stg}">${i + 1}</div>`;
            }).join('')}
          </div>
          <div style="text-align:center; font-size:12.5px; font-weight:800; color:var(--charcoal);">
            ${stages[cur]}
          </div>
        </div>

        <!-- STAGE SPECIFIC INTERACTION BOXES -->

        <!-- STAGE 0: REQUESTED -->
        ${cur === 0 ? `
          <div class="stage-content-box">
            <h3 class="heading-2" style="margin-bottom:8px;">Booking Requested</h3>
            <p class="body-secondary" style="margin-bottom:16px;">Your request has been broadcasted to the nearest cooperative depot. Matching verified Grade ${booking.workerGrade} workers...</p>
            <div style="text-align:center; padding:20px;">
              <div class="hero-status-pulse" style="width:24px; height:24px; margin:0 auto 12px auto;"></div>
              <span style="font-size:13px; font-weight:800;">Cooperative Dispatch Engine Active</span>
            </div>
            <button class="btn-primary-red" id="btn-simulate-accept">Simulate Worker Acceptance ➔</button>
          </div>
        ` : ''}

        <!-- STAGE 1: ACCEPTED -->
        ${cur === 1 ? `
          <div class="stage-content-box">
            <h3 class="heading-2" style="margin-bottom:8px;">Worker Accepted Your Booking!</h3>
            <p class="body-secondary" style="margin-bottom:14px;">Master technician ${booking.workerName} has confirmed and is preparing cooperative equipment.</p>
            
            <div class="hero-worker-row" style="background:var(--white);">
              <img src="${booking.workerAvatar}" alt="" class="hero-worker-avatar" />
              <div class="hero-worker-meta">
                <span class="hero-worker-name">${booking.workerName}</span>
                <span class="hero-worker-coop">${booking.cooperativeName}</span>
              </div>
              <span class="grade-badge-pill">★ GRADE ${booking.workerGrade}</span>
            </div>

            <button class="btn-primary-red" id="btn-simulate-on-the-way">Worker Dispatched • Start GPS Tracking ➔</button>
          </div>
        ` : ''}

        <!-- STAGE 2: ON THE WAY (LIVE GPS TRACKING) -->
        ${cur === 2 ? `
          <div class="stage-content-box">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <div>
                <span class="label-caps">LIVE MAP TELEMETRY</span>
                <h3 class="heading-2">Worker On The Way</h3>
              </div>
              <span class="label-caps" style="color:var(--vibrant-red);">SPEED: ${booking.speed}</span>
            </div>

            <!-- Simulated Live GPS Vector Map -->
            <div class="gps-map-container">
              <svg class="map-canvas-mock" viewBox="0 0 400 220" preserveAspectRatio="none">
                <!-- Roads Grid -->
                <rect width="400" height="220" fill="#d9e3df" />
                <path d="M 0 50 Q 150 70 400 40" stroke="#c0d0c9" stroke-width="20" fill="none" />
                <path d="M 50 0 L 80 220" stroke="#c0d0c9" stroke-width="16" fill="none" />
                <path d="M 180 0 Q 210 110 240 220" stroke="#c0d0c9" stroke-width="22" fill="none" />
                <path d="M 0 160 Q 200 130 400 180" stroke="#c0d0c9" stroke-width="18" fill="none" />
                <!-- Route Polyline -->
                <path d="M 150 140 Q 220 90 310 55" stroke="#ca0013" stroke-width="5" stroke-dasharray="8 6" fill="none" />
              </svg>

              <!-- Worker Marker (Animated) -->
              <div class="map-worker-marker" title="${booking.workerName}">
                🚗
              </div>

              <!-- Customer Home Pin -->
              <div class="map-home-pin" title="GLA University, Mathura">
                🏠
              </div>
            </div>

            <!-- Bento Metrics -->
            <div class="hero-bento-grid" style="margin-bottom:14px;">
              <div class="bento-metric-card">
                <span class="label-caps">ESTIMATED ARRIVAL</span>
                <span class="bento-metric-val">${booking.eta}</span>
              </div>
              <div class="bento-metric-card">
                <span class="label-caps">CURRENT DISTANCE</span>
                <span class="bento-metric-val">${booking.distance}</span>
              </div>
            </div>

            <!-- Quick Action Buttons -->
            <div style="display:flex; gap:10px; margin-bottom:14px;">
              <button class="btn-outline-pill" style="flex:1;" id="btn-call-worker">📞 Call Worker</button>
              <button class="btn-outline-pill" style="flex:1;" id="btn-chat-worker">💬 Chat / In-App</button>
            </div>

            <button class="btn-primary-red" id="btn-simulate-arrival">Simulate Worker Arrived at Site ➔</button>
          </div>
        ` : ''}

        <!-- STAGE 3: BEFORE-WORK VERIFICATION -->
        ${cur === 3 ? `
          <div class="stage-content-box">
            <span class="label-caps">QUALITY PROTOCOL 1 OF 2</span>
            <h3 class="heading-2" style="margin-bottom:6px;">Before-Work Verification</h3>
            <p class="body-secondary" style="margin-bottom:14px;">Worker has inspected the equipment and uploaded high-resolution photos prior to disassembly.</p>

            <div class="verification-photos-grid">
              <div class="photo-inspect-card">
                <img src="${booking.customerPhoto}" alt="Customer Reported Problem" class="photo-inspect-img" />
                <div class="photo-inspect-meta">
                  <span class="photo-badge">Customer Upload</span>
                </div>
              </div>
              <div class="photo-inspect-card">
                <img src="${booking.beforeVerification.photo}" alt="Worker Technical Inspection" class="photo-inspect-img" />
                <div class="photo-inspect-meta">
                  <span class="photo-badge" style="color:var(--vibrant-red);">Technician Inspection</span>
                </div>
              </div>
            </div>

            <div style="background:var(--white); border-radius:var(--radius-nested); padding:14px; border:1px solid var(--gray-green-border); margin-bottom:16px;">
              <span class="label-caps" style="display:block; margin-bottom:4px;">WORKER DIAGNOSTIC LOG</span>
              <p style="font-size:13px; font-weight:700; color:var(--charcoal);">${booking.beforeVerification.workerNotes}</p>
            </div>

            ${booking.beforeVerification.isApprovedByCustomer ? `
              <div style="background:#e6f8f0; border:1px solid #10b981; border-radius:var(--radius-pill); padding:10px 16px; display:flex; align-items:center; gap:8px; margin-bottom:14px; font-size:13px; font-weight:800; color:#047857;">
                <span>✓</span>
                <span>Before-Work Inspection Approved by Customer</span>
              </div>
              <button class="btn-primary-red" id="btn-goto-spare-decision">Proceed to Spare Part Determination ➔</button>
            ` : `
              <div style="display:flex; gap:10px;">
                <button class="btn-outline-pill" style="flex:1;" id="btn-request-clarification">Request Clarification</button>
                <button class="btn-primary-red" style="flex:1;" id="btn-approve-before-work">Approve Photos ✓</button>
              </div>
            `}
          </div>
        ` : ''}

        <!-- STAGE 4: SPARE PART REQUIRED SYSTEM -->
        ${cur === 4 ? `
          <div class="stage-content-box">
            <span class="label-caps">PARTS INTEGRATION</span>
            <h3 class="heading-2" style="margin-bottom:6px;">Is a Spare Part Required?</h3>
            <p class="body-secondary" style="margin-bottom:14px;">Cooperative dark-stores supply genuine manufacturer parts at wholesale rates delivered by express runner.</p>

            <div class="spare-part-decision-card">
              <h4 style="font-size:15px; font-weight:900; margin-bottom:8px;">Cooperative Dark Store Inventory</h4>
              <p style="font-size:12px; color:#5b6a65; margin-bottom:12px;">Dispatched from Mathura Dark Store 1 (GLA Junction) • 10-15 Min Delivery</p>

              <div class="spare-part-catalog-list">
                ${state.sparePartsInventory.slice(0, 3).map(part => {
                  const isSelected = booking.pricing.selectedPart && booking.pricing.selectedPart.id === part.id;
                  return `
                    <div class="spare-part-item-row">
                      <div class="part-info-left">
                        <span class="part-name-bold">${part.name}</span>
                        <span class="part-sub-meta">${part.compatibility} • In Stock (${part.stockCount})</span>
                      </div>
                      <div class="part-price-right">
                        <span class="part-cost-tag">₹${part.coopPrice}</span>
                        <button class="part-select-btn ${isSelected ? 'selected' : ''}" data-choose-part="${part.id}">
                          ${isSelected ? 'Selected ✓' : '+ Add'}
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              ${booking.pricing.selectedPart ? `
                <div style="background:var(--off-white); border-radius:12px; padding:12px; margin-top:12px; font-size:12.5px; font-weight:800; color:var(--charcoal); display:flex; justify-content:space-between; align-items:center;">
                  <span>Selected: ${booking.pricing.selectedPart.name}</span>
                  <span style="color:var(--vibrant-red);">+₹${booking.pricing.selectedPart.price}</span>
                </div>
              ` : ''}
            </div>

            <div style="display:flex; gap:10px; margin-top:16px;">
              <button class="btn-outline-pill" style="flex:1;" id="btn-skip-spare">No Spares Needed</button>
              <button class="btn-primary-red" style="flex:1;" id="btn-approve-spare-and-start">
                ${booking.pricing.selectedPart ? 'Approve Part & Start Work ➔' : 'Start Work ➔'}
              </button>
            </div>
          </div>
        ` : ''}

        <!-- STAGE 5: WORK IN PROGRESS -->
        ${cur === 5 ? `
          <div class="stage-content-box">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <div>
                <span class="label-caps">ACTIVE REPAIR</span>
                <h3 class="heading-2">Work In Progress</h3>
              </div>
              <span class="hero-status-pulse"></span>
            </div>

            <div style="background:var(--white); border-radius:var(--radius-nested); padding:20px; border:1px solid var(--gray-green-border); text-align:center; margin-bottom:16px;">
              <div style="font-size:36px; font-weight:900; color:var(--charcoal); margin-bottom:4px;">00:24:18</div>
              <span class="label-caps">ELAPSED SERVICING TIME</span>

              <div style="display:flex; justify-content:center; gap:8px; margin-top:16px;">
                <span class="grade-pill-tag">✓ Safety Disconnect Verified</span>
                <span class="grade-pill-tag">✓ Capacitor Tested</span>
                <span class="grade-pill-tag">✓ Earthing OK</span>
              </div>
            </div>

            <button class="btn-primary-red" id="btn-simulate-work-done">Worker Completes Work ➔</button>
          </div>
        ` : ''}

        <!-- STAGE 6: WORK COMPLETED & AFTER-WORK VERIFICATION -->
        ${cur === 6 ? `
          <div class="stage-content-box">
            <span class="label-caps">QUALITY PROTOCOL 2 OF 2</span>
            <h3 class="heading-2" style="margin-bottom:6px;">Verify Completed Work</h3>
            <p class="body-secondary" style="margin-bottom:14px;">Please review the technician's post-repair evidence before authorising final payment.</p>

            <div class="verification-photos-grid">
              <div class="photo-inspect-card">
                <img src="${booking.beforeVerification.photo}" alt="Before" class="photo-inspect-img" />
                <div class="photo-inspect-meta">
                  <span class="photo-badge">BEFORE WORK</span>
                </div>
              </div>
              <div class="photo-inspect-card">
                <img src="${booking.afterVerification.photo}" alt="After" class="photo-inspect-img" />
                <div class="photo-inspect-meta">
                  <span class="photo-badge" style="color:#059669;">AFTER WORK (CLEAN)</span>
                </div>
              </div>
            </div>

            <div style="background:var(--white); border-radius:var(--radius-nested); padding:14px; border:1px solid var(--gray-green-border); margin-bottom:16px;">
              <span class="label-caps" style="display:block; margin-bottom:4px;">TECHNICIAN CLOSING NOTES</span>
              <p style="font-size:13px; font-weight:700; color:var(--charcoal);">${booking.afterVerification.workerNotes}</p>
            </div>

            ${booking.afterVerification.isApprovedByCustomer ? `
              <div style="background:#e6f8f0; border:1px solid #10b981; border-radius:var(--radius-pill); padding:10px 16px; display:flex; align-items:center; gap:8px; margin-bottom:14px; font-size:13px; font-weight:800; color:#047857;">
                <span>✓</span>
                <span>Work Verified & Approved by Customer</span>
              </div>
              <button class="btn-primary-red" id="btn-goto-payment">Proceed to Digital Payment ➔</button>
            ` : `
              <div style="display:flex; gap:10px;">
                <button class="btn-outline-pill" style="flex:1;" id="btn-raise-issue">Raise Issue</button>
                <button class="btn-primary-red" style="flex:1;" id="btn-approve-after-work">Approve Completed Work ✓</button>
              </div>
            `}
          </div>
        ` : ''}

        <!-- STAGE 7: DIGITAL PAYMENT -->
        ${cur === 7 ? `
          <div class="stage-content-box">
            <span class="label-caps">DIGITAL CHECKOUT</span>
            <h3 class="heading-2" style="margin-bottom:6px;">Select Payment Method</h3>
            <p class="body-secondary" style="margin-bottom:14px;">Instant settlement to cooperative society with verified commission breakdown.</p>

            <div class="pricing-breakdown-card" style="margin-top:0;">
              <div class="price-line-row">
                <span>Service Labor (${booking.serviceName})</span>
                <span>₹${booking.pricing.baseCharge}</span>
              </div>
              <div class="price-line-row">
                <span>Grade Addon (${booking.pricing.gradeTitle})</span>
                <span>₹${booking.pricing.gradeAddon}</span>
              </div>
              ${booking.pricing.selectedPart ? `
                <div class="price-line-row" style="color:var(--charcoal); font-weight:800;">
                  <span>Spare Part (${booking.pricing.selectedPart.name})</span>
                  <span>₹${booking.pricing.selectedPart.price}</span>
                </div>
              ` : ''}
              <div class="price-line-row">
                <span>Cooperative Welfare Contribution (10%)</span>
                <span>₹${booking.pricing.cooperativeWelfareFund}</span>
              </div>
              <div class="price-line-row">
                <span>Platform Tech Fee</span>
                <span>₹${booking.pricing.platformTechFee}</span>
              </div>
              <div class="price-line-row">
                <span>Taxes (GST 5%)</span>
                <span>₹${booking.pricing.taxGST}</span>
              </div>

              <div class="price-line-row total-row">
                <span>FINAL PAYABLE TOTAL</span>
                <span class="price-val">₹${booking.pricing.total}</span>
              </div>
            </div>

            <!-- Payment Options -->
            <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
              <button class="btn-outline-pill" style="justify-content:flex-start; padding:12px 18px;" data-pay-method="UPI (Google Pay / PhonePe)">
                <span>📱 UPI • Google Pay / PhonePe / Paytm</span>
              </button>
              <button class="btn-outline-pill" style="justify-content:flex-start; padding:12px 18px;" data-pay-method="Credit / Debit Card">
                <span>💳 Debit / Credit Card (Visa / Mastercard / RuPay)</span>
              </button>
              <button class="btn-outline-pill" style="justify-content:flex-start; padding:12px 18px;" data-pay-method="Cooperative Sahakari Wallet">
                <span>👛 Cooperative Sahakari Wallet (Balance: ₹${INITIAL_DATA.customer.walletBalance})</span>
              </button>
              <button class="btn-outline-pill" style="justify-content:flex-start; padding:12px 18px;" data-pay-method="Net Banking">
                <span>🏛️ Net Banking (SBI, HDFC, ICICI, PNB)</span>
              </button>
            </div>

            <button class="btn-primary-red" id="btn-instant-pay">Pay ₹${booking.pricing.total} via UPI ➔</button>
          </div>
        ` : ''}

        <!-- STAGE 8: DIGITAL INVOICE -->
        ${cur === 8 ? `
          <div class="digital-invoice-card">
            <div class="invoice-stamp">PAID • VERIFIED</div>

            <div class="invoice-header-block">
              <span class="label-caps">OFFICIAL TAX INVOICE</span>
              <h2 class="invoice-coop-name">${booking.cooperativeName}</h2>
              <span class="invoice-coop-sub">Reg. No: ${booking.cooperativeReg}</span>
            </div>

            <table class="invoice-meta-table">
              <tr>
                <td>Invoice / Booking ID:</td>
                <td class="strong">#${booking.id}</td>
              </tr>
              <tr>
                <td>Customer Name:</td>
                <td class="strong">${INITIAL_DATA.customer.name}</td>
              </tr>
              <tr>
                <td>Technician / Worker:</td>
                <td class="strong">${booking.workerName} (ID: ${booking.workerId})</td>
              </tr>
              <tr>
                <td>Service Rendered:</td>
                <td class="strong">${booking.serviceName}</td>
              </tr>
              <tr>
                <td>Worker Grade Tier:</td>
                <td class="strong">GRADE ${booking.workerGrade} Master Craftsman</td>
              </tr>
              <tr>
                <td>Transaction Reference:</td>
                <td class="strong">${booking.paymentDetails.transactionId || 'TXN-UPI-88492019'}</td>
              </tr>
              <tr>
                <td>Payment Mode:</td>
                <td class="strong">${booking.paymentDetails.method}</td>
              </tr>
            </table>

            <div style="border-top:1px solid var(--gray-green-border); padding-top:12px; margin-top:12px;">
              <div class="price-line-row">
                <span>Service Labor Charges:</span>
                <span class="price-val">₹${booking.pricing.baseCharge + booking.pricing.gradeAddon}</span>
              </div>
              ${booking.pricing.selectedPart ? `
                <div class="price-line-row">
                  <span>Coop Spare Part (${booking.pricing.selectedPart.name}):</span>
                  <span class="price-val">₹${booking.pricing.selectedPart.price}</span>
                </div>
              ` : ''}
              <div class="price-line-row">
                <span>Cooperative Welfare Fund Contribution:</span>
                <span class="price-val">₹${booking.pricing.cooperativeWelfareFund}</span>
              </div>
              <div class="price-line-row">
                <span>Platform Tech Fee:</span>
                <span class="price-val">₹${booking.pricing.platformTechFee}</span>
              </div>
              <div class="price-line-row">
                <span>GST (5%):</span>
                <span class="price-val">₹${booking.pricing.taxGST}</span>
              </div>
              <div class="price-line-row total-row">
                <span>NET TOTAL PAID:</span>
                <span class="price-val">₹${booking.pricing.total}</span>
              </div>
            </div>

            <div class="invoice-actions-group">
              <button class="btn-outline-pill" style="flex:1;" id="btn-download-invoice">📥 Download PDF</button>
              <button class="btn-outline-pill" style="flex:1;" id="btn-share-invoice">🔗 Share</button>
            </div>

            <button class="btn-primary-red" style="margin-top:16px;" id="btn-proceed-to-rating">
              Rate Worker & Update AI Platform ➔
            </button>
          </div>
        ` : ''}

        <!-- STAGE 9: RATING, FEEDBACK & AI PLATFORM UPDATE -->
        ${cur === 9 ? `
          <div class="stage-content-box">
            <span class="label-caps">SERVICE FEEDBACK</span>
            <h3 class="heading-2" style="margin-bottom:6px;">Rate Your Experience</h3>
            <p class="body-secondary" style="margin-bottom:14px;">Your review directly powers cooperative welfare bonuses and algorithmic trade ratings for ${booking.workerName}.</p>

            <div class="star-rating-selector" id="star-picker">
              <span class="star-rate-icon active" data-stars="1">★</span>
              <span class="star-rate-icon active" data-stars="2">★</span>
              <span class="star-rate-icon active" data-stars="3">★</span>
              <span class="star-rate-icon active" data-stars="4">★</span>
              <span class="star-rate-icon active" data-stars="5">★</span>
            </div>

            <!-- Multi-criteria evaluation -->
            <div style="background:var(--white); border-radius:var(--radius-nested); padding:16px; border:1px solid var(--gray-green-border); margin-bottom:16px;">
              <div class="rating-criteria-row">
                <span>Service Quality & Diagnosis</span>
                <div class="mini-star-bar">★★★★★</div>
              </div>
              <div class="rating-criteria-row">
                <span>Worker Behaviour & Politeness</span>
                <div class="mini-star-bar">★★★★★</div>
              </div>
              <div class="rating-criteria-row">
                <span>Punctuality & Timeliness</span>
                <div class="mini-star-bar">★★★★★</div>
              </div>
              <div class="rating-criteria-row" style="border-bottom:none;">
                <span>Technical Work Quality & Safety</span>
                <div class="mini-star-bar">★★★★★</div>
              </div>
            </div>

            <!-- Written review -->
            <div style="margin-bottom:16px;">
              <label class="label-caps" style="display:block; margin-bottom:6px;">Written Review</label>
              <textarea 
                id="feedback-review-text"
                rows="2" 
                style="width:100%; border:1px solid var(--gray-green-border); border-radius:14px; padding:12px; font-family:var(--font-family); font-size:13.5px; outline:none;"
                placeholder="Share your experience with the cooperative..."
              >Rajesh ji was extremely punctual, identified the capacitor fault immediately, and gave a transparent cooperative bill. 5 stars!</textarea>
            </div>

            <!-- Tip Worker -->
            <div style="background:var(--white); border-radius:var(--radius-nested); padding:14px; border:1px solid var(--gray-green-border); margin-bottom:18px;">
              <label class="label-caps" style="display:block; margin-bottom:8px;">Add Tip for Worker (100% goes to worker)</label>
              <div style="display:flex; gap:8px;">
                <button class="filter-pill" data-tip="0">No Tip</button>
                <button class="filter-pill" data-tip="30">₹30</button>
                <button class="filter-pill active" data-tip="50">₹50</button>
                <button class="filter-pill" data-tip="100">₹100</button>
              </div>
            </div>

            <!-- AI Platform Update Confirmation -->
            <div style="background:rgba(23, 30, 25, 0.05); border-left:3px solid var(--charcoal); border-radius:12px; padding:12px; margin-bottom:18px;">
              <div style="font-size:12px; font-weight:800; color:var(--charcoal); margin-bottom:4px;">🤖 AI PLATFORM SYNC:</div>
              <p style="font-size:11.5px; color:#55645e;">Submitting updates Rajesh Kumar's skill credibility score (+0.04), refines Mathura AC failure forecasting, and triggers cooperative welfare bonus distribution.</p>
            </div>

            <button class="btn-primary-red" id="btn-submit-feedback-final">Submit Rating & Sync AI ➔</button>
          </div>
        ` : ''}
      </div>
    `;
  },

  // ========================================================================
  // CUSTOMER BOOKINGS HISTORY TAB
  // ========================================================================
  renderBookingsTab(state) {
    return `
      <div style="padding: 56px 24px 30px 24px;">
        <span class="label-caps">YOUR ACTIVITY</span>
        <h1 class="heading-1" style="margin-bottom:16px;">My Bookings</h1>

        ${state.activeBooking ? `
          <div style="margin-bottom: 24px;">
            <span class="label-caps" style="color:var(--vibrant-red);">ACTIVE IN PROGRESS</span>
            <div class="worker-card-main" style="margin-top:8px; border-color:var(--charcoal);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span class="label-caps">#${state.activeBooking.id}</span>
                <span class="hero-status-badge">
                  <span class="hero-status-pulse"></span>
                  <span class="hero-status-text">${this.getStageTitle(state.activeBooking.currentStageIndex)}</span>
                </span>
              </div>
              <h3 style="font-size:18px; font-weight:900;">${state.activeBooking.serviceName}</h3>
              <p style="font-size:12.5px; color:#5b6a65; margin:4px 0 12px 0;">Worker: ${state.activeBooking.workerName} • Grade ${state.activeBooking.workerGrade}</p>
              
              <button class="btn-primary-red" id="btn-track-active-from-tab">Open Real-Time Tracker ➔</button>
            </div>
          </div>
        ` : ''}

        <span class="label-caps">PAST COMPLETED SERVICES</span>
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:8px;">
          ${state.bookingHistory.map(b => `
            <div class="worker-card-main" style="padding:16px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="font-size:11px; font-weight:800; color:#687973;">${b.date} • #${b.id}</span>
                <span style="background:#e6f8f0; color:#047857; font-size:10px; font-weight:900; padding:2px 8px; border-radius:10px;">${b.status}</span>
              </div>
              <h4 style="font-size:15px; font-weight:900; color:var(--charcoal);">${b.serviceName}</h4>
              <p style="font-size:12px; color:#55625c; margin:2px 0 8px 0;">Worker: ${b.workerName} (Grade ${b.workerGrade})</p>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--gray-green-border); padding-top:8px;">
                <span style="font-size:15px; font-weight:900; color:var(--charcoal);">₹${b.amount}</span>
                <button class="btn-sm-view" data-view-past-invoice="${b.id}">View Invoice</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ========================================================================
  // CUSTOMER PROFILE VIEW
  // ========================================================================
  renderCustomerProfile(state) {
    const cust = INITIAL_DATA.customer;
    return `
      <div style="padding: 56px 24px 30px 24px;">
        <span class="label-caps">ACCOUNT OVERVIEW</span>
        <h1 class="heading-1" style="margin-bottom:16px;">Customer Profile</h1>

        <div style="background:var(--white); border-radius:var(--radius-main); padding:24px; border:1px solid var(--gray-green-border); box-shadow:var(--shadow-main); margin-bottom:20px; text-align:center;">
          <img src="${cust.avatar}" alt="${cust.name}" style="width:72px; height:72px; border-radius:50%; object-fit:cover; margin:0 auto 10px auto; border:3px solid var(--off-white);" />
          <h2 style="font-size:22px; font-weight:900;">${cust.name}</h2>
          <span style="font-size:13px; font-weight:700; color:#60706a;">${cust.phone} • ${cust.email}</span>
          <div style="display:flex; justify-content:center; gap:8px; margin-top:12px;">
            <span class="grade-pill-tag">★ ${cust.rating} Customer Rating</span>
            <span class="grade-pill-tag">GLA University Campus</span>
          </div>
        </div>

        <div class="hero-bento-grid" style="margin-bottom:20px;">
          <div class="bento-metric-card">
            <span class="label-caps">TOTAL BOOKINGS</span>
            <span class="bento-metric-val">${cust.totalBookings}</span>
          </div>
          <div class="bento-metric-card">
            <span class="label-caps">SAHAKARI WALLET</span>
            <span class="bento-metric-val">₹${cust.walletBalance}</span>
          </div>
        </div>

        <!-- Saved Addresses -->
        <div style="background:var(--white); border-radius:var(--radius-nested); padding:18px; border:1px solid var(--gray-green-border); margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 style="font-size:16px; font-weight:900;">Saved Locations</h3>
            <button class="btn-outline-pill" style="font-size:11px;" id="btn-add-new-address">+ Add</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${cust.savedAddresses.map(addr => `
              <div style="padding:10px 12px; border-radius:12px; background:var(--off-white); border:1px solid var(--gray-green-border); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <span class="label-caps">${addr.label}</span>
                  <p style="font-size:12.5px; font-weight:800; color:var(--charcoal);">${addr.address}</p>
                </div>
                ${addr.isDefault ? '<span class="grade-pill-tag" style="background:var(--charcoal); color:var(--white);">Active</span>' : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- More Links / Menu -->
        <div style="display:flex; flex-direction:column; gap:8px;">
          <button class="btn-outline-pill" style="justify-content:flex-start; padding:12px 18px;" id="btn-open-more-menu-profile">
            <span>⚙️ Account Settings & Cooperative Bylaws</span>
          </button>
          <button class="btn-outline-pill" style="justify-content:flex-start; padding:12px 18px;" id="btn-open-support-profile">
            <span>📞 Help, Grievance Cell & Emergency Support</span>
          </button>
        </div>
      </div>
    `;
  },

  // ========================================================================
  // SUPPORT & MESSAGES
  // ========================================================================
  renderSupportMessages(state) {
    return `
      <div style="padding: 56px 24px 30px 24px;">
        <span class="label-caps">COMMUNICATIONS</span>
        <h1 class="heading-1" style="margin-bottom:16px;">Messages & Help</h1>

        <div style="background:var(--white); border-radius:var(--radius-nested); padding:16px; border:1px solid var(--gray-green-border); margin-bottom:18px;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <div style="width:40px; height:40px; border-radius:50%; background:var(--charcoal); color:var(--white); display:flex; align-items:center; justify-content:center; font-size:18px;">
              🛡️
            </div>
            <div>
              <h4 style="font-size:15px; font-weight:900;">Cooperative Support Desk</h4>
              <span style="font-size:12px; color:#5b6a65;">Mathura District Federation • Online 24x7</span>
            </div>
          </div>
          <p style="font-size:13px; color:#495852; line-height:1.4;">Need assistance with a booking, spare part verification, or worker resolution? Our cooperative ombudsman responds within 3 minutes.</p>
          <div style="display:flex; gap:10px; margin-top:14px;">
            <button class="btn-primary-red" style="flex:1; padding:10px;" id="btn-call-support-direct">Call Toll-Free</button>
            <button class="btn-outline-pill" style="flex:1;" id="btn-open-chat-support">Start Chat</button>
          </div>
        </div>

        <span class="label-caps">RECENT SYSTEM ALERTS</span>
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
          ${state.notifications.map(n => `
            <div style="background:var(--white); border-radius:var(--radius-metric); padding:12px 14px; border:1px solid var(--gray-green-border);">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span class="label-caps" style="color:var(--vibrant-red);">${n.type}</span>
                <span style="font-size:11px; color:#788883;">${n.time}</span>
              </div>
              <p style="font-size:13px; font-weight:800; color:var(--charcoal);">${n.title}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ========================================================================
  // WORKER APPLICATION EXPERIENCE
  // ========================================================================
  renderWorkerDashboard(state) {
    const worker = state.workers[0]; // Rajesh Kumar
    const isOnline = state.workerState.isOnline;

    return `
      <div style="padding-bottom: 30px;">
        <header class="worker-app-header">
          <div>
            <span class="label-caps">WORKER DASHBOARD • GRADE ${worker.grade}</span>
            <h1 class="heading-1">${worker.name}</h1>
            <span style="font-size:12px; font-weight:700; color:#5d6c66;">${worker.cooperativeName}</span>
          </div>

          <button class="online-toggle-switch" id="btn-toggle-worker-online">
            <span style="font-size:12px; font-weight:900;">${isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            <div class="toggle-switch-ui" style="${isOnline ? 'background:#10b981;' : 'background:#94a3b8;'}"></div>
          </button>
        </header>

        <!-- Earnings Bento -->
        <div class="worker-earnings-bento">
          <div class="bento-metric-card">
            <span class="label-caps">TODAY</span>
            <span class="bento-metric-val">₹${state.workerState.earningsToday}</span>
          </div>
          <div class="bento-metric-card">
            <span class="label-caps">THIS WEEK</span>
            <span class="bento-metric-val">₹${state.workerState.earningsWeek}</span>
          </div>
          <div class="bento-metric-card">
            <span class="label-caps">WELFARE FUND</span>
            <span class="bento-metric-val">₹${state.workerState.welfareContribution}</span>
          </div>
        </div>

        <!-- Incoming Job Alerts -->
        <div style="padding: 0 24px; margin-bottom: 20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h3 class="heading-2">Incoming Requests (${state.workerState.pendingRequests.length})</h3>
            <span class="label-caps" style="color:var(--vibrant-red);">COOP PRIORITY POOL</span>
          </div>

          ${state.workerState.pendingRequests.length > 0 ? `
            <div style="display:flex; flex-direction:column; gap:10px;">
              ${state.workerState.pendingRequests.map(req => `
                <div class="worker-card-main" style="border-color:var(--vibrant-red); background:#fffaf9;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span class="label-caps" style="color:var(--vibrant-red);">⚡ URGENT • ${req.grade}</span>
                    <span style="font-size:18px; font-weight:900; color:var(--charcoal);">${req.estimatedPay}</span>
                  </div>
                  <h4 style="font-size:16px; font-weight:900; color:var(--charcoal);">${req.service}</h4>
                  <p style="font-size:12.5px; color:#5b6a64; margin:4px 0 12px 0;">Customer: ${req.customer} • ${req.location} (${req.distance})</p>
                  
                  <div style="display:flex; gap:10px;">
                    <button class="btn-outline-pill" style="flex:1;" data-worker-decline="${req.id}">Decline</button>
                    <button class="btn-primary-red" style="flex:1; padding:10px;" data-worker-accept="${req.id}">Accept Job ➔</button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="background:var(--white); border-radius:var(--radius-nested); padding:20px; text-align:center; border:1px solid var(--gray-green-border);">
              <p style="font-size:13.5px; font-weight:700; color:#5a6863;">No pending job requests. Keep online status active to receive nearby dispatches.</p>
            </div>
          `}
        </div>

        <!-- Worker Action Tools Panel -->
        <div style="padding: 0 24px;">
          <h3 class="heading-2" style="margin-bottom:12px;">On-Site Job Actions</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <button class="bento-metric-card" style="text-align:left; cursor:pointer;" id="btn-worker-tool-before">
              <span class="label-caps">BEFORE WORK</span>
              <span style="font-size:14px; font-weight:900; color:var(--charcoal); margin-top:4px;">Upload Before Photos 📸</span>
            </button>
            <button class="bento-metric-card" style="text-align:left; cursor:pointer;" id="btn-worker-tool-parts">
              <span class="label-caps">COOP DARK STORE</span>
              <span style="font-size:14px; font-weight:900; color:var(--charcoal); margin-top:4px;">Request Spares 📦</span>
            </button>
            <button class="bento-metric-card" style="text-align:left; cursor:pointer;" id="btn-worker-tool-after">
              <span class="label-caps">AFTER WORK</span>
              <span style="font-size:14px; font-weight:900; color:var(--charcoal); margin-top:4px;">Upload After Photos ✅</span>
            </button>
            <button class="bento-metric-card" style="text-align:left; cursor:pointer;" id="btn-worker-tool-payout">
              <span class="label-caps">PAYOUT ACCOUNT</span>
              <span style="font-size:14px; font-weight:900; color:var(--charcoal); margin-top:4px;">Bank & UPI Details 🏛️</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // ========================================================================
  // COOPERATIVE MANAGEMENT DASHBOARD
  // ========================================================================
  renderCooperativeDashboard(state) {
    const coop = INITIAL_DATA.cooperatives[0];

    return `
      <div style="padding-bottom: 30px;">
        <header style="padding: 56px 24px 16px 24px;">
          <span class="label-caps">COOPERATIVE SOCIETY PORTAL</span>
          <h1 class="heading-1">${coop.shortName}</h1>
          <span style="font-size:12.5px; font-weight:700; color:#55645e;">Reg: ${coop.registrationNo} • Mathura, UP</span>
        </header>

        <div class="coop-stats-summary">
          <div class="bento-metric-card">
            <span class="label-caps">REGISTERED WORKERS</span>
            <span class="bento-metric-val">${coop.totalWorkers}</span>
          </div>
          <div class="bento-metric-card">
            <span class="label-caps">ACTIVE ON DUTY</span>
            <span class="bento-metric-val">${coop.activeWorkers}</span>
          </div>
          <div class="bento-metric-card">
            <span class="label-caps">WELFARE FUND BALANCE</span>
            <span class="bento-metric-val">${coop.welfareFundPool}</span>
          </div>
          <div class="bento-metric-card">
            <span class="label-caps">SOCIETY RATING</span>
            <span class="bento-metric-val">★ ${coop.rating}</span>
          </div>
        </div>

        <!-- Worker Verifications & Grade Assignment -->
        <div class="coop-section-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="heading-2">Worker Verification & Grade Assignment</h3>
            <span class="label-caps" style="color:var(--vibrant-red);">ACTION REQUIRED</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px;">
            ${state.coopState.pendingVerifications.map(v => `
              <div style="background:var(--off-white); border-radius:var(--radius-nested); padding:14px; border:1px solid var(--gray-green-border); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <h4 style="font-size:15px; font-weight:900;">${v.name}</h4>
                  <p style="font-size:12px; color:#5b6a65;">${v.trade} • ${v.experience} • Assigned: Grade ${v.coopAssignedGrade}</p>
                  <span class="label-caps" style="color:#b45309;">${v.status}</span>
                </div>
                <button class="btn-sm-book" data-approve-coop-worker="${v.id}">Approve Badge</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Cooperative Dark Store Inventory -->
        <div class="coop-section-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="heading-2">Dark Store Spares Stock</h3>
            <button class="btn-outline-pill" style="font-size:11px;" id="btn-add-spare-coop">+ Add Stock</button>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px;">
            ${state.sparePartsInventory.slice(0, 4).map(part => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--gray-green-border); font-size:12.5px;">
                <div>
                  <span style="font-weight:900; color:var(--charcoal);">${part.name}</span>
                  <span style="display:block; color:#687873; font-size:11px;">Stock: ${part.stockCount} units • MRP ₹${part.mrp}</span>
                </div>
                <div style="text-align:right;">
                  <span style="font-weight:900; color:var(--charcoal);">₹${part.coopPrice} (Coop)</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // ========================================================================
  // ADMIN DASHBOARD
  // ========================================================================
  renderAdminDashboard(state) {
    return `
      <div style="padding-bottom: 30px;">
        <div class="admin-header-strip">
          <div>
            <span class="label-caps" style="color:var(--gray-green);">FEDERATION ADMIN</span>
            <h1 style="color:var(--white); font-size:22px; font-weight:900;">Platform Operations</h1>
          </div>
          <button class="btn-outline-pill" style="border-color:rgba(255,255,255,0.4); color:var(--white);" id="btn-open-new-service-modal">
            + New Service
          </button>
        </div>

        <!-- Platform Health Bento -->
        <div class="coop-stats-summary">
          <div class="bento-metric-card">
            <span class="label-caps">AFFILIATED COOPS</span>
            <span class="bento-metric-val">3 Societies</span>
          </div>
          <div class="bento-metric-card">
            <span class="label-caps">TOTAL SKILLED ARTISANS</span>
            <span class="bento-metric-val">735 Verified</span>
          </div>
          <div class="bento-metric-card">
            <span class="label-caps">SURGE PRICING DETECTED</span>
            <span class="bento-metric-val" style="color:#059669;">0% (100% Fair)</span>
          </div>
          <div class="bento-metric-card">
            <span class="label-caps">AVG RESPONSE TIME</span>
            <span class="bento-metric-val">11.8 mins</span>
          </div>
        </div>

        <!-- AI Engine Insights -->
        <div class="coop-section-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 class="heading-2">AI Platform Intelligence</h3>
            <span class="label-caps" style="color:var(--vibrant-red);">LIVE TELEMETRY</span>
          </div>

          <div style="background:var(--off-white); border-radius:var(--radius-nested); padding:16px; border:1px solid var(--gray-green-border); margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span class="label-caps">DEMAND PREDICTION</span>
              <span class="label-caps" style="color:#059669;">ACCURACY: 99.4%</span>
            </div>
            <p style="font-size:13px; font-weight:800; color:var(--charcoal);">${INITIAL_DATA.aiInsights.demandPrediction}</p>
          </div>

          <div style="background:var(--off-white); border-radius:var(--radius-nested); padding:16px; border:1px solid var(--gray-green-border);">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span class="label-caps">FRAUD & FAKE REVIEW AUDITOR</span>
              <span class="label-caps" style="color:#059669;">SECURE</span>
            </div>
            <p style="font-size:13px; font-weight:800; color:var(--charcoal);">${INITIAL_DATA.aiInsights.fakeReviewFlags}</p>
          </div>
        </div>
      </div>
    `;
  },

  // ========================================================================
  // FIXED FLOATING BOTTOM NAVIGATION BAR
  // ========================================================================
  renderBottomNav(state) {
    if (state.role !== 'customer') {
      document.getElementById('floating-bottom-nav').style.display = 'none';
      return;
    }

    document.getElementById('floating-bottom-nav').style.display = 'flex';
    const tab = state.activeCustomerTab;

    const nav = document.getElementById('floating-bottom-nav');
    nav.innerHTML = `
      <button class="nav-item-btn ${tab === 'home' ? 'active' : ''}" data-nav-tab="home">
        <span class="nav-icon">🏠</span>
        <span>Home</span>
      </button>

      <button class="nav-item-btn ${tab === 'bookings' || tab === 'lifecycle' ? 'active' : ''}" data-nav-tab="bookings">
        <span class="nav-icon">📋</span>
        <span>Bookings</span>
      </button>

      <!-- Central Floating Action (56px circular red button) -->
      <div class="central-floating-action-wrap">
        <button class="central-floating-btn" id="central-floating-book-action" title="Book a Service">
          <span>+</span>
        </button>
      </div>

      <button class="nav-item-btn ${tab === 'services' ? 'active' : ''}" data-nav-tab="services">
        <span class="nav-icon">🛠️</span>
        <span>Services</span>
      </button>

      <button class="nav-item-btn ${tab === 'profile' ? 'active' : ''}" data-nav-tab="profile">
        <span class="nav-icon">👤</span>
        <span>Profile</span>
      </button>
    `;

    nav.querySelectorAll('[data-nav-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-nav-tab');
        appStore.setCustomerTab(target);
      });
    });

    const centerBtn = document.getElementById('central-floating-book-action');
    if (centerBtn) {
      centerBtn.addEventListener('click', () => {
        appStore.startBookingForService('srv-elec');
      });
    }
  },

  // ========================================================================
  // MODALS & SHEETS
  // ========================================================================
  renderModal(state) {
    const overlay = document.getElementById('modal-overlay');
    if (!state.activeModal) {
      overlay.classList.remove('active');
      overlay.innerHTML = '';
      return;
    }

    overlay.classList.add('active');
    let content = '';

    if (state.activeModal === 'location') {
      content = `
        <div class="bottom-sheet-modal">
          <div class="sheet-handle-bar"></div>
          <div class="sheet-header-row">
            <h3 class="sheet-header-title">Select Service Location</h3>
            <button class="sheet-close-btn" id="btn-close-modal">✕</button>
          </div>
          <div class="sheet-scroll-body">
            <span class="label-caps">SAVED ADDRESSES</span>
            <div style="display:flex; flex-direction:column; gap:10px; margin-top:8px;">
              ${state.savedAddresses.map(addr => `
                <div class="worker-card-main" style="padding:14px; cursor:pointer;" data-select-loc="${addr.id}">
                  <span class="label-caps">${addr.label}</span>
                  <p style="font-size:13.5px; font-weight:800; color:var(--charcoal); margin-top:2px;">${addr.address}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (state.activeModal === 'worker-profile') {
      const wrk = state.modalExtraData || state.workers[0];
      const gradeInfo = INITIAL_DATA.grades[wrk.grade];
      content = `
        <div class="bottom-sheet-modal">
          <div class="sheet-handle-bar"></div>
          <div class="sheet-header-row">
            <h3 class="sheet-header-title">Worker Profile</h3>
            <button class="sheet-close-btn" id="btn-close-modal">✕</button>
          </div>
          <div class="sheet-scroll-body">
            <div style="display:flex; gap:16px; align-items:center; margin-bottom:16px;">
              <img src="${wrk.avatar}" alt="" style="width:72px; height:72px; border-radius:var(--radius-nested); object-fit:cover;" />
              <div>
                <h2 style="font-size:20px; font-weight:900;">${wrk.name}</h2>
                <span style="font-size:12px; color:#5b6a65;">Worker ID: ${wrk.id}</span>
                <div style="margin-top:4px;">
                  <span class="grade-badge-pill">★ ${gradeInfo.code} ${gradeInfo.badgeTitle}</span>
                </div>
              </div>
            </div>

            <div style="background:var(--white); border-radius:var(--radius-nested); padding:16px; border:1px solid var(--gray-green-border); margin-bottom:16px;">
              <span class="label-caps">COOPERATIVE AFFILIATION</span>
              <p style="font-size:13.5px; font-weight:800; color:var(--charcoal); margin-top:2px;">${wrk.cooperativeName}</p>
              <p style="font-size:12.5px; color:#55635e; margin-top:8px;">${wrk.bio}</p>
            </div>

            <div class="hero-bento-grid" style="margin-bottom:16px;">
              <div class="bento-metric-card">
                <span class="label-caps">RATING</span>
                <span class="bento-metric-val">★ ${wrk.rating}</span>
              </div>
              <div class="bento-metric-card">
                <span class="label-caps">JOBS COMPLETED</span>
                <span class="bento-metric-val">${wrk.completedJobs}</span>
              </div>
              <div class="bento-metric-card">
                <span class="label-caps">EXPERIENCE</span>
                <span class="bento-metric-val">${wrk.experience}</span>
              </div>
              <div class="bento-metric-card">
                <span class="label-caps">STANDARD RATE</span>
                <span class="bento-metric-val">₹${wrk.hourlyRate}/hr</span>
              </div>
            </div>

            <span class="label-caps">VERIFICATION BADGES</span>
            <div style="display:flex; flex-direction:column; gap:6px; margin:8px 0 16px 0;">
              ${wrk.badges.map(b => `<div style="background:var(--white); padding:8px 12px; border-radius:10px; border:1px solid var(--gray-green-border); font-size:12px; font-weight:800;">🛡️ ${b}</div>`).join('')}
            </div>

            <button class="btn-primary-red" id="btn-book-this-worker-modal" data-worker-id="${wrk.id}">Book This Worker ➔</button>
          </div>
        </div>
      `;
    } else if (state.activeModal === 'more-menu') {
      content = `
        <div class="bottom-sheet-modal">
          <div class="sheet-handle-bar"></div>
          <div class="sheet-header-row">
            <h3 class="sheet-header-title">Menu & Services</h3>
            <button class="sheet-close-btn" id="btn-close-modal">✕</button>
          </div>
          <div class="sheet-scroll-body">
            <div style="display:flex; flex-direction:column; gap:8px;">
              <button class="btn-outline-pill" style="justify-content:flex-start; padding:12px 18px;" data-menu-action="bookings">📋 My Bookings</button>
              <button class="btn-outline-pill" style="justify-content:flex-start; padding:12px 18px;" data-menu-action="payments">💳 Payments & Invoices</button>
              <button class="btn-outline-pill" style="justify-content:flex-start; padding:12px 18px;" data-menu-action="addresses">📍 Saved Addresses</button>
              <button class="btn-outline-pill" style="justify-content:flex-start; padding:12px 18px;" data-menu-action="support">📞 Help & Grievance Support</button>
              <button class="btn-outline-pill" style="justify-content:flex-start; padding:12px 18px;" data-menu-action="emergency">🚨 Emergency Assistance</button>
              <button class="btn-outline-pill" style="justify-content:flex-start; padding:12px 18px;" data-menu-action="terms">📜 Terms & Cooperative Bylaws</button>
            </div>
          </div>
        </div>
      `;
    } else if (state.activeModal === 'ai-helper') {
      content = `
        <div class="bottom-sheet-modal">
          <div class="sheet-handle-bar"></div>
          <div class="sheet-header-row">
            <h3 class="sheet-header-title">AI Smart Assistant</h3>
            <button class="sheet-close-btn" id="btn-close-modal">✕</button>
          </div>
          <div class="sheet-scroll-body">
            <p class="body-secondary" style="margin-bottom:16px;">Antigravity Cooperative AI identifies faulty home appliances and parts instantly.</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <button class="btn-primary-red" id="btn-run-ai-ac">Run AC Diagnostic Simulation ➔</button>
              <button class="btn-outline-pill" id="btn-run-ai-plumb">Run Plumbing Leak Simulation ➔</button>
            </div>
          </div>
        </div>
      `;
    }

    overlay.innerHTML = content;

    const closeBtn = document.getElementById('btn-close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => appStore.closeModal());
    }

    // Modal internal actions
    overlay.querySelectorAll('[data-select-loc]').forEach(b => {
      b.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-select-loc');
        const loc = state.savedAddresses.find(a => a.id === id);
        if (loc) appStore.setLocation(loc);
        appStore.closeModal();
      });
    });

    overlay.querySelectorAll('[data-menu-action]').forEach(b => {
      b.addEventListener('click', (e) => {
        const act = e.currentTarget.getAttribute('data-menu-action');
        if (act === 'bookings') appStore.setCustomerTab('bookings');
        else if (act === 'support') appStore.setCustomerTab('messages');
        appStore.closeModal();
      });
    });

    const bookWrkModalBtn = document.getElementById('btn-book-this-worker-modal');
    if (bookWrkModalBtn) {
      bookWrkModalBtn.addEventListener('click', (e) => {
        const wrkId = e.currentTarget.getAttribute('data-worker-id');
        appStore.closeModal();
        appStore.startBookingForService('srv-elec');
        appStore.setWizardWorker(wrkId);
      });
    }

    const runAiAc = document.getElementById('btn-run-ai-ac');
    if (runAiAc) {
      runAiAc.addEventListener('click', () => {
        appStore.closeModal();
        appStore.startBookingForService('srv-ac');
        appStore.simulateAIPhotoDiagnosis('ac-capacitor');
      });
    }
  },

  // ========================================================================
  // DYNAMIC LISTENERS FOR RENDERED SCREENS
  // ========================================================================
  attachDynamicListeners(container, state) {
    // Category pill clicks
    container.querySelectorAll('[data-cat-id]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const catId = e.currentTarget.getAttribute('data-cat-id');
        appStore.setCategory(catId);
      });
    });

    // Quick search chips
    container.querySelectorAll('[data-quick-search]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const q = e.currentTarget.getAttribute('data-quick-search');
        appStore.setSearchQuery(q);
        appStore.setCustomerTab('services');
      });
    });

    // Home search input
    const homeSearch = container.querySelector('#home-service-search-input');
    const btnSearchGo = container.querySelector('#btn-search-go');
    if (homeSearch && btnSearchGo) {
      btnSearchGo.addEventListener('click', () => {
        appStore.setSearchQuery(homeSearch.value);
        appStore.setCustomerTab('services');
      });
      homeSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          appStore.setSearchQuery(homeSearch.value);
          appStore.setCustomerTab('services');
        }
      });
    }

    // Directory search input
    const dirSearch = container.querySelector('#directory-search-input');
    if (dirSearch) {
      dirSearch.addEventListener('input', (e) => {
        appStore.setSearchQuery(e.target.value);
      });
    }

    // Location selector trigger
    const locBtn = container.querySelector('#btn-open-location-modal');
    if (locBtn) {
      locBtn.addEventListener('click', () => appStore.openModal('location'));
    }

    // Profile icon trigger
    const profileBtn = container.querySelector('#btn-open-profile-menu');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => appStore.setCustomerTab('profile'));
    }

    // Quick booking start button
    const quickBookBtn = container.querySelector('#btn-quick-book-start');
    if (quickBookBtn) {
      quickBookBtn.addEventListener('click', () => appStore.startBookingForService('srv-elec'));
    }

    // View all services
    const viewAllBtn = container.querySelector('#btn-view-all-services');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => appStore.setCustomerTab('services'));
    }

    // Live GPS tracking trigger from hero card
    const heroTrackBtn = container.querySelector('#btn-open-live-tracking');
    if (heroTrackBtn) {
      heroTrackBtn.addEventListener('click', () => appStore.setCustomerTab('lifecycle'));
    }

    // Service item click in popular grid or directory
    container.querySelectorAll('[data-service-id]').forEach(item => {
      item.addEventListener('click', (e) => {
        const srvId = e.currentTarget.getAttribute('data-service-id');
        appStore.startBookingForService(srvId);
      });
    });

    container.querySelectorAll('[data-book-service]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const srvId = e.currentTarget.getAttribute('data-book-service');
        appStore.startBookingForService(srvId);
      });
    });

    // Emergency item trigger
    container.querySelectorAll('[data-emergency]').forEach(emg => {
      emg.addEventListener('click', (e) => {
        const srvId = e.currentTarget.getAttribute('data-emergency');
        appStore.startBookingForService(srvId);
      });
    });

    // AI Helper open
    const aiBtn = container.querySelector('#btn-open-ai-helper');
    if (aiBtn) {
      aiBtn.addEventListener('click', () => appStore.openModal('ai-helper'));
    }

    // ======================================================================
    // BOOKING WIZARD LISTENERS
    // ======================================================================
    const simAcBtn = container.querySelector('#btn-simulate-photo-ac');
    if (simAcBtn) {
      simAcBtn.addEventListener('click', () => appStore.simulateAIPhotoDiagnosis('ac-capacitor'));
    }

    const simPlumbBtn = container.querySelector('#btn-simulate-photo-leak');
    if (simPlumbBtn) {
      simPlumbBtn.addEventListener('click', () => appStore.simulateAIPhotoDiagnosis('water-leak'));
    }

    const wNext1 = container.querySelector('#btn-wizard-next-1');
    if (wNext1) {
      wNext1.addEventListener('click', () => {
        const text = container.querySelector('#wizard-requirement-input')?.value;
        appStore.wizard.requirementText = text;
        appStore.wizard.step = 2;
        appStore.notify();
      });
    }

    container.querySelectorAll('[data-select-grade]').forEach(gCard => {
      gCard.addEventListener('click', (e) => {
        const g = e.currentTarget.getAttribute('data-select-grade');
        appStore.setWizardGrade(g);
      });
    });

    const wNext2 = container.querySelector('#btn-wizard-next-2');
    if (wNext2) {
      wNext2.addEventListener('click', () => {
        appStore.wizard.step = 3;
        appStore.notify();
      });
    }

    container.querySelectorAll('[data-choose-worker]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute('data-choose-worker');
        appStore.setWizardWorker(id);
      });
    });

    container.querySelectorAll('[data-view-profile]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute('data-view-profile');
        const wrk = state.workers.find(w => w.id === id);
        appStore.openModal('worker-profile', wrk);
      });
    });

    container.querySelectorAll('[data-pick-date]').forEach(b => {
      b.addEventListener('click', (e) => {
        appStore.wizard.selectedDate = e.currentTarget.getAttribute('data-pick-date');
        appStore.notify();
      });
    });

    container.querySelectorAll('[data-pick-slot]').forEach(b => {
      b.addEventListener('click', (e) => {
        appStore.wizard.selectedSlot = e.currentTarget.getAttribute('data-pick-slot');
        appStore.notify();
      });
    });

    const wNext3 = container.querySelector('#btn-wizard-next-3');
    if (wNext3) {
      wNext3.addEventListener('click', () => {
        appStore.wizard.step = 4;
        appStore.notify();
      });
    }

    const wBack = container.querySelector('#btn-wizard-back');
    if (wBack) {
      wBack.addEventListener('click', () => {
        if (appStore.wizard.step > 1) {
          appStore.wizard.step -= 1;
          appStore.notify();
        } else {
          appStore.setCustomerTab('home');
        }
      });
    }

    const wCancel = container.querySelector('#btn-wizard-cancel');
    if (wCancel) {
      wCancel.addEventListener('click', () => appStore.setCustomerTab('home'));
    }

    const confirmFinal = container.querySelector('#btn-confirm-booking-final');
    if (confirmFinal) {
      confirmFinal.addEventListener('click', () => appStore.confirmNewBooking());
    }

    // ======================================================================
    // LIFECYCLE SIMULATOR LISTENERS
    // ======================================================================
    const simPrev = container.querySelector('#btn-sim-prev');
    const simNext = container.querySelector('#btn-sim-next');
    if (simPrev) simPrev.addEventListener('click', () => appStore.setBookingStage(state.activeBooking.currentStageIndex - 1));
    if (simNext) simNext.addEventListener('click', () => appStore.setBookingStage(state.activeBooking.currentStageIndex + 1));

    const closeLifecycle = container.querySelector('#btn-back-to-home');
    if (closeLifecycle) closeLifecycle.addEventListener('click', () => appStore.setCustomerTab('home'));

    const simAccept = container.querySelector('#btn-simulate-accept');
    if (simAccept) simAccept.addEventListener('click', () => appStore.setBookingStage(1));

    const simOnTheWay = container.querySelector('#btn-simulate-on-the-way');
    if (simOnTheWay) simOnTheWay.addEventListener('click', () => appStore.setBookingStage(2));

    const simArrival = container.querySelector('#btn-simulate-arrival');
    if (simArrival) simArrival.addEventListener('click', () => appStore.setBookingStage(3));

    const approveBefore = container.querySelector('#btn-approve-before-work');
    if (approveBefore) approveBefore.addEventListener('click', () => appStore.approveBeforeWork());

    const gotoSpare = container.querySelector('#btn-goto-spare-decision');
    if (gotoSpare) gotoSpare.addEventListener('click', () => appStore.setBookingStage(4));

    container.querySelectorAll('[data-choose-part]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const partId = e.currentTarget.getAttribute('data-choose-part');
        appStore.selectSparePart(partId);
      });
    });

    const skipSpare = container.querySelector('#btn-skip-spare');
    if (skipSpare) skipSpare.addEventListener('click', () => {
      appStore.skipSparePart();
      appStore.setBookingStage(5);
    });

    const approveSpareStart = container.querySelector('#btn-approve-spare-and-start');
    if (approveSpareStart) approveSpareStart.addEventListener('click', () => appStore.setBookingStage(5));

    const simWorkDone = container.querySelector('#btn-simulate-work-done');
    if (simWorkDone) simWorkDone.addEventListener('click', () => appStore.setBookingStage(6));

    const approveAfter = container.querySelector('#btn-approve-after-work');
    if (approveAfter) approveAfter.addEventListener('click', () => appStore.approveAfterWork());

    const gotoPay = container.querySelector('#btn-goto-payment');
    if (gotoPay) gotoPay.addEventListener('click', () => appStore.setBookingStage(7));

    container.querySelectorAll('[data-pay-method]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const method = e.currentTarget.getAttribute('data-pay-method');
        appStore.completeDigitalPayment(method);
      });
    });

    const instantPay = container.querySelector('#btn-instant-pay');
    if (instantPay) instantPay.addEventListener('click', () => appStore.completeDigitalPayment('UPI (Google Pay)'));

    const proceedToRating = container.querySelector('#btn-proceed-to-rating');
    if (proceedToRating) proceedToRating.addEventListener('click', () => appStore.setBookingStage(9));

    // Feedback Stars
    container.querySelectorAll('.star-rate-icon').forEach(st => {
      st.addEventListener('click', (e) => {
        const val = parseInt(e.currentTarget.getAttribute('data-stars'));
        container.querySelectorAll('.star-rate-icon').forEach((s, idx) => {
          if (idx < val) s.classList.add('active');
          else s.classList.remove('active');
        });
      });
    });

    const submitFeedback = container.querySelector('#btn-submit-feedback-final');
    if (submitFeedback) {
      submitFeedback.addEventListener('click', () => {
        const text = container.querySelector('#feedback-review-text')?.value;
        appStore.submitRating(5, text, 50);
        appStore.setCustomerTab('home');
      });
    }

    // Call / Chat Worker Mock Sheet
    const callWrk = container.querySelector('#btn-call-worker');
    if (callWrk) {
      callWrk.addEventListener('click', () => {
        alert(`Calling ${state.activeBooking.workerName} (${state.activeBooking.workerPhone}) via Cooperative Protected Proxy Line...`);
      });
    }

    const chatWrk = container.querySelector('#btn-chat-worker');
    if (chatWrk) {
      chatWrk.addEventListener('click', () => {
        alert(`In-App Chat with ${state.activeBooking.workerName}: "Arriving in 8 mins at GLA University Block B. Keeping tools ready."`);
      });
    }

    // Worker Dashboard Actions
    const toggleOnline = container.querySelector('#btn-toggle-worker-online');
    if (toggleOnline) {
      toggleOnline.addEventListener('click', () => appStore.toggleWorkerOnline());
    }

    container.querySelectorAll('[data-worker-accept]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-worker-accept');
        appStore.acceptWorkerJob(id);
      });
    });

    // More menu trigger
    const moreMenuTrigger = container.querySelector('#btn-more-menu-trigger') || container.querySelector('#btn-open-more-menu-profile');
    if (moreMenuTrigger) {
      moreMenuTrigger.addEventListener('click', () => appStore.openModal('more-menu'));
    }
  },

  // Helper formatting methods
  getStageTitle(stageIndex) {
    const titles = [
      "Booking Requested",
      "Worker Accepted",
      "Worker On The Way 🚗",
      "Arrived • Before-Work Verification",
      "Spare Parts Determination",
      "Work In Progress ⚡",
      "Work Completed • Verify Work",
      "Digital Payment Pending",
      "Paid • Invoice Available",
      "Service Completed ★★★★★"
    ];
    return titles[stageIndex] || "Active Service";
  },

  getCategoryIcon(iconName) {
    const map = {
      'grid': '㗊',
      'tool': '🛠️',
      'sparkle': '✨',
      'cpu': '🔌',
      'car': '🚗',
      'shield': '🛡️',
      'heart': '❤️',
      'user': '👤',
      'alert-triangle': '🚨'
    };
    return map[iconName] || '🔹';
  },

  getServiceEmoji(icon) {
    const map = {
      'zap': '⚡',
      'droplet': '💧',
      'hammer': '🔨',
      'brush': '🖌️',
      'layers': '🧱',
      'wind': '❄️',
      'box': '🧊',
      'refresh-cw': '🧺',
      'radio': '📻',
      'disc': '🌪️',
      'activity': '🚰',
      'tv': '📺',
      'video': '📹',
      'monitor': '💻',
      'smartphone': '📱',
      'sparkle': '🧹',
      'home': '🏠',
      'coffee': '🍲',
      'heart': '🩺',
      'sun': '🌱',
      'shield-alert': '🐜',
      'tag': '👔',
      'user-check': '✂️',
      'navigation': '🚙',
      'car': '🚕',
      'package': '📦',
      'shield': '👮',
      'users': '👥',
      'briefcase': '🏗️'
    };
    return map[icon] || '🔧';
  }
};

// Auto-boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
