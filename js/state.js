// ==========================================================================
// STATE MANAGEMENT & REACTIVE STORE
// ==========================================================================

class AppState {
  constructor() {
    this.role = 'customer'; // 'customer' | 'worker' | 'coop' | 'admin'
    this.activeCustomerTab = 'home'; // 'home' | 'bookings' | 'services' | 'messages' | 'profile'
    this.isFullScreen = false;

    // Search and Category Filters
    this.selectedCategoryId = 'cat-all';
    this.searchQuery = '';

    // Customer Location
    this.currentLocation = INITIAL_DATA.customer.activeLocation;
    this.savedAddresses = [...INITIAL_DATA.customer.savedAddresses];

    // Services & Categories
    this.categories = [...INITIAL_DATA.categories];
    this.services = [...INITIAL_DATA.services];
    this.workers = [...INITIAL_DATA.workers];
    this.cooperatives = [...INITIAL_DATA.cooperatives];
    this.sparePartsInventory = [...INITIAL_DATA.sparePartsInventory];

    // Active Booking (Real-time Lifecycle State)
    this.activeBooking = JSON.parse(JSON.stringify(INITIAL_DATA.initialActiveBooking));
    this.bookingHistory = [...INITIAL_DATA.bookingHistory];

    // Booking Flow Wizard Draft
    this.wizard = {
      step: 1, // 1: Service details, 2: Requirements & Photo, 3: Grade Selection, 4: Worker Selection, 5: Schedule & Address, 6: Price Review, 7: Confirmed
      service: this.services[0], // Default electrician
      requirementText: '',
      photoUrl: null,
      aiDiagnosis: null,
      selectedGrade: 'A',
      selectedWorker: this.workers[0],
      selectedDate: 'Today',
      selectedSlot: 'In 30 Mins (Immediate)',
      address: this.currentLocation.address,
      customSpares: []
    };

    // Worker State
    this.workerState = {
      isOnline: true,
      earningsToday: 1850,
      earningsWeek: 11400,
      welfareContribution: 1250,
      pendingRequests: [
        {
          id: "REQ-7782",
          service: "AC Deep Clean & PCB Diagnostic",
          customer: "Aditya Sharma",
          location: "GLA University Campus, Block B",
          distance: "1.4 km",
          estimatedPay: "₹520",
          grade: "GRADE A",
          urgent: true
        }
      ]
    };

    // Cooperative State
    this.coopState = {
      pendingVerifications: [
        { id: "APPL-902", name: "Suresh Chandra", trade: "Plumbing Specialist", experience: "6 years", coopAssignedGrade: "B", status: "Pending ID Review" },
        { id: "APPL-905", name: "Mukesh Rajput", trade: "AC & Refrigeration", experience: "9 years", coopAssignedGrade: "A", status: "Trade Test Passed" }
      ],
      totalWelfareFund: "₹4,82,500",
      activeDispatches: 18
    };

    // Notifications
    this.notifications = [
      { id: "notif-1", title: "Worker Rajesh Kumar is On The Way", time: "2 mins ago", read: false, type: "gps" },
      { id: "notif-2", title: "Cooperative Dark Store: Spare Capacitor Dispatched", time: "8 mins ago", read: false, type: "part" },
      { id: "notif-3", title: "Booking Confirmed: ID #COOP-2026-88219", time: "15 mins ago", read: true, type: "booking" }
    ];

    // Active Modal Sheet
    this.activeModal = null; // null | 'location' | 'worker-profile' | 'more-menu' | 'notifications' | 'emergency' | 'ai-helper' | 'new-service'

    // Subscribed listeners
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  setRole(newRole) {
    this.role = newRole;
    this.notify();
  }

  setCustomerTab(tabName) {
    this.activeCustomerTab = tabName;
    this.notify();
  }

  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    this.notify();
  }

  setCategory(catId) {
    this.selectedCategoryId = catId;
    this.notify();
  }

  setSearchQuery(q) {
    this.searchQuery = q;
    this.notify();
  }

  setLocation(loc) {
    this.currentLocation = loc;
    INITIAL_DATA.customer.activeLocation = loc;
    this.notify();
  }

  openModal(modalName, extraData = null) {
    this.activeModal = modalName;
    this.modalExtraData = extraData;
    this.notify();
  }

  closeModal() {
    this.activeModal = null;
    this.modalExtraData = null;
    this.notify();
  }

  // Booking Flow Steps
  startBookingForService(serviceId) {
    const srv = this.services.find(s => s.id === serviceId) || this.services[0];
    this.wizard.service = srv;
    this.wizard.step = 1;
    this.wizard.requirementText = '';
    this.wizard.photoUrl = null;
    this.wizard.aiDiagnosis = null;
    this.wizard.selectedGrade = 'A';
    this.wizard.selectedWorker = this.workers.find(w => w.serviceIds.includes(srv.id) && w.grade === 'A') || this.workers[0];
    this.setCustomerTab('booking-wizard');
    this.notify();
  }

