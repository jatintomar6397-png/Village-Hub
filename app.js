// ==========================================================================
// 0. Global Sidebar Navigation Handlers (Immediately available)
// ==========================================================================
window.toggleSidebarMenu = function(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const btn = document.getElementById('hamburger-btn');
    const menu = document.getElementById('sidebar-menu');
    const overlay = document.getElementById('sidebar-overlay');
    const isOpen = menu && menu.classList.contains('active');

    if (btn) {
        btn.classList.toggle('active', !isOpen);
        btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
        btn.setAttribute('aria-label', !isOpen ? 'Close navigation menu' : 'Open navigation menu');
    }
    if (menu) menu.classList.toggle('active', !isOpen);
    if (overlay) overlay.classList.toggle('active', !isOpen);
    if (document.body) {
        document.body.style.overflow = !isOpen ? 'hidden' : '';
    }
};

window.closeSidebarMenu = function() {
    const btn = document.getElementById('hamburger-btn');
    const menu = document.getElementById('sidebar-menu');
    const overlay = document.getElementById('sidebar-overlay');
    if (btn) {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open navigation menu');
    }
    if (menu) menu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (document.body) {
        document.body.style.overflow = '';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const API = window.VillageHubAPI || window.API;

    // Attach listeners to hamburger button & overlay
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (hamburgerBtn) {
        hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.addEventListener('click', window.toggleSidebarMenu);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', window.closeSidebarMenu);
    }


    // Attach to any close buttons inside sidebar
    document.querySelectorAll('.sidebar-close-btn').forEach(btn => {
        btn.addEventListener('click', window.closeSidebarMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebarMenu && sidebarMenu.classList.contains('active')) {
            window.closeSidebarMenu();
        }
    });

    // Highlight active page in sidebar & navbar and close menu on link click
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-links a, .nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    document.querySelectorAll('.sidebar-links a').forEach(link => {
        link.addEventListener('click', () => {
            window.closeSidebarMenu();
        });
    });


    // ==========================================================================
    // 1. Census-Verified Dataset of 46 Villages (Frontend Fallback)
    //    Used ONLY when backend API is unavailable
    // ==========================================================================
    const DEFAULT_VILLAGES = [
        // --- HAPUR DISTRICT (12 Villages) ---
        { id: 1, name: "Lakhan", district: "Hapur", tehsil: "Simbhawali", pop: "1,520", focus: "Jal Jeevan Mission RO Drinking Water & Pipe Leakage", status: "Completed", progress: 100, lat: 28.7300, lng: 77.7800 },
        { id: 2, name: "Hindalpur", district: "Hapur", tehsil: "Hapur", pop: "2,240", focus: "Primary School Classroom Infrastructure & STEM Lab", status: "In Progress", progress: 70, lat: 28.7050, lng: 77.7550 },
        { id: 3, name: "Galand", district: "Hapur", tehsil: "Dhaulana", pop: "3,150", focus: "Solid Waste Segregation & Solar Streetlighting Grid", status: "Completed", progress: 100, lat: 28.6900, lng: 77.7100 },
        { id: 4, name: "Sapnawat", district: "Hapur", tehsil: "Dhaulana", pop: "3,810", focus: "Primary Health Sub-Center & Emergency Ambulance Access", status: "Under Assessment", progress: 25, lat: 28.6700, lng: 77.7400 },
        { id: 5, name: "Basatpur", district: "Hapur", tehsil: "Hapur", pop: "1,180", focus: "Village Solar Micro-Grid Electrification", status: "Completed", progress: 100, lat: 28.7150, lng: 77.7900 },
        { id: 6, name: "Masota", district: "Hapur", tehsil: "Dhaulana", pop: "940", focus: "Amrit Sarovar Pond Rejuvenation & Rainwater Filtration", status: "Under Assessment", progress: 15, lat: 28.7400, lng: 77.7200 },
        { id: 7, name: "Anwarpur", district: "Hapur", tehsil: "Simbhawali", pop: "1,760", focus: "Digital Anganwadi & Child Nutrition Center", status: "Completed", progress: 100, lat: 28.7500, lng: 77.7600 },
        { id: 8, name: "Atrolli", district: "Hapur", tehsil: "Hapur", pop: "1,320", focus: "Solar Powered Drip Irrigation Pump Set", status: "Under Assessment", progress: 30, lat: 28.6800, lng: 77.8100 },
        { id: 9, name: "Sikhera", district: "Hapur", tehsil: "Hapur", pop: "2,890", focus: "Renewable Biomass & Solar Power Grid", status: "In Progress", progress: 75, lat: 28.7600, lng: 77.7100 },
        { id: 10, name: "Garhmukteshwar", district: "Hapur", tehsil: "Garhmukteshwar", pop: "8,450", focus: "Ganges Riverfront Sewage Treatment & Water Sanitation", status: "Completed", progress: 100, lat: 28.7833, lng: 78.0833 },
        { id: 11, name: "Brajghat", district: "Hapur", tehsil: "Garhmukteshwar", pop: "4,200", focus: "Eco-Tourism Streetlighting & Ghat Sanitation", status: "In Progress", progress: 80, lat: 28.7900, lng: 78.1000 },
        { id: 12, name: "Simbhawali", district: "Hapur", tehsil: "Simbhawali", pop: "6,700", focus: "Sugar Belt Farmers Agro-Tech & Soil Testing Hub", status: "In Progress", progress: 65, lat: 28.7167, lng: 77.9000 },
        // --- GHAZIABAD DISTRICT (8 Villages) ---
        { id: 13, name: "Bhowapur", district: "Ghaziabad", tehsil: "Ghaziabad", pop: "4,500", focus: "Underground Drainage System & Sewer Line Upgrade", status: "Completed", progress: 100, lat: 28.6500, lng: 77.3800 },
        { id: 14, name: "Chijjarsi", district: "Ghaziabad", tehsil: "Ghaziabad", pop: "6,200", focus: "Public Digital Library & Youth Vocational Skills Center", status: "In Progress", progress: 85, lat: 28.6320, lng: 77.3750 },
        { id: 15, name: "Dasna Rural", district: "Ghaziabad", tehsil: "Ghaziabad", pop: "8,900", focus: "Community Water ATM & Historic Pond Desilting", status: "Completed", progress: 100, lat: 28.6800, lng: 77.5300 },
        { id: 16, name: "Muradnagar Rural", district: "Ghaziabad", tehsil: "Modi Nagar", pop: "9,200", focus: "Upper Ganges Canal Water Filtration & Bio-Filter", status: "In Progress", progress: 70, lat: 28.7800, lng: 77.5000 },
        { id: 17, name: "Modinagar Rural", district: "Ghaziabad", tehsil: "Modi Nagar", pop: "11,500", focus: "Women Self-Help Group (SHG) Handloom Training Center", status: "Completed", progress: 100, lat: 28.8333, lng: 77.5833 },
        { id: 18, name: "Loni Rural", district: "Ghaziabad", tehsil: "Loni", pop: "14,200", focus: "Air Pollution Dust Barrier & Green Belt Plantation", status: "Under Assessment", progress: 40, lat: 28.7500, lng: 77.2833 },
        { id: 19, name: "Patla", district: "Ghaziabad", tehsil: "Modi Nagar", pop: "4,900", focus: "Model Anganwadi Infrastructure & Infant Care Unit", status: "Completed", progress: 100, lat: 28.8600, lng: 77.5200 },
        { id: 20, name: "Behta Hajipur", district: "Ghaziabad", tehsil: "Loni", pop: "12,400", focus: "Municipal Solid Waste Management Plant", status: "Completed", progress: 100, lat: 28.7200, lng: 77.2900 },
        // --- MEERUT DISTRICT (8 Villages) ---
        { id: 21, name: "Khera", district: "Meerut", tehsil: "Meerut", pop: "2,400", focus: "Rural Youth Sports Complex & Skill Center", status: "Completed", progress: 100, lat: 28.9800, lng: 77.7000 },
        { id: 22, name: "Hastinapur Rural", district: "Meerut", tehsil: "Mawana", pop: "8,200", focus: "Wildlife Sanctuary Buffer Road & Eco-Sanitation", status: "In Progress", progress: 75, lat: 29.1700, lng: 78.0200 },
        { id: 23, name: "Sardhana Rural", district: "Meerut", tehsil: "Sardhana", pop: "9,600", focus: "Handloom Weavers Power Backup & Solar Grid", status: "Completed", progress: 100, lat: 29.1500, lng: 77.6200 },
        { id: 24, name: "Jani Khurd", district: "Meerut", tehsil: "Meerut", pop: "5,400", focus: "Panchayat Bhawan Computer Center & Broadband", status: "In Progress", progress: 60, lat: 28.9300, lng: 77.5500 },
        { id: 25, name: "Daurala Rural", district: "Meerut", tehsil: "Daurala", pop: "6,800", focus: "Sugar Mill Effluent Treatment & Groundwater Testing", status: "Under Assessment", progress: 35, lat: 29.1100, lng: 77.7300 },
        { id: 26, name: "Mawana Rural", district: "Meerut", tehsil: "Mawana", pop: "7,900", focus: "Cattle Disease Diagnostic Lab & Milk Chilling Center", status: "In Progress", progress: 80, lat: 29.1000, lng: 77.9200 },
        { id: 27, name: "Partapur", district: "Meerut", tehsil: "Meerut", pop: "6,100", focus: "Industrial Drainage Linkage & PMGSY Road Repair", status: "Completed", progress: 100, lat: 28.9000, lng: 77.6700 },
        { id: 28, name: "Kithore", district: "Meerut", tehsil: "Mawana", pop: "5,300", focus: "Mango Belt Cold Storage & Agri-Market Link", status: "In Progress", progress: 65, lat: 28.8700, lng: 77.9300 },
        // --- BULANDSHAHR DISTRICT (7 Villages) ---
        { id: 29, name: "Khurja Rural", district: "Bulandshahr", tehsil: "Khurja", pop: "11,200", focus: "Ceramic Cluster Effluent Filter & Solar Street Lighting", status: "Completed", progress: 100, lat: 28.2500, lng: 77.8500 },
        { id: 30, name: "Siyana Rural", district: "Bulandshahr", tehsil: "Siyana", pop: "7,400", focus: "Fruit Belt Cold Chain & Rural Fire Sub-Station", status: "In Progress", progress: 70, lat: 28.6200, lng: 78.0500 },
        { id: 31, name: "Shikarpur", district: "Bulandshahr", tehsil: "Shikarpur", pop: "6,900", focus: "Jal Jeevan Mission Overhead Water Tank", status: "Completed", progress: 100, lat: 28.2800, lng: 78.0100 },
        { id: 32, name: "Anupshahr Rural", district: "Bulandshahr", tehsil: "Anupshahr", pop: "8,700", focus: "Ganges Riverbank Soil Erosion Barrier & Clean Ghats", status: "In Progress", progress: 80, lat: 28.3600, lng: 78.2700 },
        { id: 33, name: "Gulaothi", district: "Bulandshahr", tehsil: "Bulandshahr", pop: "9,100", focus: "Connecting Highway Bypass Road & Veterinary Clinic", status: "Completed", progress: 100, lat: 28.5800, lng: 77.7800 },
        { id: 34, name: "Jahangirabad", district: "Bulandshahr", tehsil: "Anupshahr", pop: "7,800", focus: "Primary Girls School Science Lab & Sanitation", status: "Under Assessment", progress: 45, lat: 28.4000, lng: 78.1000 },
        { id: 35, name: "Pahasu", district: "Bulandshahr", tehsil: "Shikarpur", pop: "4,800", focus: "Community Health Center Oxygen Plant & Solar Power", status: "In Progress", progress: 65, lat: 28.1700, lng: 78.0500 },
        // --- NOIDA (5 Villages) ---
        { id: 36, name: "Gejha Tilapat", district: "Noida", tehsil: "Noida", pop: "6,500", focus: "Urban-Rural Fringe Stormwater Drainage & CCTV Grid", status: "Completed", progress: 100, lat: 28.5300, lng: 77.3700 },
        { id: 37, name: "Wajidpur", district: "Noida", tehsil: "Noida", pop: "4,200", focus: "Yamuna Floodplain Embankment & Clean Drinking Water", status: "In Progress", progress: 75, lat: 28.5000, lng: 77.3800 },
        { id: 38, name: "Chhaproli Khadar", district: "Noida", tehsil: "Noida", pop: "5,100", focus: "Primary Health Wellness Sub-Center & LED Lighting", status: "Completed", progress: 100, lat: 28.4800, lng: 77.4000 },
        { id: 39, name: "Nagli Wazidpur", district: "Noida", tehsil: "Noida", pop: "3,900", focus: "Pond Restoration under Amrit Sarovar Scheme", status: "Under Assessment", progress: 30, lat: 28.5100, lng: 77.3900 },
        { id: 40, name: "Sorkha", district: "Noida", tehsil: "Noida", pop: "7,800", focus: "Solid Waste Processing Unit & Internal Paved Roads", status: "Completed", progress: 100, lat: 28.5800, lng: 77.3900 },
        // --- GREATER NOIDA (6 Villages) ---
        { id: 41, name: "Surajpur Rural", district: "Greater Noida", tehsil: "Dadri", pop: "8,900", focus: "Surajpur Bird Sanctuary Buffer Eco-Sanitation & Sewage", status: "Completed", progress: 100, lat: 28.5200, lng: 77.4900 },
        { id: 42, name: "Ecotech Rural / Milk Lachi", district: "Greater Noida", tehsil: "Dadri", pop: "4,600", focus: "Industrial Effluent Barrier & Solar Streetlight Grid", status: "In Progress", progress: 80, lat: 28.4700, lng: 77.5000 },
        { id: 43, name: "Knowledge Park Rural / Tughalpur", district: "Greater Noida", tehsil: "Greater Noida", pop: "6,300", focus: "Student Community Housing Water Purification ATM", status: "Completed", progress: 100, lat: 28.4600, lng: 77.5300 },
        { id: 44, name: "Kasna", district: "Greater Noida", tehsil: "Greater Noida", pop: "9,400", focus: "Community Health Center Emergency Unit Upgrade", status: "In Progress", progress: 70, lat: 28.4300, lng: 77.5400 },
        { id: 45, name: "Dankaur Rural", district: "Greater Noida", tehsil: "Dankaur", pop: "10,200", focus: "Yamuna Expressway Feeder Road & Farmers Market Hub", status: "Completed", progress: 100, lat: 28.3500, lng: 77.5500 },
        { id: 46, name: "Bhadol", district: "Greater Noida", tehsil: "Dankaur", pop: "3,200", focus: "Solar Drip Irrigation & Dairy Cold Chain", status: "Under Assessment", progress: 35, lat: 28.4000, lng: 77.5200 }
    ];

    // ==========================================================================
    // API-Backed Data Access Layer (falls back to localStorage if API unavailable)
    // ==========================================================================
    let _villagesCache = null;
    let _apiOnline = null; // null = unknown, true/false

    // Map API village to frontend format
    const mapVillage = (v) => ({
        id: v._id || v.id,
        name: v.name,
        district: v.district,
        tehsil: v.tehsil || '',
        pop: v.population || v.pop || '0',
        focus: v.problems || v.focus || '',
        status: v.status || 'Under Assessment',
        progress: v.progress || 0,
        lat: v.latitude || v.lat || 28.65,
        lng: v.longitude || v.lng || 77.65,
        schools: v.schools || 0,
        hospitals: v.hospitals || 0
    });

    // Check if API is available
    const checkAPI = async () => {
        if (_apiOnline !== null) return _apiOnline;
        try {
            const baseUrl = (window.API_BASE_URL && window.API_BASE_URL.trim())
                ? window.API_BASE_URL.trim().replace(/\/+$/, '')
                : window.location.origin;
            const resp = await fetch(baseUrl + '/api/stats');
            _apiOnline = resp.ok;
        } catch {
            _apiOnline = false;
        }
        return _apiOnline;
    };

    const getVillages = async () => {
        if (_villagesCache && _villagesCache.length > 0) return _villagesCache;
        try {
            const apiObj = window.VillageHubAPI || window.API;
            if (apiObj && typeof apiObj.getVillages === 'function') {
                const result = await apiObj.getVillages();
                if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
                    _villagesCache = result.data.map(mapVillage);
                    _apiOnline = true;
                    return _villagesCache;
                }
            }
        } catch (err) {
            console.warn('API getVillages failed, using verified Census dataset fallback:', err);
        }
        // Fallback to localStorage / DEFAULT_VILLAGES
        _apiOnline = false;
        try {
            const existing = JSON.parse(localStorage.getItem('vh_villages'));
            if (Array.isArray(existing) && existing.length >= 40) {
                _villagesCache = existing;
                return _villagesCache;
            }
        } catch (_) {}
        _villagesCache = DEFAULT_VILLAGES;
        return _villagesCache;
    };

    // Synchronous fallback for immediate rendering — ALWAYS returns valid array of 46 villages
    const getVillagesSync = () => {
        if (_villagesCache && _villagesCache.length > 0) return _villagesCache;
        try {
            const existing = JSON.parse(localStorage.getItem('vh_villages'));
            if (Array.isArray(existing) && existing.length >= 40) return existing;
        } catch (_) {}
        return DEFAULT_VILLAGES;
    };


    const getComplaints = () => JSON.parse(localStorage.getItem('vh_complaints')) || [];
    const setComplaints = (data) => localStorage.setItem('vh_complaints', JSON.stringify(data));
    const getApps = () => JSON.parse(localStorage.getItem('vh_applications')) || [];
    const setApps = (data) => localStorage.setItem('vh_applications', JSON.stringify(data));

    // ==========================================================================
    // 2. Dark / Light Theme Toggle System
    // ==========================================================================
    const themeBtn = document.getElementById('theme-toggle-btn');
    const savedTheme = localStorage.getItem('vh_theme') || 'dark';

    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeBtn) {
                themeBtn.innerHTML = `
                    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>`;
            }
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeBtn) {
                themeBtn.innerHTML = `
                    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m0 13.5V21m8.966-8.966h-2.25m-13.5 0H3m15.364-6.364l-1.591 1.591M6.561 17.439l-1.591 1.591m12.728 0l-1.591-1.591M6.561 6.561L4.97 4.97M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>`;
            }
        }
    };

    applyTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            const next = current === 'light' ? 'dark' : 'light';
            localStorage.setItem('vh_theme', next);
            applyTheme(next);
        });
    }

    // ==========================================================================
    // 3. Auth Modal (Login / Signup) — API-Backed with JWT
    // ==========================================================================
    const authModal = document.getElementById('auth-modal');
    const openAuthBtn = document.getElementById('open-auth-modal');
    const closeAuthBtn = document.getElementById('close-auth-modal');
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    // Update navbar based on auth state
    const updateNavAuth = () => {

        const user = API ? API.getUser() : null;
        if (user && openAuthBtn) {
            // Replace login button with user info
            const navRight = openAuthBtn.parentElement;
            openAuthBtn.style.display = 'none';

            // Check if already replaced
            if (!document.getElementById('nav-user-block')) {
                const userBlock = document.createElement('div');
                userBlock.id = 'nav-user-block';
                userBlock.className = 'nav-user-info';
                userBlock.innerHTML = `
                    <span class="nav-user-avatar">${user.name.charAt(0).toUpperCase()}</span>
                    <span class="nav-user-name">${user.name.split(' ')[0]}</span>
                    <button class="nav-logout-btn" id="nav-logout-btn" title="Logout">Logout</button>
                `;
                navRight.insertBefore(userBlock, openAuthBtn);
                document.getElementById('nav-logout-btn').addEventListener('click', () => {
                    if (confirm('Are you sure you want to logout?')) {
                        API.logout();
                    }
                });
            }
        }
    };
    updateNavAuth();

    if (openAuthBtn && authModal) {
        openAuthBtn.addEventListener('click', () => {
            authModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeModal = () => {
            authModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeModal);
        authModal.addEventListener('click', (e) => { if (e.target === authModal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && authModal.classList.contains('active')) closeModal(); });

        if (tabLogin && tabSignup) {
            tabLogin.addEventListener('click', () => {
                tabLogin.classList.add('active'); tabSignup.classList.remove('active');
                if (loginForm) loginForm.classList.add('active');
                if (signupForm) signupForm.classList.remove('active');
            });
            tabSignup.addEventListener('click', () => {
                tabSignup.classList.add('active'); tabLogin.classList.remove('active');
                if (signupForm) signupForm.classList.add('active');
                if (loginForm) loginForm.classList.remove('active');
            });
        }

        if (loginForm) {
            let isLoginSubmitting = false;
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (isLoginSubmitting) return;
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const origText = submitBtn ? submitBtn.textContent : 'Login';
                if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Logging in...'; }
                isLoginSubmitting = true;

                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                try {
                    await API.login(email, password);
                    Toast.success('Login successful!');
                    closeModal();
                    setTimeout(() => window.location.reload(), 500);
                } catch (err) {
                    Toast.error(err.message || 'Login failed');
                } finally {
                    isLoginSubmitting = false;
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
                }
            });
        }

        if (signupForm) {
            let isSignupSubmitting = false;
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (isSignupSubmitting) return;
                const submitBtn = signupForm.querySelector('button[type="submit"]');
                const origText = submitBtn ? submitBtn.textContent : 'Create Account';
                if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Creating Account...'; }
                isSignupSubmitting = true;

                const name = document.getElementById('signup-name').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;
                try {
                    await API.signup(name, email, password);
                    Toast.success(`Welcome ${name}! Account created successfully.`);
                    closeModal();
                    setTimeout(() => window.location.reload(), 500);
                } catch (err) {
                    Toast.error(err.message || 'Signup failed');
                } finally {
                    isSignupSubmitting = false;
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
                }
            });
        }
    }

    // ==========================================================================
    // 4. Admin Authentication — Server-Validated JWT (No Client Passcode)
    // ==========================================================================
    const lockScreen = document.getElementById('admin-lock-screen');
    const adminWrapper = document.getElementById('admin-dashboard-wrapper');
    const lockForm = document.getElementById('admin-lock-form');
    const passcodeError = document.getElementById('admin-passcode-error');
    const deauthBtn = document.getElementById('deauthorize-device-btn');

    const checkAdminAuth = () => {
        const user = API ? API.getUser() : null;
        if (lockScreen && adminWrapper) {
            if (user && user.role === 'admin') {
                lockScreen.style.display = 'none';
                adminWrapper.style.display = 'block';
            } else {
                lockScreen.style.display = 'block';
                adminWrapper.style.display = 'none';
            }
        }
    };

    checkAdminAuth();

    if (lockForm) {
        // Replace passcode form with admin login
        const lockCard = lockForm.closest('.glass-card');
        if (lockCard) {
            const inputLabel = lockCard.querySelector('label[for="admin-passcode-input"]');
            if (inputLabel) inputLabel.textContent = 'Admin Email';
            const inputField = document.getElementById('admin-passcode-input');
            if (inputField) {
                inputField.type = 'email';
                inputField.placeholder = 'Enter admin email';
                inputField.id = 'admin-email-input';
            }

            // Add password field
            const formGroup = inputField ? inputField.closest('.form-group') : null;
            if (formGroup) {
                const pwGroup = document.createElement('div');
                pwGroup.className = 'form-group';
                pwGroup.style.marginTop = '1rem';
                pwGroup.innerHTML = `
                    <label for="admin-password-input" style="text-align: left;">Password</label>
                    <input type="password" id="admin-password-input" required placeholder="Enter admin password" autocomplete="current-password">
                `;
                formGroup.parentNode.insertBefore(pwGroup, formGroup.nextSibling);
            }

            const submitBtn = lockForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.textContent = 'Login as Admin';
        }

        let isLockSubmitting = false;
        lockForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (isLockSubmitting) return;
            const submitBtn = lockForm.querySelector('button[type="submit"]');
            const origText = submitBtn ? submitBtn.textContent : 'Login as Admin';
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Verifying...'; }
            isLockSubmitting = true;

            const email = document.getElementById('admin-email-input')?.value;
            const password = document.getElementById('admin-password-input')?.value;

            try {
                const result = await API.login(email, password);
                const user = result.user || (result.data && result.data.user);
                if (user && user.role === 'admin') {
                    Toast.success('Admin access granted!');
                    if (passcodeError) passcodeError.style.display = 'none';
                    setTimeout(() => window.location.reload(), 500);
                } else {
                    if (passcodeError) {
                        passcodeError.textContent = 'Access denied. This account does not have admin privileges.';
                        passcodeError.style.display = 'block';
                    }
                    API.clearToken();
                }
            } catch (err) {
                if (passcodeError) {
                    passcodeError.textContent = err.message || 'Invalid credentials';
                    passcodeError.style.display = 'block';
                }
            } finally {
                isLockSubmitting = false;
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
            }
        });
    }

    if (deauthBtn) {
        deauthBtn.addEventListener('click', () => {
            if (confirm("Logout and lock the Admin Control Panel?")) {
                API.logout();
            }
        });
    }

    // ==========================================================================
    // 5. Image File Preview Reader for Complaint Form (`complaint.html`)
    // ==========================================================================
    const compImageInput = document.getElementById('comp-image');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreviewImg = document.getElementById('image-preview-img');
    let currentImageBase64 = "";

    if (compImageInput) {
        compImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    currentImageBase64 = evt.target.result;
                    if (imagePreviewImg) imagePreviewImg.src = currentImageBase64;
                    if (imagePreviewContainer) imagePreviewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                currentImageBase64 = "";
                if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
            }
        });
    }

    const compForm = document.getElementById('complaint-form');
    const compCategorySelect = document.getElementById('comp-category');
    const otherProblemGroup = document.getElementById('other-problem-group');

    // Show/Hide "Others" custom input when category changes
    if (compCategorySelect) {
        compCategorySelect.addEventListener('change', () => {
            if (otherProblemGroup) {
                const otherInput = document.getElementById('comp-other-problem');
                if (compCategorySelect.value === 'Others') {
                    otherProblemGroup.style.display = 'block';
                    if (otherInput) otherInput.required = true;
                } else {
                    otherProblemGroup.style.display = 'none';
                    if (otherInput) { otherInput.required = false; otherInput.value = ''; }
                }
            }
        });
    }

    if (compForm) {
        let isCompSubmitting = false;
        compForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (isCompSubmitting) return;

            const submitBtn = compForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Complaint on Village Hub';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Submitting Complaint...';
            }
            isCompSubmitting = true;

            const name = document.getElementById('comp-name').value;
            const phone = document.getElementById('comp-phone').value;
            const district = document.getElementById('comp-district').value;
            const tehsil = document.getElementById('comp-tehsil').value;
            const village = document.getElementById('comp-village').value;
            let category = document.getElementById('comp-category').value;
            const details = document.getElementById('comp-details').value;

            // If "Others" is selected, use the custom problem text
            if (category === 'Others') {
                const otherProblem = document.getElementById('comp-other-problem');
                if (otherProblem && otherProblem.value.trim()) {
                    category = 'Others: ' + otherProblem.value.trim();
                }
            }

            const compSuccess = document.getElementById('comp-success');

            // Try API first, fallback to localStorage
            try {
                const result = await API.createComplaint({
                    name, phone, district, tehsil, village, category,
                    description: details,
                    image: currentImageBase64,
                    userId: API.getUser()?.id || null
                });

                const compId = (result && result.data && result.data.complaintId) ? result.data.complaintId : '';
                Toast.success(compId ? `Complaint ${compId} submitted successfully on Village Hub!` : 'Your complaint has been registered successfully!');
                
                if (compSuccess) compSuccess.style.display = 'flex';
                compForm.reset();
                currentImageBase64 = "";
                if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
                if (otherProblemGroup) otherProblemGroup.style.display = 'none';
                
                setTimeout(() => {
                    if (compSuccess) compSuccess.style.display = 'none';
                }, 6000);
            } catch (err) {
                if (err.offline) {
                    // Offline fallback
                    const newId = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
                    const complaints = getComplaints();
                    complaints.push({
                        id: newId, complaintId: newId, name, phone, district, tehsil, village, category,
                        image: currentImageBase64, imageData: currentImageBase64, description: details, details,
                        status: 'Submitted',
                        createdAt: new Date().toISOString(),
                        date: new Date().toLocaleDateString()
                    });
                    setComplaints(complaints);
                    Toast.success(`Complaint ${newId} submitted on Village Hub! (Saved locally)`);
                    if (compSuccess) compSuccess.style.display = 'flex';
                    compForm.reset();
                    currentImageBase64 = "";
                    if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
                    if (otherProblemGroup) otherProblemGroup.style.display = 'none';
                    setTimeout(() => {
                        if (compSuccess) compSuccess.style.display = 'none';
                    }, 6000);
                } else {
                    Toast.error(err.message || 'Failed to submit complaint. Please check your details.');
                }
            } finally {
                isCompSubmitting = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    }

    // Program Application / Volunteer Registration Form
    const regForm = document.getElementById('registration-form');
    if (regForm) {
        let isRegSubmitting = false;
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (isRegSubmitting) return;

            const submitBtn = regForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Application to Village Hub';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Submitting Application...';
            }
            isRegSubmitting = true;

            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const phone = document.getElementById('reg-phone').value;
            const village = document.getElementById('reg-village').value;
            const requestedRole = document.getElementById('reg-role').value;
            const message = document.getElementById('reg-message').value;

            const regSuccess = document.getElementById('reg-success');

            try {
                const result = await API.createApplication({
                    name, email, phone, village, requestedRole, message
                });
                if (result && result.success) {
                    Toast.success(`Registration submitted successfully! Our team will contact you.`);
                } else {
                    Toast.success('Application submitted successfully!');
                }
                if (regSuccess) regSuccess.style.display = 'flex';
                regForm.reset();
                setTimeout(() => {
                    if (regSuccess) regSuccess.style.display = 'none';
                }, 6000);
            } catch (err) {
                if (err.offline) {
                    // Fallback
                    const apps = getApps();
                    apps.push({ id: Date.now(), name, email, phone, village, requestedRole, role: requestedRole, message, status: 'Pending', createdAt: new Date().toISOString() });
                    setApps(apps);
                    Toast.success(`Registration saved locally! Thank you.`);
                    if (regSuccess) regSuccess.style.display = 'flex';
                    regForm.reset();
                    setTimeout(() => {
                        if (regSuccess) regSuccess.style.display = 'none';
                    }, 6000);
                } else {
                    Toast.error(err.message || 'Failed to submit application.');
                }
            } finally {
                isRegSubmitting = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    }

    // ==========================================================================
    // 6. Village Card Render Helper with Official Problems & Census Pop
    // ==========================================================================
    const renderVillageCardHTML = (v) => {
        const statusClass = v.status === 'Completed' ? 'status-completed' : (v.status === 'In Progress' ? 'status-progress' : 'status-assessment');
        const distColor = v.district === 'Hapur' ? '#f59e0b' : (v.district === 'Ghaziabad' ? '#3b82f6' : (v.district === 'Meerut' ? '#10b981' : (v.district === 'Bulandshahr' ? '#ec4899' : (v.district === 'Noida' ? '#8b5cf6' : '#06b6d4'))));
        return `
            <div class="village-item-card glass-card" data-status="${v.status}" data-district="${v.district}" data-id="${v.id}" onclick="showVillageDetail('${v.id}')" style="cursor:pointer;">
                <div>
                    <div class="village-header">
                        <h3>${v.name}</h3>
                        <span class="status-badge ${statusClass}">${v.status}</span>
                    </div>
                    <div class="village-details">
                        <div class="detail-row"><span>District:</span> <strong style="color:${distColor};">${v.district}</strong> (${v.tehsil || 'Tehsil'})</div>
                        <div class="detail-row"><span>Census Pop:</span> <strong>${v.pop}</strong></div>
                        <div class="detail-row" style="margin-top:0.4rem;">
                            <span>Official Issue:</span>
                            <strong style="color:var(--text-primary); font-size:0.85rem; display:block; background:rgba(255,255,255,0.05); padding:0.3rem 0.6rem; border-radius:6px; border:1px solid var(--glass-border); margin-top:0.2rem;">
                                ${v.focus}
                            </strong>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 1rem;">
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${v.progress}%;"></div>
                    </div>
                    <div class="progress-info">
                        <span>Project Resolution</span>
                        <strong>${v.progress}%</strong>
                    </div>
                </div>
            </div>
        `;
    };

    // Village Detail Modal
    window.showVillageDetail = (id) => {
        const villages = getVillagesSync();
        const v = villages.find(vil => String(vil.id) === String(id));
        if (!v) return;

        let modal = document.getElementById('village-detail-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'village-detail-modal';
            modal.className = 'village-detail-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="village-detail-content">
                <button class="village-detail-close" onclick="document.getElementById('village-detail-modal').classList.remove('active')">&times;</button>
                <div class="village-detail-header">
                    <h2>${v.name}</h2>
                    <span class="vd-district">${v.district} &bull; ${v.tehsil || 'Rural'}</span>
                </div>
                <div class="village-detail-grid">
                    <div class="vd-stat-card"><div class="vd-stat-value">${v.pop}</div><div class="vd-stat-label">Population</div></div>
                    <div class="vd-stat-card"><div class="vd-stat-value">${v.schools || 0}</div><div class="vd-stat-label">Schools</div></div>
                    <div class="vd-stat-card"><div class="vd-stat-value">${v.hospitals || 0}</div><div class="vd-stat-label">Health Facilities</div></div>
                    <div class="vd-stat-card"><div class="vd-stat-value">${v.progress}%</div><div class="vd-stat-label">${v.status}</div></div>
                </div>
                <div class="vd-info-section">
                    <h4>Official Infrastructure Problem</h4>
                    <p>${v.focus}</p>
                </div>
                <div class="vd-info-section">
                    <h4>GPS Coordinates</h4>
                    <p>Latitude: ${v.lat || 'N/A'}, Longitude: ${v.lng || 'N/A'}</p>
                </div>
                <div class="vd-info-section">
                    <h4>Location Map</h4>
                    <div class="vd-mini-map" id="vd-mini-map"></div>
                </div>
                <div class="vd-actions">
                    <a href="complaint.html" class="btn btn-primary">Report Problem</a>
                    <a href="schemes.html" class="btn btn-secondary">View Schemes</a>
                    <a href="map.html" class="btn btn-outline">Full Map</a>
                </div>
            </div>
        `;

        modal.classList.add('active');
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
        document.addEventListener('keydown', function escHandler(e) { if (e.key === 'Escape') { modal.classList.remove('active'); document.removeEventListener('keydown', escHandler); } });

        // Render mini map
        setTimeout(() => {
            const mapEl = document.getElementById('vd-mini-map');
            if (mapEl && typeof L !== 'undefined' && v.lat && v.lng) {
                const miniMap = L.map(mapEl, { zoomControl: false, attributionControl: false }).setView([v.lat, v.lng], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(miniMap);
                L.marker([v.lat, v.lng]).addTo(miniMap);
            }
        }, 200);
    };

    // ==========================================================================
    // Village Directory & Home Page — API-backed with fallback
    // ==========================================================================
    const villagesGrid = document.getElementById('villages-container');
    const searchInput = document.getElementById('village-search');
    const filterPills = document.querySelectorAll('.filter-pills .pill');

    if (villagesGrid) {
        let query = '';
        let currentFilter = 'all';
        let allVillages = getVillagesSync();
        if (!allVillages || allVillages.length === 0) allVillages = DEFAULT_VILLAGES;

        const updateGrid = () => {
            const filtered = allVillages.filter(v => {
                const matchesSearch = v.name.toLowerCase().includes(query) ||
                                      v.district.toLowerCase().includes(query) ||
                                      (v.tehsil && v.tehsil.toLowerCase().includes(query)) ||
                                      (v.focus && v.focus.toLowerCase().includes(query));
                const matchesFilter = currentFilter === 'all' ||
                                      v.status === currentFilter ||
                                      v.district.toLowerCase().includes(currentFilter.toLowerCase());
                return matchesSearch && matchesFilter;
            });

            if (filtered.length === 0) {
                villagesGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1/-1;">
                        <div class="empty-icon">🔍</div>
                        <h3>No Villages Found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </div>`;
            } else {
                villagesGrid.innerHTML = filtered.map(renderVillageCardHTML).join('');
            }
        };

        updateGrid();

        // Load from API asynchronously and update if data is available
        getVillages().then(villages => {
            if (villages && villages.length > 0) {
                allVillages = villages;
                updateGrid();
            }
        });

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                query = e.target.value.toLowerCase().trim();
                updateGrid();
            });
        }

        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentFilter = pill.getAttribute('data-filter') || 'all';
                updateGrid();
            });
        });
    }

    // Render Featured Villages on Home Page (`index.html`)
    const homeFeaturedGrid = document.getElementById('index-featured-villages');
    if (homeFeaturedGrid) {
        const renderFeatured = (villages) => {
            if (!villages || villages.length === 0) villages = DEFAULT_VILLAGES;
            homeFeaturedGrid.innerHTML = villages.slice(0, 6).map(renderVillageCardHTML).join('');
        };
        renderFeatured(getVillagesSync());
        getVillages().then(v => { if (v && v.length > 0) renderFeatured(v); });
    }

    // Dynamic Stats Count Update
    const statVillagesCount = document.getElementById('stat-villages-count');
    if (statVillagesCount) {
        statVillagesCount.innerText = `${getVillagesSync().length}+`;
        getVillages().then(v => { if (v && v.length > 0) statVillagesCount.innerText = `${v.length}+`; });
    }

    // ==========================================================================
    // 7. Leaflet Interactive Map Module (`map.html` & `index.html`)
    // ==========================================================================
    const mapElement = document.getElementById('village-map') || document.getElementById('village-map-index');
    if (mapElement) {
        const initLeafletMap = () => {
            if (typeof L === 'undefined') {
                // If Leaflet library is still loading from CDN, retry every 100ms up to 3 seconds
                let tries = 0;
                const checkInterval = setInterval(() => {
                    tries++;
                    if (typeof L !== 'undefined') {
                        clearInterval(checkInterval);
                        setupMap();
                    } else if (tries > 30) {
                        clearInterval(checkInterval);
                        renderMapFallback();
                    }
                }, 100);
            } else {
                setupMap();
            }
        };

        const renderMapFallback = () => {
            mapElement.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; min-height:400px; padding:2rem; text-align:center;">
                    <span style="font-size:3rem; margin-bottom:1rem;">🗺️</span>
                    <h3 style="color:var(--text-primary); margin-bottom:0.5rem;">Western UP Interactive Village Map</h3>
                    <p style="color:var(--text-secondary); max-width:550px; margin-bottom:1.25rem;">
                        46 census-verified villages across Hapur, Ghaziabad, Meerut, Bulandshahr, Noida, and Greater Noida are loaded and active.
                    </p>
                    <a href="villages.html" class="btn btn-primary">Browse Villages Directory (${getVillagesSync().length} Villages) &rarr;</a>
                </div>
            `;
        };

        const setupMap = () => {
            try {
                if (mapElement._leaflet_id) return;

                const map = L.map(mapElement.id, {
                    scrollWheelZoom: false
                }).setView([28.6500, 77.6500], 9);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 18,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors | Western UP Panchayati Raj & Village Hub'
                }).addTo(map);

                const renderMarkers = (villages) => {
                    if (!villages || villages.length === 0) return;
                    villages.forEach(v => {
                        const lat = Number(v.lat || v.latitude);
                        const lng = Number(v.lng || v.longitude);
                        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                            const marker = L.marker([lat, lng]).addTo(map);
                            const popupContent = `
                                <div class="map-popup-card" style="padding:0.4rem; min-width:200px;">
                                    <h4 style="color:var(--accent); margin-bottom:0.25rem;">${v.name} (${v.district})</h4>
                                    <p style="margin:0.2rem 0; font-size:0.85rem;"><strong>Tehsil:</strong> ${v.tehsil || 'Rural'}</p>
                                    <p style="margin:0.2rem 0; font-size:0.85rem;"><strong>Census Pop:</strong> ${v.pop || v.population}</p>
                                    <p style="margin:0.2rem 0; font-size:0.85rem;"><strong>Official Issue:</strong> ${v.focus || v.problems}</p>
                                    <p style="margin:0.2rem 0; font-size:0.85rem;"><strong>Status:</strong> ${v.status} (${v.progress}%)</p>
                                    <div style="margin-top:0.5rem;">
                                        <a href="javascript:void(0)" onclick="showVillageDetail('${v.id}')" style="color:var(--accent); font-weight:600; font-size:0.82rem; text-decoration:none;">View Details &rarr;</a>
                                    </div>
                                </div>
                            `;
                            marker.bindPopup(popupContent);
                        }
                    });
                };

                // Render synchronous verified villages immediately
                renderMarkers(getVillagesSync());

                // Invalidate size after layout completes to avoid grey/blank tiles
                setTimeout(() => {
                    try { map.invalidateSize(); } catch (_) {}
                }, 250);

                // Update if API returns additional data
                getVillages().then(villages => {
                    if (villages && villages.length > 0 && _apiOnline) {
                        map.eachLayer(layer => { if (layer instanceof L.Marker) map.removeLayer(layer); });
                        renderMarkers(villages);
                        try { map.invalidateSize(); } catch (_) {}
                    }
                });
            } catch (err) {
                console.error('Leaflet initialization error:', err);
                renderMapFallback();
            }
        };

        initLeafletMap();
    }


    // ==========================================================================
    // 8. Admin Control Panel Controller — API-backed
    // ==========================================================================
    const adminTbody = document.getElementById('admin-villages-tbody');
    const totalVillagesCount = document.getElementById('total-villages-count');

    if (adminTbody) {
        let adminVillages = getVillagesSync();

        const renderAdminVillages = () => {
            if (totalVillagesCount) totalVillagesCount.innerText = adminVillages.length;
            adminTbody.innerHTML = adminVillages.map(v => `
                <tr>
                    <td><strong>${v.name}</strong></td>
                    <td>${v.district} (${v.tehsil || '-'})</td>
                    <td>
                        <input type="text" value="${v.pop}" style="width:95px; padding:0.35rem 0.5rem; border-radius:6px; border:1px solid var(--glass-border); background:var(--bg-tertiary); color:var(--text-primary); font-family:var(--font-sans);" onchange="updateVillagePop('${v.id}', this.value)">
                    </td>
                    <td><span style="font-size:0.85rem;">${v.focus}</span></td>
                    <td>
                        <select onchange="updateVillageStatus('${v.id}', this.value)">
                            <option value="Completed" ${v.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="In Progress" ${v.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Under Assessment" ${v.status === 'Under Assessment' ? 'selected' : ''}>Under Assessment</option>
                        </select>
                    </td>
                    <td>
                        <input type="number" value="${v.progress}" min="0" max="100" style="width:70px; padding:0.35rem 0.5rem; border-radius:6px; border:1px solid var(--glass-border); background:var(--bg-tertiary); color:var(--text-primary);" onchange="updateVillageProgress('${v.id}', this.value)">%
                    </td>
                    <td>
                        <button class="btn btn-outline btn-sm" onclick="deleteVillage('${v.id}')" style="border-color:#f87171; color:#f87171;">Delete</button>
                    </td>
                </tr>
            `).join('');
        };

        // Load from API
        getVillages().then(villages => { adminVillages = villages; renderAdminVillages(); });
        renderAdminVillages();

        window.updateVillagePop = async (id, newPop) => {
            try {
                await API.updateVillage(id, { population: newPop });
                Toast.success('Population updated');
                _villagesCache = null;
                adminVillages = await getVillages();
                renderAdminVillages();
            } catch {
                Toast.error('Failed to update. Using local save.');
            }
        };

        window.updateVillageStatus = async (id, newStatus) => {
            try {
                const update = { status: newStatus };
                if (newStatus === 'Completed') update.progress = 100;
                await API.updateVillage(id, update);
                Toast.success('Status updated');
                _villagesCache = null;
                adminVillages = await getVillages();
                renderAdminVillages();
            } catch {
                Toast.error('Failed to update status');
            }
        };

        window.updateVillageProgress = async (id, newProg) => {
            try {
                const update = { progress: parseInt(newProg) || 0 };
                if (update.progress >= 100) update.status = 'Completed';
                await API.updateVillage(id, update);
                Toast.success('Progress updated');
                _villagesCache = null;
                adminVillages = await getVillages();
                renderAdminVillages();
            } catch {
                Toast.error('Failed to update progress');
            }
        };

        window.deleteVillage = async (id) => {
            if (!confirm("Are you sure you want to delete this village project?")) return;
            try {
                await API.deleteVillage(id);
                Toast.success('Village deleted');
                _villagesCache = null;
                adminVillages = await getVillages();
                renderAdminVillages();
            } catch {
                Toast.error('Failed to delete village');
            }
        };

        // Reset DB Button
        const resetBtn = document.getElementById('reset-db-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                Toast.info('To reset data, run: npm run seed');
            });
        }

        // Add Village Form
        const addVForm = document.getElementById('admin-add-village-form');
        if (addVForm) {
            addVForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('add-v-name').value;
                const district = document.getElementById('add-v-district').value;
                const pop = document.getElementById('add-v-pop').value;
                const focus = document.getElementById('add-v-focus').value;
                const status = document.getElementById('add-v-status').value;
                const progress = parseInt(document.getElementById('add-v-progress').value) || 50;

                try {
                    await API.createVillage({
                        name, district, population: pop, problems: focus,
                        status, progress, latitude: 28.65, longitude: 77.65
                    });
                    Toast.success(`Village "${name}" added!`);
                    addVForm.reset();
                    _villagesCache = null;
                    adminVillages = await getVillages();
                    renderAdminVillages();
                } catch (err) {
                    Toast.error(err.message || 'Failed to add village');
                }
            });
        }

        // Render Complaints Table in Admin Panel
        const adminComplaintsTbody = document.getElementById('admin-complaints-tbody');
        const pendingComplaintsCount = document.getElementById('pending-complaints-count');
        const refreshComplaintsBtn = document.getElementById('refresh-complaints-btn');

        const renderAdminComplaints = async (showToast = false) => {
            let complaints = [];
            try {
                const result = await API.getComplaints();
                complaints = result.data || [];
                if (showToast) Toast.info(`Complaints refreshed: ${complaints.length} found`);
            } catch {
                complaints = getComplaints();
                if (showToast) Toast.warning(`Refreshed from offline storage: ${complaints.length}`);
            }
            if (pendingComplaintsCount) pendingComplaintsCount.innerText = complaints.length;

            if (adminComplaintsTbody) {
                if (complaints.length === 0) {
                    adminComplaintsTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:1.5rem;">No registered citizen complaints.</td></tr>`;
                } else {
                    adminComplaintsTbody.innerHTML = complaints.map(c => {
                        const dateStr = c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : (c.date || '-');
                        return `
                        <tr>
                            <td><strong>${c.name}</strong><br><span style="font-size:0.75rem; color:var(--accent); font-weight:600;">${c.complaintId || c.id}</span></td>
                            <td>${c.phone}</td>
                            <td><strong>${c.village}</strong><br><span style="font-size:0.8rem; color:var(--text-muted);">${c.district} (${c.tehsil || ''})</span></td>
                            <td><span class="status-badge status-progress">${c.category}</span></td>
                            <td>
                                ${(c.image || c.imageData) ? `<img src="${c.image || c.imageData}" style="width:60px; height:45px; object-fit:cover; border-radius:6px; border:1px solid var(--glass-border);" alt="Evidence">` : '<span style="color:var(--text-muted); font-size:0.8rem;">No Photo</span>'}
                            </td>
                            <td><p style="font-size:0.85rem; max-width:240px; margin:0;">${c.description || c.details}</p></td>
                            <td><span style="font-size:0.8rem; color:var(--text-secondary);">${dateStr}</span></td>
                            <td>
                                <select onchange="updateComplaintStatus('${c._id || c.id}', this.value)" style="font-size:0.8rem; padding:0.35rem 0.5rem; border-radius:6px; border:1px solid var(--glass-border); background:var(--bg-tertiary); color:var(--text-primary); font-family:var(--font-sans);">
                                    <option value="Submitted" ${c.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
                                    <option value="Under Review" ${c.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                                    <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                    <option value="Resolved" ${c.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                                    <option value="Rejected" ${c.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                                </select>
                            </td>
                        </tr>
                    `;}).join('');
                }
            }
        };

        if (refreshComplaintsBtn) {
            refreshComplaintsBtn.addEventListener('click', () => renderAdminComplaints(true));
        }

        window.updateComplaintStatus = async (compId, newStatus) => {
            try {
                await API.updateComplaintStatus(compId, newStatus);
                Toast.success(`Complaint status updated to: ${newStatus}`);
                renderAdminComplaints();
            } catch (err) {
                Toast.error(err.message || 'Failed to update complaint status');
            }
        };

        renderAdminComplaints();

        // Render Applications Table
        const adminAppsTbody = document.getElementById('admin-apps-tbody');
        const pendingCountSpan = document.getElementById('pending-app-count');
        const refreshAppsBtn = document.getElementById('refresh-apps-btn');

        const renderAdminApps = async (showToast = false) => {
            let apps = [];
            try {
                const result = await API.getApplications();
                apps = result.data || [];
                if (showToast) Toast.info(`Applications refreshed: ${apps.length} found`);
            } catch {
                apps = getApps();
            }
            if (pendingCountSpan) pendingCountSpan.innerText = apps.length;
            if (adminAppsTbody) {
                if (apps.length === 0) {
                    adminAppsTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.5rem;">No pending registration applications.</td></tr>`;
                } else {
                    adminAppsTbody.innerHTML = apps.map(app => `
                        <tr>
                            <td><strong>${app.name}</strong></td>
                            <td>${app.email}</td>
                            <td>${app.phone || '-'}</td>
                            <td>${app.village}</td>
                            <td><span class="status-badge status-progress">${app.requestedRole || app.role || '-'}</span></td>
                            <td><p style="font-size:0.85rem; max-width:240px; margin:0;">${app.message || '-'}</p></td>
                            <td>
                                <select onchange="updateAppStatus('${app._id || app.id}', this.value)" style="font-size:0.8rem; padding:0.35rem 0.5rem; border-radius:6px; border:1px solid var(--glass-border); background:var(--bg-tertiary); color:var(--text-primary); font-family:var(--font-sans);">
                                    <option value="Pending" ${app.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                    <option value="Approved" ${app.status === 'Approved' ? 'selected' : ''}>Approved</option>
                                    <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                                </select>
                            </td>
                        </tr>
                    `).join('');
                }
            }
        };

        if (refreshAppsBtn) {
            refreshAppsBtn.addEventListener('click', () => renderAdminApps(true));
        }

        window.updateAppStatus = async (appId, newStatus) => {
            try {
                await API.updateApplicationStatus(appId, newStatus);
                Toast.success(`Application ${newStatus.toLowerCase()}`);
                renderAdminApps();
            } catch (err) {
                Toast.error(err.message || 'Failed to update application');
            }
        };

        renderAdminApps();

        // Auto-refresh complaints and applications every 10 seconds for real-time demonstration
        setInterval(() => {
            if (adminWrapper && adminWrapper.style.display !== 'none') {
                renderAdminComplaints(false);
                renderAdminApps(false);
            }
        }, 10000);

        // Admin Tab Buttons Controller
        const tabVillages = document.getElementById('admin-tab-villages');
        const tabComplaints = document.getElementById('admin-tab-complaints');
        const tabApps = document.getElementById('admin-tab-apps');
        const tabAdd = document.getElementById('admin-tab-add');
        const tabKisan = document.getElementById('admin-tab-kisan');
        const tabEducation = document.getElementById('admin-tab-education');
        const tabPanchayat = document.getElementById('admin-tab-panchayat');
        const tabBranding = document.getElementById('admin-tab-branding');

        const panelVillages = document.getElementById('admin-panel-villages');
        const panelComplaints = document.getElementById('admin-panel-complaints');
        const panelApps = document.getElementById('admin-panel-apps');
        const panelAdd = document.getElementById('admin-panel-add');
        const panelKisan = document.getElementById('admin-panel-kisan');
        const panelEducation = document.getElementById('admin-panel-education');
        const panelPanchayat = document.getElementById('admin-panel-panchayat');
        const panelBranding = document.getElementById('admin-panel-branding');

        const tabs = [tabVillages, tabComplaints, tabApps, tabAdd, tabKisan, tabEducation, tabPanchayat, tabBranding];
        const panels = [panelVillages, panelComplaints, panelApps, panelAdd, panelKisan, panelEducation, panelPanchayat, panelBranding];

        tabs.forEach((tab, index) => {
            if (tab && panels[index]) {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => { if (t) t.classList.remove('active'); });
                    panels.forEach(p => { if (p) p.classList.remove('active'); });
                    tab.classList.add('active');
                    panels[index].classList.add('active');

                    // Lazy load data when switching to tabs
                    if (tab === tabKisan) { loadAdminCrops(); loadAdminMandi(); loadAdminWeather(); loadAdminProd(); }
                    if (tab === tabEducation) { loadAdminSchools(); loadAdminHealth(); }
                    if (tab === tabPanchayat) { loadAdminPanchayat(); }
                    if (tab === tabBranding) { loadAdminBranding(); }
                });
            }
        });

        // ---------------------------------------------------------------------
        // ADMIN: Kisan Corner Subtabs & CRUD
        // ---------------------------------------------------------------------
        const kisanSubtabBtns = document.querySelectorAll('#kisan-admin-subtabs .admin-subtab-btn');
        kisanSubtabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                kisanSubtabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const targetSubtab = btn.getAttribute('data-subtab');
                document.querySelectorAll('.kisan-admin-section').forEach(sec => sec.style.display = 'none');
                const targetSec = document.getElementById(targetSubtab);
                if (targetSec) targetSec.style.display = 'block';
            });
        });

        // 1. Crop Calendar
        const adminCropsTbody = document.getElementById('admin-crops-tbody');
        const addCropForm = document.getElementById('admin-add-crop-form');

        const loadAdminCrops = async () => {
            if (!adminCropsTbody) return;
            try {
                const res = await API.getCropCalendar();
                const records = res.data || [];
                if (records.length === 0) {
                    adminCropsTbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:1.5rem;">No crop records found. Add one above!</td></tr>';
                    return;
                }
                adminCropsTbody.innerHTML = records.map(c => `
                    <tr>
                        <td><strong>${c.crop_name}</strong></td>
                        <td><span class="status-badge status-progress">${c.crop_season || 'All'}</span></td>
                        <td>${c.district}</td>
                        <td>${c.sowing_period} &bull; ${c.harvesting_period}</td>
                        <td>${c.recommended_varieties || '—'}<br><span style="font-size:0.75rem; color:var(--text-muted);">${c.estimated_yield || ''}</span></td>
                        <td><span style="font-size:0.8rem; color:var(--text-muted);">${c.source}</span></td>
                        <td>
                            <button class="btn btn-outline btn-sm" onclick="deleteAdminCrop('${c.id}')" style="border-color:#f87171; color:#f87171;">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } catch (err) {
                console.error('Error loading admin crops:', err);
            }
        };

        window.deleteAdminCrop = async (id) => {
            if (!confirm('Are you sure you want to delete this crop record?')) return;
            try {
                await API.deleteCropCalendar(id);
                Toast.success('Crop record deleted');
                loadAdminCrops();
            } catch (err) {
                Toast.error(err.message || 'Failed to delete record');
            }
        };

        if (addCropForm) {
            addCropForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = {
                    crop_name: document.getElementById('crop-in-name').value,
                    crop_season: document.getElementById('crop-in-season').value,
                    district: document.getElementById('crop-in-district').value,
                    sowing_period: document.getElementById('crop-in-sowing').value,
                    harvesting_period: document.getElementById('crop-in-harvest').value,
                    recommended_varieties: document.getElementById('crop-in-var').value,
                    estimated_yield: document.getElementById('crop-in-yield').value,
                    source: document.getElementById('crop-in-source').value,
                    source_url: document.getElementById('crop-in-sourceurl').value,
                    advisory: document.getElementById('crop-in-adv').value,
                    is_verified: true
                };
                try {
                    await API.createCropCalendar(data);
                    Toast.success(`Crop "${data.crop_name}" added successfully!`);
                    addCropForm.reset();
                    loadAdminCrops();
                } catch (err) {
                    Toast.error(err.message || 'Failed to add crop');
                }
            });
        }

        // 2. Mandi Prices
        const adminMandiTbody = document.getElementById('admin-mandi-tbody');
        const addMandiForm = document.getElementById('admin-add-mandi-form');

        const loadAdminMandi = async () => {
            if (!adminMandiTbody) return;
            try {
                const res = await API.getMandiPrices();
                const records = res.data || [];
                if (records.length === 0) {
                    adminMandiTbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:1.5rem;">No mandi price records found.</td></tr>';
                    return;
                }
                adminMandiTbody.innerHTML = records.map(p => `
                    <tr>
                        <td><strong>${p.commodity}</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">${p.variety || ''}</span></td>
                        <td>${p.mandi_name} (${p.district})</td>
                        <td><strong style="color:var(--accent);">₹${p.modal_price}</strong> ${p.price_unit}</td>
                        <td>₹${p.min_price || '—'} / ₹${p.max_price || '—'}</td>
                        <td>${p.price_date || '—'}</td>
                        <td><span class="status-badge status-progress">${p.data_type}</span></td>
                        <td>
                            <button class="btn btn-outline btn-sm" onclick="deleteAdminMandi('${p.id}')" style="border-color:#f87171; color:#f87171;">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } catch (err) {
                console.error('Error loading admin mandi:', err);
            }
        };

        window.deleteAdminMandi = async (id) => {
            if (!confirm('Are you sure you want to delete this mandi price record?')) return;
            try {
                await API.deleteMandiPrice(id);
                Toast.success('Mandi price record deleted');
                loadAdminMandi();
            } catch (err) {
                Toast.error(err.message || 'Failed to delete record');
            }
        };

        if (addMandiForm) {
            addMandiForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = {
                    commodity: document.getElementById('mandi-in-comm').value,
                    mandi_name: document.getElementById('mandi-in-name').value,
                    district: document.getElementById('mandi-in-dist').value,
                    modal_price: parseFloat(document.getElementById('mandi-in-modal').value),
                    min_price: document.getElementById('mandi-in-min').value ? parseFloat(document.getElementById('mandi-in-min').value) : null,
                    max_price: document.getElementById('mandi-in-max').value ? parseFloat(document.getElementById('mandi-in-max').value) : null,
                    price_unit: document.getElementById('mandi-in-unit').value,
                    price_date: document.getElementById('mandi-in-date').value || new Date().toISOString().split('T')[0],
                    data_type: document.getElementById('mandi-in-datatype').value,
                    source: 'AGMARKNET',
                    source_url: document.getElementById('mandi-in-url').value,
                    is_verified: true
                };
                try {
                    await API.createMandiPrice(data);
                    Toast.success(`Price record for "${data.commodity}" saved!`);
                    addMandiForm.reset();
                    loadAdminMandi();
                } catch (err) {
                    Toast.error(err.message || 'Failed to save price');
                }
            });
        }

        // 3. Weather Advisories
        const adminWeatherTbody = document.getElementById('admin-weather-tbody');
        const addWeatherForm = document.getElementById('admin-add-weather-form');

        const loadAdminWeather = async () => {
            if (!adminWeatherTbody) return;
            try {
                const res = await API.getWeatherAdvisories();
                const records = res.data || [];
                if (records.length === 0) {
                    adminWeatherTbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:1.5rem;">No weather advisories found.</td></tr>';
                    return;
                }
                adminWeatherTbody.innerHTML = records.map(w => `
                    <tr>
                        <td><strong>${w.title}</strong></td>
                        <td>${w.district}</td>
                        <td>${w.temperature_min || '—'} - ${w.temperature_max || '—'} °C</td>
                        <td>${w.forecast_period || '—'}</td>
                        <td><span style="font-size:0.8rem; color:${w.warnings && w.warnings !== 'None' ? '#f87171' : 'var(--text-muted)'};">${w.warnings || 'None'}</span></td>
                        <td>
                            <button class="btn btn-outline btn-sm" onclick="deleteAdminWeather('${w.id}')" style="border-color:#f87171; color:#f87171;">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } catch (err) {
                console.error('Error loading admin weather:', err);
            }
        };

        window.deleteAdminWeather = async (id) => {
            if (!confirm('Are you sure you want to delete this weather advisory?')) return;
            try {
                await API.deleteWeatherAdvisory(id);
                Toast.success('Weather advisory deleted');
                loadAdminWeather();
            } catch (err) {
                Toast.error(err.message || 'Failed to delete');
            }
        };

        if (addWeatherForm) {
            addWeatherForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = {
                    district: document.getElementById('weather-in-dist').value,
                    title: document.getElementById('weather-in-title').value,
                    forecast_period: document.getElementById('weather-in-period').value,
                    temperature_min: document.getElementById('weather-in-tmin').value,
                    temperature_max: document.getElementById('weather-in-tmax').value,
                    rainfall_info: document.getElementById('weather-in-rain').value,
                    warnings: document.getElementById('weather-in-warn').value,
                    description: document.getElementById('weather-in-desc').value,
                    source: document.getElementById('weather-in-source').value,
                    source_url: document.getElementById('weather-in-url').value,
                    is_verified: true
                };
                try {
                    await API.createWeatherAdvisory(data);
                    Toast.success('Weather advisory published!');
                    addWeatherForm.reset();
                    loadAdminWeather();
                } catch (err) {
                    Toast.error(err.message || 'Failed to publish advisory');
                }
            });
        }

        // 4. Production Stats
        const adminProdTbody = document.getElementById('admin-prod-tbody');
        const addProdForm = document.getElementById('admin-add-prod-form');

        const loadAdminProd = async () => {
            if (!adminProdTbody) return;
            try {
                const res = await API.getProductionStats();
                const records = res.data || [];
                if (records.length === 0) {
                    adminProdTbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:1.5rem;">No production statistics recorded.</td></tr>';
                    return;
                }
                adminProdTbody.innerHTML = records.map(s => `
                    <tr>
                        <td><strong>${s.crop_name}</strong></td>
                        <td>${s.agricultural_year}</td>
                        <td>${s.district}</td>
                        <td>${s.cultivated_area || '—'}</td>
                        <td>${s.production || '—'}</td>
                        <td>${s.yield || '—'}</td>
                        <td>
                            <button class="btn btn-outline btn-sm" onclick="deleteAdminProd('${s.id}')" style="border-color:#f87171; color:#f87171;">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } catch (err) {
                console.error('Error loading admin production stats:', err);
            }
        };

        window.deleteAdminProd = async (id) => {
            if (!confirm('Are you sure you want to delete this production record?')) return;
            try {
                await API.deleteProductionStat(id);
                Toast.success('Production statistic deleted');
                loadAdminProd();
            } catch (err) {
                Toast.error(err.message || 'Failed to delete');
            }
        };

        if (addProdForm) {
            addProdForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = {
                    crop_name: document.getElementById('prod-in-crop').value,
                    agricultural_year: document.getElementById('prod-in-year').value,
                    district: document.getElementById('prod-in-dist').value,
                    cultivated_area: document.getElementById('prod-in-area').value,
                    production: document.getElementById('prod-in-prod').value,
                    yield: document.getElementById('prod-in-yield').value,
                    geographic_level: document.getElementById('prod-in-geo').value,
                    source: document.getElementById('prod-in-source').value,
                    is_verified: true
                };
                try {
                    await API.createProductionStat(data);
                    Toast.success('Production statistic added!');
                    addProdForm.reset();
                    loadAdminProd();
                } catch (err) {
                    Toast.error(err.message || 'Failed to add statistic');
                }
            });
        }

        // ---------------------------------------------------------------------
        // ADMIN: Education & Healthcare Subtabs & CRUD
        // ---------------------------------------------------------------------
        const eduSubtabBtns = document.querySelectorAll('#edu-admin-subtabs .admin-subtab-btn');
        eduSubtabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                eduSubtabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const targetSubtab = btn.getAttribute('data-subtab');
                document.querySelectorAll('.edu-admin-section').forEach(sec => sec.style.display = 'none');
                const targetSec = document.getElementById(targetSubtab);
                if (targetSec) targetSec.style.display = 'block';
            });
        });

        // 1. Schools
        const adminSchoolsTbody = document.getElementById('admin-schools-tbody');
        const addSchoolForm = document.getElementById('admin-add-school-form');

        const loadAdminSchools = async () => {
            if (!adminSchoolsTbody) return;
            try {
                const res = await API.getSchools();
                const records = res.data || [];
                if (records.length === 0) {
                    adminSchoolsTbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:1.5rem;">No school records found.</td></tr>';
                    return;
                }
                adminSchoolsTbody.innerHTML = records.map(s => `
                    <tr>
                        <td><strong>${s.school_name || 'Group Record'}</strong></td>
                        <td><span class="status-badge status-progress">${s.school_type}</span></td>
                        <td>${s.district}${s.village ? ' / ' + s.village : ''}</td>
                        <td>${s.total_students ? s.total_students.toLocaleString('en-IN') : '—'}</td>
                        <td>${s.total_teachers || '—'}</td>
                        <td>${s.academic_year}</td>
                        <td>
                            <button class="btn btn-outline btn-sm" onclick="deleteAdminSchool('${s.id}')" style="border-color:#f87171; color:#f87171;">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } catch (err) {
                console.error('Error loading admin schools:', err);
            }
        };

        window.deleteAdminSchool = async (id) => {
            if (!confirm('Are you sure you want to delete this school record?')) return;
            try {
                await API.deleteSchool(id);
                Toast.success('School record deleted');
                loadAdminSchools();
            } catch (err) {
                Toast.error(err.message || 'Failed to delete');
            }
        };

        if (addSchoolForm) {
            addSchoolForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = {
                    school_name: document.getElementById('sch-in-name').value,
                    school_type: document.getElementById('sch-in-type').value,
                    district: document.getElementById('sch-in-dist').value,
                    village: document.getElementById('sch-in-village').value,
                    block_name: document.getElementById('sch-in-block').value,
                    geographic_level: document.getElementById('sch-in-geo').value,
                    total_students: document.getElementById('sch-in-students').value ? parseInt(document.getElementById('sch-in-students').value) : null,
                    boys_enrolment: document.getElementById('sch-in-boys').value ? parseInt(document.getElementById('sch-in-boys').value) : null,
                    girls_enrolment: document.getElementById('sch-in-girls').value ? parseInt(document.getElementById('sch-in-girls').value) : null,
                    total_teachers: document.getElementById('sch-in-teachers').value ? parseInt(document.getElementById('sch-in-teachers').value) : null,
                    facilities: document.getElementById('sch-in-fac').value,
                    academic_year: document.getElementById('sch-in-year').value,
                    source: document.getElementById('sch-in-source').value,
                    is_verified: true
                };
                try {
                    await API.createSchool(data);
                    Toast.success('School record saved!');
                    addSchoolForm.reset();
                    loadAdminSchools();
                } catch (err) {
                    Toast.error(err.message || 'Failed to save school');
                }
            });
        }

        // 2. Healthcare
        const adminHealthTbody = document.getElementById('admin-health-tbody');
        const addHealthForm = document.getElementById('admin-add-health-form');

        const loadAdminHealth = async () => {
            if (!adminHealthTbody) return;
            try {
                const res = await API.getHealthcare();
                const records = res.data || [];
                if (records.length === 0) {
                    adminHealthTbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:1.5rem;">No healthcare facilities found.</td></tr>';
                    return;
                }
                adminHealthTbody.innerHTML = records.map(h => `
                    <tr>
                        <td><strong>${h.facility_name}</strong></td>
                        <td><span class="status-badge status-progress">${h.facility_type}</span></td>
                        <td>${h.district}${h.village ? ' / ' + h.village : ''}</td>
                        <td>${h.bed_capacity ? h.bed_capacity + ' Beds' : '—'} &bull; ${h.doctors_count || 0} Docs</td>
                        <td><span class="status-badge ${h.operational_status === 'Operational' ? 'status-completed' : 'status-assessment'}">${h.operational_status || 'Reported'}</span></td>
                        <td>
                            <button class="btn btn-outline btn-sm" onclick="deleteAdminHealth('${h.id}')" style="border-color:#f87171; color:#f87171;">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } catch (err) {
                console.error('Error loading admin health:', err);
            }
        };

        window.deleteAdminHealth = async (id) => {
            if (!confirm('Are you sure you want to delete this healthcare facility record?')) return;
            try {
                await API.deleteHealthcare(id);
                Toast.success('Healthcare facility deleted');
                loadAdminHealth();
            } catch (err) {
                Toast.error(err.message || 'Failed to delete');
            }
        };

        if (addHealthForm) {
            addHealthForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = {
                    facility_name: document.getElementById('health-in-name').value,
                    facility_type: document.getElementById('health-in-type').value,
                    district: document.getElementById('health-in-dist').value,
                    village: document.getElementById('health-in-village').value,
                    block_name: document.getElementById('health-in-block').value,
                    operational_status: document.getElementById('health-in-status').value,
                    bed_capacity: document.getElementById('health-in-beds').value ? parseInt(document.getElementById('health-in-beds').value) : null,
                    doctors_count: document.getElementById('health-in-doc').value ? parseInt(document.getElementById('health-in-doc').value) : null,
                    staff_count: document.getElementById('health-in-staff').value ? parseInt(document.getElementById('health-in-staff').value) : null,
                    contact_details: document.getElementById('health-in-contact').value,
                    services: document.getElementById('health-in-services').value,
                    source: 'UP Health Department',
                    is_verified: true
                };
                try {
                    await API.createHealthcare(data);
                    Toast.success(`Facility "${data.facility_name}" added!`);
                    addHealthForm.reset();
                    loadAdminHealth();
                } catch (err) {
                    Toast.error(err.message || 'Failed to add facility');
                }
            });
        }

        // ---------------------------------------------------------------------
        // ADMIN: Panchayat Funds CRUD, CSV Import & Export
        // ---------------------------------------------------------------------
        const adminPfTbody = document.getElementById('admin-pf-tbody');
        const addPfForm = document.getElementById('admin-add-pf-form');
        const pfImportBox = document.getElementById('pf-import-box');
        const showImportBtn = document.getElementById('admin-show-import-btn');
        const cancelImportBtn = document.getElementById('pf-cancel-import-btn');
        const execImportBtn = document.getElementById('pf-execute-import-btn');
        const exportPfBtn = document.getElementById('admin-export-pf-btn');
        let currentPfRecords = [];

        const loadAdminPanchayat = async () => {
            if (!adminPfTbody) return;
            try {
                const res = await API.getPanchayatFunds();
                currentPfRecords = res.data || [];
                if (currentPfRecords.length === 0) {
                    adminPfTbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:1.5rem;">No Panchayat fund records found. Add or import records above.</td></tr>';
                    return;
                }
                adminPfTbody.innerHTML = currentPfRecords.map(r => `
                    <tr>
                        <td><strong>${r.gram_panchayat}</strong></td>
                        <td>${r.district} (${r.block_name || 'Block'})</td>
                        <td>${r.financial_year}</td>
                        <td>${r.scheme_name || '—'}</td>
                        <td class="pf-financial-val">₹${r.sanctioned_amount ? Number(r.sanctioned_amount).toLocaleString('en-IN') : '—'}</td>
                        <td class="pf-financial-val">₹${r.released_amount ? Number(r.released_amount).toLocaleString('en-IN') : '—'}</td>
                        <td class="pf-financial-val">₹${r.expenditure ? Number(r.expenditure).toLocaleString('en-IN') : '—'}</td>
                        <td><span class="status-badge ${r.work_status === 'Completed' ? 'status-completed' : 'status-assessment'}">${r.work_status || 'Reported'}</span></td>
                        <td>
                            <button class="btn btn-outline btn-sm" onclick="deleteAdminPf('${r.id}')" style="border-color:#f87171; color:#f87171;">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } catch (err) {
                console.error('Error loading admin panchayat funds:', err);
            }
        };

        window.deleteAdminPf = async (id) => {
            if (!confirm('Are you sure you want to delete this Panchayat fund record?')) return;
            try {
                await API.deletePanchayatFund(id);
                Toast.success('Panchayat fund record deleted');
                loadAdminPanchayat();
            } catch (err) {
                Toast.error(err.message || 'Failed to delete record');
            }
        };

        if (addPfForm) {
            addPfForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = {
                    gram_panchayat: document.getElementById('pf-in-gp').value,
                    block_name: document.getElementById('pf-in-block').value,
                    district: document.getElementById('pf-in-dist').value,
                    financial_year: document.getElementById('pf-in-fy').value,
                    scheme_name: document.getElementById('pf-in-scheme').value,
                    work_name: document.getElementById('pf-in-work').value,
                    sanctioned_amount: document.getElementById('pf-in-sanc').value ? parseFloat(document.getElementById('pf-in-sanc').value) : null,
                    released_amount: document.getElementById('pf-in-rel').value ? parseFloat(document.getElementById('pf-in-rel').value) : null,
                    expenditure: document.getElementById('pf-in-exp').value ? parseFloat(document.getElementById('pf-in-exp').value) : null,
                    balance: document.getElementById('pf-in-bal').value ? parseFloat(document.getElementById('pf-in-bal').value) : null,
                    work_status: document.getElementById('pf-in-status').value,
                    source: document.getElementById('pf-in-source').value,
                    source_url: document.getElementById('pf-in-url').value,
                    is_verified: true
                };
                try {
                    await API.createPanchayatFund(data);
                    Toast.success('Panchayat fund record added!');
                    addPfForm.reset();
                    loadAdminPanchayat();
                } catch (err) {
                    Toast.error(err.message || 'Failed to add record');
                }
            });
        }

        // CSV Import toggles
        if (showImportBtn && pfImportBox) {
            showImportBtn.addEventListener('click', () => {
                pfImportBox.style.display = pfImportBox.style.display === 'none' ? 'block' : 'none';
            });
        }
        if (cancelImportBtn && pfImportBox) {
            cancelImportBtn.addEventListener('click', () => {
                pfImportBox.style.display = 'none';
            });
        }

        if (execImportBtn) {
            execImportBtn.addEventListener('click', async () => {
                const text = document.getElementById('pf-import-csv-text').value.trim();
                if (!text) {
                    Toast.warning('Please paste CSV content to import');
                    return;
                }

                try {
                    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                    if (lines.length < 2) throw new Error('CSV must contain a header line and at least one data row');

                    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                    const records = [];

                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',').map(v => v.trim());
                        const rec = {};
                        headers.forEach((h, idx) => {
                            rec[h] = values[idx] || '';
                        });

                        records.push({
                            gram_panchayat: rec.gram_panchayat || rec.gp || 'Gram Panchayat',
                            district: rec.district || 'Hapur',
                            block_name: rec.block_name || rec.block || '',
                            financial_year: rec.financial_year || rec.fy || '2025-26',
                            scheme_name: rec.scheme_name || rec.scheme || '',
                            sanctioned_amount: parseFloat(rec.sanctioned_amount) || null,
                            released_amount: parseFloat(rec.released_amount) || null,
                            expenditure: parseFloat(rec.expenditure) || null,
                            balance: parseFloat(rec.balance) || null,
                            work_name: rec.work_name || '',
                            work_status: rec.work_status || 'Reported',
                            source: 'eGramSwaraj',
                            data_type: 'imported',
                            is_verified: true
                        });
                    }

                    const res = await API.importPanchayatFunds(records);
                    Toast.success(`Successfully imported ${res.count || records.length} records!`);
                    pfImportBox.style.display = 'none';
                    document.getElementById('pf-import-csv-text').value = '';
                    loadAdminPanchayat();
                } catch (err) {
                    Toast.error('Import failed: ' + (err.message || 'Invalid CSV format'));
                }
            });
        }

        // CSV Export
        if (exportPfBtn) {
            exportPfBtn.addEventListener('click', () => {
                if (currentPfRecords.length === 0) {
                    Toast.warning('No records to export');
                    return;
                }
                const headers = ['gram_panchayat', 'district', 'block_name', 'financial_year', 'scheme_name', 'sanctioned_amount', 'released_amount', 'expenditure', 'balance', 'work_name', 'work_status', 'source'];
                const csvRows = [headers.join(',')];
                currentPfRecords.forEach(r => {
                    const row = headers.map(h => {
                        let val = r[h] !== null && r[h] !== undefined ? String(r[h]) : '';
                        if (val.includes(',') || val.includes('"')) {
                            val = '"' + val.replace(/"/g, '""') + '"';
                        }
                        return val;
                    });
                    csvRows.push(row.join(','));
                });
                const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `panchayat_funds_${Date.now()}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                Toast.info('CSV export downloaded');
            });
        }

        // ---------------------------------------------------------------------
        // ADMIN: Branding & Logo Management
        // ---------------------------------------------------------------------
        const brandingForm = document.getElementById('admin-branding-form');
        const brandingLogoInput = document.getElementById('branding-logo-url');
        const brandingSiteTitleInput = document.getElementById('branding-site-title');
        const brandingPreview = document.getElementById('branding-logo-preview');

        const loadAdminBranding = async () => {
            try {
                const res = await API.getSettings();
                const settings = res.data || {};
                if (settings.logo_url && brandingLogoInput) {
                    brandingLogoInput.value = settings.logo_url;
                    if (brandingPreview) brandingPreview.src = settings.logo_url;
                }
                if (settings.site_name && brandingSiteTitleInput) {
                    brandingSiteTitleInput.value = settings.site_name;
                }
            } catch (err) {
                console.error('Error loading branding settings:', err);
            }
        };

        if (brandingLogoInput && brandingPreview) {
            brandingLogoInput.addEventListener('input', () => {
                brandingPreview.src = brandingLogoInput.value || 'assets/logo.png';
            });
        }

        if (brandingForm) {
            brandingForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const newLogoUrl = brandingLogoInput.value.trim();
                const newTitle = brandingSiteTitleInput ? brandingSiteTitleInput.value.trim() : 'Village Hub';

                try {
                    await API.updateSetting('logo_url', newLogoUrl);
                    if (newTitle) await API.updateSetting('site_name', newTitle);
                    Toast.success('Branding settings saved to Supabase!');
                } catch (err) {
                    Toast.error(err.message || 'Failed to update branding');
                }
            });
        }
    }

    // ==========================================================================
    // 9. Member Dashboard Controller (`dashboard.html`)
    // ==========================================================================
    const profileName = document.getElementById('profile-user-name');
    const profileEmail = document.getElementById('profile-user-email');
    const profileRole = document.getElementById('profile-user-role');
    const profileAvatarChar = document.getElementById('profile-avatar-char');
    const userAppsList = document.getElementById('user-applications-list');

    if (profileName) {
        const currentUser = API ? API.getUser() : null;
        const u = currentUser || { name: "Guest User", email: "guest@villagehub.in", role: "Visitor" };
        profileName.innerText = u.name;
        if (profileEmail) profileEmail.innerText = u.email;
        if (profileRole) profileRole.innerText = u.role || "Verified Member";
        if (profileAvatarChar) profileAvatarChar.innerText = u.name.charAt(0).toUpperCase();

        if (userAppsList) {
            const renderDashboardItems = async () => {
                let comps = [];
                try {
                    const result = await API.getComplaints();
                    comps = result.data || [];
                } catch {
                    comps = getComplaints().filter(c => c.name.toLowerCase() === u.name.toLowerCase());
                }

                if (comps.length === 0) {
                    userAppsList.innerHTML = `<p style="color:var(--text-muted);">No submitted complaints found under your account. <a href="complaint.html" style="color:var(--accent);">Register a complaint &rarr;</a></p>`;
                } else {
                    userAppsList.innerHTML = comps.map(c => `
                        <div style="padding:1rem; border-bottom:1px solid var(--glass-border); display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <strong style="color:var(--accent);">[${c.complaintId || c.id}] ${c.village} (${c.district})</strong>
                                <p style="font-size:0.85rem; color:var(--text-secondary);">${c.category}: ${c.description || c.details}</p>
                            </div>
                            <span class="status-badge ${c.status === 'Resolved' ? 'status-completed' : 'status-progress'}">${c.status}</span>
                        </div>
                    `).join('');
                }
            };
            renderDashboardItems();
        }
    }

    // ==========================================================================
    // 10. Government Schemes & Rural Welfare Finder Controller (`schemes.html`)
    // ==========================================================================
    const schemesGrid = document.getElementById('schemes-list-container');
    if (schemesGrid) {
        const GOVT_SCHEMES = [
            {
                id: "SCH-01", name: "Jal Jeevan Mission (Har Ghar Jal)", category: "Water",
                dept: "Ministry of Jal Shakti & UP Namami Gange Dept",
                desc: "Provides functional household tap connection (FHTC) delivering 55 litres of clean, tested drinking water per person per day to every rural home in UP.",
                benefit: "Free piped RO/Tested Tap Water Connection + Underground Pipeline in Village",
                steps: ["Verify if village pipeline infrastructure survey is completed under Gram Panchayat Jal Samiti.", "Submit household tap connection request form to Village Pradhan / Panchayat Secretary.", "Provide Aadhaar card and house address proof to Gram Panchayat Field Operator.", "Jal Samiti inspects house line and installs official water meter & tap connection free of cost."],
                docs: ["Aadhaar Card", "Ration Card", "Electricity Bill / House Address Proof", "Mobile Number"],
                link: "https://ejaljeevanmission.gov.in/"
            },
            {
                id: "SCH-02", name: "Pradhan Mantri Gramin Awas Yojana (PMAY-G)", category: "Housing",
                dept: "Ministry of Rural Development & UP Gram Vikas Dept",
                desc: "Financial assistance to Kutcha and homeless rural households to construct a 25 sq.m disaster-resilient Pucca house with hygienic kitchen and toilet.",
                benefit: "\u20B91,20,000 Direct Financial Subsidy in 3 installments + \u20B912,000 Toilet Subsidy + 90 days MGNREGA wages",
                steps: ["Check name in SECC Census Socio-Economic Household survey list at Gram Sabha office.", "Fill PMAY-G application form at local Jan Seva Kendra (CSC) or BDO office.", "Geo-tag existing Kutcha house photograph with Block Development Officer (BDO).", "Amount credited directly into Aadhaar-seeded bank account in 3 stages during construction."],
                docs: ["Aadhaar Card", "Bank Passbook (Aadhaar Seeded)", "Job Card Number", "Land Revenue Record / Khatauni", "Passport Photo"],
                link: "https://pmayg.nic.in/"
            },
            {
                id: "SCH-03", name: "PM Kisan Samman Nidhi Yojana", category: "Farmers",
                dept: "Ministry of Agriculture & UP Agriculture Department",
                desc: "Income support scheme providing direct bank transfer to all landholding farmer families across Western UP to meet agricultural input needs.",
                benefit: "\u20B96,000 per year transferred in 3 equal installments of \u20B92,000 directly to bank account",
                steps: ["Register online at PM-Kisan Portal (pmkisan.gov.in) or visit nearest Jan Seva Kendra.", "Upload UP Land Khatauni (Khasra/Khatauni details) verifying farmland ownership.", "Complete mandatory e-KYC via Aadhaar OTP or Biometric at CSC kiosk.", "Tehsildar & District Agriculture Officer verify land records for direct disbursement."],
                docs: ["Aadhaar Card", "UP Farmland Khatauni / Khasra Copy", "Aadhaar Linked Bank Passbook", "Active Mobile Number"],
                link: "https://pmkisan.gov.in/"
            },
            {
                id: "SCH-04", name: "PM Surya Ghar: Muft Bijli & PM-KUSUM Solar Pump", category: "Solar",
                dept: "Ministry of New & Renewable Energy (MNRE) & UPNEDA",
                desc: "Subsidy for rural rooftop solar panels and off-grid solar agriculture pumpsets to eliminate electricity bills and power tube wells.",
                benefit: "Up to \u20B978,000 central subsidy for rooftop solar + up to 60% subsidy on Solar Agriculture Irrigation Pumps",
                steps: ["Apply online at pmsuryaghar.gov.in portal selecting PVVNL electricity distribution company.", "Technical feasibility approval granted by DISCOM within 15 working days.", "Empaneled vendor installs solar system / solar pump set at household / farm.", "Net meter installation & inspection, subsidy credited to bank account within 30 days."],
                docs: ["Electricity Connection Consumer ID", "Aadhaar Card", "Bank Passbook", "Roof / Pump Site Photo"],
                link: "https://pmsuryaghar.gov.in/"
            },
            {
                id: "SCH-05", name: "MGNREGA Rural Employment Guarantee", category: "Employment",
                dept: "Ministry of Rural Development & UP Gram Vikas Vibhag",
                desc: "Guarantees 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work.",
                benefit: "100 Days Guaranteed Wage Employment + Direct Daily Payment into Bank Account @ State Wage Rate",
                steps: ["Submit written application for Job Card to Gram Panchayat Secretary / Rozgar Sewak.", "Gram Panchayat verifies adult family members and issues MGNREGA Job Card within 15 days.", "Submit work request form specifying preferred dates for village infrastructure work.", "Work assigned within 5 km radius of village; wages directly transferred weekly into bank."],
                docs: ["Aadhaar Card of all adult members", "Bank Account Details", "Passport Size Photograph"],
                link: "https://nrega.nic.in/"
            },
            {
                id: "SCH-06", name: "Swachh Bharat Mission Gramin (IHHL Toilet & Amrit Sarovar)", category: "Water",
                dept: "UP Panchayati Raj Department & SBM-G",
                desc: "Incentive for constructing individual household latrines (IHHL) and village solid/liquid waste segregation centers and pond rejuvenation.",
                benefit: "\u20B912,000 Financial Assistance for Household Toilet Construction",
                steps: ["Apply at sbm.gov.in or submit application to Gram Panchayat Secretary.", "Gram Pradhan inspects site and approves construction plan.", "Complete toilet construction with dual-pit leach system.", "Geo-tag completed toilet photo to receive \u20B912,000 direct bank transfer."],
                docs: ["Aadhaar Card", "Bank Passbook", "Mobile Number", "Constructed Toilet Geo-Tagged Photo"],
                link: "https://sbm.gov.in/"
            },
            {
                id: "SCH-07", name: "Ayushman Bharat UP (PM-JAY Health Card)", category: "Health",
                dept: "National Health Authority & UP State Health Agency",
                desc: "World's largest health insurance scheme providing cashless secondary and tertiary hospitalization treatment at impaneled government & private hospitals.",
                benefit: "\u20B95,00,000 Free Cashless Medical Health Cover per family per year",
                steps: ["Check eligibility on beneficiary.nha.gov.in using Aadhaar number or Ration Card number.", "Visit nearby District Hospital, Community Health Center (CHC), or CSC Jan Seva Kendra.", "Authenticate identity via Aadhaar OTP or Biometric scan with Ayushman Mitra.", "Download and print Ayushman Golden Card for instant cashless hospital treatment."],
                docs: ["Aadhaar Card", "Ration Card / Family ID", "Mobile Number"],
                link: "https://beneficiary.nha.gov.in/"
            },
            {
                id: "SCH-08", name: "PM Vishwakarma & UP ODOP Artisan Scheme", category: "Employment",
                dept: "Ministry of MSME & UP Micro, Small & Medium Enterprises Dept",
                desc: "End-to-end support for traditional village artisans, carpenters, blacksmiths, potters, masons, and weavers in Western UP.",
                benefit: "\u20B915,000 Free Toolkit e-Voucher + Collateral-free Credit up to \u20B93,00,000 @ 5% interest rate + Skill Stipend",
                steps: ["Register at pmvishwakarma.gov.in via nearest CSC center with trade details.", "3-Step verification: Gram Panchayat level -> District Implementation Committee -> Screening.", "Complete 5-7 days basic skill training with \u20B9500/day daily stipend.", "Receive \u20B915,000 toolkit voucher and eligibility for 1st tranche loan of \u20B91,00,000."],
                docs: ["Aadhaar Card", "Bank Account Passbook", "Skill/Trade Photo", "Active Mobile Number"],
                link: "https://pmvishwakarma.gov.in/"
            },
            {
                id: "SCH-09", name: "UP Mukhyamantri Kanya Sumangala Yojana", category: "Health",
                dept: "UP Women and Child Development Department",
                desc: "Financial assistance program to support girl child education, vaccination, and prevent child marriage across Uttar Pradesh.",
                benefit: "Total \u20B915,000 Financial Grant in 6 installments from birth to college admission",
                steps: ["Apply online at mksy.up.gov.in portal within specified timeframe after birth/admission.", "Upload birth certificate, immunization record, or school admission proof.", "Verification by Block Development Officer (BDO) / District Programme Officer (DPO).", "Installment directly credited to mother's or girl child's bank account."],
                docs: ["Mother/Father Aadhaar Card", "Girl Child Birth Certificate", "Bank Passbook", "Family Income Certificate (<\u20B93 Lakh)"],
                link: "https://mksy.up.gov.in/"
            },
            {
                id: "SCH-10", name: "UP Gramin Sadak (PMGSY) & Pothole Reporting", category: "Housing",
                dept: "UP Public Works Department (PWD) & Rural Roads Development Agency",
                desc: "All-weather road connectivity to unconnected rural habitations and grievance reporting for village road repairs.",
                benefit: "Bituminous All-Weather Road Connectivity + Direct Grievance Escalation to District Engineer",
                steps: ["Report damaged village road or missing connectivity on Meri Sadak Mobile App or Village Hub Complaint Portal.", "Include GPS location, road stretch details, and photos of potholes/damage.", "Executive Engineer PWD inspects road stretch within 7 days.", "Sanction and repair executed under PMGSY maintenance budget."],
                docs: ["Location/Village Details", "Road Photograph", "Complainant Contact Details"],
                link: "https://pmgsy.nic.in/"
            }
        ];

        let activeCategory = 'all';
        let searchQuery = '';

        const renderSchemes = () => {
            const filtered = GOVT_SCHEMES.filter(s => {
                const matchesCat = activeCategory === 'all' || s.category.toLowerCase() === activeCategory.toLowerCase();
                const matchesSearch = searchQuery === '' ||
                    s.name.toLowerCase().includes(searchQuery) ||
                    s.desc.toLowerCase().includes(searchQuery) ||
                    s.benefit.toLowerCase().includes(searchQuery) ||
                    s.dept.toLowerCase().includes(searchQuery);
                return matchesCat && matchesSearch;
            });

            if (filtered.length === 0) {
                schemesGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1/-1;">
                        <div class="empty-icon">🔍</div>
                        <h3>No Government Schemes Found</h3>
                        <p>Try selecting a different need category or clearing your search input.</p>
                    </div>`;
                return;
            }

            schemesGrid.innerHTML = filtered.map(s => `
                <div class="scheme-card glass-card">
                    <div>
                        <div class="scheme-card-header">
                            <div>
                                <h3 class="scheme-title">${s.name}</h3>
                                <div class="scheme-dept">\ud83c\udfdb\ufe0f ${s.dept}</div>
                            </div>
                            <span class="scheme-badge">${s.category} Welfare</span>
                        </div>

                        <p class="scheme-desc">${s.desc}</p>

                        <div class="scheme-benefits-highlight">
                            <strong>Key Benefit:</strong> ${s.benefit}
                        </div>

                        <h4 style="font-size: 0.95rem; margin-top: 1.2rem; color: var(--text-primary); border-bottom: 1px solid var(--glass-border); padding-bottom: 0.4rem;">
                            \ud83d\udccb Step-by-Step Application Steps:
                        </h4>
                        <ul class="step-process-list">
                            ${s.steps.map((st, idx) => `
                                <li class="step-process-item" data-step="${idx + 1}">${st}</li>
                            `).join('')}
                        </ul>

                        <h4 style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                            \ud83d\udcc2 Required Documents Checklist:
                        </h4>
                        <div class="doc-tags-wrapper">
                            ${s.docs.map(d => `<span class="doc-tag">\ud83d\udcc4 ${d}</span>`).join('')}
                        </div>
                    </div>

                    <div class="scheme-card-footer">
                        <a href="${s.link}" target="_blank" class="btn btn-primary" style="font-size: 0.88rem; flex: 1; text-align: center; justify-content: center;">
                            Apply on Official Portal &rarr;
                        </a>
                        <a href="complaint.html" class="btn btn-secondary" style="font-size: 0.88rem; text-align: center;">
                            Report Village Issue
                        </a>
                    </div>
                </div>
            `).join('');
        };

        // Filter Pills Handler
        const schemeFilterPills = document.querySelectorAll('.scheme-filter-pill');
        schemeFilterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                schemeFilterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                activeCategory = pill.dataset.cat;
                renderSchemes();
            });
        });

        // Search Input Handler
        const schemeSearchInput = document.getElementById('scheme-search-input');
        if (schemeSearchInput) {
            schemeSearchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase().trim();
                renderSchemes();
            });
        }

        // Need Selection Wizard Box Handler
        const wizardBoxes = document.querySelectorAll('.need-select-box');
        wizardBoxes.forEach(box => {
            box.addEventListener('click', () => {
                wizardBoxes.forEach(b => b.classList.remove('selected'));
                box.classList.add('selected');
                const needCategory = box.dataset.need;

                schemeFilterPills.forEach(p => {
                    if (p.dataset.cat.toLowerCase() === needCategory.toLowerCase()) {
                        p.classList.add('active');
                    } else {
                        p.classList.remove('active');
                    }
                });

                activeCategory = needCategory;
                renderSchemes();
                schemesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // Initial Render
        renderSchemes();
    }

    // ==========================================================================
    // 11. Complaint Tracker (on complaint.html)
    // ==========================================================================
    const trackerSearchBtn = document.getElementById('tracker-search-btn');
    const trackerInput = document.getElementById('tracker-input');
    const trackerResults = document.getElementById('tracker-results');

    if (trackerSearchBtn && trackerInput) {
        trackerSearchBtn.addEventListener('click', async () => {
            const query = trackerInput.value.trim();
            if (!query) { Toast.warning('Enter a Complaint ID or Phone Number'); return; }

            try {
                const result = await API.trackComplaint(query);
                const complaints = result.data || [];

                if (complaints.length === 0) {
                    trackerResults.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-icon">🔍</div>
                            <h3>No Complaints Found</h3>
                            <p>No complaints match "${query}". Check your Complaint ID or phone number.</p>
                        </div>`;
                    return;
                }

                const statusOrder = ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'];

                trackerResults.innerHTML = complaints.map(c => {
                    const currentIdx = statusOrder.indexOf(c.status);
                    const timeline = statusOrder.filter(s => s !== 'Rejected').map((s, idx) => {
                        let cls = '';
                        if (c.status === 'Rejected' && s === 'Submitted') cls = 'completed';
                        else if (idx < currentIdx) cls = 'completed';
                        else if (idx === currentIdx) cls = 'active';
                        return `<div class="tl-step ${cls}">${s}</div>`;
                    }).join('');

                    return `
                        <div class="tracker-result-card">
                            <div class="tr-header">
                                <span class="tr-id">${c.complaintId}</span>
                                <span class="status-badge ${c.status === 'Resolved' ? 'status-completed' : (c.status === 'Rejected' ? 'status-assessment' : 'status-progress')}">${c.status}</span>
                            </div>
                            <div class="tr-detail"><strong>Village:</strong> ${c.village} (${c.district})</div>
                            <div class="tr-detail"><strong>Category:</strong> ${c.category}</div>
                            <div class="tr-detail"><strong>Description:</strong> ${c.description}</div>
                            <div class="tracker-timeline">${timeline}</div>
                        </div>`;
                }).join('');
            } catch (err) {
                trackerResults.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">⚠️</div>
                        <h3>Tracking Unavailable</h3>
                        <p>${err.message || 'Server is not available. Try again later.'}</p>
                    </div>`;
            }
        });

        trackerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') trackerSearchBtn.click();
        });
    }
});
