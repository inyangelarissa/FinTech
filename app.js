document.addEventListener('DOMContentLoaded', function() {
    // API endpoints
    const CURRENCY_API = 'https://api.exchangerate-api.com/v4/latest/USD';
    const STORAGE_KEY = 'groupSavingsData';
    
    // State variables
    let members = [];
    let savingsGoal = 0;
    let goalDate = '';
    let exchangeRates = {};
    let selectedMemberIndex = -1;
    let chartInstance = null;
    
    // DOM Elements
    const totalSavingsEl = document.getElementById('totalSavings');
    const convertedAmountEl = document.getElementById('convertedAmount');
    const currencySelectEl = document.getElementById('currency');
    const goalProgressEl = document.getElementById('goalProgress');
    const goalPercentageEl = document.getElementById('goalPercentage');
    const goalAmountEl = document.getElementById('goalAmount');
    const membersListEl = document.getElementById('membersList');
    const searchMembersEl = document.getElementById('searchMembers');
    const sortMembersEl = document.getElementById('sortMembers');
    const addMemberBtn = document.getElementById('addMemberBtn');
    const setGoalBtn = document.getElementById('setGoalBtn');
    const goalInputEl = document.getElementById('goalInput');
    const goalDateEl = document.getElementById('goalDate');
    const chartTypeEl = document.getElementById('chartType');
    
    // Modals
    const addMemberModal = document.getElementById('addMemberModal');
    const addMemberForm = document.getElementById('addMemberForm');
    const memberDetailsModal = document.getElementById('memberDetailsModal');
    const saveContributionBtn = document.getElementById('saveContribution');
    
    // Initial setup
    initializeApp();
    
    // Functions
    
    function initializeApp() {
        loadData();
        fetchExchangeRates();
        renderMembers();
        updateDashboard();
        updateChart();
        
        // Add event listeners
        addMemberBtn.addEventListener('click', openAddMemberModal);
        setGoalBtn.addEventListener('click', setGoal);
        addMemberForm.addEventListener('submit', addMember);
        saveContributionBtn.addEventListener('click', addContribution);
        searchMembersEl.addEventListener('input', renderMembers);
        sortMembersEl.addEventListener('change', renderMembers);
        currencySelectEl.addEventListener('change', updateConvertedAmount);
        chartTypeEl.addEventListener('change', updateChart);
        
        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                addMemberModal.style.display = 'none';
                memberDetailsModal.style.display = 'none';
            });
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === addMemberModal) {
                addMemberModal.style.display = 'none';
            }
            if (event.target === memberDetailsModal) {
                memberDetailsModal.style.display = 'none';
            }
        });
    }
    
    function loadData() {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const data = JSON.parse(savedData);
            members = data.members || [];
            savingsGoal = data.savingsGoal || 0;
            goalDate = data.goalDate || '';
            
            // Set goal input values
            goalInputEl.value = savingsGoal;
            goalDateEl.value = goalDate;
        }
    }
    
    function saveData() {
        const data = {
            members,
            savingsGoal,
            goalDate
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    
    async function fetchExchangeRates() {
        try {
            const response = await fetch(CURRENCY_API);
            const data = await response.json();
            exchangeRates = data.rates;
            updateConvertedAmount();
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    }
    
    function updateDashboard() {
        const totalSavings = calculateTotalSavings();
        
        // Update total savings
        totalSavingsEl.textContent = formatCurrency(totalSavings, 'USD');
        
        // Update goal information
        goalAmountEl.textContent = formatCurrency(savingsGoal, 'USD');
        
        // Calculate and update progress
        const progress = savingsGoal > 0 ? (totalSavings / savingsGoal) * 100 : 0;
        goalProgressEl.style.width = `${Math.min(progress, 100)}%`;
        goalPercentageEl.textContent = `${Math.round(progress)}%`;
        
        updateConvertedAmount();
    }
    
    function updateConvertedAmount() {
        const totalSavings = calculateTotalSavings();
        const selectedCurrency = currencySelectEl.value;
        
        if (exchangeRates && exchangeRates[selectedCurrency]) {
            const convertedValue = totalSavings * exchangeRates[selectedCurrency];
            convertedAmountEl.textContent = formatCurrency(convertedValue, selectedCurrency);
        } else {
            convertedAmountEl.textContent = formatCurrency(totalSavings, 'USD');
        }
    }
    
    function calculateTotalSavings() {
        return members.reduce((sum, member) => sum + member.amount, 0);
    }
    
    function formatCurrency(amount, currency) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        });
        return formatter.format(amount);
    }
    
    function renderMembers() {
        const searchTerm = searchMembersEl.value.toLowerCase();
        const sortBy = sortMembersEl.value;
        
        // Filter members by search term
        let filteredMembers = members.filter(member => 
            member.name.toLowerCase().includes(searchTerm)
        );
        
        // Sort members
        filteredMembers.sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortBy === 'amount') {
                return b.amount - a.amount;
            } else if (sortBy === 'date') {
                const dateA = a.lastContribution ? new Date(a.lastContribution) : new Date(0);
                const dateB = b.lastContribution ? new Date(b.lastContribution) : new Date(0);
                return dateB - dateA;
            }
            return 0;
        });
        
        // Render to DOM
        membersListEl.innerHTML = '';
        
        if (filteredMembers.length === 0) {
            membersListEl.innerHTML = '<p class="no-results">No members found</p>';
            return;
        }
        
        filteredMembers.forEach((member, index) => {
            const memberEl = document.createElement('div');
            memberEl.className = 'member-item';
            memberEl.innerHTML = `
                <div class="member-info">
                    <span class="member-name">${member.name}</span>
                    <span class="member-date">Last: ${member.lastContribution || 'No contributions'}</span>
                </div>
                <span class="member-amount">${formatCurrency(member.amount, 'USD')}</span>
            `;
            
            memberEl.addEventListener('click', () => {
                openMemberDetails(members.indexOf(member));
            });
            
            membersListEl.appendChild(memberEl);
        });
    }
    
    function updateChart() {
        const chartType = chartTypeEl.value;
        const ctx = document.getElementById('savingsChart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }
        
        let chartData;
        let options;
        
        if (chartType === 'bar' || chartType === 'pie') {
            // Prepare data for bar or pie chart
            const labels = members.map(member => member.name);
            const data = members.map(member => member.amount);
            const backgroundColor = generateColors(members.length);
            
            chartData = {
                labels: labels,
                datasets: [{
                    label: 'Savings Amount',
                    data: data,
                    backgroundColor: backgroundColor
                }]
            };
            
            options = {
                responsive: true,
                plugins: {
                    legend: {
                        position: chartType === 'pie' ? 'right' : 'top',
                    },
                    title: {
                        display: true,
                        text: 'Member Contributions'
                    }
                }
            };
        } else if (chartType === 'line') {
            // Create a timeline of total savings
            // For simplicity, we'll use the contribution history
            const timeline = [];
            let runningTotal = 0;
            
            // Get all contributions sorted by date
            const allContributions = [];
            members.forEach(member => {
                if (member.history) {
                    member.history.forEach(h => {
                        allContributions.push({
                            date: h.date,
                            amount: h.amount
                        });
                    });
                }
            });
            
            // Sort by date
            allContributions.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Create cumulative timeline
            allContributions.forEach(contribution => {
                runningTotal += contribution.amount;
                timeline.push({
                    date: contribution.date,
                    amount: runningTotal
                });
            });
            
            // If no contributions, add starting point
            if (timeline.length === 0) {
                timeline.push({
                    date: new Date().toISOString().split('T')[0],
                    amount: 0
                });
            }
            
            chartData = {
                labels: timeline.map(t => t.date),
                datasets: [{
                    label: 'Total Savings Over Time',
                    data: timeline.map(t => t.amount),
                    fill: false,
                    borderColor: '#3498db',
                    tension: 0.1
                }]
            };
            
            options = {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Savings Growth Over Time'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount ($)'
                        }
                    }
                }
            };
        }
        
        // Create chart
        chartInstance = new Chart(ctx, {
            type: chartType,
            data: chartData,
            options: options
        });
    }
    
    function generateColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = (i * 137) % 360; // Using golden angle for good distribution
            colors.push(`hsl(${hue}, 70%, 60%)`);
        }
        return colors;
    }
    
    function openAddMemberModal() {
        // Reset form
        document.getElementById('memberName').value = '';
        document.getElementById('initialAmount').value = '';
        document.getElementById('memberEmail').value = '';
        
        // Show modal
        addMemberModal.style.display = 'block';
    }
    
    function openMemberDetails(index) {
        selectedMemberIndex = index;
        const member = members[index];
        
        // Populate member details
        document.getElementById('detailsName').textContent = member.name;
        document.getElementById('detailsAmount').textContent = formatCurrency(member.amount, 'USD');
        document.getElementById('detailsDate').textContent = member.lastContribution || 'No contributions';
        document.getElementById('detailsEmail').textContent = member.email;
        
        // Reset contribution input
        document.getElementById('addContribution').value = '';
        
        // Populate contribution history
        const historyList = document.getElementById('detailsHistory');
        historyList.innerHTML = '';
        
        if (member.history && member.history.length > 0) {
            member.history.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            member.history.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.date}</span>
                    <span>${formatCurrency(item.amount, 'USD')}</span>
                `;
                historyList.appendChild(li);
            });
        } else {
            historyList.innerHTML = '<li>No contribution history</li>';
        }
        
        // Show modal
        memberDetailsModal.style.display = 'block';
    }
    
    function addMember(e) {
        e.preventDefault();
        
        const name = document.getElementById('memberName').value.trim();
        const amount = parseFloat(document.getElementById('initialAmount').value) || 0;
        const email = document.getElementById('memberEmail').value.trim();
        
        if (!name) {
            alert('Please enter a name for the member');
            return;
        }
        
        const today = new Date().toISOString().split('T')[0];
        
        const newMember = {
            name,
            amount,
            email,
            lastContribution: amount > 0 ? today : null,
            history: amount > 0 ? [{date: today, amount}] : []
        };
        
        members.push(newMember);
        saveData();
        
        // Close modal and update UI
        addMemberModal.style.display = 'none';
        renderMembers();
        updateDashboard();
        updateChart();
    }
    
    function addContribution() {
        if (selectedMemberIndex === -1) return;
        
        const contributionAmount = parseFloat(document.getElementById('addContribution').value);
        if (isNaN(contributionAmount) || contributionAmount <= 0) {
            alert('Please enter a valid contribution amount');
            return;
        }
        
        const today = new Date().toISOString().split('T')[0];
        const member = members[selectedMemberIndex];
        
        // Add to member's amount
        member.amount += contributionAmount;
        member.lastContribution = today;
        
        // Add to history
        if (!member.history) member.history = [];
        member.history.push({
            date: today,
            amount: contributionAmount
        });
        
        saveData();
        
        // Update UI
        memberDetailsModal.style.display = 'none';
        renderMembers();
        updateDashboard();
        updateChart();
    }
    
    function setGoal() {
        const goal = parseFloat(goalInputEl.value);
        const date = goalDateEl.value;
        
        if (isNaN(goal) || goal <= 0) {
            alert('Please enter a valid goal amount');
            return;
        }
        
        savingsGoal = goal;
        goalDate = date;
        saveData();
        updateDashboard();
    }
});