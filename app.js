// S&P 500 Dashboard Application
class SP500Dashboard {
    constructor() {
        this.data = this.initializeData();
        this.filteredData = [...this.data];
        this.currentPage = 1;
        this.pageSize = 20;
        this.currentSort = 'dcf_value_gap';
        this.charts = {};
        this.alerts = {
            peThreshold: 15,
            dcfThreshold: 20,
            enabled: true
        };
        
        this.init();
    }

    initializeData() {
        // Extended S&P 500 sample data based on provided JSON
        return [
            {
                symbol: "AAPL",
                name: "Apple Inc.",
                sector: "Technology", 
                classification: "Blend",
                final_tag: "Blend",
                pe: 35.27,
                pb: 59.31,
                ps: 9.67,
                ev_ebit: 26.91,
                dcf_value_gap: -11.15,
                fcf_yield: 2.87,
                roic: 30.0,
                fair_value: 180.98,
                current_price: 203.68,
                marketCap: 3120000000000,
                eps_growth: 5,
                revenue_growth: 5,
                dividend_yield: 0.43
            },
            {
                symbol: "MSFT", 
                name: "Microsoft Corporation",
                sector: "Technology",
                classification: "Growth",
                final_tag: "GROWTH – Momentum", 
                pe: 40.60,
                pb: 12.75,
                ps: 15.63,
                ev_ebit: 28.33,
                dcf_value_gap: -22.47,
                fcf_yield: 2.31,
                roic: 18.0,
                fair_value: 365.06,
                current_price: 470.87,
                marketCap: 3500000000000,
                eps_growth: 18,
                revenue_growth: 12,
                dividend_yield: 0.72
            },
            {
                symbol: "BRK-B",
                name: "Berkshire Hathaway Inc.",
                sector: "Financial Services",
                classification: "Value", 
                final_tag: "VALUE – Undervalued",
                pe: 10.83,
                pb: 1.64,
                ps: 2.58,
                ev_ebit: 7.54,
                dcf_value_gap: 45.92,
                fcf_yield: 3.45,
                roic: 12.0,
                fair_value: 721.65,
                current_price: 494.55,
                marketCap: 890000000000,
                eps_growth: 8,
                revenue_growth: 6,
                dividend_yield: 0.0
            },
            {
                symbol: "JPM",
                name: "JP Morgan Chase & Co.",
                sector: "Financial Services", 
                classification: "Blend",
                final_tag: "Blend",
                pe: 14.92,
                pb: 1.88,
                ps: 4.30,
                ev_ebit: 7.62,
                dcf_value_gap: 47.08,
                fcf_yield: 4.12,
                roic: 14.0,
                fair_value: 391.77,
                current_price: 266.36,
                marketCap: 760000000000,
                eps_growth: 12,
                revenue_growth: 8,
                dividend_yield: 2.19
            },
            {
                symbol: "JNJ",
                name: "Johnson & Johnson",
                sector: "Healthcare",
                classification: "Blend",
                final_tag: "VALUE – Overvalued", 
                pe: 15.47,
                pb: 5.36,
                ps: 5.18,
                ev_ebit: 11.83,
                dcf_value_gap: -11.54,
                fcf_yield: 4.86,
                roic: 16.0,
                fair_value: 137.02,
                current_price: 154.90,
                marketCap: 390000000000,
                eps_growth: 6,
                revenue_growth: 4,
                dividend_yield: 3.05
            },
            {
                symbol: "XOM",
                name: "Exxon Mobil Corporation",
                sector: "Energy",
                classification: "Value",
                final_tag: "VALUE – Fairly Valued",
                pe: 14.23,
                pb: 1.78,
                ps: 1.84,
                ev_ebit: 5.64,
                dcf_value_gap: 8.45,
                fcf_yield: 6.12,
                roic: 11.0,
                fair_value: 128.50,
                current_price: 118.45,
                marketCap: 480000000000,
                eps_growth: 3,
                revenue_growth: 2,
                dividend_yield: 5.89
            },
            {
                symbol: "WMT",
                name: "Walmart Inc.",
                sector: "Consumer Defensive",
                classification: "Blend",
                final_tag: "Blend",
                pe: 28.45,
                pb: 7.23,
                ps: 0.91,
                ev_ebit: 15.32,
                dcf_value_gap: -5.67,
                fcf_yield: 2.34,
                roic: 13.0,
                fair_value: 75.80,
                current_price: 80.35,
                marketCap: 650000000000,
                eps_growth: 7,
                revenue_growth: 5,
                dividend_yield: 2.24
            },
            {
                symbol: "PG",
                name: "Procter & Gamble Company",
                sector: "Consumer Defensive", 
                classification: "Blend",
                final_tag: "Blend",
                pe: 25.67,
                pb: 8.12,
                ps: 4.78,
                ev_ebit: 18.45,
                dcf_value_gap: -3.24,
                fcf_yield: 3.45,
                roic: 15.0,
                fair_value: 158.90,
                current_price: 164.22,
                marketCap: 380000000000,
                eps_growth: 4,
                revenue_growth: 3,
                dividend_yield: 2.38
            },
            {
                symbol: "KO",
                name: "The Coca-Cola Company",
                sector: "Consumer Defensive",
                classification: "Blend", 
                final_tag: "Blend",
                pe: 26.34,
                pb: 11.23,
                ps: 6.45,
                ev_ebit: 16.78,
                dcf_value_gap: 2.15,
                fcf_yield: 3.12,
                roic: 17.0,
                fair_value: 63.50,
                current_price: 62.18,
                marketCap: 270000000000,
                eps_growth: 5,
                revenue_growth: 4,
                dividend_yield: 3.07
            },
            {
                symbol: "CVX",
                name: "Chevron Corporation", 
                sector: "Energy",
                classification: "Value",
                final_tag: "VALUE – Undervalued",
                pe: 13.45,
                pb: 1.56,
                ps: 1.67,
                ev_ebit: 6.23,
                dcf_value_gap: 22.34,
                fcf_yield: 7.89,
                roic: 13.0,
                fair_value: 187.60,
                current_price: 153.45,
                marketCap: 290000000000,
                eps_growth: 4,
                revenue_growth: 3,
                dividend_yield: 3.48
            }
        ];
    }

