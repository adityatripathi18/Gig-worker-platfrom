// ==========================================================================
// DATA LAYER: Cooperative Gig Services Platform ("SahakariSeva")
// ==========================================================================

const INITIAL_DATA = {
  customer: {
    id: "CUST-9014",
    name: "Aditya Sharma",
    phone: "+91 98765 43210",
    email: "aditya.sharma@gla.ac.in",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    rating: 4.95,
    totalBookings: 18,
    activeLocation: {
      id: "loc-1",
      label: "Home",
      address: "GLA University Campus, Block B-302",
      city: "Mathura",
      pincode: "281406",
      isDefault: true
    },
    savedAddresses: [
      { id: "loc-1", label: "Home", address: "GLA University Campus, Block B-302, Mathura", pincode: "281406", isDefault: true },
      { id: "loc-2", label: "Hostel / Lab", address: "Academic Block 1, Department of Computing, GLA University", pincode: "281406", isDefault: false },
      { id: "loc-3", label: "Family Residence", address: "42 Krishna Nagar Main Road, Mathura", pincode: "281004", isDefault: false }
    ],
    walletBalance: 850
  },

  cooperatives: [
    {
      id: "COOP-MTH-01",
      name: "Mathura District Shramik Sahakari Samiti",
      shortName: "Mathura Shramik Coop",
      registrationNo: "UP-MTH-COOP-4102/2014",
      established: 2014,
      totalWorkers: 340,
      activeWorkers: 184,
      welfareFundPool: "₹4,82,500",
      rating: 4.88,
      address: "Mandi Samiti Road, Mathura, UP",
      contact: "+91 565 240 8912"
    },
    {
      id: "COOP-BRAJ-02",
      name: "Braj Skilled Artisans & Technical Cooperative",
      shortName: "Braj Artisans Coop",
      registrationNo: "UP-MTH-COOP-6721/2018",
      established: 2018,
      totalWorkers: 215,
      activeWorkers: 142,
      welfareFundPool: "₹2,95,000",
      rating: 4.85,
      address: "Vrindavan Link Road, Chhatikara, Mathura",
      contact: "+91 565 255 1199"
    },
    {
      id: "COOP-YAMUNA-03",
      name: "Yamuna Parivahan & Suraksha Labour Society",
      shortName: "Yamuna Parivahan Coop",
      registrationNo: "UP-MTH-COOP-8830/2020",
      established: 2020,
      totalWorkers: 180,
      activeWorkers: 98,
      welfareFundPool: "₹1,90,400",
      rating: 4.79,
      address: "Raya Road, Near Old Bridge, Mathura",
      contact: "+91 565 246 3320"
    }
  ],

  categories: [
    { id: "cat-all", name: "All Services", icon: "grid", description: "All cooperative verified services" },
    { id: "cat-repair", name: "Home Repair", icon: "tool", description: "Electrical, plumbing, carpentry & structural repairs" },
    { id: "cat-clean", name: "Cleaning", icon: "sparkle", description: "Deep cleaning, sanitation, pest control & daily help" },
    { id: "cat-appliances", name: "Appliances", icon: "cpu", description: "AC, fridge, washing machine, microwave & electronics" },
    { id: "cat-transport", name: "Transport", icon: "car", description: "Verified drivers, logistics & vehicle roadside assistance" },
    { id: "cat-security", name: "Security", icon: "shield", description: "Guards, event security & community caretakers" },
    { id: "cat-care", name: "Care & Help", icon: "heart", description: "Caregivers, cooks, gardening & elderly support" },
    { id: "cat-personal", name: "Personal Services", icon: "user", description: "Tailoring, fitness & daily life assistance" },
    { id: "cat-emergency", name: "Emergency SOS", icon: "alert-triangle", description: "Instant priority dispatch for urgent domestic crises" }
  ],

  services: [
    // HOME REPAIR & MAINTENANCE
    {
      id: "srv-elec",
      categoryId: "cat-repair",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "Electrician",
      shortDesc: "Wiring, switchboard, fuse replacement, inverter & lighting fix",
      fullDesc: "Comprehensive domestic electrical repair by licensed cooperative electricians. Includes load testing, spark troubleshooting, switchboard installation, and safety earthing check.",
      icon: "zap",
      basePrice: 199,
      duration: "45–60 mins",
      isPopular: true,
      isEmergency: true,
      popularTag: "Most Booked",
      gradePricing: { A: 349, B: 249, C: 199 },
      requirementsPlaceholder: "e.g., Sparks coming from bedroom switchboard, tripped MCB repeatedly."
    },
    {
      id: "srv-plumb",
      categoryId: "cat-repair",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "Plumber",
      shortDesc: "Tap leakage, pipe burst, toilet repair, water motor & geyser",
      fullDesc: "Certified cooperative plumbers specializing in leak detection, bathroom fittings, underground pipeline repairs, water tank connections, and sanitary fixtures.",
      icon: "droplet",
      basePrice: 199,
      duration: "45–90 mins",
      isPopular: true,
      isEmergency: true,
      popularTag: "Fast Arrival",
      gradePricing: { A: 349, B: 249, C: 199 },
      requirementsPlaceholder: "e.g., Washbasin drain leaking under cabinet, low water pressure."
    },
    {
      id: "srv-carp",
      categoryId: "cat-repair",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "Carpenter",
      shortDesc: "Door lock, hinge repair, furniture assembly & wooden fixtures",
      fullDesc: "Master carpenters from Braj Artisans Cooperative. Custom woodworking, hinge alignment, modular furniture assembly, handle installation, and woodwork restoration.",
      icon: "hammer",
      basePrice: 249,
      duration: "60–120 mins",
      isPopular: true,
      isEmergency: false,
      gradePricing: { A: 399, B: 299, C: 249 },
      requirementsPlaceholder: "e.g., Balcony door lock jammed, kitchen drawer runner replacement."
    },
    {
      id: "srv-paint",
      categoryId: "cat-repair",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "Painter",
      shortDesc: "Touch-up painting, wall waterproofing, putty & complete repaint",
      fullDesc: "Skilled cooperative painters for spot fixes, dampness sealing, enamel woodwork painting, and room colour transformation with zero-mess promise.",
      icon: "brush",
      basePrice: 399,
      duration: "2–4 hours",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 599, B: 449, C: 349 },
      requirementsPlaceholder: "e.g., Living room accent wall patch paint, exterior balcony sealing."
    },
    {
      id: "srv-mason",
      categoryId: "cat-repair",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "Mason",
      shortDesc: "Tile replacement, brickwork, cement plastering & floor repair",
      fullDesc: "Civil construction artisans for wall patching, bathroom tile resetting, granite counter adjustments, and floor levelling.",
      icon: "layers",
      basePrice: 349,
      duration: "2–4 hours",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 549, B: 429, C: 349 },
      requirementsPlaceholder: "e.g., Cracked bathroom floor tiles, balcony parapet plastering."
    },

    // APPLIANCES & REPAIRS
    {
      id: "srv-ac",
      categoryId: "cat-appliances",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "AC Repair & Servicing",
      shortDesc: "Deep jet clean, gas refill, PCB diagnostics & capacitor replacement",
      fullDesc: "High-pressure foam cleaning, cooling coil check, compressor amp testing, PCB circuit repair, and refrigerant leak detection with warranty.",
      icon: "wind",
      basePrice: 349,
      duration: "60–90 mins",
      isPopular: true,
      isEmergency: true,
      popularTag: "High Demand",
      gradePricing: { A: 549, B: 429, C: 349 },
      requirementsPlaceholder: "e.g., AC blowing normal warm air, outdoor unit vibrating loudly."
    },
    {
      id: "srv-fridge",
      categoryId: "cat-appliances",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "Refrigerator Repair",
      shortDesc: "Cooling failure, thermostat, defrost timer & compressor check",
      fullDesc: "Single and double-door refrigerator troubleshooting. Gas charging, thermostat adjustment, relay replacement, and door gasket sealing.",
      icon: "box",
      basePrice: 299,
      duration: "60 mins",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 479, B: 379, C: 299 },
      requirementsPlaceholder: "e.g., Freezer freezing but lower fridge compartment not cold."
    },
    {
      id: "srv-wm",
      categoryId: "cat-appliances",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "Washing Machine Repair",
      shortDesc: "Spin cycle failure, water draining issue & motor belt fix",
      fullDesc: "Automatic and semi-automatic repairs. Inlet valve clean, pulsator gear replacement, drum bearing balancing, and PCB circuit testing.",
      icon: "refresh-cw",
      basePrice: 299,
      duration: "60 mins",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 479, B: 379, C: 299 },
      requirementsPlaceholder: "e.g., Machine stopping mid-drain with E4 error code."
    },
    {
      id: "srv-micro",
      categoryId: "cat-appliances",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "Microwave Repair",
      shortDesc: "Not heating, turntable stuck, spark & touch panel repair",
      fullDesc: "Magnetron testing, high voltage diode replacement, door microswitch servicing, and keypad touch repair.",
      icon: "radio",
      basePrice: 249,
      duration: "45 mins",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 399, B: 299, C: 249 },
      requirementsPlaceholder: "e.g., Plate rotates but food remains cold."
    },
    {
      id: "srv-mixer",
      categoryId: "cat-appliances",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "Mixer/Grinder Repair",
      shortDesc: "Blade socket, motor carbon brush & coupler replacement",
      fullDesc: "Rapid home repair for domestic blenders and kitchen food processors.",
      icon: "disc",
      basePrice: 149,
      duration: "30 mins",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 249, B: 199, C: 149 },
      requirementsPlaceholder: "e.g., Jar coupler slipping, burning smell from motor."
    },
    {
      id: "srv-ro",
      categoryId: "cat-appliances",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "RO/Water Purifier Repair",
      shortDesc: "Filter cartridge change, pump repair, membrane test & TDS check",
      fullDesc: "Complete domestic RO water purifier service. Sediment and carbon filter replacement, booster pump repair, and automatic cut-off valve repair.",
      icon: "activity",
      basePrice: 249,
      duration: "45 mins",
      isPopular: true,
      isEmergency: false,
      gradePricing: { A: 399, B: 299, C: 249 },
      requirementsPlaceholder: "e.g., Tank not filling, continuous wastewater flow."
    },
    {
      id: "srv-tv",
      categoryId: "cat-appliances",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "TV Repair",
      shortDesc: "LED/OLED backlight, audio issues, HDMI port & power board",
      fullDesc: "Smart TV diagnostic and motherboard servicing with genuine components.",
      icon: "tv",
      basePrice: 299,
      duration: "60 mins",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 499, B: 399, C: 299 },
      requirementsPlaceholder: "e.g., Sound working but black screen."
    },
    {
      id: "srv-cctv",
      categoryId: "cat-appliances",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "CCTV Installation/Repair",
      shortDesc: "Camera setup, DVR configuration, mobile streaming & cabling",
      fullDesc: "Security surveillance installation and troubleshooting for homes and shops.",
      icon: "video",
      basePrice: 349,
      duration: "90 mins",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 549, B: 429, C: 349 },
      requirementsPlaceholder: "e.g., Camera 2 offline on mobile app, DVR hard disk error."
    },
    {
      id: "srv-comp",
      categoryId: "cat-appliances",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "Computer/Laptop Repair",
      shortDesc: "OS reinstall, SSD upgrade, thermal paste, display & battery",
      fullDesc: "Hardware and software troubleshooting by certified computer technicians.",
      icon: "monitor",
      basePrice: 299,
      duration: "60 mins",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 499, B: 379, C: 299 },
      requirementsPlaceholder: "e.g., Windows bluescreen crash, laptop overheating."
    },
    {
      id: "srv-mobile",
      categoryId: "cat-appliances",
      categoryName: "HOME REPAIR & MAINTENANCE",
      name: "Mobile Repair",
      shortDesc: "Screen replacement, battery swap, charging pin & microphone fix",
      fullDesc: "Doorstep mobile diagnosis with genuine cooperative sourced parts.",
      icon: "smartphone",
      basePrice: 199,
      duration: "45 mins",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 349, B: 249, C: 199 },
      requirementsPlaceholder: "e.g., Charging port loose, needs wiggling to charge."
    },

    // HOME & PERSONAL SERVICES
    {
      id: "srv-clean",
      categoryId: "cat-clean",
      categoryName: "HOME & PERSONAL SERVICES",
      name: "Cleaner & Deep Cleaning",
      shortDesc: "Intensive bathroom scrub, kitchen de-greasing & full house clean",
      fullDesc: "Eco-safe hospital grade sanitization by trained cooperative housekeeping teams. Dust extraction, tile scrubbing, and grease elimination.",
      icon: "sparkle",
      basePrice: 399,
      duration: "120–180 mins",
      isPopular: true,
      isEmergency: false,
      popularTag: "Top Rated",
      gradePricing: { A: 599, B: 479, C: 399 },
      requirementsPlaceholder: "e.g., 2 BHK post-renovation deep clean & bathroom tile scrub."
    },
    {
      id: "srv-help",
      categoryId: "cat-care",
      categoryName: "HOME & PERSONAL SERVICES",
      name: "House Help",
      shortDesc: "Daily chores, utensil washing, dusting & cloth folding",
      fullDesc: "Reliable, police-verified daily domestic helpers backed by cooperative society welfare agreements.",
      icon: "home",
      basePrice: 199,
      duration: "60 mins",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 299, B: 249, C: 199 },
      requirementsPlaceholder: "e.g., Helper needed for morning chores and kitchen support."
    },
    {
      id: "srv-cook",
      categoryId: "cat-care",
      categoryName: "HOME & PERSONAL SERVICES",
      name: "Cook",
      shortDesc: "Hygienic home-style meals, breakfast, lunch & family dinners",
      fullDesc: "FSSAI hygiene compliant cooperative home chefs skilled in North Indian, South Indian, and special dietary cooking.",
      icon: "coffee",
      basePrice: 299,
      duration: "90 mins",
      isPopular: true,
      isEmergency: false,
      gradePricing: { A: 449, B: 349, C: 299 },
      requirementsPlaceholder: "e.g., Sattvic dinner for 4 people: Dal Tadka, Sabzi, Phulkas."
    },
    {
      id: "srv-caregiver",
      categoryId: "cat-care",
      categoryName: "HOME & PERSONAL SERVICES",
      name: "Caregiver & Elderly Assistance",
      shortDesc: "Elderly companion, mobility aid, medication reminders & vitals",
      fullDesc: "Certified empathetic healthcare attendants for senior citizen support and patient recovery care.",
      icon: "heart",
      basePrice: 399,
      duration: "2–4 hours",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 599, B: 479, C: 399 },
      requirementsPlaceholder: "e.g., Senior citizen mobility support and evening medication supervision."
    },
    {
      id: "srv-gardener",
      categoryId: "cat-care",
      categoryName: "HOME & PERSONAL SERVICES",
      name: "Gardener",
      shortDesc: "Lawn mowing, plant pruning, potting soil enrichment & pest spray",
      fullDesc: "Horticulture trained cooperative gardeners for balcony planters and lawn upkeep.",
      icon: "sun",
      basePrice: 249,
      duration: "90 mins",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 399, B: 299, C: 249 },
      requirementsPlaceholder: "e.g., Pruning overgrown bougainvillea and terrace planter soil repotting."
    },
    {
      id: "srv-pest",
      categoryId: "cat-clean",
      categoryName: "HOME & PERSONAL SERVICES",
      name: "Pest Control",
      shortDesc: "Termite, cockroach herbal gel & anti-bedbug treatment",
      fullDesc: "Odorless, pet-safe pest elimination with 90-day cooperative service warranty.",
      icon: "shield-alert",
      basePrice: 499,
      duration: "60 mins",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 699, B: 579, C: 499 },
      requirementsPlaceholder: "e.g., Cockroach infestation in kitchen cabinets."
    },
    {
      id: "srv-laundry",
      categoryId: "cat-clean",
      categoryName: "HOME & PERSONAL SERVICES",
      name: "Laundry & Ironing",
      shortDesc: "Steam ironing, doorstep wash & fold, dry cleaning pickup",
      fullDesc: "Crisp steam pressing and hygienic fabric laundering delivered to your doorstep.",
      icon: "tag",
      basePrice: 149,
      duration: "Same-day",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 249, B: 199, C: 149 },
      requirementsPlaceholder: "e.g., 10 shirts and trousers for steam press."
    },
    {
      id: "srv-personal",
      categoryId: "cat-personal",
      categoryName: "HOME & PERSONAL SERVICES",
      name: "Personal Services",
      shortDesc: "Tailoring alterations, home salon & fitness assistance",
      fullDesc: "Certified local artisans providing doorstep lifestyle support.",
      icon: "user-check",
      basePrice: 199,
      duration: "45 mins",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 349, B: 249, C: 199 },
      requirementsPlaceholder: "e.g., Kurta and pant fitting alteration."
    },

    // TRANSPORT & MOBILITY
    {
      id: "srv-driver",
      categoryId: "cat-transport",
      categoryName: "TRANSPORT & MOBILITY",
      name: "Personal Driver / Chauffeur",
      shortDesc: "Hourly city transit, highway outstation & family event driver",
      fullDesc: "Licensed commercial drivers from Yamuna Parivahan Cooperative. Thoroughly vetted, courteous, experienced with manual & automatic transmission.",
      icon: "navigation",
      basePrice: 299,
      duration: "2 hours",
      isPopular: true,
      isEmergency: false,
      popularTag: "Verified Drivers",
      gradePricing: { A: 449, B: 349, C: 299 },
      requirementsPlaceholder: "e.g., Driver for Delhi-NCR airport round trip in Honda City automatic."
    },
    {
      id: "srv-taxi",
      categoryId: "cat-transport",
      categoryName: "TRANSPORT & MOBILITY",
      name: "Taxi Driver",
      shortDesc: "Cooperative taxi ride, fixed rates, zero surge pricing",
      fullDesc: "Cooperative registered tourist and city cabs.",
      icon: "car",
      basePrice: 249,
      duration: "On-demand",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 399, B: 319, C: 249 },
      requirementsPlaceholder: "e.g., Mathura junction to GLA University."
    },
    {
      id: "srv-roadside",
      categoryId: "cat-transport",
      categoryName: "TRANSPORT & MOBILITY",
      name: "Vehicle Assistance & Breakdown",
      shortDesc: "Battery jumpstart, tyre puncture, fuel drop & towing support",
      fullDesc: "24x7 emergency mechanics ready with portable jump-packs and puncture gear.",
      icon: "tool",
      basePrice: 249,
      duration: "30 mins",
      isPopular: false,
      isEmergency: true,
      gradePricing: { A: 399, B: 299, C: 249 },
      requirementsPlaceholder: "e.g., Car battery dead in GLA parking lot, jumpstart required."
    },
    {
      id: "srv-delivery",
      categoryId: "cat-transport",
      categoryName: "TRANSPORT & MOBILITY",
      name: "Delivery Worker",
      shortDesc: "Document courier, parcel dispatch, domestic logistics",
      fullDesc: "Fast cooperative dispatchers for safe local package delivery.",
      icon: "package",
      basePrice: 99,
      duration: "45 mins",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 179, B: 129, C: 99 },
      requirementsPlaceholder: "e.g., Urgent document delivery from GLA campus to District Court."
    },

    // SECURITY & COMMUNITY
    {
      id: "srv-guard",
      categoryId: "cat-security",
      categoryName: "SECURITY & COMMUNITY",
      name: "Security Guard",
      shortDesc: "Residential society guard, shop night watch, access control",
      fullDesc: "Disciplined, PSARA trained security personnel from Yamuna Suraksha Labour Cooperative.",
      icon: "shield",
      basePrice: 399,
      duration: "8 hour shift",
      isPopular: true,
      isEmergency: true,
      popularTag: "Trained & Vetted",
      gradePricing: { A: 599, B: 489, C: 399 },
      requirementsPlaceholder: "e.g., Night guard for society gate B entrance."
    },
    {
      id: "srv-event-sec",
      categoryId: "cat-security",
      categoryName: "SECURITY & COMMUNITY",
      name: "Event Security & Crowd Marshall",
      shortDesc: "Wedding, conference, campus fest & festival security team",
      fullDesc: "Coordinated cooperative security teams for crowd control and dignitary protection.",
      icon: "users",
      basePrice: 499,
      duration: "Per event shift",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 749, B: 599, C: 499 },
      requirementsPlaceholder: "e.g., 2 Marshalls for university cultural evening registration desk."
    },
    {
      id: "srv-labour",
      categoryId: "cat-security",
      categoryName: "SECURITY & COMMUNITY",
      name: "General Labour & Helpers",
      shortDesc: "Heavy lifting, warehouse shifting, debris removal, loading",
      fullDesc: "Physical labour team members insured by the cooperative society.",
      icon: "briefcase",
      basePrice: 249,
      duration: "3 hours",
      isPopular: false,
      isEmergency: false,
      gradePricing: { A: 399, B: 299, C: 249 },
      requirementsPlaceholder: "e.g., Shifting household furniture and boxes from ground to 2nd floor."
    }
  ],

  // WORKER GRADES SPECIFICATION
  grades: {
    A: {
      code: "GRADE A",
      badgeTitle: "Master Craftsman",
      stars: 5,
      starsText: "★★★★★",
      experienceText: "8+ Years Experience",
      verificationLevel: "Advanced Govt & Skill Trade Certified",
      serviceTier: "Premium Master Tier",
      description: "Highly experienced master craftsmen with advanced technical certifications, extensive service history (1,000+ jobs), and highest cooperative peer rating.",
      multiplier: 1.5,
      priceAddon: 150
    },
    B: {
      code: "GRADE B",
      badgeTitle: "Certified Journeyman",
      stars: 4.5,
      starsText: "★★★★☆",
      experienceText: "4–7 Years Experience",
      verificationLevel: "Cooperative Verified & Trade Tested",
      serviceTier: "Standard Verified Tier",
      description: "Experienced, thoroughly vetted technicians with proven track records (500+ jobs). Ideal balance of seasoned skill, reliability, and cooperative value.",
      multiplier: 1.2,
      priceAddon: 80
    },
    C: {
      code: "GRADE C",
      badgeTitle: "Trained Apprentice",
      stars: 4.2,
      starsText: "★★★★☆",
      experienceText: "1–3 Years Experience",
      verificationLevel: "Cooperative Apprentice Certified",
      serviceTier: "Basic Essential Tier",
      description: "Trained and verified entry-level artisans guided by senior cooperative mentors. Fully insured, motivated, and perfect for standard routine household tasks.",
      multiplier: 1.0,
      priceAddon: 0
    }
  },

  // WORKER PROFILES
  workers: [
    {
      id: "WRK-MTH-101",
      name: "Rajesh Kumar",
      phone: "+91 94123 45678",
      avatar: "assets/worker_rajesh.jpg",
      grade: "A",
      cooperativeId: "COOP-MTH-01",
      cooperativeName: "Mathura District Shramik Sahakari Samiti",
      primaryService: "Electrician",
      serviceIds: ["srv-elec", "srv-ac", "srv-appliances"],
      rating: 4.96,
      ratingCount: 312,
      completedJobs: 1420,
      experience: "9 years",
      distance: "1.4 km",
      eta: "8 mins",
      isOnline: true,
      languages: ["Hindi", "Braj Bhasha", "Basic English"],
      skills: ["Industrial Wiring", "Inverter/Solar", "High-Voltage PCB", "AC Compressor Diagnostics", "Short Circuit Safety"],
      hourlyRate: 350,
      badges: ["Govt Trade Certified (ITI)", "Police Clearance 2026", "Cooperative Executive Member", "Zero-Accident Safety Award"],
      bio: "Master Electrician with 9 years of dedicated service in Mathura & Vrindavan. Specialised in complex domestic rewiring, high voltage safety, and inverter setups. Proud member of Mathura Shramik Coop.",
      reviews: [
        { customer: "Dr. Alok Verma", date: "2 days ago", rating: 5, comment: "Rajesh ji identified the faulty capacitor immediately. Solved 3-day mystery in 20 minutes! Very respectful." },
        { customer: "Pooja Singhal", date: "Last week", rating: 5, comment: "Punctual, professional, carried all genuine spares. Highly recommend Grade A service." }
      ]
    },
    {
      id: "WRK-MTH-102",
      name: "Rameshwar Sharma",
      phone: "+91 94123 78901",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80",
      grade: "A",
      cooperativeId: "COOP-MTH-01",
      cooperativeName: "Mathura District Shramik Sahakari Samiti",
      primaryService: "Plumber",
      serviceIds: ["srv-plumb"],
      rating: 4.92,
      ratingCount: 285,
      completedJobs: 1850,
      experience: "12 years",
      distance: "2.1 km",
      eta: "14 mins",
      isOnline: true,
      languages: ["Hindi", "Braj Bhasha"],
      skills: ["Concealed Pipe Detection", "Pressure Pumps", "CPVC Fitting", "Sanitary Ware"],
      hourlyRate: 350,
      badges: ["State Master Plumber Award", "Police Clearance 2026", "Cooperative Trustee"],
      bio: "12 years master plumbing specialist. Expertise in high-pressure plumbing, underground line repairs, and luxury bathroom sanitary ware.",
      reviews: [
        { customer: "Vikram Mehta", date: "3 days ago", rating: 5, comment: "Fixed stubborn concealed leak without breaking wall tiles. Genius!" }
      ]
    },
    {
      id: "WRK-BRAJ-201",
      name: "Amit Verma",
      phone: "+91 98971 12345",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      grade: "B",
      cooperativeId: "COOP-BRAJ-02",
      cooperativeName: "Braj Skilled Artisans & Technical Cooperative",
      primaryService: "Electrician",
      serviceIds: ["srv-elec", "srv-ac"],
      rating: 4.82,
      ratingCount: 140,
      completedJobs: 680,
      experience: "5 years",
      distance: "2.8 km",
      eta: "18 mins",
      isOnline: true,
      languages: ["Hindi", "English"],
      skills: ["Switchboard Upgrades", "Ceiling Fan Installation", "MCB Box Replacement"],
      hourlyRate: 260,
      badges: ["Trade Diploma (Braj Poly)", "Cooperative Verified", "Safety Insured"],
      bio: "Dependable and swift electrician with 5 years experience across residential townships in Mathura. Always carries essential test meters and safety gloves.",
      reviews: [
        { customer: "Neha Gupta", date: "5 days ago", rating: 5, comment: "Polite and solved the tripping fuse problem quickly. Great value." }
      ]
    },
    {
      id: "WRK-BRAJ-202",
      name: "Sunita Devi",
      phone: "+91 97600 44211",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
      grade: "B",
      cooperativeId: "COOP-BRAJ-02",
      cooperativeName: "Braj Skilled Artisans & Technical Cooperative",
      primaryService: "Cleaner & Deep Cleaning",
      serviceIds: ["srv-clean", "srv-help", "srv-cook"],
      rating: 4.89,
      ratingCount: 198,
      completedJobs: 890,
      experience: "6 years",
      distance: "1.8 km",
      eta: "12 mins",
      isOnline: true,
      languages: ["Hindi", "Braj Bhasha"],
      skills: ["Deep Degreasing", "Kitchen Sanitation", "Delicate Fabric Care", "North Indian Cooking"],
      hourlyRate: 280,
      badges: ["FSSAI Hygiene Certificate", "Police Verified", "Top Cooperative Helper 2025"],
      bio: "Specialist in intensive kitchen scrubbing, sanitary bathroom deep cleaning, and delicious homestyle cooking. 6 years trusted cooperative record.",
      reviews: [
        { customer: "Suman Rawat", date: "Yesterday", rating: 5, comment: "Left the kitchen sparkling like new. Very polite and disciplined." }
      ]
    },
    {
      id: "WRK-YAM-301",
      name: "Deepak Singh",
      phone: "+91 98372 90123",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
      grade: "C",
      cooperativeId: "COOP-YAMUNA-03",
      cooperativeName: "Yamuna Parivahan & Suraksha Labour Society",
      primaryService: "Electrician",
      serviceIds: ["srv-elec"],
      rating: 4.74,
      ratingCount: 65,
      completedJobs: 190,
      experience: "2 years",
      distance: "3.2 km",
      eta: "22 mins",
      isOnline: true,
      languages: ["Hindi"],
      skills: ["Bulb & Batten Light Fixing", "Socket Replacement", "Wire Extension"],
      hourlyRate: 199,
      badges: ["Cooperative Vocational Trainee", "ID Verified"],
      bio: "Enthusiastic and sincere junior electrician trained by senior cooperative craftsmen. Fast, courteous, and very affordable for basic home needs.",
      reviews: [
        { customer: "Rahul Yadav", date: "1 week ago", rating: 4.5, comment: "Very humble boy, fixed 3 tube lights and 2 wall sockets neatly." }
      ]
    },
    {
      id: "WRK-YAM-302",
      name: "Harish Chandra",
      phone: "+91 94101 55678",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80",
      grade: "A",
      cooperativeId: "COOP-YAMUNA-03",
      cooperativeName: "Yamuna Parivahan & Suraksha Labour Society",
      primaryService: "Personal Driver / Chauffeur",
      serviceIds: ["srv-driver", "srv-taxi"],
      rating: 4.97,
      ratingCount: 420,
      completedJobs: 2150,
      experience: "14 years",
      distance: "2.5 km",
      eta: "15 mins",
      isOnline: true,
      languages: ["Hindi", "English", "Braj Bhasha"],
      skills: ["Highways & Expressway Pro", "VIP Chauffeur Protocols", "Hill Driving Certified", "Car Maintenance"],
      hourlyRate: 300,
      badges: ["Heavy & Commercial License", "Zero-Accident 10 Yr Record", "Police Verified 2026"],
      bio: "14 years professional driving veteran. Calm, non-smoker, punctuality guaranteed. Familiar with all Delhi-Agra-Jaipur expressways.",
      reviews: [
        { customer: "Prof. S. K. Jain", date: "4 days ago", rating: 5, comment: "Smooth highway drive to IGI Delhi Airport. Extremely courteous." }
      ]
    },
    {
      id: "WRK-MTH-103",
      name: "Karan Bahadur",
      phone: "+91 98970 88214",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80",
      grade: "A",
      cooperativeId: "COOP-MTH-01",
      cooperativeName: "Mathura District Shramik Sahakari Samiti",
      primaryService: "Security Guard",
      serviceIds: ["srv-guard", "srv-event-sec"],
      rating: 4.94,
      ratingCount: 160,
      completedJobs: 940,
      experience: "10 years (Ex-Serviceman)",
      distance: "1.9 km",
      eta: "10 mins",
      isOnline: true,
      languages: ["Hindi", "Nepali", "English"],
      skills: ["Access Control", "First Aid Responder", "Night Vigilance", "Crowd De-escalation"],
      hourlyRate: 320,
      badges: ["Ex-Armed Forces Vetted", "PSARA Certified", "Fire Safety Trained"],
      bio: "Ex-serviceman with 10 years disciplined security leadership. Expert in campus access screening, night patrols, and emergency protocols.",
      reviews: [
        { customer: "GLA Event Committee", date: "Last month", rating: 5, comment: "Handled our annual tech festival perimeter flawlessly." }
      ]
    }
  ],

  // COOPERATIVE DARK STORE / SPARE PARTS INVENTORY
  sparePartsInventory: [
    {
      id: "PART-CAP-45",
      name: "45µF Heavy-Duty AC Run Capacitor",
      category: "AC & Electrical",
      compatibility: "1.0T – 2.0T Split & Window ACs",
      coopPrice: 420,
      mrp: 650,
      stockCount: 48,
      warehouse: "Mathura Dark Store 1 (GLA Junction)",
      deliveryTime: "10–15 mins",
      inStock: true,
      partNumber: "CAP-450V-45UF-AL"
    },
    {
      id: "PART-MCB-32",
      name: "Havells 32A C-Curve Dual Pole MCB",
      category: "Electrical",
      compatibility: "Main DB & Heavy Load Inverter lines",
      coopPrice: 380,
      mrp: 520,
      stockCount: 65,
      warehouse: "Mathura Dark Store 1 (GLA Junction)",
      deliveryTime: "10–12 mins",
      inStock: true,
      partNumber: "MCB-DP-32A-10KA"
    },
    {
      id: "PART-VALVE-BRASS",
      name: "Brass Full-Bore Ball Valve 1 Inch",
      category: "Plumbing",
      compatibility: "Water tank main line & overhead connections",
      coopPrice: 310,
      mrp: 480,
      stockCount: 32,
      warehouse: "Braj Hub Chhatikara",
      deliveryTime: "15 mins",
      inStock: true,
      partNumber: "VALVE-BRS-25MM"
    },
    {
      id: "PART-PIPE-CPVC",
      name: "Astral CPVC High-Pressure Pipe Joint Set",
      category: "Plumbing",
      compatibility: "Hot & cold water concealed lines",
      coopPrice: 190,
      mrp: 290,
      stockCount: 80,
      warehouse: "Mathura Dark Store 1 (GLA Junction)",
      deliveryTime: "10 mins",
      inStock: true,
      partNumber: "CPVC-FIT-075"
    },
    {
      id: "PART-SW-MOD",
      name: "Anchor Roma 16A Modular Switch & Socket Set",
      category: "Electrical",
      compatibility: "Geyser, Microwave, AC & Refrigerator",
      coopPrice: 220,
      mrp: 320,
      stockCount: 110,
      warehouse: "Mathura Dark Store 1 (GLA Junction)",
      deliveryTime: "10 mins",
      inStock: true,
      partNumber: "ROMA-16A-CMB"
    },
    {
      id: "PART-RO-MEM",
      name: "Dow Filmtec 75 GPD RO Membrane Cartridge",
      category: "Water Purifier",
      compatibility: "Universal domestic RO systems (Kent, Aquaguard)",
      coopPrice: 850,
      mrp: 1400,
      stockCount: 22,
      warehouse: "Mathura Dark Store 1 (GLA Junction)",
      deliveryTime: "15 mins",
      inStock: true,
      partNumber: "MEM-75GPD-FLM"
    }
  ],

  // INITIAL ACTIVE BOOKING FOR REAL-TIME SIMULATION
  initialActiveBooking: {
    id: "COOP-2026-88219",
    serviceId: "srv-ac",
    serviceName: "AC Repair & Servicing",
    categoryName: "HOME REPAIR & MAINTENANCE",
    workerId: "WRK-MTH-101",
    workerName: "Rajesh Kumar",
    workerAvatar: "assets/worker_rajesh.jpg",
    workerGrade: "A",
    workerPhone: "+91 94123 45678",
    cooperativeName: "Mathura District Shramik Sahakari Samiti",
    cooperativeReg: "UP-MTH-COOP-4102/2014",
    location: "Home: GLA University Campus, Block B-302, Mathura",
    scheduledTime: "Today • Immediate Priority",
    createdAt: "2026-10-02 20:15",
    
    // CURRENT STAGE: 0 to 8
    // 0: Requested
    // 1: Accepted
    // 2: On The Way (Live GPS Tracking)
    // 3: Arrived & Before-Work Verification
    // 4: Spare Part Decision & Runner Delivery
    // 5: Work in Progress
    // 6: Work Completed & After-Work Verification
    // 7: Digital Payment
    // 8: Paid & Invoice Generated
    // 9: Rating & Feedback Done
    currentStageIndex: 2, // Default in live GPS tracking to wow immediately
    eta: "8 mins",
    distance: "1.4 km",
    speed: "28 km/h",

    // Pricing items
    pricing: {
      baseCharge: 349,
      gradeAddon: 150,
      gradeTitle: "GRADE A Master Craftsman",
      partRequired: true,
      selectedPart: {
        id: "PART-CAP-45",
        name: "45µF Heavy-Duty AC Run Capacitor",
        price: 420,
        warehouse: "Cooperative Dark Store 1",
        runnerETA: "Delivered on site"
      },
      cooperativeWelfareFund: 45, // 10% towards worker healthcare & pension
      platformTechFee: 35,
      taxGST: 40,
      total: 1039 // 349 + 150 + 420 + 45 + 35 + 40
    },

    customerRequirement: "Split AC outdoor condenser humming but fan not rotating. Indoor unit blows ambient warm air.",
    customerPhoto: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    
    beforeVerification: {
      uploaded: true,
      photo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      workerNotes: "Inspected condenser assembly: Old 45uF capacitor bulged with dielectric leak. Contactor points need cleaning. Replacement part required from cooperative inventory.",
      timestamp: "20:25 PM",
      isApprovedByCustomer: true
    },

    afterVerification: {
      uploaded: false,
      photo: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
      workerNotes: "New 45uF capacitor installed with insulated spade lugs. Refrigerant pressure stable at 128 PSI. Amp draw normal at 5.2A. Air vent temperature measured 15.8°C.",
      timestamp: null,
      isApprovedByCustomer: false
    },

    paymentDetails: {
      status: "PENDING", // PENDING or COMPLETED
      method: "UPI (Google Pay)",
      transactionId: null,
      paidAt: null
    },

    ratingFeedback: {
      rating: 5,
      aspects: {
        serviceQuality: 5,
        workerBehaviour: 5,
        timeliness: 5,
        workQuality: 5
      },
      review: "",
      tipAmount: 50,
      submitted: false
    }
  },

  // BOOKING HISTORY FOR CUSTOMER
  bookingHistory: [
    {
      id: "COOP-2026-79110",
      serviceName: "Plumbing - Tap & Sink Fitting",
      workerName: "Rameshwar Sharma",
      workerGrade: "A",
      date: "Sep 24, 2026",
      status: "COMPLETED",
      amount: 479,
      cooperative: "Mathura District Shramik Sahakari Samiti",
      rating: 5
    },
    {
      id: "COOP-2026-64192",
      serviceName: "Deep Cleaning & Washroom Scrub",
      workerName: "Sunita Devi",
      workerGrade: "B",
      date: "Aug 18, 2026",
      status: "COMPLETED",
      amount: 520,
      cooperative: "Braj Skilled Artisans & Technical Cooperative",
      rating: 5
    },
    {
      id: "COOP-2026-51203",
      serviceName: "Personal Driver (Mathura to Agra Round Trip)",
      workerName: "Harish Chandra",
      workerGrade: "A",
      date: "Jul 11, 2026",
      status: "COMPLETED",
      amount: 850,
      cooperative: "Yamuna Parivahan & Suraksha Labour Society",
      rating: 5
    }
  ],

  // EMERGENCY CATEGORIES
  emergencyCategories: [
    { id: "emg-elec", title: "Electrical Emergency", desc: "Sparks, burning smell, power cut", icon: "zap", responseTime: "Under 12 mins" },
    { id: "emg-plumb", title: "Plumbing Burst", desc: "Flooding, pipe fracture, tank overflow", icon: "droplet", responseTime: "Under 15 mins" },
    { id: "emg-ac", title: "AC / Refrigerator Breakdown", desc: "Severe heat distress, food spoiling", icon: "wind", responseTime: "Under 20 mins" },
    { id: "emg-veh", title: "Roadside Breakdown", desc: "Dead battery, flat tyre, jumpstart", icon: "tool", responseTime: "Under 15 mins" },
    { id: "emg-sec", title: "Security SOS", desc: "Urgent gate guard, perimeter check", icon: "shield-alert", responseTime: "Under 10 mins" }
  ],

  // AI INTELLIGENCE SYSTEM STATS
  aiInsights: {
    matchingAccuracy: "99.4%",
    avgResponseTime: "11.8 mins",
    demandPrediction: "High Demand Expected Tomorrow for AC Servicing (Temperature 39°C)",
    fairPricingCompliance: "100% (No Surge Pricing Detected)",
    fakeReviewFlags: "0 Detected (100% Cooperative Vetted Reviews)",
    photoDiagnosticsAccuracy: "96.2% on electrical & HVAC faults"
  }
};
