/**
 * Village Hub - API Client & Toast Notification System
 * Robust REST API integration for Village Hub web application
 */

(function() {
    'use strict';

    const TOKEN_KEY = 'vh_token';
    const USER_KEY = 'vh_user';

    const VillageHubAPI = {
        // --- Auth Token Management ---
        getToken() {
            return localStorage.getItem(TOKEN_KEY);
        },
        
        setToken(token) {
            if (token) localStorage.setItem(TOKEN_KEY, token);
        },
        
        getUser() {
            try {
                const raw = localStorage.getItem(USER_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                return null;
            }
        },
        
        setUser(user) {
            if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
        },
        
        clearToken() {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        },
        
        isLoggedIn() {
            return !!this.getToken();
        },
        
        isAdmin() {
            const u = this.getUser();
            return !!(u && u.role === 'admin');
        },

        // --- HTTP Helper ---
        async request(endpoint, options = {}) {
            let baseUrl = (window.API_BASE_URL && window.API_BASE_URL.trim())
                ? window.API_BASE_URL.trim().replace(/\/+$/, '')
                : window.location.origin;
            if (baseUrl.endsWith('/api')) {
                baseUrl = baseUrl.slice(0, -4);
            }
            let path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
            if (!path.startsWith('/api/') && path !== '/api') {
                path = '/api' + path;
            }
            const url = baseUrl + path;
            
            const headers = {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            };
            
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const config = {
                method: options.method || 'GET',
                headers,
                ...options
            };

            try {
                let response;
                try {
                    response = await fetch(url, config);
                } catch (fetchErr) {
                    if (baseUrl === 'https://village-hub-api.onrender.com') {
                        const fallbackUrl = 'https://villahe-hub-api.onrender.com' + path;
                        response = await fetch(fallbackUrl, config);
                        window.API_BASE_URL = 'https://villahe-hub-api.onrender.com';
                    } else {
                        throw fetchErr;
                    }
                }

                if (response && response.status === 404 && baseUrl === 'https://village-hub-api.onrender.com') {
                    try {
                        const fallbackUrl = 'https://villahe-hub-api.onrender.com' + path;
                        const fallbackResp = await fetch(fallbackUrl, config);
                        if (fallbackResp.status !== 404) {
                            response = fallbackResp;
                            window.API_BASE_URL = 'https://villahe-hub-api.onrender.com';
                        }
                    } catch (_) {}
                }

                let data;
                try {
                    data = await response.json();
                } catch (jsonErr) {
                    data = { success: false, message: response.statusText || 'Invalid server response' };
                }

                if (!response.ok) {
                    if (response.status === 401 && !endpoint.includes('/login') && !endpoint.includes('/signup')) {
                        // Invalid/expired token
                        this.clearToken();
                    }
                    const err = new Error(data.message || `Request failed with status ${response.status}`);
                    err.status = response.status;
                    err.data = data;
                    throw err;
                }

                return data;
            } catch (err) {
                if (err.status) throw err;
                // Network error / server offline
                console.warn('Network request failed:', err.message);
                const networkErr = new Error('Cannot connect to server. Please check your network connection.');
                networkErr.status = 0;
                networkErr.offline = true;
                throw networkErr;
            }
        },

        // --- Auth Endpoints ---
        async signup(name, email, password) {
            const result = await this.request('/auth/signup', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });
            const token = result.token || (result.data && result.data.token);
            const user = result.user || (result.data && result.data.user);
            if (token) this.setToken(token);
            if (user) this.setUser(user);
            return result;
        },

        async login(email, password) {
            const result = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            const token = result.token || (result.data && result.data.token);
            const user = result.user || (result.data && result.data.user);
            if (token) this.setToken(token);
            if (user) this.setUser(user);
            return result;
        },

        async getMe() {
            return await this.request('/auth/me');
        },

        logout() {
            this.clearToken();
            window.location.reload();
        },

        // --- Village Endpoints ---
        async getVillages(params = {}) {
            const query = new URLSearchParams(params).toString();
            return await this.request('/villages' + (query ? '?' + query : ''));
        },

        async getVillage(id) {
            return await this.request(`/villages/${id}`);
        },

        async createVillage(villageData) {
            return await this.request('/villages', {
                method: 'POST',
                body: JSON.stringify(villageData)
            });
        },

        async updateVillage(id, villageData) {
            return await this.request(`/villages/${id}`, {
                method: 'PUT',
                body: JSON.stringify(villageData)
            });
        },

        async deleteVillage(id) {
            return await this.request(`/villages/${id}`, {
                method: 'DELETE'
            });
        },

        // --- Complaint Endpoints ---
        async createComplaint(complaintData) {
            return await this.request('/complaints', {
                method: 'POST',
                body: JSON.stringify(complaintData)
            });
        },

        async getComplaints(params = {}) {
            const query = new URLSearchParams(params).toString();
            return await this.request('/complaints' + (query ? '?' + query : ''));
        },

        async getComplaintById(id) {
            return await this.request(`/complaints/${id}`);
        },

        async trackComplaint(query) {
            return await this.request(`/complaints/track/${encodeURIComponent(query)}`);
        },

        async updateComplaintStatus(id, status) {
            return await this.request(`/complaints/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
        },

        // --- Application Endpoints ---
        async createApplication(appData) {
            return await this.request('/applications', {
                method: 'POST',
                body: JSON.stringify(appData)
            });
        },

        async getApplications(params = {}) {
            const query = new URLSearchParams(params).toString();
            return await this.request('/applications' + (query ? '?' + query : ''));
        },

        async updateApplicationStatus(id, status) {
            return await this.request(`/applications/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
        },

        // --- Stats Endpoint ---
        async getStats() {
            return await this.request('/stats');
        },

        // ===== NEW MODULE API METHODS =====

        // --- Kisan Corner: Crop Calendar ---
        async getCropCalendar(params = {}) {
            const q = new URLSearchParams(params).toString();
            return await this.request('/kisan/crop-calendar' + (q ? '?' + q : ''));
        },
        async createCropCalendar(data) {
            return await this.request('/kisan/crop-calendar', { method: 'POST', body: JSON.stringify(data) });
        },
        async updateCropCalendar(id, data) {
            return await this.request(`/kisan/crop-calendar/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        },
        async deleteCropCalendar(id) {
            return await this.request(`/kisan/crop-calendar/${id}`, { method: 'DELETE' });
        },

        // --- Kisan Corner: Mandi Prices ---
        async getMandiPrices(params = {}) {
            const q = new URLSearchParams(params).toString();
            return await this.request('/kisan/mandi-prices' + (q ? '?' + q : ''));
        },
        async createMandiPrice(data) {
            return await this.request('/kisan/mandi-prices', { method: 'POST', body: JSON.stringify(data) });
        },
        async updateMandiPrice(id, data) {
            return await this.request(`/kisan/mandi-prices/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        },
        async deleteMandiPrice(id) {
            return await this.request(`/kisan/mandi-prices/${id}`, { method: 'DELETE' });
        },

        // --- Kisan Corner: Weather Advisories ---
        async getWeatherAdvisories(params = {}) {
            const q = new URLSearchParams(params).toString();
            return await this.request('/kisan/weather' + (q ? '?' + q : ''));
        },
        async createWeatherAdvisory(data) {
            return await this.request('/kisan/weather', { method: 'POST', body: JSON.stringify(data) });
        },
        async updateWeatherAdvisory(id, data) {
            return await this.request(`/kisan/weather/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        },
        async deleteWeatherAdvisory(id) {
            return await this.request(`/kisan/weather/${id}`, { method: 'DELETE' });
        },

        // --- Kisan Corner: Crop Production Stats ---
        async getProductionStats(params = {}) {
            const q = new URLSearchParams(params).toString();
            return await this.request('/kisan/production-stats' + (q ? '?' + q : ''));
        },
        async createProductionStat(data) {
            return await this.request('/kisan/production-stats', { method: 'POST', body: JSON.stringify(data) });
        },
        async updateProductionStat(id, data) {
            return await this.request(`/kisan/production-stats/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        },
        async deleteProductionStat(id) {
            return await this.request(`/kisan/production-stats/${id}`, { method: 'DELETE' });
        },

        // --- Education: School Info ---
        async getSchools(params = {}) {
            const q = new URLSearchParams(params).toString();
            return await this.request('/education/schools' + (q ? '?' + q : ''));
        },
        async createSchool(data) {
            return await this.request('/education/schools', { method: 'POST', body: JSON.stringify(data) });
        },
        async updateSchool(id, data) {
            return await this.request(`/education/schools/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        },
        async deleteSchool(id) {
            return await this.request(`/education/schools/${id}`, { method: 'DELETE' });
        },

        // --- Education: Healthcare Facilities ---
        async getHealthcare(params = {}) {
            const q = new URLSearchParams(params).toString();
            return await this.request('/education/healthcare' + (q ? '?' + q : ''));
        },
        async createHealthcare(data) {
            return await this.request('/education/healthcare', { method: 'POST', body: JSON.stringify(data) });
        },
        async updateHealthcare(id, data) {
            return await this.request(`/education/healthcare/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        },
        async deleteHealthcare(id) {
            return await this.request(`/education/healthcare/${id}`, { method: 'DELETE' });
        },

        // --- Panchayat Funds ---
        async getPanchayatFunds(params = {}) {
            const q = new URLSearchParams(params).toString();
            return await this.request('/panchayat-funds' + (q ? '?' + q : ''));
        },
        async createPanchayatFund(data) {
            return await this.request('/panchayat-funds', { method: 'POST', body: JSON.stringify(data) });
        },
        async updatePanchayatFund(id, data) {
            return await this.request(`/panchayat-funds/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        },
        async deletePanchayatFund(id) {
            return await this.request(`/panchayat-funds/${id}`, { method: 'DELETE' });
        },
        async importPanchayatFunds(records) {
            return await this.request('/panchayat-funds/import', { method: 'POST', body: JSON.stringify({ records }) });
        },

        // --- Site Settings ---
        async getSettings() {
            return await this.request('/settings');
        },
        async updateSetting(key, value) {
            return await this.request(`/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) });
        }
    };

    // --- Toast Notification System ---
    const Toast = {
        show(message, type = 'info', duration = 4000) {
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.className = 'toast-container';
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.className = 'toast toast-' + type;

            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };

            toast.innerHTML = `
                <span class="toast-icon">${icons[type] || icons.info}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" type="button" onclick="this.parentElement.remove()" title="Close">&times;</button>
            `;

            container.appendChild(toast);

            // Trigger animation frame for CSS transition
            requestAnimationFrame(() => {
                toast.classList.add('toast-show');
            });

            // Auto dismiss
            setTimeout(() => {
                toast.classList.remove('toast-show');
                setTimeout(() => {
                    if (toast.parentElement) toast.remove();
                }, 350);
            }, duration);
        },

        success(msg, dur) { this.show(msg, 'success', dur || 4000); },
        error(msg, dur) { this.show(msg, 'error', dur || 5000); },
        warning(msg, dur) { this.show(msg, 'warning', dur || 4000); },
        info(msg, dur) { this.show(msg, 'info', dur || 3500); }
    };

    // Export to global window
    window.VillageHubAPI = VillageHubAPI;
    window.API = VillageHubAPI;
    window.Toast = Toast;

})();