    init() {
        this.setupEventListeners();
        this.populateFilters();
        this.updateDashboard();
        this.renderOverview();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('[data-tab]').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Comparison tab navigation
        document.querySelectorAll('[data-comparison-tab]').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.comparisonTab;
                this.switchComparisonTab(tab);
            });
        });

        // Filter controls
        document.getElementById('applyFilters').addEventListener('click', () => this.applyFilters());
        document.getElementById('resetFilters').addEventListener('click', () => this.resetFilters());
        document.getElementById('exportData').addEventListener('click', () => this.exportData());

        // Range sliders
        document.getElementById('dividendMin').addEventListener('input', () => this.updateRangeDisplay());
        document.getElementById('dividendMax').addEventListener('input', () => this.updateRangeDisplay());

        // Time period buttons
        document.querySelectorAll('[data-period]').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Table controls
        document.getElementById('tableSearch').addEventListener('input', (e) => this.searchTable(e.target.value));
        document.getElementById('tableSort').addEventListener('change', (e) => this.sortTable(e.target.value));
        document.getElementById('prevPage').addEventListener('click', () => this.changePage(-1));
        document.getElementById('nextPage').addEventListener('click', () => this.changePage(1));

        // Comparison
        document.getElementById('compareCompanies').addEventListener('click', () => this.compareSelectedCompanies());

        // Alerts
        document.getElementById('saveAlerts').addEventListener('click', () => this.saveAlertConfiguration());
    }

    populateFilters() {
        // Populate sector filter
        const sectors = [...new Set(this.data.map(d => d.sector))].sort();
        const sectorFilter = document.getElementById('sectorFilter');
        sectorFilter.innerHTML = '<option value="">All Sectors</option>';
        sectors.forEach(sector => {
            const option = document.createElement('option');
            option.value = sector;
            option.textContent = sector;
            sectorFilter.appendChild(option);
        });

        // Populate company selector for comparison
        const companySelector = document.getElementById('companySelector');
        companySelector.innerHTML = '';
        this.data.forEach(company => {
            const option = document.createElement('option');
            option.value = company.symbol;
            option.textContent = `${company.name} (${company.symbol})`;
            companySelector.appendChild(option);
        });

        this.updateRangeDisplay();
    }

    updateRangeDisplay() {
        const minValue = document.getElementById('dividendMin').value;
        const maxValue = document.getElementById('dividendMax').value;
        document.getElementById('dividendMinValue').textContent = `${minValue}%`;
        document.getElementById('dividendMaxValue').textContent = `${maxValue}%`;
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('[data-tab]').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const targetContent = document.getElementById(`${tabName}-content`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Render specific tab content
        setTimeout(() => {
            switch(tabName) {
                case 'overview':
                    this.renderOverview();
                    break;
                case 'value-assessment':
                    this.renderValueTable();
                    break;
                case 'comparison':
                    this.renderComparison();
                    break;
                case 'leaderboard':
                    this.renderLeaderboard();
                    break;
                case 'alerts':
                    this.renderAlerts();
                    break;
            }
        }, 100);
    }

    switchComparisonTab(tabName) {
        document.querySelectorAll('[data-comparison-tab]').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`[data-comparison-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.comparison-content').forEach(content => {
            content.classList.remove('active');
        });
        const targetContent = document.getElementById(`${tabName}-comparison`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    applyFilters() {
        const sectorFilter = Array.from(document.getElementById('sectorFilter').selectedOptions).map(o => o.value).filter(v => v);
        const valuationFilter = document.getElementById('valuationFilter').value;
        const dividendMin = parseFloat(document.getElementById('dividendMin').value);
        const dividendMax = parseFloat(document.getElementById('dividendMax').value);

        this.filteredData = this.data.filter(company => {
            let passes = true;

            // Sector filter
            if (sectorFilter.length > 0 && !sectorFilter.includes(company.sector)) {
                passes = false;
            }

            // Valuation filter
            if (valuationFilter && company.final_tag !== valuationFilter) {
                passes = false;
            }

            // Dividend yield filter
            if (company.dividend_yield < dividendMin || company.dividend_yield > dividendMax) {
                passes = false;
            }

            return passes;
        });

        this.currentPage = 1;
        this.updateDashboard();
        
        // Re-render current tab content
        const activeTab = document.querySelector('[data-tab].active');
        if (activeTab) {
            this.switchTab(activeTab.dataset.tab);
        }
    }

    resetFilters() {
        document.getElementById('sectorFilter').selectedIndex = 0;
        document.getElementById('valuationFilter').value = '';
        document.getElementById('dividendMin').value = 0;
        document.getElementById('dividendMax').value = 6;
        this.updateRangeDisplay();
        this.filteredData = [...this.data];
        this.updateDashboard();
        
        // Re-render current tab content
        const activeTab = document.querySelector('[data-tab].active');
        if (activeTab) {
            this.switchTab(activeTab.dataset.tab);
        }
    }

    updateDashboard() {
        this.updateHeaderStats();
    }

    updateHeaderStats() {
        const total = this.filteredData.length;
        const valueStocks = this.filteredData.filter(d => d.classification === 'Value').length;
        const growthStocks = this.filteredData.filter(d => d.classification === 'Growth').length;

        document.getElementById('totalCompanies').textContent = total;
        document.getElementById('valueStocks').textContent = valueStocks;
        document.getElementById('growthStocks').textContent = growthStocks;
    }

    renderOverview() {
        this.updateKPIs();
        this.renderCharts();
    }

    updateKPIs() {
        const valueStocks = this.filteredData.filter(d => d.classification === 'Value');
        const growthStocks = this.filteredData.filter(d => d.classification === 'Growth');

        document.getElementById('valueCount').textContent = valueStocks.length;
        document.getElementById('growthCount').textContent = growthStocks.length;

        // Calculate average P/E ratios
        const avgPEValue = valueStocks.length > 0 
            ? (valueStocks.reduce((sum, s) => sum + s.pe, 0) / valueStocks.length).toFixed(1)
            : '--';
        const avgPEGrowth = growthStocks.length > 0 
            ? (growthStocks.reduce((sum, s) => sum + s.pe, 0) / growthStocks.length).toFixed(1)
            : '--';

        document.getElementById('avgPEValue').textContent = avgPEValue;
        document.getElementById('avgPEGrowth').textContent = avgPEGrowth;
    }

    renderCharts() {
        // Small delay to ensure canvas elements are visible
        setTimeout(() => {
            this.renderSectorChart();
            this.renderValuationChart();
        }, 100);
    }

    renderSectorChart() {
        const canvas = document.getElementById('sectorChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.sector) {
            this.charts.sector.destroy();
        }

        const sectorCounts = {};
        this.filteredData.forEach(company => {
            sectorCounts[company.sector] = (sectorCounts[company.sector] || 0) + 1;
        });

        this.charts.sector = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(sectorCounts),
                datasets: [{
                    data: Object.values(sectorCounts),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    renderValuationChart() {
        const canvas = document.getElementById('valuationChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.valuation) {
            this.charts.valuation.destroy();
        }

        const valueStocks = this.filteredData.filter(d => d.classification === 'Value');
        const growthStocks = this.filteredData.filter(d => d.classification === 'Growth');

        const valueAvgPE = valueStocks.length > 0 ? valueStocks.reduce((sum, s) => sum + s.pe, 0) / valueStocks.length : 0;
        const growthAvgPE = growthStocks.length > 0 ? growthStocks.reduce((sum, s) => sum + s.pe, 0) / growthStocks.length : 0;
        const valueAvgPB = valueStocks.length > 0 ? valueStocks.reduce((sum, s) => sum + s.pb, 0) / valueStocks.length : 0;
        const growthAvgPB = growthStocks.length > 0 ? growthStocks.reduce((sum, s) => sum + s.pb, 0) / growthStocks.length : 0;

        this.charts.valuation = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['P/E Ratio', 'P/B Ratio'],
                datasets: [{
                    label: 'Value Stocks',
                    data: [valueAvgPE, valueAvgPB],
                    backgroundColor: '#1FB8CD'
                }, {
                    label: 'Growth Stocks',
                    data: [growthAvgPE, growthAvgPB],
                    backgroundColor: '#FFC185'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderValueTable() {
        const tbody = document.getElementById('valueTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        pageData.forEach(company => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${company.name}</strong><br><small>${company.symbol}</small></td>
                <td>${company.sector}</td>
                <td>${company.pe.toFixed(2)}</td>
                <td>${company.pb.toFixed(2)}</td>
                <td>${company.ev_ebit.toFixed(2)}</td>
                <td class="${company.dcf_value_gap > 0 ? 'text-success' : 'text-error'}">${company.dcf_value_gap.toFixed(2)}%</td>
                <td>${company.fcf_yield.toFixed(2)}%</td>
                <td>${company.roic.toFixed(2)}%</td>
                <td>$${company.fair_value.toFixed(2)}</td>
                <td><span class="valuation-tag ${this.getTagClass(company.final_tag)}">${company.final_tag}</span></td>
            `;
            tbody.appendChild(row);
        });

        this.updatePagination();
    }

    getTagClass(tag) {
        if (tag.includes('Undervalued')) return 'undervalued';
        if (tag.includes('Fairly Valued')) return 'fairly-valued';
        if (tag.includes('Overvalued')) return 'overvalued';
        if (tag.includes('Momentum')) return 'growth-momentum';
        if (tag.includes('Watchlist')) return 'growth-watchlist';
        return 'blend';
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        const pageInfo = document.getElementById('pageInfo');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (pageInfo) pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages;
    }

    changePage(direction) {
        const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        const newPage = this.currentPage + direction;
        
        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.renderValueTable();
        }
    }

    searchTable(query) {
        if (!query) {
            this.applyFilters(); // Reapply existing filters
        } else {
            // Apply search on top of existing filters
            const baseFiltered = this.getFilteredData();
            this.filteredData = baseFiltered.filter(company =>
                company.name.toLowerCase().includes(query.toLowerCase()) ||
                company.symbol.toLowerCase().includes(query.toLowerCase()) ||
                company.sector.toLowerCase().includes(query.toLowerCase())
            );
        }
        this.currentPage = 1;
        this.renderValueTable();
        this.updateHeaderStats();
    }

    getFilteredData() {
        const sectorFilter = Array.from(document.getElementById('sectorFilter').selectedOptions).map(o => o.value).filter(v => v);
        const valuationFilter = document.getElementById('valuationFilter').value;
        const dividendMin = parseFloat(document.getElementById('dividendMin').value);
        const dividendMax = parseFloat(document.getElementById('dividendMax').value);

        return this.data.filter(company => {
            let passes = true;

            if (sectorFilter.length > 0 && !sectorFilter.includes(company.sector)) {
                passes = false;
            }

            if (valuationFilter && company.final_tag !== valuationFilter) {
                passes = false;
            }

            if (company.dividend_yield < dividendMin || company.dividend_yield > dividendMax) {
                passes = false;
            }

            return passes;
        });
    }

    sortTable(sortBy) {
        this.currentSort = sortBy;
        
        this.filteredData.sort((a, b) => {
            switch(sortBy) {
                case 'dcf_value_gap':
                    return b.dcf_value_gap - a.dcf_value_gap;
                case 'pe':
                    return a.pe - b.pe;
                case 'pb':
                    return a.pb - b.pb;
                case 'roic':
                    return b.roic - a.roic;
                default:
                    return 0;
            }
        });

        this.renderValueTable();
    }

    renderComparison() {
        // No additional rendering needed for comparison tab initialization
    }

    compareSelectedCompanies() {
        const selector = document.getElementById('companySelector');
        const selectedSymbols = Array.from(selector.selectedOptions).map(o => o.value);
        
        if (selectedSymbols.length < 2 || selectedSymbols.length > 5) {
            alert('Please select 2-5 companies for comparison');
            return;
        }

        const selectedCompanies = this.data.filter(c => selectedSymbols.includes(c.symbol));
        document.getElementById('comparisonCharts').style.display = 'block';
        
        setTimeout(() => {
            this.renderComparisonCharts(selectedCompanies);
        }, 100);
    }

    renderComparisonCharts(companies) {
        this.renderValuationComparison(companies);
        this.renderProfitabilityComparison(companies);
        this.renderGrowthComparison(companies);
    }

    renderValuationComparison(companies) {
        const canvas = document.getElementById('valuationComparisonChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.valuationComparison) {
            this.charts.valuationComparison.destroy();
        }

        this.charts.valuationComparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: companies.map(c => c.symbol),
                datasets: [{
                    label: 'P/E Ratio',
                    data: companies.map(c => c.pe),
                    backgroundColor: '#1FB8CD'
                }, {
                    label: 'P/B Ratio',
                    data: companies.map(c => c.pb),
                    backgroundColor: '#FFC185'
                }, {
                    label: 'EV/EBIT',
                    data: companies.map(c => c.ev_ebit),
                    backgroundColor: '#B4413C'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderProfitabilityComparison(companies) {
        const canvas = document.getElementById('profitabilityChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.profitability) {
            this.charts.profitability.destroy();
        }

        this.charts.profitability = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['ROIC (%)', 'FCF Yield (%)', 'Operating Margin (%)'],
                datasets: companies.map((company, index) => ({
                    label: company.symbol,
                    data: [company.roic, company.fcf_yield, company.roic * 0.8], // Approximating operating margin
                    backgroundColor: `rgba(${['31, 184, 205', '255, 193, 133', '180, 65, 60', '236, 235, 213', '93, 135, 143'][index % 5]}, 0.2)`,
                    borderColor: `rgb(${['31, 184, 205', '255, 193, 133', '180, 65, 60', '236, 235, 213', '93, 135, 143'][index % 5]})`
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        borderWidth: 3
                    }
                }
            }
        });
    }

    renderGrowthComparison(companies) {
        const canvas = document.getElementById('growthChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.growth) {
            this.charts.growth.destroy();
        }

        this.charts.growth = new Chart(ctx, {
            type: 'line',
            data: {
                labels: companies.map(c => c.symbol),
                datasets: [{
                    label: 'EPS Growth (%)',
                    data: companies.map(c => c.eps_growth),
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD',
                    fill: false
                }, {
                    label: 'Revenue Growth (%)',
                    data: companies.map(c => c.revenue_growth),
                    backgroundColor: '#FFC185',
                    borderColor: '#FFC185',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderLeaderboard() {
        const undervaluedStocks = this.filteredData
            .filter(stock => stock.dcf_value_gap > 0)
            .sort((a, b) => b.dcf_value_gap - a.dcf_value_gap)
            .slice(0, 10);

        const grid = document.getElementById('leaderboardGrid');
        if (!grid) return;
        
        grid.innerHTML = '';

        if (undervaluedStocks.length === 0) {
            grid.innerHTML = '<p class="text-secondary">No undervalued stocks found in current filter selection.</p>';
            return;
        }

        undervaluedStocks.forEach((stock, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.innerHTML = `
                <div class="leaderboard-rank">${index + 1}</div>
                <div class="leaderboard-company">
                    <div class="leaderboard-name">${stock.name}</div>
                    <div class="leaderboard-sector">${stock.sector}</div>
                </div>
                <div class="leaderboard-metrics">
                    <div class="leaderboard-metric">
                        <span class="leaderboard-metric-label">DCF Gap</span>
                        <span class="leaderboard-metric-value">+${stock.dcf_value_gap.toFixed(1)}%</span>
                    </div>
                    <div class="leaderboard-metric">
                        <span class="leaderboard-metric-label">P/E</span>
                        <span class="leaderboard-metric-value">${stock.pe.toFixed(1)}</span>
                    </div>
                    <div class="leaderboard-metric">
                        <span class="leaderboard-metric-label">ROIC</span>
                        <span class="leaderboard-metric-value">${stock.roic.toFixed(1)}%</span>
                    </div>
                </div>
            `;
            grid.appendChild(item);
        });
    }

    renderAlerts() {
        this.checkAlerts();
    }

    saveAlertConfiguration() {
        this.alerts.peThreshold = parseFloat(document.getElementById('peThreshold').value);
        this.alerts.dcfThreshold = parseFloat(document.getElementById('dcfThreshold').value);
        this.alerts.enabled = document.getElementById('enableAlerts').checked;
        
        this.checkAlerts();
        alert('Alert configuration saved successfully!');
    }

    checkAlerts() {
        if (!this.alerts.enabled) return;

        const alertsContainer = document.getElementById('activeAlerts');
        if (!alertsContainer) return;
        
        alertsContainer.innerHTML = '';

        const triggeredAlerts = this.filteredData.filter(stock => {
            return (stock.pe < this.alerts.peThreshold && stock.pe > 0) || 
                   stock.dcf_value_gap > this.alerts.dcfThreshold;
        });

        if (triggeredAlerts.length === 0) {
            alertsContainer.innerHTML = '<p class="text-secondary">No active alerts</p>';
            return;
        }

        triggeredAlerts.forEach(stock => {
            const alert = document.createElement('div');
            alert.className = stock.dcf_value_gap > this.alerts.dcfThreshold ? 'alert-item high-priority' : 'alert-item';
            
            let alertText = '';
            if (stock.pe < this.alerts.peThreshold && stock.pe > 0) {
                alertText += `Low P/E: ${stock.pe.toFixed(2)} `;
            }
            if (stock.dcf_value_gap > this.alerts.dcfThreshold) {
                alertText += `High DCF Gap: +${stock.dcf_value_gap.toFixed(1)}%`;
            }

            alert.innerHTML = `
                <strong>${stock.name}</strong><br>
                <small>${alertText}</small>
            `;
            alertsContainer.appendChild(alert);
        });
    }

    exportData() {
        const csvContent = this.convertToCSV(this.filteredData);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'sp500_filtered_data.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    convertToCSV(data) {
        const headers = ['Symbol', 'Name', 'Sector', 'Classification', 'PE Ratio', 'PB Ratio', 'EV/EBIT', 'DCF Value Gap (%)', 'FCF Yield (%)', 'ROIC (%)', 'Fair Value', 'Current Price', 'Valuation Tag'];
        
        const csvRows = [headers.join(',')];
        
        data.forEach(row => {
            const values = [
                row.symbol,
                `"${row.name}"`,
                row.sector,
                row.classification,
                row.pe,
                row.pb,
                row.ev_ebit,
                row.dcf_value_gap,
                row.fcf_yield,
                row.roic,
                row.fair_value,
                row.current_price,
                `"${row.final_tag}"`
            ];
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SP500Dashboard();
});