/**
 * Village Hub — New Modules Client Logic
 * Handles interactive tabs, filtering, and data rendering for:
 * 1. Kisan Corner (kisan.html)
 * 2. Education & Healthcare (education.html)
 * 3. Panchayat Funds (panchayat-funds.html)
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // Utility helpers
    // -------------------------------------------------------------------------
    const formatCurrency = (val) => {
        if (val === null || val === undefined || val === '') return '—';
        const num = Number(val);
        if (isNaN(num)) return val;
        return '₹' + num.toLocaleString('en-IN');
    };

    const escapeHTML = (str) => {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    // -------------------------------------------------------------------------
    // 1. KISAN CORNER CONTROLLER (kisan.html)
    // -------------------------------------------------------------------------
    const kisanTabsContainer = document.getElementById('kisan-tabs');
    if (kisanTabsContainer) {
        // Tab switching
        const tabBtns = kisanTabsContainer.querySelectorAll('.module-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const targetId = 'panel-' + btn.getAttribute('data-tab');
                document.querySelectorAll('.module-panel').forEach(panel => {
                    panel.classList.remove('active');
                });
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) targetPanel.classList.add('active');
            });
        });

        // Tab 1: Crop Calendar
        const cropDistrictFilter = document.getElementById('crop-filter-district');
        const cropSeasonFilter = document.getElementById('crop-filter-season');
        const cropContent = document.getElementById('crop-calendar-content');

        const loadCropCalendar = async () => {
            if (!cropContent) return;
            const params = {};
            if (cropDistrictFilter && cropDistrictFilter.value) params.district = cropDistrictFilter.value;
            if (cropSeasonFilter && cropSeasonFilter.value) params.season = cropSeasonFilter.value;

            try {
                cropContent.innerHTML = '<p style="text-align:center; padding:2rem; color:var(--text-muted);">Loading verified crop calendar...</p>';
                const res = await API.getCropCalendar(params);
                const records = res.data || [];

                if (records.length === 0) {
                    cropContent.innerHTML = `
                        <div class="module-empty-state">
                            <div class="empty-icon">🌱</div>
                            <h3>Seasonal Crop Calendar</h3>
                            <p>No crop records found for the selected filter. Data will appear here once verified records are added by administrators.</p>
                            <p class="geo-disclaimer">Regional crops for Western UP: Wheat, Paddy, Sugarcane, Mustard, Potato.</p>
                            <div style="margin-top:1.25rem;">
                                <a href="https://upagriculture.com/" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Official UP Agriculture Dept &rarr;</a>
                            </div>
                        </div>
                    `;
                    return;
                }

                cropContent.innerHTML = `
                    <div class="timeline-grid">
                        ${records.map(crop => `
                            <div class="crop-card">
                                <div>
                                    <div class="card-top">
                                        <div>
                                            <h3 class="card-title">${escapeHTML(crop.crop_name)}</h3>
                                            <span style="font-size:0.85rem; color:var(--accent); font-weight:600;">${escapeHTML(crop.crop_season || 'All Season')}</span>
                                        </div>
                                        <span class="card-badge ${crop.is_verified ? 'badge-verified' : 'badge-unverified'}">
                                            ${crop.is_verified ? '✓ Verified' : 'Unverified'}
                                        </span>
                                    </div>
                                    <div class="card-meta-list">
                                        <div class="meta-item"><span>District:</span><strong>${escapeHTML(crop.district || 'Western UP')}</strong></div>
                                        <div class="meta-item"><span>Sowing Period:</span><strong>${escapeHTML(crop.sowing_period || '—')}</strong></div>
                                        <div class="meta-item"><span>Harvesting:</span><strong>${escapeHTML(crop.harvesting_period || '—')}</strong></div>
                                        ${crop.recommended_varieties ? `<div class="meta-item"><span>Varieties:</span><strong>${escapeHTML(crop.recommended_varieties)}</strong></div>` : ''}
                                        ${crop.estimated_yield ? `<div class="meta-item"><span>Est. Yield:</span><strong>${escapeHTML(crop.estimated_yield)}</strong></div>` : ''}
                                        ${crop.advisory ? `<div style="margin-top:0.5rem; font-size:0.85rem; color:var(--text-secondary); background:rgba(255,255,255,0.03); padding:0.6rem; border-radius:6px; border-left:3px solid var(--accent);"><strong style="color:var(--text-primary);">Advisory:</strong> ${escapeHTML(crop.advisory)}</div>` : ''}
                                    </div>
                                </div>
                                <div class="card-footer-info">
                                    <span>Source: ${escapeHTML(crop.source || 'ICAR/UP Ag')}</span>
                                    ${crop.source_url ? `<a href="${escapeHTML(crop.source_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent); font-weight:600;">Official Source &rarr;</a>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            } catch (err) {
                console.error('Error loading crop calendar:', err);
                cropContent.innerHTML = `<p style="color:#f87171; text-align:center; padding:2rem;">Failed to load crop calendar. Please try again later.</p>`;
            }
        };

        if (cropDistrictFilter) cropDistrictFilter.addEventListener('change', loadCropCalendar);
        if (cropSeasonFilter) cropSeasonFilter.addEventListener('change', loadCropCalendar);
        loadCropCalendar();

        // Tab 2: Mandi Prices
        const mandiDistrictFilter = document.getElementById('mandi-filter-district');
        const mandiSearch = document.getElementById('mandi-search');
        const mandiContent = document.getElementById('mandi-prices-content');

        const loadMandiPrices = async () => {
            if (!mandiContent) return;
            const params = {};
            if (mandiDistrictFilter && mandiDistrictFilter.value) params.district = mandiDistrictFilter.value;
            if (mandiSearch && mandiSearch.value) params.commodity = mandiSearch.value;

            try {
                mandiContent.innerHTML = '<p style="text-align:center; padding:2rem; color:var(--text-muted);">Loading verified mandi prices...</p>';
                const res = await API.getMandiPrices(params);
                const records = res.data || [];

                if (records.length === 0) {
                    mandiContent.innerHTML = `
                        <div class="module-empty-state">
                            <div class="empty-icon">💹</div>
                            <h3>Mandi Market Prices</h3>
                            <p>No mandi price records found for this selection. Data will appear here once verified datasets are imported by an administrator.</p>
                            <p class="geo-disclaimer">Official Source: AGMARKNET portal (agmarknet.gov.in). Never fabricated.</p>
                            <div style="margin-top:1.25rem;">
                                <a href="https://agmarknet.gov.in/" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Check Live Prices on AGMARKNET &rarr;</a>
                            </div>
                        </div>
                    `;
                    return;
                }

                mandiContent.innerHTML = `
                    <div class="price-grid">
                        ${records.map(p => `
                            <div class="price-card">
                                <div class="card-top">
                                    <div>
                                        <h3 class="card-title">${escapeHTML(p.commodity)}</h3>
                                        <span style="font-size:0.82rem; color:var(--text-muted);">${escapeHTML(p.mandi_name)} (${escapeHTML(p.district)})</span>
                                    </div>
                                    <span class="card-badge ${p.data_type === 'live' ? 'badge-verified' : 'badge-type'}">
                                        ${p.data_type === 'live' ? '● Live' : 'Historical'}
                                    </span>
                                </div>
                                <div class="price-highlight">
                                    ${p.modal_price ? `₹${p.modal_price}` : '—'}
                                    <span style="font-size:0.85rem; font-weight:normal; color:var(--text-muted);">${escapeHTML(p.price_unit || '₹/Quintal')}</span>
                                </div>
                                <div class="card-meta-list" style="margin-top:0.5rem;">
                                    <div class="meta-item"><span>Variety:</span><strong>${escapeHTML(p.variety || 'Standard')}</strong></div>
                                    <div class="meta-item"><span>Min / Max:</span><strong>${p.min_price ? '₹' + p.min_price : '—'} / ${p.max_price ? '₹' + p.max_price : '—'}</strong></div>
                                    <div class="meta-item"><span>Price Date:</span><strong>${escapeHTML(p.price_date || '—')}</strong></div>
                                </div>
                                <div class="card-footer-info">
                                    <span>Source: ${escapeHTML(p.source || 'AGMARKNET')}</span>
                                    ${p.source_url ? `<a href="${escapeHTML(p.source_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);">AGMARKNET &rarr;</a>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            } catch (err) {
                console.error('Error loading mandi prices:', err);
                mandiContent.innerHTML = `<p style="color:#f87171; text-align:center; padding:2rem;">Failed to load mandi prices.</p>`;
            }
        };

        if (mandiDistrictFilter) mandiDistrictFilter.addEventListener('change', loadMandiPrices);
        if (mandiSearch) {
            let timeout = null;
            mandiSearch.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(loadMandiPrices, 400);
            });
        }
        loadMandiPrices();

        // Tab 3: Weather Advisories
        const weatherDistrictFilter = document.getElementById('weather-filter-district');
        const weatherContent = document.getElementById('weather-advisory-content');

        const loadWeather = async () => {
            if (!weatherContent) return;
            const params = {};
            if (weatherDistrictFilter && weatherDistrictFilter.value) params.district = weatherDistrictFilter.value;

            try {
                weatherContent.innerHTML = '<p style="text-align:center; padding:2rem; color:var(--text-muted);">Loading weather advisories...</p>';
                const res = await API.getWeatherAdvisories(params);
                const records = res.data || [];

                if (records.length === 0) {
                    weatherContent.innerHTML = `
                        <div class="module-empty-state">
                            <div class="empty-icon">🌦️</div>
                            <h3>Agricultural Weather Advisories</h3>
                            <p>No weather advisories published for this district currently. Real-time agricultural weather forecasts and rainfall observations are provided directly by IMD.</p>
                            <p class="geo-disclaimer">Official Source: India Meteorological Department (IMD Mausam).</p>
                            <div style="margin-top:1.25rem;">
                                <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Open IMD Mausam Official Portal &rarr;</a>
                            </div>
                        </div>
                    `;
                    return;
                }

                weatherContent.innerHTML = `
                    <div class="timeline-grid">
                        ${records.map(w => `
                            <div class="crop-card">
                                <div>
                                    <div class="card-top">
                                        <div>
                                            <h3 class="card-title">${escapeHTML(w.title || 'Weather Advisory')}</h3>
                                            <span style="font-size:0.85rem; color:var(--text-muted);">${escapeHTML(w.district)} ${w.block_name ? '(' + escapeHTML(w.block_name) + ')' : ''}</span>
                                        </div>
                                        <span class="card-badge badge-type">${escapeHTML(w.advisory_type || 'General')}</span>
                                    </div>
                                    <div class="card-meta-list">
                                        ${w.temperature_min || w.temperature_max ? `<div class="meta-item"><span>Temperature:</span><strong>${escapeHTML(w.temperature_min || '—')} - ${escapeHTML(w.temperature_max || '—')} °C</strong></div>` : ''}
                                        ${w.rainfall_info ? `<div class="meta-item"><span>Rainfall Info:</span><strong>${escapeHTML(w.rainfall_info)}</strong></div>` : ''}
                                        ${w.forecast_period ? `<div class="meta-item"><span>Period:</span><strong>${escapeHTML(w.forecast_period)}</strong></div>` : ''}
                                        ${w.warnings ? `<div style="margin-top:0.5rem; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#fca5a5; padding:0.6rem; border-radius:6px; font-size:0.85rem;"><strong>Warning:</strong> ${escapeHTML(w.warnings)}</div>` : ''}
                                        ${w.description ? `<p style="font-size:0.88rem; color:var(--text-secondary); margin-top:0.6rem;">${escapeHTML(w.description)}</p>` : ''}
                                    </div>
                                </div>
                                <div class="card-footer-info">
                                    <span>Source: ${escapeHTML(w.source || 'IMD')}</span>
                                    ${w.source_url ? `<a href="${escapeHTML(w.source_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);">IMD Link &rarr;</a>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            } catch (err) {
                console.error('Error loading weather:', err);
                weatherContent.innerHTML = `<p style="color:#f87171; text-align:center; padding:2rem;">Failed to load weather advisories.</p>`;
            }
        };

        if (weatherDistrictFilter) weatherDistrictFilter.addEventListener('change', loadWeather);
        loadWeather();

        // Tab 4: Production Stats
        const prodDistrictFilter = document.getElementById('prod-filter-district');
        const prodContent = document.getElementById('production-stats-content');

        const loadProductionStats = async () => {
            if (!prodContent) return;
            const params = {};
            if (prodDistrictFilter && prodDistrictFilter.value) params.district = prodDistrictFilter.value;

            try {
                prodContent.innerHTML = '<p style="text-align:center; padding:2rem; color:var(--text-muted);">Loading production statistics...</p>';
                const res = await API.getProductionStats(params);
                const records = res.data || [];

                if (records.length === 0) {
                    prodContent.innerHTML = `
                        <div class="module-empty-state">
                            <div class="empty-icon">📊</div>
                            <h3>Historical Production Statistics</h3>
                            <p>No historical production statistics currently loaded for this filter. Official historical data covers cultivated area, total production, and yield per hectare across Western UP.</p>
                            <p class="geo-disclaimer">Source: UP Agriculture Statistics Directorate.</p>
                            <div style="margin-top:1.25rem;">
                                <a href="https://upagriculture.com/" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Visit UP Agriculture Statistics Portal &rarr;</a>
                            </div>
                        </div>
                    `;
                    return;
                }

                prodContent.innerHTML = `
                    <div class="timeline-grid">
                        ${records.map(s => `
                            <div class="crop-card">
                                <div>
                                    <div class="card-top">
                                        <div>
                                            <h3 class="card-title">${escapeHTML(s.crop_name)}</h3>
                                            <span style="font-size:0.85rem; color:var(--text-muted);">${escapeHTML(s.agricultural_year)} &bull; ${escapeHTML(s.district)}</span>
                                        </div>
                                        <span class="card-badge badge-type">${escapeHTML(s.geographic_level || 'District')}</span>
                                    </div>
                                    <div class="card-meta-list">
                                        <div class="meta-item"><span>Cultivated Area:</span><strong>${escapeHTML(s.cultivated_area || '—')} ${escapeHTML(s.area_unit || '')}</strong></div>
                                        <div class="meta-item"><span>Total Production:</span><strong>${escapeHTML(s.production || '—')} ${escapeHTML(s.production_unit || '')}</strong></div>
                                        <div class="meta-item"><span>Yield:</span><strong>${escapeHTML(s.yield || '—')} ${escapeHTML(s.yield_unit || '')}</strong></div>
                                    </div>
                                </div>
                                <div class="card-footer-info">
                                    <span>Source: ${escapeHTML(s.source || 'UP Ag Stats')}</span>
                                    ${s.source_url ? `<a href="${escapeHTML(s.source_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);">View Report &rarr;</a>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            } catch (err) {
                console.error('Error loading production stats:', err);
                prodContent.innerHTML = `<p style="color:#f87171; text-align:center; padding:2rem;">Failed to load production statistics.</p>`;
            }
        };

        if (prodDistrictFilter) prodDistrictFilter.addEventListener('change', loadProductionStats);
        loadProductionStats();
    }

    // -------------------------------------------------------------------------
    // 2. EDUCATION & HEALTHCARE CONTROLLER (education.html)
    // -------------------------------------------------------------------------
    const eduTabsContainer = document.getElementById('edu-tabs');
    if (eduTabsContainer) {
        // Tab switching
        const tabBtns = eduTabsContainer.querySelectorAll('.module-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const targetId = 'panel-' + btn.getAttribute('data-tab');
                document.querySelectorAll('.module-panel').forEach(panel => panel.classList.remove('active'));
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) targetPanel.classList.add('active');
            });
        });

        // Tab 1: Schools
        const schoolDistrictFilter = document.getElementById('school-filter-district');
        const schoolTypeFilter = document.getElementById('school-filter-type');
        const schoolsContent = document.getElementById('schools-content');

        const loadSchools = async () => {
            if (!schoolsContent) return;
            const params = {};
            if (schoolDistrictFilter && schoolDistrictFilter.value) params.district = schoolDistrictFilter.value;
            if (schoolTypeFilter && schoolTypeFilter.value) params.type = schoolTypeFilter.value;

            try {
                schoolsContent.innerHTML = '<p style="text-align:center; padding:2rem; color:var(--text-muted);">Loading verified school statistics...</p>';
                const res = await API.getSchools(params);
                const records = res.data || [];

                if (records.length === 0) {
                    schoolsContent.innerHTML = `
                        <div class="module-empty-state">
                            <div class="empty-icon">🎓</div>
                            <h3>School Information — Western UP</h3>
                            <p>No school records currently found for the selected filter. School count, student enrolment and teacher figures are verified through official UDISE+ publications.</p>
                            <p class="geo-disclaimer">⚠️ Statistics clearly identify whether they cover a Village, Block, or District. Village-level figures are never substituted with broader estimates.</p>
                            <div style="margin-top:1.25rem;">
                                <a href="https://udiseplus.gov.in/" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Visit UDISE+ Official Portal &rarr;</a>
                            </div>
                        </div>
                    `;
                    return;
                }

                schoolsContent.innerHTML = `
                    <div class="timeline-grid">
                        ${records.map(s => `
                            <div class="school-card">
                                <div>
                                    <div class="card-top">
                                        <div>
                                            <h3 class="card-title">${escapeHTML(s.school_name || s.district + ' School Statistics')}</h3>
                                            <span style="font-size:0.85rem; color:var(--accent); font-weight:600;">${escapeHTML(s.school_type)} &bull; ${escapeHTML(s.academic_year || 'Current')}</span>
                                        </div>
                                        <span class="card-badge badge-type">${escapeHTML(s.geographic_level || 'District')}</span>
                                    </div>
                                    <div class="card-meta-list">
                                        <div class="meta-item"><span>District:</span><strong>${escapeHTML(s.district)}</strong></div>
                                        ${s.block_name ? `<div class="meta-item"><span>Block:</span><strong>${escapeHTML(s.block_name)}</strong></div>` : ''}
                                        ${s.village ? `<div class="meta-item"><span>Village:</span><strong>${escapeHTML(s.village)}</strong></div>` : ''}
                                        ${s.total_students ? `<div class="meta-item"><span>Total Students:</span><strong>${s.total_students.toLocaleString('en-IN')}</strong></div>` : ''}
                                        ${s.boys_enrolment || s.girls_enrolment ? `<div class="meta-item"><span>Enrolment (B / G):</span><strong>${s.boys_enrolment || '—'} / ${s.girls_enrolment || '—'}</strong></div>` : ''}
                                        ${s.total_teachers ? `<div class="meta-item"><span>Total Teachers:</span><strong>${s.total_teachers}</strong></div>` : ''}
                                        ${s.facilities ? `<div style="margin-top:0.5rem; font-size:0.85rem; color:var(--text-secondary); background:rgba(255,255,255,0.03); padding:0.6rem; border-radius:6px;"><strong style="color:var(--text-primary);">Facilities:</strong> ${escapeHTML(s.facilities)}</div>` : ''}
                                    </div>
                                </div>
                                <div class="card-footer-info">
                                    <span>Source: ${escapeHTML(s.source || 'UDISE+')}</span>
                                    ${s.source_url ? `<a href="${escapeHTML(s.source_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);">UDISE+ &rarr;</a>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            } catch (err) {
                console.error('Error loading schools:', err);
                schoolsContent.innerHTML = `<p style="color:#f87171; text-align:center; padding:2rem;">Failed to load school information.</p>`;
            }
        };

        if (schoolDistrictFilter) schoolDistrictFilter.addEventListener('change', loadSchools);
        if (schoolTypeFilter) schoolTypeFilter.addEventListener('change', loadSchools);
        loadSchools();

        // Tab 2: Healthcare
        const healthDistrictFilter = document.getElementById('health-filter-district');
        const healthTypeFilter = document.getElementById('health-filter-type');
        const healthcareContent = document.getElementById('healthcare-content');

        const loadHealthcare = async () => {
            if (!healthcareContent) return;
            const params = {};
            if (healthDistrictFilter && healthDistrictFilter.value) params.district = healthDistrictFilter.value;
            if (healthTypeFilter && healthTypeFilter.value) params.type = healthTypeFilter.value;

            try {
                healthcareContent.innerHTML = '<p style="text-align:center; padding:2rem; color:var(--text-muted);">Loading healthcare facilities...</p>';
                const res = await API.getHealthcare(params);
                const records = res.data || [];

                if (records.length === 0) {
                    healthcareContent.innerHTML = `
                        <div class="module-empty-state">
                            <div class="empty-icon">🏥</div>
                            <h3>Healthcare Facilities — Western UP</h3>
                            <p>No healthcare facility records currently found for the selected filter. Verified records for Primary Health Centres (PHCs), CHCs, Sub-Centres and District Hospitals will appear here.</p>
                            <p class="geo-disclaimer">Official Source: Uttar Pradesh Department of Medical Health and Family Welfare.</p>
                            <div style="margin-top:1.25rem;">
                                <a href="https://uphealth.up.gov.in/" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Visit UP Health Department Portal &rarr;</a>
                            </div>
                        </div>
                    `;
                    return;
                }

                healthcareContent.innerHTML = `
                    <div class="timeline-grid">
                        ${records.map(h => `
                            <div class="health-card">
                                <div>
                                    <div class="card-top">
                                        <div>
                                            <h3 class="card-title">${escapeHTML(h.facility_name)}</h3>
                                            <span style="font-size:0.85rem; color:var(--accent); font-weight:600;">${escapeHTML(h.facility_type)}</span>
                                        </div>
                                        <span class="card-badge ${h.operational_status === 'Operational' ? 'badge-verified' : 'badge-unverified'}">
                                            ${escapeHTML(h.operational_status || 'Reported')}
                                        </span>
                                    </div>
                                    <div class="card-meta-list">
                                        <div class="meta-item"><span>District:</span><strong>${escapeHTML(h.district)}</strong></div>
                                        ${h.block_name ? `<div class="meta-item"><span>Block:</span><strong>${escapeHTML(h.block_name)}</strong></div>` : ''}
                                        ${h.village ? `<div class="meta-item"><span>Village:</span><strong>${escapeHTML(h.village)}</strong></div>` : ''}
                                        ${h.bed_capacity ? `<div class="meta-item"><span>Bed Capacity:</span><strong>${h.bed_capacity} Beds</strong></div>` : ''}
                                        ${h.doctors_count ? `<div class="meta-item"><span>Doctors / Staff:</span><strong>${h.doctors_count} Doctors / ${h.staff_count || '—'} Staff</strong></div>` : ''}
                                        ${h.services ? `<div style="margin-top:0.5rem; font-size:0.85rem; color:var(--text-secondary); background:rgba(255,255,255,0.03); padding:0.6rem; border-radius:6px;"><strong style="color:var(--text-primary);">Services:</strong> ${escapeHTML(h.services)}</div>` : ''}
                                        ${h.contact_details ? `<div class="meta-item" style="margin-top:0.4rem;"><span>Contact:</span><strong>${escapeHTML(h.contact_details)}</strong></div>` : ''}
                                    </div>
                                </div>
                                <div class="card-footer-info">
                                    <span>Source: ${escapeHTML(h.source || 'UP Health Dept')}</span>
                                    ${h.source_url ? `<a href="${escapeHTML(h.source_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);">Official Record &rarr;</a>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            } catch (err) {
                console.error('Error loading healthcare:', err);
                healthcareContent.innerHTML = `<p style="color:#f87171; text-align:center; padding:2rem;">Failed to load healthcare information.</p>`;
            }
        };

        if (healthDistrictFilter) healthDistrictFilter.addEventListener('change', loadHealthcare);
        if (healthTypeFilter) healthTypeFilter.addEventListener('change', loadHealthcare);
        loadHealthcare();
    }

    // -------------------------------------------------------------------------
    // 3. PANCHAYAT FUNDS CONTROLLER (panchayat-funds.html)
    // -------------------------------------------------------------------------
    const pfContent = document.getElementById('panchayat-funds-content');
    if (pfContent) {
        const pfDistrictFilter = document.getElementById('pf-filter-district');
        const pfFyFilter = document.getElementById('pf-filter-fy');
        const pfSearch = document.getElementById('pf-search');

        const loadPanchayatFunds = async () => {
            const params = {};
            if (pfDistrictFilter && pfDistrictFilter.value) params.district = pfDistrictFilter.value;
            if (pfFyFilter && pfFyFilter.value) params.financial_year = pfFyFilter.value;
            if (pfSearch && pfSearch.value) params.search = pfSearch.value;

            try {
                pfContent.innerHTML = '<p style="text-align:center; padding:2rem; color:var(--text-muted);">Loading Panchayat financial records...</p>';
                const res = await API.getPanchayatFunds(params);
                const records = res.data || [];

                if (records.length === 0) {
                    pfContent.innerHTML = `
                        <div class="module-empty-state">
                            <div class="empty-icon">💰</div>
                            <h3>Panchayat Financial Data</h3>
                            <p>No Panchayat fund records currently loaded for this selection. Public development records can be imported by an administrator from authorized eGramSwaraj or Meri Panchayat datasets.</p>
                            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.5rem;">
                                Financial fields (Sanctioned, Released, Expenditure, Balance) are strictly defined and never conflated.
                            </p>
                            <div style="display:flex; gap:0.75rem; flex-wrap:wrap; justify-content:center; margin-top:1.25rem;">
                                <a href="https://egramswaraj.gov.in/" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Visit eGramSwaraj &rarr;</a>
                                <a href="https://panchayat.gov.in/" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Visit Meri Panchayat &rarr;</a>
                            </div>
                        </div>
                    `;
                    return;
                }

                pfContent.innerHTML = `
                    <div class="pf-table-wrapper">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Gram Panchayat</th>
                                    <th>District (Block)</th>
                                    <th>Financial Year</th>
                                    <th>Scheme / Work</th>
                                    <th>Sanctioned Amount</th>
                                    <th>Released Amount</th>
                                    <th>Expenditure</th>
                                    <th>Balance</th>
                                    <th>Status / Progress</th>
                                    <th>Source</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${records.map(r => `
                                    <tr>
                                        <td><strong>${escapeHTML(r.gram_panchayat)}</strong></td>
                                        <td>${escapeHTML(r.district)} (${escapeHTML(r.block_name || 'Block')})</td>
                                        <td><span class="status-badge status-progress">${escapeHTML(r.financial_year)}</span></td>
                                        <td>
                                            <strong>${escapeHTML(r.scheme_name || '—')}</strong>
                                            ${r.work_name ? `<br><span style="font-size:0.8rem; color:var(--text-secondary);">${escapeHTML(r.work_name)}</span>` : ''}
                                        </td>
                                        <td class="pf-financial-val">${formatCurrency(r.sanctioned_amount)}</td>
                                        <td class="pf-financial-val">${formatCurrency(r.released_amount)}</td>
                                        <td class="pf-financial-val">${formatCurrency(r.expenditure)}</td>
                                        <td class="pf-financial-val">${formatCurrency(r.balance)}</td>
                                        <td>
                                            <span class="status-badge ${r.work_status === 'Completed' ? 'status-completed' : 'status-assessment'}">
                                                ${escapeHTML(r.work_status || r.physical_progress || 'Reported')}
                                            </span>
                                        </td>
                                        <td>
                                            <span style="font-size:0.8rem; color:var(--text-muted);">${escapeHTML(r.source || 'eGramSwaraj')}</span>
                                            ${r.source_url ? `<br><a href="${escapeHTML(r.source_url)}" target="_blank" rel="noopener noreferrer" style="font-size:0.75rem; color:var(--accent);">Report &rarr;</a>` : ''}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            } catch (err) {
                console.error('Error loading panchayat funds:', err);
                pfContent.innerHTML = `<p style="color:#f87171; text-align:center; padding:2rem;">Failed to load Panchayat financial records.</p>`;
            }
        };

        if (pfDistrictFilter) pfDistrictFilter.addEventListener('change', loadPanchayatFunds);
        if (pfFyFilter) pfFyFilter.addEventListener('change', loadPanchayatFunds);
        if (pfSearch) {
            let timeout = null;
            pfSearch.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(loadPanchayatFunds, 400);
            });
        }
        loadPanchayatFunds();
    }
});
