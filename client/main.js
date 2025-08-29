// Data Storage
let restaurants = [
    {
        id: 1,
        name: "Bella Vista",
        address: "Rua das Flores, 123 - Centro",
        phone: "(11) 1234-5678",
        description: "Restaurante italiano com vista panorâmica da cidade",
        capacity: 80,
        image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/046606eb-1668-44b3-8093-aea075d82187.png"
    },
    {
        id: 2,
        name: "Sabor do Mar",
        address: "Av. Atlântica, 456 - Copacabana",
        phone: "(11) 9876-5432",
        description: "Especializado em frutos do mar frescos",
        capacity: 60,
        image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d34c40ee-4bde-4eca-acf8-479715fb0e6e.png"
    },
    {
        id: 3,
        name: "Churrascaria Gaúcha",
        address: "Rua do Comércio, 789 - Bela Vista",
        phone: "(11) 5555-4444",
        description: "Autêntica churrascaria com rodízio completo",
        capacity: 120,
        image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a06c9d58-1b6a-40cd-8432-00d748f102af.png"
    }
];

let reservations = [];
let customers = [];
let nextRestaurantId = 4;
let nextReservationId = 1;
let nextCustomerId = 1;
let currentDate = new Date();

// HORÁRIO DE RESERVA
const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
];

// INICIALIZAÇÃO DO SISTEMA
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    generateSampleData();
    showPage('dashboard');
});

function initializeApp() {
    // SETAR DATA MÍNIMA PARA RESERVA
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reservation-date').min = today;
    document.getElementById('filter-date').value = today;

    // SETAR EVENTOS
    setupEventListeners();

    // GERAR TIME SLOTS
    generateTimeSlots();

    // INICIALIZAÇÃO DO CALENDÁRIO
    renderCalendar();
}

function setupEventListeners() {
    document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);
    document.getElementById('mobile-overlay').addEventListener('click', closeSidebar);

    // FILTROS E CALENDÁRIO
    document.getElementById('filter-restaurant').addEventListener('change', filterReservations);
    document.getElementById('filter-status').addEventListener('change', filterReservations);
    document.getElementById('filter-date').addEventListener('change', filterReservations);
    document.getElementById('calendar-restaurant-filter').addEventListener('change', renderCalendar);

    // MUDANÇA DE DATA E RESTAURANTE
    document.getElementById('reservation-date').addEventListener('change', generateTimeSlots);
    document.getElementById('reservation-restaurant').addEventListener('change', generateTimeSlots);
}

function generateSampleData() {
    // GERA DADOS DE AMOSTRA PARA TESTE
    const sampleCustomers = [
        { name: "João Silva", email: "joao@email.com", phone: "(11) 99999-1111" },
        { name: "Maria Santos", email: "maria@email.com", phone: "(11) 99999-2222" },
        { name: "Pedro Oliveira", email: "pedro@email.com", phone: "(11) 99999-3333" }
    ];

    sampleCustomers.forEach(customer => {
        customers.push({
            id: nextCustomerId++,
            ...customer
        });
    });

    // GERAR RESERVAS DE AMOSTRA
    const today = new Date();
    for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + Math.floor(Math.random() * 30));

        reservations.push({
            id: nextReservationId++,
            customerId: customers[Math.floor(Math.random() * customers.length)].id,
            restaurantId: restaurants[Math.floor(Math.random() * restaurants.length)].id,
            date: date.toISOString().split('T')[0],
            time: timeSlots[Math.floor(Math.random() * timeSlots.length)],
            partySize: Math.floor(Math.random() * 8) + 1,
            status: ['confirmada', 'pendente', 'cancelada'][Math.floor(Math.random() * 3)],
            notes: 'Reserva de exemplo'
        });
    }

    updateStats();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');

    if (window.innerWidth < 768) {
        sidebar.classList.toggle('hidden');
        overlay.classList.toggle('active');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');

    if (window.innerWidth < 768) {
        sidebar.classList.add('hidden');
        overlay.classList.remove('active');
    }
}

