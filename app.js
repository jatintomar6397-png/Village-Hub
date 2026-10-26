// ==========================================================================
// 0. Global Sidebar Navigation Handlers (Immediately available & Debounced)
// ==========================================================================
let _lastSidebarToggle = 0;
window.toggleSidebarMenu = function(e) {
    if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const now = Date.now();
    if (now - _lastSidebarToggle < 250) return;
    _lastSidebarToggle = now;

    const btn = document.getElementById('hamburger-btn');
    const menu = document.getElementById('sidebar-menu');
    const overlay = document.getElementById('sidebar-overlay');
    if (!menu) return;

    const isOpen = menu.classList.contains('active');
    if (btn) {
        btn.classList.toggle('active', !isOpen);
        btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
        btn.setAttribute('aria-label', !isOpen ? 'Close navigation menu' : 'Open navigation menu');
    }
    menu.classList.toggle('active', !isOpen);
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

    // Attach listeners to hamburger button & overlay safely
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (hamburgerBtn) {
        hamburgerBtn.removeAttribute('onclick');
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
    // 1. Census-Verified Dataset of 270 Villages (Frontend Fallback)
    //    Used ONLY when backend API is unavailable
    // ==========================================================================
    const DEFAULT_VILLAGES = [
        {"id":1,"serialNo":1,"name":"Dasna Dehat","villageName":"Dasna Dehat","district":"Ghaziabad","tehsil":"Rajapur","developmentBlock":"Rajapur","households":7840,"censusPopulation":43722,"estimatedPopulation2026":53200,"literacyRate":0.685,"pop":"43,722","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":2,"serialNo":2,"name":"Masuri","villageName":"Masuri","district":"Ghaziabad","tehsil":"Rajapur","developmentBlock":"Rajapur","households":4120,"censusPopulation":22934,"estimatedPopulation2026":27900,"literacyRate":0.7120000000000001,"pop":"22,934","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":3,"serialNo":3,"name":"Nahal","villageName":"Nahal","district":"Ghaziabad","tehsil":"Rajapur","developmentBlock":"Rajapur","households":3150,"censusPopulation":18450,"estimatedPopulation2026":22400,"literacyRate":0.6579999999999999,"pop":"18,450","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":4,"serialNo":4,"name":"Mandola","villageName":"Mandola","district":"Ghaziabad","tehsil":"Loni","developmentBlock":"Loni","households":2680,"censusPopulation":14200,"estimatedPopulation2026":17250,"literacyRate":0.743,"pop":"14,200","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":5,"serialNo":5,"name":"Surana","villageName":"Surana","district":"Ghaziabad","tehsil":"Muradnagar","developmentBlock":"Muradnagar","households":2480,"censusPopulation":13450,"estimatedPopulation2026":16300,"literacyRate":0.7609999999999999,"pop":"13,450","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":6,"serialNo":6,"name":"Shahpur Bamheta","villageName":"Shahpur Bamheta","district":"Ghaziabad","tehsil":"Rajapur","developmentBlock":"Rajapur","households":2410,"censusPopulation":12850,"estimatedPopulation2026":15600,"literacyRate":0.794,"pop":"12,850","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":7,"serialNo":7,"name":"Banthala","villageName":"Banthala","district":"Ghaziabad","tehsil":"Loni","developmentBlock":"Loni","households":2390,"censusPopulation":12650,"estimatedPopulation2026":15300,"literacyRate":0.758,"pop":"12,650","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":8,"serialNo":8,"name":"Bhojpur","villageName":"Bhojpur","district":"Ghaziabad","tehsil":"Bhojpur","developmentBlock":"Bhojpur","households":2190,"censusPopulation":11800,"estimatedPopulation2026":14300,"literacyRate":0.725,"pop":"11,800","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":9,"serialNo":9,"name":"Morta","villageName":"Morta","district":"Ghaziabad","tehsil":"Rajapur","developmentBlock":"Rajapur","households":2120,"censusPopulation":11400,"estimatedPopulation2026":13800,"literacyRate":0.782,"pop":"11,400","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":10,"serialNo":10,"name":"Agraula","villageName":"Agraula","district":"Ghaziabad","tehsil":"Loni","developmentBlock":"Loni","households":2050,"censusPopulation":11200,"estimatedPopulation2026":13600,"literacyRate":0.7040000000000001,"pop":"11,200","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":11,"serialNo":11,"name":"Mekarmatpur Sikrod","villageName":"Mekarmatpur Sikrod","district":"Ghaziabad","tehsil":"Rajapur","developmentBlock":"Rajapur","households":1850,"censusPopulation":9850,"estimatedPopulation2026":11950,"literacyRate":0.679,"pop":"9,850","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":12,"serialNo":12,"name":"Amrala","villageName":"Amrala","district":"Ghaziabad","tehsil":"Bhojpur","developmentBlock":"Bhojpur","households":1720,"censusPopulation":9450,"estimatedPopulation2026":11500,"literacyRate":0.731,"pop":"9,450","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":13,"serialNo":13,"name":"Chirauri","villageName":"Chirauri","district":"Ghaziabad","tehsil":"Loni","developmentBlock":"Loni","households":1820,"censusPopulation":9800,"estimatedPopulation2026":11900,"literacyRate":0.72,"pop":"9,800","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":14,"serialNo":14,"name":"Tila Shahbazpur","villageName":"Tila Shahbazpur","district":"Ghaziabad","tehsil":"Loni","developmentBlock":"Loni","households":1790,"censusPopulation":9400,"estimatedPopulation2026":11400,"literacyRate":0.752,"pop":"9,400","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":15,"serialNo":15,"name":"Abupur","villageName":"Abupur","district":"Ghaziabad","tehsil":"Muradnagar","developmentBlock":"Muradnagar","households":1690,"censusPopulation":9200,"estimatedPopulation2026":11200,"literacyRate":0.774,"pop":"9,200","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":16,"serialNo":16,"name":"Begumabad Budana","villageName":"Begumabad Budana","district":"Ghaziabad","tehsil":"Bhojpur","developmentBlock":"Bhojpur","households":1610,"censusPopulation":8900,"estimatedPopulation2026":10800,"literacyRate":0.768,"pop":"8,900","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":17,"serialNo":17,"name":"Khanpur Japti","villageName":"Khanpur Japti","district":"Ghaziabad","tehsil":"Loni","developmentBlock":"Loni","households":1640,"censusPopulation":8900,"estimatedPopulation2026":10800,"literacyRate":0.691,"pop":"8,900","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":18,"serialNo":18,"name":"Khindaura","villageName":"Khindaura","district":"Ghaziabad","tehsil":"Muradnagar","developmentBlock":"Muradnagar","households":1580,"censusPopulation":8700,"estimatedPopulation2026":10550,"literacyRate":0.7490000000000001,"pop":"8,700","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":19,"serialNo":19,"name":"Kushaliya","villageName":"Kushaliya","district":"Ghaziabad","tehsil":"Rajapur","developmentBlock":"Rajapur","households":1480,"censusPopulation":8400,"estimatedPopulation2026":10200,"literacyRate":0.6629999999999999,"pop":"8,400","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":20,"serialNo":20,"name":"Sikri Khurd","villageName":"Sikri Khurd","district":"Ghaziabad","tehsil":"Bhojpur","developmentBlock":"Bhojpur","households":1490,"censusPopulation":8200,"estimatedPopulation2026":9950,"literacyRate":0.785,"pop":"8,200","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":21,"serialNo":21,"name":"Mataur","villageName":"Mataur","district":"Ghaziabad","tehsil":"Muradnagar","developmentBlock":"Muradnagar","households":1440,"censusPopulation":7950,"estimatedPopulation2026":9650,"literacyRate":0.75,"pop":"7,950","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":22,"serialNo":22,"name":"Sadat Nagar Ikla","villageName":"Sadat Nagar Ikla","district":"Ghaziabad","tehsil":"Rajapur","developmentBlock":"Rajapur","households":1390,"censusPopulation":7900,"estimatedPopulation2026":9600,"literacyRate":0.7709999999999999,"pop":"7,900","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":23,"serialNo":23,"name":"Mirpur Hindu","villageName":"Mirpur Hindu","district":"Ghaziabad","tehsil":"Loni","developmentBlock":"Loni","households":1420,"censusPopulation":7850,"estimatedPopulation2026":9500,"literacyRate":0.736,"pop":"7,850","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":24,"serialNo":24,"name":"Fariha","villageName":"Fariha","district":"Ghaziabad","tehsil":"Bhojpur","developmentBlock":"Bhojpur","households":1380,"censusPopulation":7600,"estimatedPopulation2026":9200,"literacyRate":0.7140000000000001,"pop":"7,600","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":25,"serialNo":25,"name":"Patla (Rural)","villageName":"Patla (Rural)","district":"Ghaziabad","tehsil":"Muradnagar","developmentBlock":"Muradnagar","households":1360,"censusPopulation":7400,"estimatedPopulation2026":8950,"literacyRate":0.792,"pop":"7,400","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":26,"serialNo":26,"name":"Badshahpur Sirauli","villageName":"Badshahpur Sirauli","district":"Ghaziabad","tehsil":"Loni","developmentBlock":"Loni","households":1350,"censusPopulation":7400,"estimatedPopulation2026":9000,"literacyRate":0.6890000000000001,"pop":"7,400","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":27,"serialNo":27,"name":"Dindarpur","villageName":"Dindarpur","district":"Ghaziabad","tehsil":"Bhojpur","developmentBlock":"Bhojpur","households":1260,"censusPopulation":6950,"estimatedPopulation2026":8450,"literacyRate":0.721,"pop":"6,950","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":28,"serialNo":28,"name":"Mewala Bhatti","villageName":"Mewala Bhatti","district":"Ghaziabad","tehsil":"Loni","developmentBlock":"Loni","households":1280,"censusPopulation":6900,"estimatedPopulation2026":8400,"literacyRate":0.705,"pop":"6,900","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":29,"serialNo":29,"name":"Niwari (Rural)","villageName":"Niwari (Rural)","district":"Ghaziabad","tehsil":"Muradnagar","developmentBlock":"Muradnagar","households":1240,"censusPopulation":6850,"estimatedPopulation2026":8300,"literacyRate":0.78,"pop":"6,850","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":30,"serialNo":30,"name":"Bhowapur","villageName":"Bhowapur","district":"Ghaziabad","tehsil":"Rajapur","developmentBlock":"Rajapur","households":1260,"censusPopulation":6800,"estimatedPopulation2026":8250,"literacyRate":0.8009999999999999,"pop":"6,800","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":31,"serialNo":31,"name":"Phalaunda","villageName":"Phalaunda","district":"Ghaziabad","tehsil":"Bhojpur","developmentBlock":"Bhojpur","households":1160,"censusPopulation":6400,"estimatedPopulation2026":7750,"literacyRate":0.7340000000000001,"pop":"6,400","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":32,"serialNo":32,"name":"Ataur","villageName":"Ataur","district":"Ghaziabad","tehsil":"Rajapur","developmentBlock":"Rajapur","households":1180,"censusPopulation":6400,"estimatedPopulation2026":7750,"literacyRate":0.765,"pop":"6,400","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":33,"serialNo":33,"name":"Jafarabad Ganauli","villageName":"Jafarabad Ganauli","district":"Ghaziabad","tehsil":"Loni","developmentBlock":"Loni","households":1140,"censusPopulation":6300,"estimatedPopulation2026":7650,"literacyRate":0.728,"pop":"6,300","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":34,"serialNo":34,"name":"Muradgrampur Pursi","villageName":"Muradgrampur Pursi","district":"Ghaziabad","tehsil":"Muradnagar","developmentBlock":"Muradnagar","households":1110,"censusPopulation":6100,"estimatedPopulation2026":7400,"literacyRate":0.741,"pop":"6,100","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":35,"serialNo":35,"name":"Khorajpur","villageName":"Khorajpur","district":"Ghaziabad","tehsil":"Bhojpur","developmentBlock":"Bhojpur","households":890,"censusPopulation":4900,"estimatedPopulation2026":5950,"literacyRate":0.7559999999999999,"pop":"4,900","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":36,"serialNo":36,"name":"Gyaspur","villageName":"Gyaspur","district":"Ghaziabad","tehsil":"Muradnagar","developmentBlock":"Muradnagar","households":1080,"censusPopulation":5900,"estimatedPopulation2026":7150,"literacyRate":0.7190000000000001,"pop":"5,900","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":37,"serialNo":37,"name":"Pipala Bandpur","villageName":"Pipala Bandpur","district":"Ghaziabad","tehsil":"Bhojpur","developmentBlock":"Bhojpur","households":1050,"censusPopulation":5800,"estimatedPopulation2026":7050,"literacyRate":0.738,"pop":"5,800","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":38,"serialNo":38,"name":"Sirora Salempur","villageName":"Sirora Salempur","district":"Ghaziabad","tehsil":"Loni","developmentBlock":"Loni","households":1020,"censusPopulation":5700,"estimatedPopulation2026":6900,"literacyRate":0.7020000000000001,"pop":"5,700","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":39,"serialNo":39,"name":"Asadpur Nagal","villageName":"Asadpur Nagal","district":"Ghaziabad","tehsil":"Muradnagar","developmentBlock":"Muradnagar","households":980,"censusPopulation":5400,"estimatedPopulation2026":6550,"literacyRate":0.753,"pop":"5,400","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":40,"serialNo":40,"name":"Tiwari","villageName":"Tiwari","district":"Ghaziabad","tehsil":"Bhojpur","developmentBlock":"Bhojpur","households":940,"censusPopulation":5200,"estimatedPopulation2026":6300,"literacyRate":0.745,"pop":"5,200","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":41,"serialNo":41,"name":"Bahadurpur","villageName":"Bahadurpur","district":"Ghaziabad","tehsil":"Rajapur","developmentBlock":"Rajapur","households":950,"censusPopulation":5200,"estimatedPopulation2026":6300,"literacyRate":0.71,"pop":"5,200","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":42,"serialNo":42,"name":"Sikhrani","villageName":"Sikhrani","district":"Ghaziabad","tehsil":"Loni","developmentBlock":"Loni","households":930,"censusPopulation":5100,"estimatedPopulation2026":6200,"literacyRate":0.687,"pop":"5,100","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":43,"serialNo":43,"name":"Morti","villageName":"Morti","district":"Ghaziabad","tehsil":"Rajapur","developmentBlock":"Rajapur","households":910,"censusPopulation":4950,"estimatedPopulation2026":6000,"literacyRate":0.779,"pop":"4,950","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":44,"serialNo":44,"name":"Puthri","villageName":"Puthri","district":"Ghaziabad","tehsil":"Muradnagar","developmentBlock":"Muradnagar","households":880,"censusPopulation":4800,"estimatedPopulation2026":5800,"literacyRate":0.762,"pop":"4,800","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":45,"serialNo":45,"name":"Jahalawa","villageName":"Jahalawa","district":"Ghaziabad","tehsil":"Muradnagar","developmentBlock":"Muradnagar","households":810,"censusPopulation":4500,"estimatedPopulation2026":5450,"literacyRate":0.7390000000000001,"pop":"4,500","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":46,"serialNo":1,"name":"Bhajeda Kalan","villageName":"Bhajeda Kalan","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":2450,"censusPopulation":15957,"estimatedPopulation2026":19460,"literacyRate":0.7340000000000001,"pop":"15,957","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":47,"serialNo":2,"name":"Asodha","villageName":"Asodha","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":2390,"censusPopulation":15588,"estimatedPopulation2026":19010,"literacyRate":0.7190000000000001,"pop":"15,588","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":48,"serialNo":3,"name":"Dehra","villageName":"Dehra","district":"Hapur","tehsil":"Dhaulana","developmentBlock":"Dhaulana","households":2210,"censusPopulation":14501,"estimatedPopulation2026":17690,"literacyRate":0.6679999999999999,"pop":"14,501","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":49,"serialNo":4,"name":"Dhaulana","villageName":"Dhaulana","district":"Hapur","tehsil":"Dhaulana","developmentBlock":"Dhaulana","households":2150,"censusPopulation":14060,"estimatedPopulation2026":17150,"literacyRate":0.7559999999999999,"pop":"14,060","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":50,"serialNo":5,"name":"Pilkhua Dehat","villageName":"Pilkhua Dehat","district":"Hapur","tehsil":"Dhaulana","developmentBlock":"Dhaulana","households":1820,"censusPopulation":11900,"estimatedPopulation2026":14510,"literacyRate":0.721,"pop":"11,900","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":51,"serialNo":6,"name":"Piplehda","villageName":"Piplehda","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":1740,"censusPopulation":11391,"estimatedPopulation2026":13890,"literacyRate":0.748,"pop":"11,391","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":52,"serialNo":7,"name":"Garh Dehat","villageName":"Garh Dehat","district":"Hapur","tehsil":"Garhmukteshwar","developmentBlock":"Garhmukteshwar","households":1680,"censusPopulation":10980,"estimatedPopulation2026":13390,"literacyRate":0.682,"pop":"10,980","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":53,"serialNo":8,"name":"Simbhaoli","villageName":"Simbhaoli","district":"Hapur","tehsil":"Simbhaoli","developmentBlock":"Simbhaoli","households":1540,"censusPopulation":10080,"estimatedPopulation2026":12290,"literacyRate":0.763,"pop":"10,080","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":54,"serialNo":9,"name":"Galand","villageName":"Galand","district":"Hapur","tehsil":"Dhaulana","developmentBlock":"Dhaulana","households":1480,"censusPopulation":9620,"estimatedPopulation2026":11730,"literacyRate":0.7090000000000001,"pop":"9,620","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":55,"serialNo":10,"name":"Sapnavat","villageName":"Sapnavat","district":"Hapur","tehsil":"Dhaulana","developmentBlock":"Dhaulana","households":1390,"censusPopulation":9110,"estimatedPopulation2026":11110,"literacyRate":0.741,"pop":"9,110","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":56,"serialNo":11,"name":"Chhajarsi","villageName":"Chhajarsi","district":"Hapur","tehsil":"Dhaulana","developmentBlock":"Dhaulana","households":1310,"censusPopulation":8560,"estimatedPopulation2026":10440,"literacyRate":0.725,"pop":"8,560","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":57,"serialNo":12,"name":"Brijnathpur","villageName":"Brijnathpur","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":1250,"censusPopulation":8150,"estimatedPopulation2026":9940,"literacyRate":0.75,"pop":"8,150","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":58,"serialNo":13,"name":"Bhatiana","villageName":"Bhatiana","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":1190,"censusPopulation":7780,"estimatedPopulation2026":9490,"literacyRate":0.772,"pop":"7,780","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":59,"serialNo":14,"name":"Tatarpur","villageName":"Tatarpur","district":"Hapur","tehsil":"Garhmukteshwar","developmentBlock":"Garhmukteshwar","households":1150,"censusPopulation":7520,"estimatedPopulation2026":9170,"literacyRate":0.7390000000000001,"pop":"7,520","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":60,"serialNo":15,"name":"Gohra Alamgirpur","villageName":"Gohra Alamgirpur","district":"Hapur","tehsil":"Simbhaoli","developmentBlock":"Simbhaoli","households":1120,"censusPopulation":7340,"estimatedPopulation2026":8950,"literacyRate":0.7140000000000001,"pop":"7,340","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":61,"serialNo":16,"name":"Babugarh Dehat","villageName":"Babugarh Dehat","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":1080,"censusPopulation":7050,"estimatedPopulation2026":8600,"literacyRate":0.7809999999999999,"pop":"7,050","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":62,"serialNo":17,"name":"Buxar","villageName":"Buxar","district":"Hapur","tehsil":"Garhmukteshwar","developmentBlock":"Garhmukteshwar","households":1020,"censusPopulation":6670,"estimatedPopulation2026":8130,"literacyRate":0.695,"pop":"6,670","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":63,"serialNo":18,"name":"Zainuddinpur","villageName":"Zainuddinpur","district":"Hapur","tehsil":"Simbhaoli","developmentBlock":"Simbhaoli","households":990,"censusPopulation":6470,"estimatedPopulation2026":7890,"literacyRate":0.746,"pop":"6,470","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":64,"serialNo":19,"name":"Lakhan","villageName":"Lakhan","district":"Hapur","tehsil":"Dhaulana","developmentBlock":"Dhaulana","households":980,"censusPopulation":6410,"estimatedPopulation2026":7820,"literacyRate":0.732,"pop":"6,410","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":65,"serialNo":20,"name":"Baroda Hinduvan","villageName":"Baroda Hinduvan","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":960,"censusPopulation":6280,"estimatedPopulation2026":7660,"literacyRate":0.759,"pop":"6,280","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":66,"serialNo":21,"name":"Siana","villageName":"Siana","district":"Hapur","tehsil":"Garhmukteshwar","developmentBlock":"Garhmukteshwar","households":940,"censusPopulation":6140,"estimatedPopulation2026":7490,"literacyRate":0.7040000000000001,"pop":"6,140","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":67,"serialNo":22,"name":"Anwarpur","villageName":"Anwarpur","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":920,"censusPopulation":6020,"estimatedPopulation2026":7340,"literacyRate":0.768,"pop":"6,020","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":68,"serialNo":23,"name":"Hasanpur Lodha","villageName":"Hasanpur Lodha","district":"Hapur","tehsil":"Dhaulana","developmentBlock":"Dhaulana","households":910,"censusPopulation":5950,"estimatedPopulation2026":7250,"literacyRate":0.6809999999999999,"pop":"5,950","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":69,"serialNo":24,"name":"Achhaija","villageName":"Achhaija","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":880,"censusPopulation":5750,"estimatedPopulation2026":7010,"literacyRate":0.753,"pop":"5,750","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":70,"serialNo":25,"name":"Hafizpur Ubarpur","villageName":"Hafizpur Ubarpur","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":870,"censusPopulation":5690,"estimatedPopulation2026":6940,"literacyRate":0.74,"pop":"5,690","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":71,"serialNo":26,"name":"Kapoorpur","villageName":"Kapoorpur","district":"Hapur","tehsil":"Dhaulana","developmentBlock":"Dhaulana","households":850,"censusPopulation":5550,"estimatedPopulation2026":6770,"literacyRate":0.715,"pop":"5,550","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":72,"serialNo":27,"name":"Badnoli","villageName":"Badnoli","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":840,"censusPopulation":5490,"estimatedPopulation2026":6690,"literacyRate":0.737,"pop":"5,490","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":73,"serialNo":28,"name":"Dayanatpur","villageName":"Dayanatpur","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":830,"censusPopulation":5420,"estimatedPopulation2026":6610,"literacyRate":0.76,"pop":"5,420","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":74,"serialNo":29,"name":"Lodhipur Soban","villageName":"Lodhipur Soban","district":"Hapur","tehsil":"Garhmukteshwar","developmentBlock":"Garhmukteshwar","households":810,"censusPopulation":5290,"estimatedPopulation2026":6450,"literacyRate":0.674,"pop":"5,290","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":75,"serialNo":30,"name":"Kamaruddin Nagar","villageName":"Kamaruddin Nagar","district":"Hapur","tehsil":"Dhaulana","developmentBlock":"Dhaulana","households":790,"censusPopulation":5160,"estimatedPopulation2026":6290,"literacyRate":0.728,"pop":"5,160","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":76,"serialNo":31,"name":"Baroda Sinhani","villageName":"Baroda Sinhani","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":780,"censusPopulation":5100,"estimatedPopulation2026":6220,"literacyRate":0.745,"pop":"5,100","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":77,"serialNo":32,"name":"Kakrana","villageName":"Kakrana","district":"Hapur","tehsil":"Dhaulana","developmentBlock":"Dhaulana","households":760,"censusPopulation":4970,"estimatedPopulation2026":6060,"literacyRate":0.731,"pop":"4,970","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":78,"serialNo":33,"name":"Bhikanpur","villageName":"Bhikanpur","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":740,"censusPopulation":4830,"estimatedPopulation2026":5890,"literacyRate":0.752,"pop":"4,830","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":79,"serialNo":34,"name":"Salarpur","villageName":"Salarpur","district":"Hapur","tehsil":"Garhmukteshwar","developmentBlock":"Garhmukteshwar","households":730,"censusPopulation":4770,"estimatedPopulation2026":5810,"literacyRate":0.6990000000000001,"pop":"4,770","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":80,"serialNo":35,"name":"Dastoi","villageName":"Dastoi","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":720,"censusPopulation":4710,"estimatedPopulation2026":5740,"literacyRate":0.765,"pop":"4,710","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":81,"serialNo":36,"name":"Bhameda","villageName":"Bhameda","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":710,"censusPopulation":4640,"estimatedPopulation2026":5660,"literacyRate":0.742,"pop":"4,640","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":82,"serialNo":37,"name":"Dahpa","villageName":"Dahpa","district":"Hapur","tehsil":"Dhaulana","developmentBlock":"Dhaulana","households":690,"censusPopulation":4510,"estimatedPopulation2026":5500,"literacyRate":0.71,"pop":"4,510","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":83,"serialNo":38,"name":"Khairpur Khairabad","villageName":"Khairpur Khairabad","district":"Hapur","tehsil":"Dhaulana","developmentBlock":"Dhaulana","households":670,"censusPopulation":4380,"estimatedPopulation2026":5340,"literacyRate":0.7240000000000001,"pop":"4,380","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":84,"serialNo":39,"name":"Chitauli","villageName":"Chitauli","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":660,"censusPopulation":4310,"estimatedPopulation2026":5250,"literacyRate":0.758,"pop":"4,310","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":85,"serialNo":40,"name":"Doymi","villageName":"Doymi","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":640,"censusPopulation":4180,"estimatedPopulation2026":5090,"literacyRate":0.77,"pop":"4,180","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":86,"serialNo":41,"name":"Akdauli","villageName":"Akdauli","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":610,"censusPopulation":3990,"estimatedPopulation2026":4860,"literacyRate":0.735,"pop":"3,990","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":87,"serialNo":42,"name":"Dadayara","villageName":"Dadayara","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":590,"censusPopulation":3860,"estimatedPopulation2026":4710,"literacyRate":0.7490000000000001,"pop":"3,860","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":88,"serialNo":43,"name":"Alampur","villageName":"Alampur","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":580,"censusPopulation":3790,"estimatedPopulation2026":4620,"literacyRate":0.72,"pop":"3,790","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":89,"serialNo":44,"name":"Bhatail","villageName":"Bhatail","district":"Hapur","tehsil":"Hapur","developmentBlock":"Hapur","households":550,"censusPopulation":3590,"estimatedPopulation2026":4380,"literacyRate":0.713,"pop":"3,590","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":90,"serialNo":45,"name":"Jadopur","villageName":"Jadopur","district":"Hapur","tehsil":"Dhaulana","developmentBlock":"Dhaulana","households":530,"censusPopulation":3460,"estimatedPopulation2026":4220,"literacyRate":0.701,"pop":"3,460","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":91,"serialNo":1,"name":"Incholi","villageName":"Incholi","district":"Meerut","tehsil":"Mawana","developmentBlock":"Mawana","households":2760,"censusPopulation":14914,"estimatedPopulation2026":18195,"literacyRate":0.715,"pop":"14,914","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":92,"serialNo":2,"name":"Rasulpur Dhaulri","villageName":"Rasulpur Dhaulri","district":"Meerut","tehsil":"Rohta","developmentBlock":"Rohta","households":2610,"censusPopulation":14187,"estimatedPopulation2026":17308,"literacyRate":0.732,"pop":"14,187","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":93,"serialNo":3,"name":"Salawa","villageName":"Salawa","district":"Meerut","tehsil":"Sardhana","developmentBlock":"Sardhana","households":2540,"censusPopulation":13850,"estimatedPopulation2026":16890,"literacyRate":0.6890000000000001,"pop":"13,850","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":94,"serialNo":4,"name":"Phalauda Rural","villageName":"Phalauda Rural","district":"Meerut","tehsil":"Mawana","developmentBlock":"Mawana","households":2210,"censusPopulation":12100,"estimatedPopulation2026":14760,"literacyRate":0.674,"pop":"12,100","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":95,"serialNo":5,"name":"Kithaur Rural","villageName":"Kithaur Rural","district":"Meerut","tehsil":"Machhra","developmentBlock":"Machhra","households":2150,"censusPopulation":11800,"estimatedPopulation2026":14390,"literacyRate":0.652,"pop":"11,800","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":96,"serialNo":6,"name":"Khiwai Rural","villageName":"Khiwai Rural","district":"Meerut","tehsil":"Sardhana","developmentBlock":"Sardhana","households":2080,"censusPopulation":11420,"estimatedPopulation2026":13930,"literacyRate":0.66,"pop":"11,420","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":97,"serialNo":7,"name":"Daurala Rural","villageName":"Daurala Rural","district":"Meerut","tehsil":"Daurala","developmentBlock":"Daurala","households":1950,"censusPopulation":10700,"estimatedPopulation2026":13050,"literacyRate":0.765,"pop":"10,700","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":98,"serialNo":8,"name":"Parikshitgarh Rural","villageName":"Parikshitgarh Rural","district":"Meerut","tehsil":"Parikshitgarh","developmentBlock":"Parikshitgarh","households":1880,"censusPopulation":10350,"estimatedPopulation2026":12620,"literacyRate":0.728,"pop":"10,350","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":99,"serialNo":9,"name":"Shahjahanpur Rural","villageName":"Shahjahanpur Rural","district":"Meerut","tehsil":"Machhra","developmentBlock":"Machhra","households":1850,"censusPopulation":10120,"estimatedPopulation2026":12340,"literacyRate":0.691,"pop":"10,120","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":100,"serialNo":10,"name":"Lawar Rural","villageName":"Lawar Rural","district":"Meerut","tehsil":"Daurala","developmentBlock":"Daurala","households":1820,"censusPopulation":9980,"estimatedPopulation2026":12170,"literacyRate":0.705,"pop":"9,980","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":101,"serialNo":11,"name":"Rohta","villageName":"Rohta","district":"Meerut","tehsil":"Rohta","developmentBlock":"Rohta","households":1750,"censusPopulation":9650,"estimatedPopulation2026":11770,"literacyRate":0.759,"pop":"9,650","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":102,"serialNo":12,"name":"Sardhana Rural","villageName":"Sardhana Rural","district":"Meerut","tehsil":"Sardhana","developmentBlock":"Sardhana","households":1690,"censusPopulation":9320,"estimatedPopulation2026":11370,"literacyRate":0.684,"pop":"9,320","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":103,"serialNo":13,"name":"Machhra","villageName":"Machhra","district":"Meerut","tehsil":"Machhra","developmentBlock":"Machhra","households":1620,"censusPopulation":8950,"estimatedPopulation2026":10920,"literacyRate":0.742,"pop":"8,950","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":104,"serialNo":14,"name":"Janani","villageName":"Janani","district":"Meerut","tehsil":"Rajpura","developmentBlock":"Rajpura","households":1580,"censusPopulation":8740,"estimatedPopulation2026":10660,"literacyRate":0.731,"pop":"8,740","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":105,"serialNo":15,"name":"Ghat","villageName":"Ghat","district":"Meerut","tehsil":"Jani Khurd","developmentBlock":"Jani Khurd","households":1550,"censusPopulation":8560,"estimatedPopulation2026":10440,"literacyRate":0.75,"pop":"8,560","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":106,"serialNo":16,"name":"Jani Khurd","villageName":"Jani Khurd","district":"Meerut","tehsil":"Jani Khurd","developmentBlock":"Jani Khurd","households":1510,"censusPopulation":8350,"estimatedPopulation2026":10180,"literacyRate":0.762,"pop":"8,350","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":107,"serialNo":17,"name":"Mawana Kalan","villageName":"Mawana Kalan","district":"Meerut","tehsil":"Mawana","developmentBlock":"Mawana","households":1490,"censusPopulation":8210,"estimatedPopulation2026":10010,"literacyRate":0.7240000000000001,"pop":"8,210","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":108,"serialNo":18,"name":"Bala","villageName":"Bala","district":"Meerut","tehsil":"Daurala","developmentBlock":"Daurala","households":1450,"censusPopulation":7980,"estimatedPopulation2026":9730,"literacyRate":0.78,"pop":"7,980","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":109,"serialNo":19,"name":"Pohalli","villageName":"Pohalli","district":"Meerut","tehsil":"Sardhana","developmentBlock":"Sardhana","households":1420,"censusPopulation":7850,"estimatedPopulation2026":9570,"literacyRate":0.718,"pop":"7,850","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":110,"serialNo":20,"name":"Kharkhoda Rural","villageName":"Kharkhoda Rural","district":"Meerut","tehsil":"Kharkhoda","developmentBlock":"Kharkhoda","households":1380,"censusPopulation":7620,"estimatedPopulation2026":9290,"literacyRate":0.746,"pop":"7,620","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":111,"serialNo":21,"name":"Bhojpur","villageName":"Bhojpur","district":"Meerut","tehsil":"Machhra","developmentBlock":"Machhra","households":1350,"censusPopulation":7450,"estimatedPopulation2026":9090,"literacyRate":0.735,"pop":"7,450","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":112,"serialNo":22,"name":"Sarurpur Rural","villageName":"Sarurpur Rural","district":"Meerut","tehsil":"Sarurpur","developmentBlock":"Sarurpur","households":1320,"censusPopulation":7300,"estimatedPopulation2026":8900,"literacyRate":0.7090000000000001,"pop":"7,300","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":113,"serialNo":23,"name":"Sewalkhas Rural","villageName":"Sewalkhas Rural","district":"Meerut","tehsil":"Jani Khurd","developmentBlock":"Jani Khurd","households":1290,"censusPopulation":7150,"estimatedPopulation2026":8720,"literacyRate":0.665,"pop":"7,150","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":114,"serialNo":24,"name":"Kaul","villageName":"Kaul","district":"Meerut","tehsil":"Daurala","developmentBlock":"Daurala","households":1260,"censusPopulation":6980,"estimatedPopulation2026":8510,"literacyRate":0.773,"pop":"6,980","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":115,"serialNo":25,"name":"Rithani Rural","villageName":"Rithani Rural","district":"Meerut","tehsil":"Meerut","developmentBlock":"Meerut","households":1240,"censusPopulation":6850,"estimatedPopulation2026":8350,"literacyRate":0.7909999999999999,"pop":"6,850","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":116,"serialNo":26,"name":"Mohiuddinpur Rural","villageName":"Mohiuddinpur Rural","district":"Meerut","tehsil":"Meerut","developmentBlock":"Meerut","households":1210,"censusPopulation":6700,"estimatedPopulation2026":8170,"literacyRate":0.785,"pop":"6,700","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":117,"serialNo":27,"name":"Ahar","villageName":"Ahar","district":"Meerut","tehsil":"Parikshitgarh","developmentBlock":"Parikshitgarh","households":1180,"censusPopulation":6550,"estimatedPopulation2026":7990,"literacyRate":0.72,"pop":"6,550","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":118,"serialNo":28,"name":"Gagol","villageName":"Gagol","district":"Meerut","tehsil":"Kharkhoda","developmentBlock":"Kharkhoda","households":1150,"censusPopulation":6380,"estimatedPopulation2026":7780,"literacyRate":0.754,"pop":"6,380","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":119,"serialNo":29,"name":"Niloha","villageName":"Niloha","district":"Meerut","tehsil":"Mawana","developmentBlock":"Mawana","households":1120,"censusPopulation":6210,"estimatedPopulation2026":7570,"literacyRate":0.7390000000000001,"pop":"6,210","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":120,"serialNo":30,"name":"Pali","villageName":"Pali","district":"Meerut","tehsil":"Baghpat Border","developmentBlock":"Baghpat Border","households":1090,"censusPopulation":6050,"estimatedPopulation2026":7380,"literacyRate":0.741,"pop":"6,050","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":121,"serialNo":31,"name":"Chhur","villageName":"Chhur","district":"Meerut","tehsil":"Sarurpur","developmentBlock":"Sarurpur","households":1070,"censusPopulation":5920,"estimatedPopulation2026":7220,"literacyRate":0.726,"pop":"5,920","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":122,"serialNo":32,"name":"Dikoli","villageName":"Dikoli","district":"Meerut","tehsil":"Rohta","developmentBlock":"Rohta","households":1050,"censusPopulation":5800,"estimatedPopulation2026":7070,"literacyRate":0.748,"pop":"5,800","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":123,"serialNo":33,"name":"Meharjanj","villageName":"Meharjanj","district":"Meerut","tehsil":"Sardhana","developmentBlock":"Sardhana","households":1020,"censusPopulation":5650,"estimatedPopulation2026":6890,"literacyRate":0.698,"pop":"5,650","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":124,"serialNo":34,"name":"Jatauli","villageName":"Jatauli","district":"Meerut","tehsil":"Daurala","developmentBlock":"Daurala","households":990,"censusPopulation":5500,"estimatedPopulation2026":6710,"literacyRate":0.769,"pop":"5,500","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":125,"serialNo":35,"name":"Behta","villageName":"Behta","district":"Meerut","tehsil":"Mawana","developmentBlock":"Mawana","households":970,"censusPopulation":5380,"estimatedPopulation2026":6560,"literacyRate":0.7120000000000001,"pop":"5,380","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":126,"serialNo":36,"name":"Mavi","villageName":"Mavi","district":"Meerut","tehsil":"Machhra","developmentBlock":"Machhra","households":950,"censusPopulation":5250,"estimatedPopulation2026":640,"literacyRate":0.73,"pop":"5,250","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":127,"serialNo":37,"name":"Kalyanpur","villageName":"Kalyanpur","district":"Meerut","tehsil":"Meerut","developmentBlock":"Meerut","households":930,"censusPopulation":5120,"estimatedPopulation2026":6240,"literacyRate":0.7759999999999999,"pop":"5,120","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":128,"serialNo":38,"name":"Ghesupur","villageName":"Ghesupur","district":"Meerut","tehsil":"Parikshitgarh","developmentBlock":"Parikshitgarh","households":910,"censusPopulation":5010,"estimatedPopulation2026":6110,"literacyRate":0.705,"pop":"5,010","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":129,"serialNo":39,"name":"Bhadaini","villageName":"Bhadaini","district":"Meerut","tehsil":"Jani Khurd","developmentBlock":"Jani Khurd","households":890,"censusPopulation":4900,"estimatedPopulation2026":5980,"literacyRate":0.743,"pop":"4,900","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":130,"serialNo":40,"name":"Siwal Khas","villageName":"Siwal Khas","district":"Meerut","tehsil":"Jani Khurd","developmentBlock":"Jani Khurd","households":870,"censusPopulation":4800,"estimatedPopulation2026":5850,"literacyRate":0.679,"pop":"4,800","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":131,"serialNo":41,"name":"Mandaula","villageName":"Mandaula","district":"Meerut","tehsil":"Kharkhoda","developmentBlock":"Kharkhoda","households":850,"censusPopulation":4680,"estimatedPopulation2026":5710,"literacyRate":0.7509999999999999,"pop":"4,680","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":132,"serialNo":42,"name":"Rajpura Rural","villageName":"Rajpura Rural","district":"Meerut","tehsil":"Rajpura","developmentBlock":"Rajpura","households":830,"censusPopulation":4550,"estimatedPopulation2026":5550,"literacyRate":0.764,"pop":"4,550","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":133,"serialNo":43,"name":"Daurau","villageName":"Daurau","district":"Meerut","tehsil":"Daurala","developmentBlock":"Daurala","households":810,"censusPopulation":4430,"estimatedPopulation2026":5400,"literacyRate":0.758,"pop":"4,430","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":134,"serialNo":44,"name":"Gura","villageName":"Gura","district":"Meerut","tehsil":"Rohta","developmentBlock":"Rohta","households":790,"censusPopulation":4310,"estimatedPopulation2026":5260,"literacyRate":0.737,"pop":"4,310","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":135,"serialNo":45,"name":"Karnawal Rural","villageName":"Karnawal Rural","district":"Meerut","tehsil":"Sarurpur","developmentBlock":"Sarurpur","households":770,"censusPopulation":4200,"estimatedPopulation2026":5120,"literacyRate":0.76,"pop":"4,200","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":136,"serialNo":1,"name":"Dhoom Manikpur","villageName":"Dhoom Manikpur","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":1750,"censusPopulation":10388,"estimatedPopulation2026":14240,"literacyRate":0.768,"pop":"10,388","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":137,"serialNo":2,"name":"Kalonda","villageName":"Kalonda","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":1680,"censusPopulation":9910,"estimatedPopulation2026":13580,"literacyRate":0.6920000000000001,"pop":"9,910","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":138,"serialNo":3,"name":"Dayantpur","villageName":"Dayantpur","district":"Gautam Buddh Nagar","tehsil":"Jewar","developmentBlock":"Jewar","households":1640,"censusPopulation":9722,"estimatedPopulation2026":13320,"literacyRate":0.725,"pop":"9,722","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":139,"serialNo":4,"name":"Jarcha","villageName":"Jarcha","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":1610,"censusPopulation":9548,"estimatedPopulation2026":13080,"literacyRate":0.741,"pop":"9,548","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":140,"serialNo":5,"name":"Dujana","villageName":"Dujana","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":1530,"censusPopulation":9021,"estimatedPopulation2026":12360,"literacyRate":0.759,"pop":"9,021","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":141,"serialNo":6,"name":"Bambawad","villageName":"Bambawad","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":1480,"censusPopulation":8760,"estimatedPopulation2026":12000,"literacyRate":0.7340000000000001,"pop":"8,760","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":142,"serialNo":7,"name":"Bisrakh Jalalpur","villageName":"Bisrakh Jalalpur","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":920,"censusPopulation":5470,"estimatedPopulation2026":7500,"literacyRate":0.812,"pop":"5,470","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":143,"serialNo":8,"name":"Rabupura Rural","villageName":"Rabupura Rural","district":"Gautam Buddh Nagar","tehsil":"Jewar","developmentBlock":"Jewar","households":2210,"censusPopulation":12450,"estimatedPopulation2026":17060,"literacyRate":0.705,"pop":"12,450","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":144,"serialNo":9,"name":"Jewar Khurd","villageName":"Jewar Khurd","district":"Gautam Buddh Nagar","tehsil":"Jewar","developmentBlock":"Jewar","households":1550,"censusPopulation":9150,"estimatedPopulation2026":12540,"literacyRate":0.738,"pop":"9,150","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":145,"serialNo":10,"name":"Dankaur Rural","villageName":"Dankaur Rural","district":"Gautam Buddh Nagar","tehsil":"Dankaur","developmentBlock":"Dankaur","households":1490,"censusPopulation":8820,"estimatedPopulation2026":12080,"literacyRate":0.746,"pop":"8,820","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":146,"serialNo":11,"name":"Bilaspur Rural","villageName":"Bilaspur Rural","district":"Gautam Buddh Nagar","tehsil":"Dankaur","developmentBlock":"Dankaur","households":1420,"censusPopulation":8410,"estimatedPopulation2026":11520,"literacyRate":0.7190000000000001,"pop":"8,410","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":147,"serialNo":12,"name":"Dadri Rural","villageName":"Dadri Rural","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":1380,"censusPopulation":8150,"estimatedPopulation2026":11170,"literacyRate":0.772,"pop":"8,150","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":148,"serialNo":13,"name":"Salarpur Rural","villageName":"Salarpur Rural","district":"Gautam Buddh Nagar","tehsil":"Dankaur","developmentBlock":"Dankaur","households":1310,"censusPopulation":7750,"estimatedPopulation2026":10620,"literacyRate":0.784,"pop":"7,750","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":149,"serialNo":14,"name":"Chhapraula Rural","villageName":"Chhapraula Rural","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":1280,"censusPopulation":7550,"estimatedPopulation2026":10340,"literacyRate":0.805,"pop":"7,550","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":150,"serialNo":15,"name":"Badalpur","villageName":"Badalpur","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":1250,"censusPopulation":7380,"estimatedPopulation2026":10110,"literacyRate":0.7909999999999999,"pop":"7,380","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":151,"serialNo":16,"name":"Tilapta Karanvas","villageName":"Tilapta Karanvas","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":1210,"censusPopulation":7120,"estimatedPopulation2026":9750,"literacyRate":0.763,"pop":"7,120","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":152,"serialNo":17,"name":"Gheja","villageName":"Gheja","district":"Gautam Buddh Nagar","tehsil":"Dankaur","developmentBlock":"Dankaur","households":1180,"censusPopulation":6950,"estimatedPopulation2026":9520,"literacyRate":0.75,"pop":"6,950","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":153,"serialNo":18,"name":"Wajidpur Rural","villageName":"Wajidpur Rural","district":"Gautam Buddh Nagar","tehsil":"Dankaur","developmentBlock":"Dankaur","households":1140,"censusPopulation":6720,"estimatedPopulation2026":9210,"literacyRate":0.789,"pop":"6,720","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":154,"serialNo":19,"name":"Shahpur Govardhanpur","villageName":"Shahpur Govardhanpur","district":"Gautam Buddh Nagar","tehsil":"Dankaur","developmentBlock":"Dankaur","households":1110,"censusPopulation":6550,"estimatedPopulation2026":8970,"literacyRate":0.775,"pop":"6,550","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":155,"serialNo":20,"name":"Bhangel Begampur","villageName":"Bhangel Begampur","district":"Gautam Buddh Nagar","tehsil":"Dankaur","developmentBlock":"Dankaur","households":1080,"censusPopulation":6380,"estimatedPopulation2026":8740,"literacyRate":0.81,"pop":"6,380","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":156,"serialNo":21,"name":"Gejha Tilapat","villageName":"Gejha Tilapat","district":"Gautam Buddh Nagar","tehsil":"Dankaur","developmentBlock":"Dankaur","households":1050,"censusPopulation":6210,"estimatedPopulation2026":8510,"literacyRate":0.7959999999999999,"pop":"6,210","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":157,"serialNo":22,"name":"Sorkha Rural","villageName":"Sorkha Rural","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":1020,"censusPopulation":5980,"estimatedPopulation2026":8190,"literacyRate":0.77,"pop":"5,980","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":158,"serialNo":23,"name":"Nithari Rural","villageName":"Nithari Rural","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":990,"censusPopulation":5820,"estimatedPopulation2026":7970,"literacyRate":0.7859999999999999,"pop":"5,820","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":159,"serialNo":24,"name":"Chhalera Bangar Rural","villageName":"Chhalera Bangar Rural","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":970,"censusPopulation":5680,"estimatedPopulation2026":7780,"literacyRate":0.821,"pop":"5,680","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":160,"serialNo":25,"name":"Mamura Rural","villageName":"Mamura Rural","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":950,"censusPopulation":5520,"estimatedPopulation2026":7560,"literacyRate":0.804,"pop":"5,520","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":161,"serialNo":26,"name":"Agahpur Rural","villageName":"Agahpur Rural","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":920,"censusPopulation":5380,"estimatedPopulation2026":7370,"literacyRate":0.795,"pop":"5,380","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":162,"serialNo":27,"name":"Baraula Rural","villageName":"Baraula Rural","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":900,"censusPopulation":5250,"estimatedPopulation2026":7190,"literacyRate":0.782,"pop":"5,250","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":163,"serialNo":28,"name":"Hoshiyarpur Rural","villageName":"Hoshiyarpur Rural","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":880,"censusPopulation":5110,"estimatedPopulation2026":7000,"literacyRate":0.799,"pop":"5,110","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":164,"serialNo":29,"name":"Chaura Sadatpur","villageName":"Chaura Sadatpur","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":860,"censusPopulation":4980,"estimatedPopulation2026":6820,"literacyRate":0.815,"pop":"4,980","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":165,"serialNo":30,"name":"Kakod Rural","villageName":"Kakod Rural","district":"Gautam Buddh Nagar","tehsil":"Dankaur","developmentBlock":"Dankaur","households":840,"censusPopulation":4850,"estimatedPopulation2026":6640,"literacyRate":0.7240000000000001,"pop":"4,850","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":166,"serialNo":31,"name":"Jhajar Rural","villageName":"Jhajar Rural","district":"Gautam Buddh Nagar","tehsil":"Dankaur","developmentBlock":"Dankaur","households":820,"censusPopulation":4720,"estimatedPopulation2026":6470,"literacyRate":0.71,"pop":"4,720","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":167,"serialNo":32,"name":"Rampur Majra","villageName":"Rampur Majra","district":"Gautam Buddh Nagar","tehsil":"Dankaur","developmentBlock":"Dankaur","households":800,"censusPopulation":4580,"estimatedPopulation2026":6270,"literacyRate":0.748,"pop":"4,580","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":168,"serialNo":33,"name":"Mursan Rural","villageName":"Mursan Rural","district":"Gautam Buddh Nagar","tehsil":"Jewar","developmentBlock":"Jewar","households":780,"censusPopulation":4450,"estimatedPopulation2026":6100,"literacyRate":0.732,"pop":"4,450","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":169,"serialNo":34,"name":"Miranpur","villageName":"Miranpur","district":"Gautam Buddh Nagar","tehsil":"Jewar","developmentBlock":"Jewar","households":760,"censusPopulation":4320,"estimatedPopulation2026":5920,"literacyRate":0.7090000000000001,"pop":"4,320","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":170,"serialNo":35,"name":"Thora","villageName":"Thora","district":"Gautam Buddh Nagar","tehsil":"Jewar","developmentBlock":"Jewar","households":740,"censusPopulation":4190,"estimatedPopulation2026":5740,"literacyRate":0.721,"pop":"4,190","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":171,"serialNo":36,"name":"Raniha","villageName":"Raniha","district":"Gautam Buddh Nagar","tehsil":"Jewar","developmentBlock":"Jewar","households":720,"censusPopulation":4060,"estimatedPopulation2026":5560,"literacyRate":0.715,"pop":"4,060","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":172,"serialNo":37,"name":"Khaikhera","villageName":"Khaikhera","district":"Gautam Buddh Nagar","tehsil":"Jewar","developmentBlock":"Jewar","households":700,"censusPopulation":3940,"estimatedPopulation2026":5400,"literacyRate":0.736,"pop":"3,940","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":173,"serialNo":38,"name":"Bhatta","villageName":"Bhatta","district":"Gautam Buddh Nagar","tehsil":"Dankaur","developmentBlock":"Dankaur","households":680,"censusPopulation":3810,"estimatedPopulation2026":5220,"literacyRate":0.753,"pop":"3,810","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":174,"serialNo":39,"name":"Parsaul","villageName":"Parsaul","district":"Gautam Buddh Nagar","tehsil":"Dankaur","developmentBlock":"Dankaur","households":660,"censusPopulation":3680,"estimatedPopulation2026":5040,"literacyRate":0.7490000000000001,"pop":"3,680","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":175,"serialNo":40,"name":"Ghanghola","villageName":"Ghanghola","district":"Gautam Buddh Nagar","tehsil":"Dankaur","developmentBlock":"Dankaur","households":640,"censusPopulation":3550,"estimatedPopulation2026":4860,"literacyRate":0.7609999999999999,"pop":"3,550","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":176,"serialNo":41,"name":"Sakipur","villageName":"Sakipur","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":620,"censusPopulation":3420,"estimatedPopulation2026":4690,"literacyRate":0.778,"pop":"3,420","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":177,"serialNo":42,"name":"Gulistanpur","villageName":"Gulistanpur","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":600,"censusPopulation":3300,"estimatedPopulation2026":4520,"literacyRate":0.78,"pop":"3,300","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":178,"serialNo":43,"name":"Sutiyana","villageName":"Sutiyana","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":580,"censusPopulation":3180,"estimatedPopulation2026":4360,"literacyRate":0.765,"pop":"3,180","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":179,"serialNo":44,"name":"Tusyana","villageName":"Tusyana","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":560,"censusPopulation":3050,"estimatedPopulation2026":4180,"literacyRate":0.752,"pop":"3,050","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":180,"serialNo":45,"name":"Kulesra Rural","villageName":"Kulesra Rural","district":"Gautam Buddh Nagar","tehsil":"Dadri","developmentBlock":"Dadri","households":540,"censusPopulation":2920,"estimatedPopulation2026":4000,"literacyRate":0.74,"pop":"2,920","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":181,"serialNo":1,"name":"Roravar","villageName":"Roravar","district":"Aligarh","tehsil":"Aligarh","developmentBlock":"Aligarh","households":4560,"censusPopulation":25522,"estimatedPopulation2026":31137,"literacyRate":0.638,"pop":"25,522","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":182,"serialNo":2,"name":"Barla","villageName":"Barla","district":"Aligarh","tehsil":"Atrauli","developmentBlock":"Atrauli","households":2310,"censusPopulation":13850,"estimatedPopulation2026":16897,"literacyRate":0.695,"pop":"13,850","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":183,"serialNo":3,"name":"Pilkhana Rural","villageName":"Pilkhana Rural","district":"Aligarh","tehsil":"Gonda","developmentBlock":"Gonda","households":1950,"censusPopulation":11518,"estimatedPopulation2026":14052,"literacyRate":0.721,"pop":"11,518","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":184,"serialNo":4,"name":"Dhaurra Mafi","villageName":"Dhaurra Mafi","district":"Aligarh","tehsil":"Lodha","developmentBlock":"Lodha","households":1820,"censusPopulation":10840,"estimatedPopulation2026":13225,"literacyRate":0.8240000000000001,"pop":"10,840","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":185,"serialNo":5,"name":"Harduaganj Rural","villageName":"Harduaganj Rural","district":"Aligarh","tehsil":"Dhanipur","developmentBlock":"Dhanipur","households":1750,"censusPopulation":10420,"estimatedPopulation2026":12712,"literacyRate":0.746,"pop":"10,420","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":186,"serialNo":6,"name":"Jawa Rural","villageName":"Jawa Rural","district":"Aligarh","tehsil":"Jawan Sikandrpur","developmentBlock":"Jawan Sikandrpur","households":1690,"censusPopulation":10110,"estimatedPopulation2026":12334,"literacyRate":0.7390000000000001,"pop":"10,110","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":187,"serialNo":7,"name":"Chharra Rural","villageName":"Chharra Rural","district":"Aligarh","tehsil":"Gangiri","developmentBlock":"Gangiri","households":2250,"censusPopulation":12950,"estimatedPopulation2026":15799,"literacyRate":0.662,"pop":"12,950","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":188,"serialNo":8,"name":"Jaliha","villageName":"Jaliha","district":"Aligarh","tehsil":"Atrauli","developmentBlock":"Atrauli","households":1580,"censusPopulation":9420,"estimatedPopulation2026":11492,"literacyRate":0.687,"pop":"9,420","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":189,"serialNo":9,"name":"Gonda Rural","villageName":"Gonda Rural","district":"Aligarh","tehsil":"Gonda","developmentBlock":"Gonda","households":1520,"censusPopulation":9110,"estimatedPopulation2026":11114,"literacyRate":0.75,"pop":"9,110","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":190,"serialNo":10,"name":"Iglas Rural","villageName":"Iglas Rural","district":"Aligarh","tehsil":"Iglas","developmentBlock":"Iglas","households":1490,"censusPopulation":8950,"estimatedPopulation2026":10919,"literacyRate":0.762,"pop":"8,950","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":191,"serialNo":11,"name":"Khair Rural","villageName":"Khair Rural","district":"Aligarh","tehsil":"Khair","developmentBlock":"Khair","households":1440,"censusPopulation":8620,"estimatedPopulation2026":10516,"literacyRate":0.748,"pop":"8,620","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":192,"serialNo":12,"name":"Tappal Rural","villageName":"Tappal Rural","district":"Aligarh","tehsil":"Tappal","developmentBlock":"Tappal","households":1390,"censusPopulation":8350,"estimatedPopulation2026":10187,"literacyRate":0.713,"pop":"8,350","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":193,"serialNo":13,"name":"Beswan Rural","villageName":"Beswan Rural","district":"Aligarh","tehsil":"Iglas","developmentBlock":"Iglas","households":1340,"censusPopulation":8020,"estimatedPopulation2026":9784,"literacyRate":0.735,"pop":"8,020","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":194,"serialNo":14,"name":"Vijaygarh Rural","villageName":"Vijaygarh Rural","district":"Aligarh","tehsil":"Akrabad","developmentBlock":"Akrabad","households":1310,"censusPopulation":7850,"estimatedPopulation2026":9577,"literacyRate":0.7090000000000001,"pop":"7,850","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":195,"serialNo":15,"name":"Akrabad Rural","villageName":"Akrabad Rural","district":"Aligarh","tehsil":"Akrabad","developmentBlock":"Akrabad","households":1280,"censusPopulation":7680,"estimatedPopulation2026":9370,"literacyRate":0.7240000000000001,"pop":"7,680","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":196,"serialNo":16,"name":"Dhanipur Rural","villageName":"Dhanipur Rural","district":"Aligarh","tehsil":"Dhanipur","developmentBlock":"Dhanipur","households":1250,"censusPopulation":7510,"estimatedPopulation2026":9162,"literacyRate":0.7559999999999999,"pop":"7,510","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":197,"serialNo":17,"name":"Lodha","villageName":"Lodha","district":"Aligarh","tehsil":"Lodha","developmentBlock":"Lodha","households":1210,"censusPopulation":7250,"estimatedPopulation2026":8845,"literacyRate":0.7809999999999999,"pop":"7,250","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":198,"serialNo":18,"name":"Gaboli","villageName":"Gaboli","district":"Aligarh","tehsil":"Jawan Sikandrpur","developmentBlock":"Jawan Sikandrpur","households":1180,"censusPopulation":7080,"estimatedPopulation2026":8638,"literacyRate":0.71,"pop":"7,080","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":199,"serialNo":19,"name":"Gangiri Rural","villageName":"Gangiri Rural","district":"Aligarh","tehsil":"Gangiri","developmentBlock":"Gangiri","households":1150,"censusPopulation":6920,"estimatedPopulation2026":8442,"literacyRate":0.6779999999999999,"pop":"6,920","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":200,"serialNo":20,"name":"Bijaigarh Rural","villageName":"Bijaigarh Rural","district":"Aligarh","tehsil":"Akrabad","developmentBlock":"Akrabad","households":1120,"censusPopulation":6750,"estimatedPopulation2026":8235,"literacyRate":0.72,"pop":"6,750","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":201,"serialNo":21,"name":"Sasni Rural","villageName":"Sasni Rural","district":"Aligarh","tehsil":"Iglas Border","developmentBlock":"Iglas Border","households":1090,"censusPopulation":6580,"estimatedPopulation2026":8028,"literacyRate":0.743,"pop":"6,580","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":202,"serialNo":22,"name":"Hasayan Rural","villageName":"Hasayan Rural","district":"Aligarh","tehsil":"Sikandra Rao","developmentBlock":"Sikandra Rao","households":1070,"censusPopulation":6420,"estimatedPopulation2026":7832,"literacyRate":0.731,"pop":"6,420","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":203,"serialNo":23,"name":"Porah","villageName":"Porah","district":"Aligarh","tehsil":"Lodha","developmentBlock":"Lodha","households":1050,"censusPopulation":6280,"estimatedPopulation2026":7662,"literacyRate":0.765,"pop":"6,280","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":204,"serialNo":24,"name":"Cherat Rural","villageName":"Cherat Rural","district":"Aligarh","tehsil":"Jawan Sikandrpur","developmentBlock":"Jawan Sikandrpur","households":1020,"censusPopulation":6120,"estimatedPopulation2026":7466,"literacyRate":0.789,"pop":"6,120","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":205,"serialNo":25,"name":"Panethi","villageName":"Panethi","district":"Aligarh","tehsil":"Dhanipur","developmentBlock":"Dhanipur","households":990,"censusPopulation":5950,"estimatedPopulation2026":7259,"literacyRate":0.752,"pop":"5,950","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":206,"serialNo":26,"name":"Kauriyaganj Rural","villageName":"Kauriyaganj Rural","district":"Aligarh","tehsil":"Dhanipur","developmentBlock":"Dhanipur","households":970,"censusPopulation":5810,"estimatedPopulation2026":7088,"literacyRate":0.7140000000000001,"pop":"5,810","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":207,"serialNo":27,"name":"Somna","villageName":"Somna","district":"Aligarh","tehsil":"Khair","developmentBlock":"Khair","households":950,"censusPopulation":5680,"estimatedPopulation2026":6930,"literacyRate":0.738,"pop":"5,680","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":208,"serialNo":28,"name":"Pisawa Rural","villageName":"Pisawa Rural","district":"Aligarh","tehsil":"Pisawa","developmentBlock":"Pisawa","households":930,"censusPopulation":5550,"estimatedPopulation2026":6771,"literacyRate":0.74,"pop":"5,550","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":209,"serialNo":29,"name":"Jawan Rural","villageName":"Jawan Rural","district":"Aligarh","tehsil":"Jawan Sikandrpur","developmentBlock":"Jawan Sikandrpur","households":910,"censusPopulation":5420,"estimatedPopulation2026":6612,"literacyRate":0.759,"pop":"5,420","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":210,"serialNo":30,"name":"Mursan Rural","villageName":"Mursan Rural","district":"Aligarh","tehsil":"Iglas Border","developmentBlock":"Iglas Border","households":890,"censusPopulation":5290,"estimatedPopulation2026":6454,"literacyRate":0.726,"pop":"5,290","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":211,"serialNo":31,"name":"Satha","villageName":"Satha","district":"Aligarh","tehsil":"Jawan Sikandrpur","developmentBlock":"Jawan Sikandrpur","households":870,"censusPopulation":5150,"estimatedPopulation2026":6283,"literacyRate":0.768,"pop":"5,150","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":212,"serialNo":32,"name":"Barauli Rural","villageName":"Barauli Rural","district":"Aligarh","tehsil":"Jawan Sikandrpur","developmentBlock":"Jawan Sikandrpur","households":850,"censusPopulation":5020,"estimatedPopulation2026":6124,"literacyRate":0.745,"pop":"5,020","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":213,"serialNo":33,"name":"Chandaus Rural","villageName":"Chandaus Rural","district":"Aligarh","tehsil":"Chandaus","developmentBlock":"Chandaus","households":830,"censusPopulation":4890,"estimatedPopulation2026":5966,"literacyRate":0.721,"pop":"4,890","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":214,"serialNo":34,"name":"Khonda","villageName":"Khonda","district":"Aligarh","tehsil":"Gonda","developmentBlock":"Gonda","households":810,"censusPopulation":4760,"estimatedPopulation2026":5807,"literacyRate":0.7340000000000001,"pop":"4,760","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":215,"serialNo":35,"name":"Gorai","villageName":"Gorai","district":"Aligarh","tehsil":"Iglas","developmentBlock":"Iglas","households":790,"censusPopulation":4630,"estimatedPopulation2026":5649,"literacyRate":0.7509999999999999,"pop":"4,630","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":216,"serialNo":36,"name":"Tochhigarh","villageName":"Tochhigarh","district":"Aligarh","tehsil":"Iglas","developmentBlock":"Iglas","households":770,"censusPopulation":4510,"estimatedPopulation2026":5502,"literacyRate":0.763,"pop":"4,510","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":217,"serialNo":37,"name":"Beswan","villageName":"Beswan","district":"Aligarh","tehsil":"Iglas","developmentBlock":"Iglas","households":750,"censusPopulation":4390,"estimatedPopulation2026":5356,"literacyRate":0.7490000000000001,"pop":"4,390","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":218,"serialNo":38,"name":"Mitholi","villageName":"Mitholi","district":"Aligarh","tehsil":"Gonda","developmentBlock":"Gonda","households":730,"censusPopulation":4260,"estimatedPopulation2026":5197,"literacyRate":0.718,"pop":"4,260","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":219,"serialNo":39,"name":"Bilona","villageName":"Bilona","district":"Aligarh","tehsil":"Atrauli","developmentBlock":"Atrauli","households":720,"censusPopulation":4140,"estimatedPopulation2026":5051,"literacyRate":0.6990000000000001,"pop":"4,140","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":220,"serialNo":40,"name":"Kazimabad","villageName":"Kazimabad","district":"Aligarh","tehsil":"Aligarh","developmentBlock":"Aligarh","households":700,"censusPopulation":4020,"estimatedPopulation2026":4904,"literacyRate":0.78,"pop":"4,020","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":221,"serialNo":41,"name":"Dawoodpur","villageName":"Dawoodpur","district":"Aligarh","tehsil":"Lodha","developmentBlock":"Lodha","households":680,"censusPopulation":3900,"estimatedPopulation2026":4758,"literacyRate":0.7559999999999999,"pop":"3,900","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":222,"serialNo":42,"name":"Gahna","villageName":"Gahna","district":"Aligarh","tehsil":"Dhanipur","developmentBlock":"Dhanipur","households":660,"censusPopulation":3780,"estimatedPopulation2026":4612,"literacyRate":0.762,"pop":"3,780","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":223,"serialNo":43,"name":"Bhankari","villageName":"Bhankari","district":"Aligarh","tehsil":"Akrabad","developmentBlock":"Akrabad","households":640,"censusPopulation":3650,"estimatedPopulation2026":4453,"literacyRate":0.7340000000000001,"pop":"3,650","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":224,"serialNo":44,"name":"Keshopur Jafri","villageName":"Keshopur Jafri","district":"Aligarh","tehsil":"Jawan","developmentBlock":"Jawan","households":620,"censusPopulation":3520,"estimatedPopulation2026":4294,"literacyRate":0.741,"pop":"3,520","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":225,"serialNo":45,"name":"Narsinghpur","villageName":"Narsinghpur","district":"Aligarh","tehsil":"Khair","developmentBlock":"Khair","households":600,"censusPopulation":3400,"estimatedPopulation2026":4148,"literacyRate":0.728,"pop":"3,400","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":226,"serialNo":1,"name":"Sikandrabad Rural","villageName":"Sikandrabad Rural","district":"Bulandshahr","tehsil":"Sikandrabad","developmentBlock":"Sikandrabad","households":3910,"censusPopulation":22794,"estimatedPopulation2026":27353,"literacyRate":0.71,"pop":"22,794","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":227,"serialNo":2,"name":"Baral","villageName":"Baral","district":"Bulandshahr","tehsil":"Gulaothi","developmentBlock":"Gulaothi","households":1540,"censusPopulation":8712,"estimatedPopulation2026":10454,"literacyRate":0.764,"pop":"8,712","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":228,"serialNo":3,"name":"Agota","villageName":"Agota","district":"Bulandshahr","tehsil":"Bulandshahr","developmentBlock":"Bulandshahr","households":1490,"censusPopulation":8450,"estimatedPopulation2026":10140,"literacyRate":0.752,"pop":"8,450","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":229,"serialNo":4,"name":"Malagarh","villageName":"Malagarh","district":"Bulandshahr","tehsil":"Bulandshahr","developmentBlock":"Bulandshahr","households":1420,"censusPopulation":8120,"estimatedPopulation2026":9744,"literacyRate":0.778,"pop":"8,120","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":230,"serialNo":5,"name":"Gulaothi Rural","villageName":"Gulaothi Rural","district":"Bulandshahr","tehsil":"Gulaothi","developmentBlock":"Gulaothi","households":2150,"censusPopulation":12250,"estimatedPopulation2026":14700,"literacyRate":0.725,"pop":"12,250","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":231,"serialNo":6,"name":"Jahangirabad Rural","villageName":"Jahangirabad Rural","district":"Bulandshahr","tehsil":"Jahangirabad","developmentBlock":"Jahangirabad","households":2080,"censusPopulation":11950,"estimatedPopulation2026":14340,"literacyRate":0.669,"pop":"11,950","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":232,"serialNo":7,"name":"Anupshahr Rural","villageName":"Anupshahr Rural","district":"Bulandshahr","tehsil":"Anupshahr","developmentBlock":"Anupshahr","households":1850,"censusPopulation":10550,"estimatedPopulation2026":12660,"literacyRate":0.731,"pop":"10,550","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":233,"serialNo":8,"name":"Siyana Rural","villageName":"Siyana Rural","district":"Bulandshahr","tehsil":"Siyana","developmentBlock":"Siyana","households":1790,"censusPopulation":10210,"estimatedPopulation2026":12252,"literacyRate":0.7559999999999999,"pop":"10,210","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":234,"serialNo":9,"name":"Debai Rural","villageName":"Debai Rural","district":"Bulandshahr","tehsil":"Debai","developmentBlock":"Debai","households":1720,"censusPopulation":9850,"estimatedPopulation2026":11820,"literacyRate":0.684,"pop":"9,850","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":235,"serialNo":10,"name":"Shikarpur Rural","villageName":"Shikarpur Rural","district":"Bulandshahr","tehsil":"Shikarpur","developmentBlock":"Shikarpur","households":1680,"censusPopulation":9620,"estimatedPopulation2026":11544,"literacyRate":0.7090000000000001,"pop":"9,620","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":236,"serialNo":11,"name":"Khurja Rural","villageName":"Khurja Rural","district":"Bulandshahr","tehsil":"Khurja","developmentBlock":"Khurja","households":1620,"censusPopulation":9280,"estimatedPopulation2026":11136,"literacyRate":0.738,"pop":"9,280","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":237,"serialNo":12,"name":"Pahasu Rural","villageName":"Pahasu Rural","district":"Bulandshahr","tehsil":"Pahasu","developmentBlock":"Pahasu","households":1550,"censusPopulation":8910,"estimatedPopulation2026":10692,"literacyRate":0.715,"pop":"8,910","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":238,"serialNo":13,"name":"Chatari Rural","villageName":"Chatari Rural","district":"Bulandshahr","tehsil":"Pahasu","developmentBlock":"Pahasu","households":1480,"censusPopulation":8520,"estimatedPopulation2026":10224,"literacyRate":0.682,"pop":"8,520","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":239,"serialNo":14,"name":"Khanpur Rural","villageName":"Khanpur Rural","district":"Bulandshahr","tehsil":"Jahangirabad","developmentBlock":"Jahangirabad","households":1440,"censusPopulation":8250,"estimatedPopulation2026":9900,"literacyRate":0.74,"pop":"8,250","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":240,"serialNo":15,"name":"Bhawan Bahadur Nagar Rural","villageName":"Bhawan Bahadur Nagar Rural","district":"Bulandshahr","tehsil":"B.B. Nagar","developmentBlock":"B.B. Nagar","households":1390,"censusPopulation":7980,"estimatedPopulation2026":9576,"literacyRate":0.7709999999999999,"pop":"7,980","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":241,"serialNo":16,"name":"Bugrasi Rural","villageName":"Bugrasi Rural","district":"Bulandshahr","tehsil":"Siyana","developmentBlock":"Siyana","households":1350,"censusPopulation":7720,"estimatedPopulation2026":9264,"literacyRate":0.698,"pop":"7,720","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":242,"serialNo":17,"name":"Aurangabad Rural","villageName":"Aurangabad Rural","district":"Bulandshahr","tehsil":"Lakhaoti","developmentBlock":"Lakhaoti","households":1310,"censusPopulation":7510,"estimatedPopulation2026":9012,"literacyRate":0.7240000000000001,"pop":"7,510","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":243,"serialNo":18,"name":"Kakore Rural","villageName":"Kakore Rural","district":"Bulandshahr","tehsil":"Sikandrabad","developmentBlock":"Sikandrabad","households":1280,"censusPopulation":7320,"estimatedPopulation2026":8784,"literacyRate":0.7490000000000001,"pop":"7,320","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":244,"serialNo":19,"name":"Lakhaoti","villageName":"Lakhaoti","district":"Bulandshahr","tehsil":"Lakhaoti","developmentBlock":"Lakhaoti","households":1240,"censusPopulation":7110,"estimatedPopulation2026":8532,"literacyRate":0.765,"pop":"7,110","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":245,"serialNo":20,"name":"Chola","villageName":"Chola","district":"Bulandshahr","tehsil":"Khurja","developmentBlock":"Khurja","households":1210,"censusPopulation":6950,"estimatedPopulation2026":8340,"literacyRate":0.758,"pop":"6,950","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":246,"serialNo":21,"name":"Dharau","villageName":"Dharau","district":"Bulandshahr","tehsil":"Khurja","developmentBlock":"Khurja","households":1180,"censusPopulation":6780,"estimatedPopulation2026":8136,"literacyRate":0.74,"pop":"6,780","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":247,"serialNo":22,"name":"Arni","villageName":"Arni","district":"Bulandshahr","tehsil":"Khurja","developmentBlock":"Khurja","households":1150,"censusPopulation":6610,"estimatedPopulation2026":7932,"literacyRate":0.726,"pop":"6,610","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":248,"serialNo":23,"name":"Walipura","villageName":"Walipura","district":"Bulandshahr","tehsil":"Bulandshahr","developmentBlock":"Bulandshahr","households":1120,"censusPopulation":6420,"estimatedPopulation2026":7704,"literacyRate":0.769,"pop":"6,420","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":249,"serialNo":24,"name":"Maman","villageName":"Maman","district":"Bulandshahr","tehsil":"Bulandshahr","developmentBlock":"Bulandshahr","households":1090,"censusPopulation":6250,"estimatedPopulation2026":7500,"literacyRate":0.784,"pop":"6,250","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":250,"serialNo":25,"name":"Akbarpur Rural","villageName":"Akbarpur Rural","district":"Bulandshahr","tehsil":"Sikandrabad","developmentBlock":"Sikandrabad","households":1070,"censusPopulation":6110,"estimatedPopulation2026":7332,"literacyRate":0.7120000000000001,"pop":"6,110","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":251,"serialNo":26,"name":"Jahangirpur Rural","villageName":"Jahangirpur Rural","district":"Bulandshahr","tehsil":"Khurja","developmentBlock":"Khurja","households":1050,"censusPopulation":5980,"estimatedPopulation2026":7176,"literacyRate":0.73,"pop":"5,980","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":252,"serialNo":27,"name":"Bilaspur Rural","villageName":"Bilaspur Rural","district":"Bulandshahr","tehsil":"Sikandrabad","developmentBlock":"Sikandrabad","households":1020,"censusPopulation":5820,"estimatedPopulation2026":6984,"literacyRate":0.745,"pop":"5,820","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":253,"serialNo":28,"name":"Dankaur Border Rural","villageName":"Dankaur Border Rural","district":"Bulandshahr","tehsil":"Sikandrabad","developmentBlock":"Sikandrabad","households":990,"censusPopulation":5680,"estimatedPopulation2026":6816,"literacyRate":0.7290000000000001,"pop":"5,680","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":254,"serialNo":29,"name":"Rabupura Border Rural","villageName":"Rabupura Border Rural","district":"Bulandshahr","tehsil":"Khurja","developmentBlock":"Khurja","households":970,"censusPopulation":5520,"estimatedPopulation2026":6624,"literacyRate":0.708,"pop":"5,520","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":255,"serialNo":30,"name":"Jawa Rural","villageName":"Jawa Rural","district":"Bulandshahr","tehsil":"Lakhaoti","developmentBlock":"Lakhaoti","households":950,"censusPopulation":5380,"estimatedPopulation2026":6456,"literacyRate":0.736,"pop":"5,380","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":256,"serialNo":31,"name":"Gangagarh","villageName":"Gangagarh","district":"Bulandshahr","tehsil":"B.B. Nagar","developmentBlock":"B.B. Nagar","households":930,"censusPopulation":5250,"estimatedPopulation2026":6300,"literacyRate":0.789,"pop":"5,250","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":257,"serialNo":32,"name":"Saidpur Rural","villageName":"Saidpur Rural","district":"Bulandshahr","tehsil":"B.B. Nagar","developmentBlock":"B.B. Nagar","households":910,"censusPopulation":5110,"estimatedPopulation2026":6132,"literacyRate":0.762,"pop":"5,110","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":258,"serialNo":33,"name":"Chandok","villageName":"Chandok","district":"Bulandshahr","tehsil":"Siyana","developmentBlock":"Siyana","households":890,"censusPopulation":4980,"estimatedPopulation2026":5976,"literacyRate":0.748,"pop":"4,980","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":259,"serialNo":34,"name":"Kuchesar Rural","villageName":"Kuchesar Rural","district":"Bulandshahr","tehsil":"Gulaothi","developmentBlock":"Gulaothi","households":870,"censusPopulation":4850,"estimatedPopulation2026":5820,"literacyRate":0.77,"pop":"4,850","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":260,"serialNo":35,"name":"Bhatona","villageName":"Bhatona","district":"Bulandshahr","tehsil":"Gulaothi","developmentBlock":"Gulaothi","households":850,"censusPopulation":4720,"estimatedPopulation2026":5664,"literacyRate":0.763,"pop":"4,720","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":261,"serialNo":36,"name":"Nimchana","villageName":"Nimchana","district":"Bulandshahr","tehsil":"Sikandrabad","developmentBlock":"Sikandrabad","households":830,"censusPopulation":4580,"estimatedPopulation2026":5496,"literacyRate":0.75,"pop":"4,580","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":262,"serialNo":37,"name":"Chanderu","villageName":"Chanderu","district":"Bulandshahr","tehsil":"Sikandrabad","developmentBlock":"Sikandrabad","households":810,"censusPopulation":4450,"estimatedPopulation2026":5340,"literacyRate":0.782,"pop":"4,450","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":263,"serialNo":38,"name":"Gesupur","villageName":"Gesupur","district":"Bulandshahr","tehsil":"Bulandshahr","developmentBlock":"Bulandshahr","households":790,"censusPopulation":4310,"estimatedPopulation2026":5172,"literacyRate":0.741,"pop":"4,310","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":264,"serialNo":39,"name":"Lalpur","villageName":"Lalpur","district":"Bulandshahr","tehsil":"Bulandshahr","developmentBlock":"Bulandshahr","households":770,"censusPopulation":4180,"estimatedPopulation2026":5016,"literacyRate":0.7390000000000001,"pop":"4,180","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":265,"serialNo":40,"name":"Kiratpur","villageName":"Kiratpur","district":"Bulandshahr","tehsil":"Bulandshahr","developmentBlock":"Bulandshahr","households":750,"censusPopulation":4050,"estimatedPopulation2026":4860,"literacyRate":0.754,"pop":"4,050","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":266,"serialNo":41,"name":"Bhamra","villageName":"Bhamra","district":"Bulandshahr","tehsil":"Gulaothi","developmentBlock":"Gulaothi","households":730,"censusPopulation":3920,"estimatedPopulation2026":4704,"literacyRate":0.7609999999999999,"pop":"3,920","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":267,"serialNo":42,"name":"Pratapipur","villageName":"Pratapipur","district":"Bulandshahr","tehsil":"Anupshahr","developmentBlock":"Anupshahr","households":710,"censusPopulation":3790,"estimatedPopulation2026":4548,"literacyRate":0.7140000000000001,"pop":"3,790","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":268,"serialNo":43,"name":"Karanpur","villageName":"Karanpur","district":"Bulandshahr","tehsil":"Anupshahr","developmentBlock":"Anupshahr","households":690,"censusPopulation":3660,"estimatedPopulation2026":4392,"literacyRate":0.72,"pop":"3,660","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":269,"serialNo":44,"name":"Ramghat Rural","villageName":"Ramghat Rural","district":"Bulandshahr","tehsil":"Debai","developmentBlock":"Debai","households":670,"censusPopulation":3520,"estimatedPopulation2026":4224,"literacyRate":0.695,"pop":"3,520","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null},
        {"id":270,"serialNo":45,"name":"Rajghat Rural","villageName":"Rajghat Rural","district":"Bulandshahr","tehsil":"Debai","developmentBlock":"Debai","households":650,"censusPopulation":3390,"estimatedPopulation2026":4068,"literacyRate":0.687,"pop":"3,390","focus":"","status":"Under Assessment","progress":0,"lat":null,"lng":null}
    ];

    // ==========================================================================
    // API-Backed Data Access Layer (falls back to localStorage if API unavailable)
    // ==========================================================================
    let _villagesCache = null;
    let _apiOnline = null; // null = unknown, true/false

    // Map API village to frontend format
    const mapVillage = (v) => ({
        id: v._id || v.id,
        serialNo: v.serialNo || v.id,
        name: v.name || v.villageName,
        villageName: v.villageName || v.name,
        district: v.district,
        tehsil: v.tehsil || v.developmentBlock || '',
        developmentBlock: v.developmentBlock || v.tehsil || '',
        households: v.households || 0,
        censusPopulation: v.censusPopulation || parseInt(String(v.population || v.pop || '0').replace(/,/g, ''), 10) || 0,
        estimatedPopulation2026: v.estimatedPopulation2026 || 0,
        literacyRate: v.literacyRate !== undefined ? v.literacyRate : null,
        pop: (v.censusPopulation ? v.censusPopulation.toLocaleString('en-IN') : null) || v.population || v.pop || '0',
        focus: v.problems || v.focus || '',
        status: v.status || 'Under Assessment',
        progress: v.progress !== undefined ? v.progress : 0,
        lat: v.latitude !== undefined ? v.latitude : (v.lat !== undefined ? v.lat : null),
        lng: v.longitude !== undefined ? v.longitude : (v.lng !== undefined ? v.lng : null),
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
            if (Array.isArray(existing) && existing.length >= 200) {
                _villagesCache = existing;
                return _villagesCache;
            } else {
                localStorage.removeItem('vh_villages');
            }
        } catch (_) {}
        _villagesCache = DEFAULT_VILLAGES;
        return _villagesCache;
    };

    // Synchronous fallback for immediate rendering — ALWAYS returns valid array of 270 villages
    const getVillagesSync = () => {
        if (_villagesCache && _villagesCache.length > 0) return _villagesCache;
        try {
            const existing = JSON.parse(localStorage.getItem('vh_villages'));
            if (Array.isArray(existing) && existing.length >= 200) return existing;
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
    // 6. Village Card Render Helper with 7 Official Directory Fields
    // ==========================================================================
    const formatLiteracyRate = (rate) => {
        if (rate === null || rate === undefined || rate === '') return 'N/A';
        const num = Number(rate);
        if (isNaN(num)) return String(rate);
        if (num <= 1) return (num * 100).toFixed(1) + '%';
        return num.toFixed(1) + '%';
    };

    const getDistrictColor = (dist) => {
        switch (dist) {
            case 'Ghaziabad': return '#3b82f6';
            case 'Hapur': return '#f59e0b';
            case 'Meerut': return '#10b981';
            case 'Gautam Buddh Nagar': return '#8b5cf6';
            case 'Aligarh': return '#ec4899';
            case 'Bulandshahr': return '#06b6d4';
            default: return '#3b82f6';
        }
    };

    const renderVillageCardHTML = (v) => {
        const distColor = getDistrictColor(v.district);
        const householdsDisplay = v.households ? Number(v.households).toLocaleString('en-IN') : 'N/A';
        const censusPopDisplay = v.censusPopulation ? Number(v.censusPopulation).toLocaleString('en-IN') : (v.pop || 'N/A');
        const est2026Display = v.estimatedPopulation2026 ? Number(v.estimatedPopulation2026).toLocaleString('en-IN') : 'N/A';
        const litRateDisplay = formatLiteracyRate(v.literacyRate);

        return `
            <div class="village-item-card glass-card" data-district="${v.district}" data-id="${v.id}" onclick="showVillageDetail('${v.id}')" style="cursor:pointer;">
                <div>
                    <div class="village-header">
                        <h3><span style="font-size:0.8em; color:var(--text-secondary); margin-right:4px;">#${v.serialNo || ''}</span> ${v.name || v.villageName}</h3>
                        <span class="status-badge" style="background:rgba(255,255,255,0.06); color:${distColor}; border:1px solid ${distColor}40;">${v.district}</span>
                    </div>
                    <div class="village-details" style="display:grid; grid-template-columns: 1fr 1fr; gap:0.4rem; margin-top:0.6rem; font-size:0.85rem;">
                        <div class="detail-row"><span>Block:</span> <strong style="color:var(--text-primary);">${v.developmentBlock || v.tehsil || 'N/A'}</strong></div>
                        <div class="detail-row"><span>Households:</span> <strong>${householdsDisplay}</strong></div>
                        <div class="detail-row"><span>Census Pop:</span> <strong>${censusPopDisplay}</strong></div>
                        <div class="detail-row"><span>Est. 2026 Pop:</span> <strong>${est2026Display}</strong></div>
                        <div class="detail-row" style="grid-column: 1 / -1; display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:0.35rem 0.6rem; border-radius:6px; border:1px solid var(--glass-border); margin-top:0.25rem;">
                            <span>Literacy Rate:</span>
                            <strong style="color:#10b981; font-size:0.92rem;">${litRateDisplay}</strong>
                        </div>
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

        const distColor = getDistrictColor(v.district);
        const householdsDisplay = v.households ? Number(v.households).toLocaleString('en-IN') : 'N/A';
        const censusPopDisplay = v.censusPopulation ? Number(v.censusPopulation).toLocaleString('en-IN') : (v.pop || 'N/A');
        const est2026Display = v.estimatedPopulation2026 ? Number(v.estimatedPopulation2026).toLocaleString('en-IN') : 'N/A';
        const litRateDisplay = formatLiteracyRate(v.literacyRate);
        const hasCoords = (v.lat !== null && v.lat !== undefined && !isNaN(Number(v.lat))) &&
                          (v.lng !== null && v.lng !== undefined && !isNaN(Number(v.lng)));

        modal.innerHTML = `
            <div class="village-detail-content">
                <button class="village-detail-close" onclick="document.getElementById('village-detail-modal').classList.remove('active')">&times;</button>
                <div class="village-detail-header">
                    <h2>${v.name || v.villageName} <span style="font-size:0.6em; color:var(--text-secondary); font-weight:normal;">(S.No: ${v.serialNo || 'N/A'})</span></h2>
                    <span class="vd-district" style="color:${distColor}; font-weight:600;">${v.district} &bull; Development Block: ${v.developmentBlock || v.tehsil || 'N/A'}</span>
                </div>
                <div class="village-detail-grid">
                    <div class="vd-stat-card"><div class="vd-stat-value">${censusPopDisplay}</div><div class="vd-stat-label">Census Population</div></div>
                    <div class="vd-stat-card"><div class="vd-stat-value">${est2026Display}</div><div class="vd-stat-label">Estimated 2026 Pop</div></div>
                    <div class="vd-stat-card"><div class="vd-stat-value">${householdsDisplay}</div><div class="vd-stat-label">Households</div></div>
                    <div class="vd-stat-card"><div class="vd-stat-value" style="color:#10b981;">${litRateDisplay}</div><div class="vd-stat-label">Literacy Rate</div></div>
                </div>
                <div class="vd-info-section">
                    <h4>Administrative & Census Profile</h4>
                    <p><strong>District:</strong> ${v.district} &nbsp;|&nbsp; <strong>Development Block:</strong> ${v.developmentBlock || v.tehsil || 'N/A'} &nbsp;|&nbsp; <strong>Serial No:</strong> ${v.serialNo || 'N/A'}</p>
                </div>
                <div class="vd-info-section">
                    <h4>GPS Coordinates</h4>
                    <p>${hasCoords ? ('Latitude: ' + v.lat + ', Longitude: ' + v.lng) : 'Coordinates not available for this census directory record'}</p>
                </div>
                ${hasCoords ? `
                <div class="vd-info-section">
                    <h4>Location Map</h4>
                    <div class="vd-mini-map" id="vd-mini-map"></div>
                </div>` : `
                <div class="vd-info-section" style="background:rgba(255,255,255,0.02); border:1px dashed var(--glass-border); padding:1rem; border-radius:8px; text-align:center; color:var(--text-secondary);">
                    <p style="margin:0;">📍 Map view requires GPS coordinates (not part of the standard directory dataset).</p>
                </div>`}
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

        // Render mini map only if coords exist
        if (hasCoords) {
            setTimeout(() => {
                const mapEl = document.getElementById('vd-mini-map');
                if (mapEl && typeof L !== 'undefined') {
                    const miniMap = L.map(mapEl, { zoomControl: false, attributionControl: false }).setView([v.lat, v.lng], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(miniMap);
                    L.marker([v.lat, v.lng]).addTo(miniMap);
                }
            }, 200);
        }
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
                const vName = (v.name || v.villageName || '').toLowerCase();
                const vDist = (v.district || '').toLowerCase();
                const vBlock = (v.developmentBlock || v.tehsil || '').toLowerCase();
                const matchesSearch = !query || vName.includes(query) || vDist.includes(query) || vBlock.includes(query);
                const matchesFilter = currentFilter === 'all' ||
                                      vDist === currentFilter.toLowerCase() ||
                                      vDist.includes(currentFilter.toLowerCase());
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
    const mapElements = [document.getElementById('village-map'), document.getElementById('village-map-index')].filter(Boolean);
    if (mapElements.length > 0) {
        const renderMapFallback = (targetEl) => {
            if (!targetEl) return;
            targetEl.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; min-height:400px; padding:2rem; text-align:center;">
                    <span style="font-size:3rem; margin-bottom:1rem;">🗺️</span>
                    <h3 style="color:var(--text-primary); margin-bottom:0.5rem;">Western UP Interactive Village Map</h3>
                    <p style="color:var(--text-secondary); max-width:550px; margin-bottom:1.25rem;">
                        270 census-verified villages across Ghaziabad, Hapur, Meerut, Gautam Buddh Nagar, Aligarh, and Bulandshahr are documented in the directory.
                    </p>
                    <a href="villages.html" class="btn btn-primary">Browse Villages Directory (${getVillagesSync().length} Villages) &rarr;</a>
                </div>
            `;
        };

        const setupMapFor = (targetEl) => {
            try {
                if (!targetEl || targetEl._leaflet_id) return;

                const map = L.map(targetEl.id, {
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

                // Invalidate size in multiple intervals to ensure proper sizing after font/layout load
                [100, 300, 600, 1200].forEach(delay => {
                    setTimeout(() => {
                        try { map.invalidateSize(); } catch (_) {}
                    }, delay);
                });

                window.addEventListener('resize', () => {
                    try { map.invalidateSize(); } catch (_) {}
                });

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
                renderMapFallback(targetEl);
            }
        };

        const setupAllMaps = () => {
            mapElements.forEach(setupMapFor);
        };

        const initLeafletMap = () => {
            if (typeof L === 'undefined') {
                if (!document.querySelector('script[src*="leaflet.js"]')) {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.onload = () => setupAllMaps();
                    document.head.appendChild(script);
                }
                let tries = 0;
                const checkInterval = setInterval(() => {
                    tries++;
                    if (typeof L !== 'undefined') {
                        clearInterval(checkInterval);
                        setupAllMaps();
                    } else if (tries > 30) {
                        clearInterval(checkInterval);
                        mapElements.forEach(renderMapFallback);
                    }
                }, 100);
            } else {
                setupAllMaps();
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