  setWizardGrade(grade) {
    this.wizard.selectedGrade = grade;
    const suitableWorker = this.workers.find(w => w.grade === grade && (w.serviceIds.includes(this.wizard.service.id) || w.primaryService.toLowerCase().includes(this.wizard.service.name.toLowerCase()))) 
      || this.workers.find(w => w.grade === grade) 
      || this.workers[0];
    this.wizard.selectedWorker = suitableWorker;
    this.notify();
  }

  setWizardWorker(workerId) {
    const wrk = this.workers.find(w => w.id === workerId);
    if (wrk) {
      this.wizard.selectedWorker = wrk;
      this.wizard.selectedGrade = wrk.grade;
    }
    this.notify();
  }

  setWizardSchedule(date, slot) {
    this.wizard.selectedDate = date;
    this.wizard.selectedSlot = slot;
    this.notify();
  }

  simulateAIPhotoDiagnosis(sampleType = 'ac-capacitor') {
    if (sampleType === 'ac-capacitor') {
      this.wizard.photoUrl = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
      this.wizard.aiDiagnosis = {
        detectedIssue: "Blown Dual Run Capacitor & Contact Oxidation",
        confidence: "98.4%",
        estimatedDuration: "45 mins",
        suggestedGrade: "GRADE A Master Craftsman (High Voltage Safety)",
        predictedPart: "45µF Heavy-Duty AC Run Capacitor (Stock in Cooperative Dark Store #1)",
        predictedPartPrice: 420
      };
      this.wizard.requirementText = "AC outdoor fan stalled with buzzing noise. AI confirmed capacitor breakdown.";
    } else if (sampleType === 'water-leak') {
      this.wizard.photoUrl = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80';
      this.wizard.aiDiagnosis = {
        detectedIssue: "High-Pressure CPVC Joint Hairline Crack",
        confidence: "95.1%",
        estimatedDuration: "40 mins",
        suggestedGrade: "GRADE B Certified Journeyman",
        predictedPart: "Astral CPVC High-Pressure Pipe Joint Set",
        predictedPartPrice: 190
      };
      this.wizard.requirementText = "Concealed leak behind kitchen wall cabinet.";
    }
    this.notify();
  }

