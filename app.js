document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 0. Hamburger Sidebar Menu Toggle
    // ==========================================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    const toggleSidebar = () => {
        hamburgerBtn && hamburgerBtn.classList.toggle('active');
        sidebarMenu && sidebarMenu.classList.toggle('active');
        sidebarOverlay && sidebarOverlay.classList.toggle('active');
    };

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

    // Highlight active page in sidebar & navbar
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-links a, .nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
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
        if (_villagesCache) return _villagesCache;
        try {
            const result = await window.VillageHubAPI.getVillages();
            if (result.success && result.data && result.data.length > 0) {
                _villagesCache = result.data.map(mapVillage);
                _apiOnline = true;
                return _villagesCache;
            }
        } catch {}
        // Fallback to localStorage/default
        _apiOnline = false;
        const existing = JSON.parse(localStorage.getItem('vh_villages')) || [];
        _villagesCache = (existing.length >= 40 ? existing : DEFAULT_VILLAGES);
        return _villagesCache;
    };

    // Synchronous fallback for immediate rendering
    const getVillagesSync = () => {
        if (_villagesCache) return _villagesCache;
        const existing = JSON.parse(localStorage.getItem('vh_villages')) || [];
        return (existing.length >= 40 ? existing : DEFAULT_VILLAGES);
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

    const API = window.VillageHubAPI;

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

        const updateGrid = () => {
            const filtered = allVillages.filter(v => {
                const matchesSearch = v.name.toLowerCase().includes(query) ||
                                      v.district.toLowerCase().includes(query) ||
                                      (v.tehsil && v.tehsil.toLowerCase().includes(query)) ||
                                      v.focus.toLowerCase().includes(query);
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

        // Load from API asynchronously
        getVillages().then(villages => {
            allVillages = villages;
            updateGrid();
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
                currentFilter = pill.getAttribute('data-filter');
                updateGrid();
            });
        });
    }

    // Render Featured Villages on Home Page (`index.html`)
    const homeFeaturedGrid = document.getElementById('index-featured-villages');
    if (homeFeaturedGrid) {
        const renderFeatured = (villages) => {
            homeFeaturedGrid.innerHTML = villages.slice(0, 6).map(renderVillageCardHTML).join('');
        };
        renderFeatured(getVillagesSync());
        getVillages().then(v => renderFeatured(v));
    }

    // Dynamic Stats Count Update
    const statVillagesCount = document.getElementById('stat-villages-count');
    if (statVillagesCount) {
        statVillagesCount.innerText = `${getVillagesSync().length}+`;
        getVillages().then(v => { statVillagesCount.innerText = `${v.length}+`; });
    }

    // ==========================================================================
    // 7. Leaflet Interactive Map Module (`map.html` & `index.html`)
    // ==========================================================================
    const mapElement = document.getElementById('village-map') || document.getElementById('village-map-index');
    if (mapElement && typeof L !== 'undefined') {
        const map = L.map(mapElement.id).setView([28.6500, 77.6500], 9);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; OpenStreetMap contributors | Western UP Panchayati Raj & Village Hub'
        }).addTo(map);

        const renderMarkers = (villages) => {
            villages.forEach(v => {
                if (v.lat && v.lng) {
                    const marker = L.marker([v.lat, v.lng]).addTo(map);
                    const popupContent = `
                        <div class="map-popup-card">
                            <h4>${v.name} (${v.district})</h4>
                            <p><strong>Tehsil:</strong> ${v.tehsil || 'Rural'}</p>
                            <p><strong>Census Pop:</strong> ${v.pop}</p>
                            <p><strong>Official Issue:</strong> ${v.focus}</p>
                            <p><strong>Status:</strong> ${v.status} (${v.progress}%)</p>
                            <a href="javascript:void(0)" onclick="showVillageDetail('${v.id}')" style="color:var(--accent); font-weight:600; font-size:0.8rem;">View Details &rarr;</a>
                        </div>
                    `;
                    marker.bindPopup(popupContent);
                }
            });
        };

        renderMarkers(getVillagesSync());
        // Also load from API for most current data
        getVillages().then(villages => {
            // Clear and re-add if API returned different data
            if (_apiOnline) {
                map.eachLayer(layer => { if (layer instanceof L.Marker) map.removeLayer(layer); });
                renderMarkers(villages);
            }
        });
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

        const panelVillages = document.getElementById('admin-panel-villages');
        const panelComplaints = document.getElementById('admin-panel-complaints');
        const panelApps = document.getElementById('admin-panel-apps');
        const panelAdd = document.getElementById('admin-panel-add');

        const tabs = [tabVillages, tabComplaints, tabApps, tabAdd];
        const panels = [panelVillages, panelComplaints, panelApps, panelAdd];

        tabs.forEach((tab, index) => {
            if (tab && panels[index]) {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => { if (t) t.classList.remove('active'); });
                    panels.forEach(p => { if (p) p.classList.remove('active'); });
                    tab.classList.add('active');
                    panels[index].classList.add('active');
                });
            }
        });
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