// NAVEGAÇÃO ENTRE PÁGINAS
function showPage(pageId) {
    // ESCONDER TODAS AS PÁGINAS
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });

    // MOSTRAR PÁGINA SELECIONADA
    document.getElementById(pageId + '-page').classList.remove('hidden');

    // ATUALIZAR TÍTULO
    const titles = {
        'dashboard': { title: 'Dashboard', subtitle: 'Visão geral do sistema' },
        'restaurants': { title: 'Restaurantes', subtitle: 'Gerencie os restaurantes' },
        'reservations': { title: 'Reservas', subtitle: 'Gerencie as reservas' },
        'calendar': { title: 'Calendário', subtitle: 'Visualize as reservas' },
        'analytics': { title: 'Relatórios', subtitle: 'Análises e métricas' },
        'customers': { title: 'Clientes', subtitle: 'Gerencie os clientes' }
    };

    document.getElementById('page-title').textContent = titles[pageId].title;
    document.getElementById('page-subtitle').textContent = titles[pageId].subtitle;

    // ATUALIZAR NAVEGAÇÃO ATIVA
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('bg-purple-100', 'text-purple-700');
    });

    // CARREGAR CONTEÚDO DA PÁGINA
    switch (pageId) {
        case 'dashboard':
            updateStats();
            renderRecentReservations();
            setTimeout(createCharts, 100);
            break;
        case 'restaurants':
            renderRestaurants();
            break;
        case 'reservations':
            renderReservations();
            populateRestaurantFilters();
            break;
        case 'calendar':
            renderCalendar();
            populateCalendarFilters();
            break;
        case 'analytics':
            setTimeout(createAnalyticsCharts, 100);
            break;
        case 'customers':
            renderCustomers();
            break;
    }

    // FECHAR SIDEBAR NO MOBILE
    if (window.innerWidth < 768) {
        closeSidebar();
    }
}