  confirmNewBooking() {
    const newId = `COOP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const gradeInfo = INITIAL_DATA.grades[this.wizard.selectedGrade];
    const base = this.wizard.service.basePrice;
    const gradeAddon = gradeInfo.priceAddon;
    const coopWelfare = 45;
    const platformFee = 30;
    const gst = Math.round((base + gradeAddon) * 0.05);

    this.activeBooking = {
      id: newId,
      serviceId: this.wizard.service.id,
      serviceName: this.wizard.service.name,
      categoryName: this.wizard.service.categoryName,
      workerId: this.wizard.selectedWorker.id,
      workerName: this.wizard.selectedWorker.name,
      workerAvatar: this.wizard.selectedWorker.avatar,
      workerGrade: this.wizard.selectedGrade,
      workerPhone: this.wizard.selectedWorker.phone,
      cooperativeName: this.wizard.selectedWorker.cooperativeName,
      cooperativeReg: "UP-MTH-COOP-4102/2014",
      location: this.wizard.address,
      scheduledTime: `${this.wizard.selectedDate} • ${this.wizard.selectedSlot}`,
      createdAt: "Just now",
      currentStageIndex: 1, // Worker Accepted
      eta: "12 mins",
      distance: "1.8 km",
      speed: "30 km/h",
      pricing: {
        baseCharge: base,
        gradeAddon: gradeAddon,
        gradeTitle: `${gradeInfo.code} ${gradeInfo.badgeTitle}`,
        partRequired: false,
        selectedPart: null,
        cooperativeWelfareFund: coopWelfare,
        platformTechFee: platformFee,
        taxGST: gst,
        total: base + gradeAddon + coopWelfare + platformFee + gst
      },
      customerRequirement: this.wizard.requirementText || "Standard repair and diagnostics requested.",
      customerPhoto: this.wizard.photoUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      beforeVerification: {
        uploaded: true,
        photo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
        workerNotes: "Inspected domestic circuit and components. Ready for customer sign-off.",
        timestamp: "Just now",
        isApprovedByCustomer: false
      },
      afterVerification: {
        uploaded: false,
        photo: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
        workerNotes: "Repairs finalized and safety earthing verified.",
        timestamp: null,
        isApprovedByCustomer: false
      },
      paymentDetails: {
        status: "PENDING",
        method: "UPI (Google Pay)",
        transactionId: null,
        paidAt: null
      },
      ratingFeedback: {
        rating: 5,
        aspects: { serviceQuality: 5, workerBehaviour: 5, timeliness: 5, workQuality: 5 },
        review: "",
        tipAmount: 50,
        submitted: false
      }
    };

    // Add notification
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `Booking Confirmed: #${newId}`,
      time: "Just now",
      read: false,
      type: "booking"
    });

    this.setCustomerTab('lifecycle');
    this.notify();
  }

  // Active Booking Lifecycle Stage Controller
  setBookingStage(stageIndex) {
    if (!this.activeBooking) return;
    this.activeBooking.currentStageIndex = Math.max(0, Math.min(stageIndex, 9));
    
    // Auto-update substates based on stage
    if (stageIndex >= 3) {
      this.activeBooking.beforeVerification.uploaded = true;
    }
    if (stageIndex >= 6) {
      this.activeBooking.afterVerification.uploaded = true;
      this.activeBooking.afterVerification.timestamp = "Just completed";
    }
    if (stageIndex >= 8) {
      this.activeBooking.paymentDetails.status = "COMPLETED";
      this.activeBooking.paymentDetails.transactionId = `TXN-UPI-${Math.floor(100000000 + Math.random() * 900000000)}`;
      this.activeBooking.paymentDetails.paidAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    this.notify();
  }

  advanceBookingStage() {
    if (!this.activeBooking) return;
    this.setBookingStage(this.activeBooking.currentStageIndex + 1);
  }

  approveBeforeWork() {
    if (!this.activeBooking) return;
    this.activeBooking.beforeVerification.isApprovedByCustomer = true;
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: "Before-Work Photos Approved by Customer",
      time: "Just now",
      read: false,
      type: "verification"
    });
    this.notify();
  }

  selectSparePart(partId) {
    if (!this.activeBooking) return;
    const part = this.sparePartsInventory.find(p => p.id === partId);
    if (part) {
      this.activeBooking.pricing.partRequired = true;
      this.activeBooking.pricing.selectedPart = {
        id: part.id,
        name: part.name,
        price: part.coopPrice,
        warehouse: part.warehouse,
        runnerETA: "10 mins (Cooperative Express Delivery)"
      };
      // Recalculate total
      const p = this.activeBooking.pricing;
      p.total = p.baseCharge + p.gradeAddon + p.selectedPart.price + p.cooperativeWelfareFund + p.platformTechFee + p.taxGST;

      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: `Spare Part Approved: ${part.name} (₹${part.coopPrice})`,
        time: "Just now",
        read: false,
        type: "part"
      });
    }
    this.notify();
  }

  skipSparePart() {
    if (!this.activeBooking) return;
    this.activeBooking.pricing.partRequired = false;
    this.activeBooking.pricing.selectedPart = null;
    const p = this.activeBooking.pricing;
    p.total = p.baseCharge + p.gradeAddon + p.cooperativeWelfareFund + p.platformTechFee + p.taxGST;
    this.notify();
  }

  approveAfterWork() {
    if (!this.activeBooking) return;
    this.activeBooking.afterVerification.isApprovedByCustomer = true;
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: "Work Completion Verified by Customer",
      time: "Just now",
      read: false,
      type: "verification"
    });
    this.notify();
  }

  completeDigitalPayment(method) {
    if (!this.activeBooking) return;
    this.activeBooking.paymentDetails.status = "COMPLETED";
    this.activeBooking.paymentDetails.method = method;
    this.activeBooking.paymentDetails.transactionId = `TXN-UPI-${Math.floor(100000000 + Math.random() * 900000000)}`;
    this.activeBooking.paymentDetails.paidAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `Payment Successful: ₹${this.activeBooking.pricing.total} via ${method}`,
      time: "Just now",
      read: false,
      type: "payment"
    });

    this.setBookingStage(8); // Move to Invoice
  }

  submitRating(rating, reviewText, tip) {
    if (!this.activeBooking) return;
    this.activeBooking.ratingFeedback.rating = rating;
    this.activeBooking.ratingFeedback.review = reviewText;
    this.activeBooking.ratingFeedback.tipAmount = tip;
    this.activeBooking.ratingFeedback.submitted = true;

    // AI Platform Update
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: "Cooperative AI Platform: Worker Quality Index & Welfare Bonus Updated",
      time: "Just now",
      read: false,
      type: "ai"
    });

    this.setBookingStage(9); // Completed
  }

  // Worker Side Actions
  toggleWorkerOnline() {
    this.workerState.isOnline = !this.workerState.isOnline;
    this.notify();
  }

  acceptWorkerJob(requestId) {
    this.workerState.pendingRequests = this.workerState.pendingRequests.filter(r => r.id !== requestId);
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `Worker Rajesh Kumar Accepted Job #${requestId}`,
      time: "Just now",
      read: false,
      type: "job"
    });
    this.notify();
  }

  // Admin Dynamic Service Addition
  addNewService(newService) {
    this.services.unshift(newService);
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `New Cooperative Service Published: ${newService.name}`,
      time: "Just now",
      read: false,
      type: "admin"
    });
    this.notify();
  }
}

// Global App State Instance
const appStore = new AppState();