function createCharts() {
    try {
        // RESERVAS POR MÊS E RESTAURANTES MAIS POPULARES
        const ctx1 = document.getElementById('reservationsChart');
        if (ctx1) {
            // Destruir gráfico existente se houver
            if (window.reservationsChartInstance) {
                window.reservationsChartInstance.destroy();
            }

            window.reservationsChartInstance = new Chart(ctx1.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Reservas',
                        data: [12, 19, 15, 25, 22, 30],
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // RESERVAS POR RESTAURANTE
        const ctx2 = document.getElementById('restaurantsChart');
        if (ctx2) {
            // Destruir gráfico existente se houver
            if (window.restaurantsChartInstance) {
                window.restaurantsChartInstance.destroy();
            }

            const restaurantData = restaurants.map(restaurant => {
                const count = reservations.filter(r => r.restaurantId === restaurant.id).length;
                return { name: restaurant.name, count };
            });

            window.restaurantsChartInstance = new Chart(ctx2.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: restaurantData.map(r => r.name),
                    datasets: [{
                        data: restaurantData.map(r => r.count),
                        backgroundColor: ['#4f46e5', '#059669', '#dc2626', '#f59e0b']
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
    } catch (error) {
        console.error('Erro ao criar gráficos:', error);
    }
}

function createAnalyticsCharts() {
    try {
        // OCUPAÇÃO POR DIA DA SEMANA
        const ctx1 = document.getElementById('occupancyChart');
        if (ctx1) {
            // Destruir gráfico existente se houver
            if (window.occupancyChartInstance) {
                window.occupancyChartInstance.destroy();
            }

            window.occupancyChartInstance = new Chart(ctx1.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
                    datasets: [{
                        label: 'Taxa de Ocupação (%)',
                        data: [65, 80, 75, 85, 90, 95, 70],
                        backgroundColor: '#4f46e5'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }

        // TEMPO POPULAR DE RESERVAS
        const ctx2 = document.getElementById('timesChart');
        if (ctx2) {
            // Destruir gráfico existente se houver
            if (window.timesChartInstance) {
                window.timesChartInstance.destroy();
            }

            window.timesChartInstance = new Chart(ctx2.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['11:00', '12:00', '13:00', '18:00', '19:00', '20:00', '21:00'],
                    datasets: [{
                        label: 'Reservas',
                        data: [5, 15, 20, 25, 35, 30, 15],
                        borderColor: '#059669',
                        backgroundColor: 'rgba(5, 150, 105, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    } catch (error) {
        console.error('Erro ao criar gráficos de analytics:', error);
    }
}


// FUNCOES DOS RESTAURANTES
function renderRestaurants() {
    const grid = document.getElementById('restaurants-grid');

    if (restaurants.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">Nenhum restaurante encontrado</div>';
        return;
    }

    grid.innerHTML = restaurants.map(restaurant => `
                <div class="restaurant-card bg-white rounded-xl p-6 shadow-sm">
                    <div class="mb-4">
                        <img src="${restaurant.image}" alt="${restaurant.name}" class="w-full h-48 object-cover rounded-lg">
                    </div>
                    <h4 class="text-lg font-semibold text-gray-800 mb-2">${restaurant.name}</h4>
                    <p class="text-gray-600 text-sm mb-2">${restaurant.address}</p>
                    <p class="text-gray-600 text-sm mb-2">${restaurant.phone}</p>
                    <p class="text-gray-500 text-sm mb-4">${restaurant.description}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-500">Capacidade: ${restaurant.capacity} pessoas</span>
                        <div class="flex space-x-2">
                            <button onclick="editRestaurant(${restaurant.id})" class="text-blue-600 hover:text-blue-800">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteRestaurant(${restaurant.id})" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
}

function openRestaurantModal(restaurantId = null) {
    const modal = document.getElementById('restaurant-modal');
    const form = document.getElementById('restaurant-form');

    if (restaurantId) {
        const restaurant = restaurants.find(r => r.id === restaurantId);
        document.getElementById('restaurant-name').value = restaurant.name;
        document.getElementById('restaurant-address').value = restaurant.address;
        document.getElementById('restaurant-phone').value = restaurant.phone;
        document.getElementById('restaurant-capacity').value = restaurant.capacity;
        document.getElementById('restaurant-description').value = restaurant.description;
        form.dataset.editId = restaurantId;
    } else {
        form.reset();
        delete form.dataset.editId;
    }

    modal.classList.remove('hidden');
}

function closeRestaurantModal() {
    document.getElementById('restaurant-modal').classList.add('hidden');
}

function editRestaurant(id) {
    openRestaurantModal(id);
}

function deleteRestaurant(id) {
    if (confirm('Tem certeza que deseja excluir este restaurante?')) {
        restaurants = restaurants.filter(r => r.id !== id);
        renderRestaurants();
        showNotification('Restaurante excluído com sucesso!', 'success');
    }
}

// FUNCOES DAS RESERVAS
function renderReservations() {
    const tbody = document.getElementById('reservations-table');

    if (reservations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">Nenhuma reserva encontrada</td></tr>';
        return;
    }

    tbody.innerHTML = reservations.map(reservation => {
        const customer = customers.find(c => c.id === reservation.customerId);
        const restaurant = restaurants.find(r => r.id === reservation.restaurantId);

        const statusColors = {
            'confirmada': 'bg-green-100 text-green-800',
            'pendente': 'bg-yellow-100 text-yellow-800',
            'cancelada': 'bg-red-100 text-red-800'
        };

        return `
                    <tr>
                        <td class="px-6 py-4 text-sm text-gray-900">${customer ? customer.name : 'Cliente não encontrado'}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${restaurant ? restaurant.name : 'Restaurante não encontrado'}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${formatDate(reservation.date)}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${reservation.time}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${reservation.partySize}</td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColors[reservation.status]}">
                                ${reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm">
                            <div class="flex space-x-2">
                                <button onclick="editReservation(${reservation.id})" class="text-blue-600 hover:text-blue-800">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteReservation(${reservation.id})" class="text-red-600 hover:text-red-800">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
    }).join('');
}

function renderRecentReservations() {
    const tbody = document.getElementById('recent-reservations');
    const recentReservations = reservations.slice(-5).reverse();

    if (recentReservations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Nenhuma reserva encontrada</td></tr>';
        return;
    }

    tbody.innerHTML = recentReservations.map(reservation => {
        const customer = customers.find(c => c.id === reservation.customerId);
        const restaurant = restaurants.find(r => r.id === reservation.restaurantId);

        const statusColors = {
            'confirmada': 'bg-green-100 text-green-800',
            'pendente': 'bg-yellow-100 text-yellow-800',
            'cancelada': 'bg-red-100 text-red-800'
        };

        return `
                    <tr>
                        <td class="px-6 py-4 text-sm text-gray-900">${customer ? customer.name : 'Cliente não encontrado'}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${restaurant ? restaurant.name : 'Restaurante não encontrado'}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${formatDate(reservation.date)}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${reservation.time}</td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColors[reservation.status]}">
                                ${reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                            </span>
                        </td>
                    </tr>
                `;
    }).join('');
}

function openReservationModal(reservationId = null) {
    const modal = document.getElementById('reservation-modal');
    const form = document.getElementById('reservation-form');

    // POPULAR RESTAURANTES
    const restaurantSelect = document.getElementById('reservation-restaurant');
    restaurantSelect.innerHTML = '<option value="">Selecione um restaurante</option>' +
        restaurants.map(r => `<option value="${r.id}">${r.name}</option>`).join('');

    if (reservationId) {
        const reservation = reservations.find(r => r.id === reservationId);
        const customer = customers.find(c => c.id === reservation.customerId);

        document.getElementById('customer-name').value = customer.name;
        document.getElementById('customer-email').value = customer.email;
        document.getElementById('customer-phone').value = customer.phone;
        document.getElementById('reservation-restaurant').value = reservation.restaurantId;
        document.getElementById('reservation-date').value = reservation.date;
        document.getElementById('party-size').value = reservation.partySize;
        document.getElementById('reservation-notes').value = reservation.notes;

        form.dataset.editId = reservationId;
        generateTimeSlots();

        setTimeout(() => {
            const timeSlot = document.querySelector(`[data-time="${reservation.time}"]`);
            if (timeSlot) {
                timeSlot.click();
            }
        }, 100);
    } else {
        form.reset();
        delete form.dataset.editId;
        generateTimeSlots();
    }

    modal.classList.remove('hidden');
}

function closeReservationModal() {
    document.getElementById('reservation-modal').classList.add('hidden');
}

function editReservation(id) {
    openReservationModal(id);
}

function deleteReservation(id) {
    if (confirm('Tem certeza que deseja excluir esta reserva?')) {
        reservations = reservations.filter(r => r.id !== id);
        renderReservations();
        updateStats();
        showNotification('Reserva excluída com sucesso!', 'success');
    }
}

function generateTimeSlots() {
    const container = document.getElementById('time-slots');
    const selectedDate = document.getElementById('reservation-date').value;
    const selectedRestaurant = document.getElementById('reservation-restaurant').value;

    if (!selectedDate || !selectedRestaurant) {
        container.innerHTML = '<p class="text-gray-500 text-sm col-span-2">Selecione um restaurante e data primeiro</p>';
        return;
    }

    // VERIFICAR HORÁRIOS OCUPADOS
    const occupiedTimes = reservations
        .filter(r => r.date === selectedDate && r.restaurantId == selectedRestaurant && r.status !== 'cancelada')
        .map(r => r.time);

    container.innerHTML = timeSlots.map(time => {
        const isOccupied = occupiedTimes.includes(time);
        return `
                    <div class="time-slot ${isOccupied ? 'unavailable' : ''}" 
                         data-time="${time}" 
                         onclick="${isOccupied ? '' : 'selectTimeSlot(this)'}">
                        ${time}
                    </div>
                `;
    }).join('');
}

function selectTimeSlot(element) {
    // REMOVER SELEÇÃO ANTERIOR
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });

    // SELECIONAR NOVO HORÁRIO
    element.classList.add('selected');
}

// FUNCOES DO CALENDÁRIO
function renderCalendar() {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    document.getElementById('calendar-month-year').textContent =
        `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendarDays = document.getElementById('calendar-days');
    calendarDays.innerHTML = '';

    const selectedRestaurant = document.getElementById('calendar-restaurant-filter').value;

    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const dateStr = date.toISOString().split('T')[0];
        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
        const isToday = dateStr === new Date().toISOString().split('T')[0];

        // VERIFICAR SE TEM RESERVAS
        const dayReservations = reservations.filter(r => {
            const matchesDate = r.date === dateStr;
            const matchesRestaurant = !selectedRestaurant || r.restaurantId == selectedRestaurant;
            return matchesDate && matchesRestaurant && r.status !== 'cancelada';
        });

        const hasReservations = dayReservations.length > 0;

        let classes = 'calendar-day';
        if (!isCurrentMonth) classes += ' text-gray-300';
        if (isToday) classes += ' today';
        if (hasReservations) classes += ' has-reservation';

        const dayElement = document.createElement('div');
        dayElement.className = classes;
        dayElement.textContent = date.getDate();
        dayElement.title = hasReservations ? `${dayReservations.length} reserva(s)` : '';

        dayElement.addEventListener('click', () => showDayReservations(dateStr));

        calendarDays.appendChild(dayElement);
    }
}

function showDayReservations(dateStr) {
    const selectedRestaurant = document.getElementById('calendar-restaurant-filter').value;
    const dayReservations = reservations.filter(r => {
        const matchesDate = r.date === dateStr;
        const matchesRestaurant = !selectedRestaurant || r.restaurantId == selectedRestaurant;
        return matchesDate && matchesRestaurant && r.status !== 'cancelada';
    });

    const reservationsSection = document.getElementById('selected-day-reservations');
    const selectedDateSpan = document.getElementById('selected-date');
    const reservationsList = document.getElementById('day-reservations-list');

    // Formatar data para exibição
    const date = new Date(dateStr + 'T00:00:00');
    const formattedDate = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    selectedDateSpan.textContent = formattedDate;

    if (dayReservations.length === 0) {
        reservationsList.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhuma reserva encontrada para este dia.</p>';
    } else {
        reservationsList.innerHTML = dayReservations.map(reservation => {
            const customer = customers.find(c => c.id === reservation.customerId);
            const restaurant = restaurants.find(r => r.id === reservation.restaurantId);

            return `
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div class="flex justify-between items-start">
                                <div class="flex-1">
                                    <h6 class="font-semibold text-gray-800">${customer.name}</h6>
                                    <p class="text-sm text-gray-600">${restaurant.name}</p>
                                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                        <span><i class="fas fa-clock mr-1"></i>${reservation.time}</span>
                                        <span><i class="fas fa-users mr-1"></i>${reservation.partySize} pessoas</span>
                                        <span class="px-2 py-1 rounded-full text-xs ${getStatusColor(reservation.status)}">${reservation.status}</span>
                                    </div>
                                    ${reservation.notes ? `<p class="text-sm text-gray-600 mt-2">${reservation.notes}</p>` : ''}
                                </div>
                                <div class="flex space-x-2">
                                    <button onclick="editReservation(${reservation.id})" class="text-blue-600 hover:text-blue-800">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deleteReservation(${reservation.id})" class="text-red-600 hover:text-red-800">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
        }).join('');
    }

    reservationsSection.classList.remove('hidden');

    // Scroll suave para a seção de reservas
    reservationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    document.getElementById('selected-day-reservations').classList.add('hidden');
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    document.getElementById('selected-day-reservations').classList.add('hidden');
}

// FUNCOES DOS CLIENTES
function renderCustomers() {
    const tbody = document.getElementById('customers-table');

    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Nenhum cliente encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = customers.map(customer => {
        const customerReservations = reservations.filter(r => r.customerId === customer.id);

        return `
                    <tr>
                        <td class="px-6 py-4 text-sm text-gray-900">${customer.name}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${customer.email}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${customer.phone}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${customerReservations.length}</td>
                        <td class="px-6 py-4 text-sm">
                            <div class="flex space-x-2">
                                <button onclick="editCustomer(${customer.id})" class="text-blue-600 hover:text-blue-800">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteCustomer(${customer.id})" class="text-red-600 hover:text-red-800">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
    }).join('');
}

function openCustomerModal(customerId = null) {
    const modal = document.getElementById('customer-modal');
    const form = document.getElementById('customer-form');

    if (customerId) {
        const customer = customers.find(c => c.id === customerId);
        document.getElementById('new-customer-name').value = customer.name;
        document.getElementById('new-customer-email').value = customer.email;
        document.getElementById('new-customer-phone').value = customer.phone;
        form.dataset.editId = customerId;
    } else {
        form.reset();
        delete form.dataset.editId;
    }

    modal.classList.remove('hidden');
}

function closeCustomerModal() {
    document.getElementById('customer-modal').classList.add('hidden');
}

function editCustomer(id) {
    openCustomerModal(id);
}

function deleteCustomer(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        customers = customers.filter(c => c.id !== id);
        renderCustomers();
        showNotification('Cliente excluído com sucesso!', 'success');
    }
}

// FUNCOES DE FILTRO
function populateRestaurantFilters() {
    const filterSelect = document.getElementById('filter-restaurant');
    filterSelect.innerHTML = '<option value="">Todos os restaurantes</option>' +
        restaurants.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
}

function populateCalendarFilters() {
    const filterSelect = document.getElementById('calendar-restaurant-filter');
    filterSelect.innerHTML = '<option value="">Todos os restaurantes</option>' +
        restaurants.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
}

function filterReservations() {
    const restaurantFilter = document.getElementById('filter-restaurant').value;
    const statusFilter = document.getElementById('filter-status').value;
    const dateFilter = document.getElementById('filter-date').value;

    // IMPLEMENTAR LÓGICA DE FILTRO AQUI
    renderReservations();
}

function clearFilters() {
    document.getElementById('filter-restaurant').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-date').value = new Date().toISOString().split('T')[0];
    filterReservations();
}

// FUNCOES DE FORMULÁRIO
document.getElementById('restaurant-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('restaurant-name').value,
        address: document.getElementById('restaurant-address').value,
        phone: document.getElementById('restaurant-phone').value,
        capacity: parseInt(document.getElementById('restaurant-capacity').value),
        description: document.getElementById('restaurant-description').value,
        image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/046606eb-1668-44b3-8093-aea075d82187.png"
    };

    if (this.dataset.editId) {
        // EDITAR RESTAURANTE
        const id = parseInt(this.dataset.editId);
        const index = restaurants.findIndex(r => r.id === id);
        restaurants[index] = { ...restaurants[index], ...formData };
        showNotification('Restaurante atualizado com sucesso!', 'success');
    } else {
        // NOVO RESTAURANTE
        restaurants.push({
            id: nextRestaurantId++,
            ...formData
        });
        showNotification('Restaurante adicionado com sucesso!', 'success');
    }

    closeRestaurantModal();
    renderRestaurants();
    updateStats();
});

document.getElementById('reservation-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const selectedTimeSlot = document.querySelector('.time-slot.selected');
    if (!selectedTimeSlot) {
        showNotification('Selecione um horário para a reserva', 'error');
        return;
    }

    // VERIFICAR SE CLIENTE JÁ EXISTE
    const customerEmail = document.getElementById('customer-email').value;
    let customer = customers.find(c => c.email === customerEmail);

    if (!customer) {
        // CRIAR NOVO CLIENTE
        customer = {
            id: nextCustomerId++,
            name: document.getElementById('customer-name').value,
            email: customerEmail,
            phone: document.getElementById('customer-phone').value
        };
        customers.push(customer);
    }

    const reservationData = {
        customerId: customer.id,
        restaurantId: parseInt(document.getElementById('reservation-restaurant').value),
        date: document.getElementById('reservation-date').value,
        time: selectedTimeSlot.dataset.time,
        partySize: parseInt(document.getElementById('party-size').value),
        status: 'confirmada',
        notes: document.getElementById('reservation-notes').value
    };

    if (this.dataset.editId) {
        // EDITAR RESERVA
        const id = parseInt(this.dataset.editId);
        const index = reservations.findIndex(r => r.id === id);
        reservations[index] = { ...reservations[index], ...reservationData };
        showNotification('Reserva atualizada com sucesso!', 'success');
    } else {
        // NOVA RESERVA
        reservations.push({
            id: nextReservationId++,
            ...reservationData
        });
        showNotification('Reserva criada com sucesso!', 'success');
    }

    closeReservationModal();
    renderReservations();
    updateStats();
});

document.getElementById('customer-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('new-customer-name').value,
        email: document.getElementById('new-customer-email').value,
        phone: document.getElementById('new-customer-phone').value
    };

    if (this.dataset.editId) {
        // EDITAR CLIENTE
        const id = parseInt(this.dataset.editId);
        const index = customers.findIndex(c => c.id === id);
        customers[index] = { ...customers[index], ...formData };
        showNotification('Cliente atualizado com sucesso!', 'success');
    } else {
        // NOVO CLIENTE
        customers.push({
            id: nextCustomerId++,
            ...formData
        });
        showNotification('Cliente adicionado com sucesso!', 'success');
    }

    closeCustomerModal();
    renderCustomers();
});

// FUNCOES UTILITÁRIAS
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => r.date === today && r.status !== 'cancelada');

    document.getElementById('total-reservations').textContent = reservations.filter(r => r.status !== 'cancelada').length;
    document.getElementById('today-reservations').textContent = todayReservations.length;
    document.getElementById('total-restaurants').textContent = restaurants.length;
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// FECHAR MODAIS AO CLICAR FORA
window.addEventListener('click', function (e) {
    const modals = ['restaurant-modal', 'reservation-modal', 'customer-modal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

// RESPONSIVIDADE
window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) {
        document.getElementById('sidebar').classList.remove('hidden');
        document.getElementById('mobile-overlay').classList.remove('active');
    } else {
        document.getElementById('sidebar').classList.add('hidden');
    }
});

function getStatusColor(status) {
    switch (status) {
        case 'confirmada':
            return 'bg-green-100 text-green-800';
        case 'pendente':
            return 'bg-yellow-100 text-yellow-800';
        case 'cancelada':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function exportCustomers() {
    const data = customers.map(customer => ({
        Nome: customer.name || 'Registrado sem nome',
        Email: customer.email || 'Registrado sem email',
        Telefone: customer.phone || 'Registrado sem telefone',
        'Total Reservas': customer.totalReservations || 0,
        'Última Reserva': customer.lastReservation || 'Sem horário'
    }));

    const csv = convertToCSV(data);
    downloadCSV(csv, 'clientes.csv');
    showNotification('Dados exportados com sucesso!', 'success');
}

// FUNÇÕES GERAIS
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function convertToCSV(data) {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    return csvContent;
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}