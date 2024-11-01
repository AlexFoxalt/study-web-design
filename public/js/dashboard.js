// Make authenticated requests
async function makeAuthenticatedRequest(url, options = {}) {
  const token = localStorage.getItem('token');
  if (!token) {
    redirectToLogin();
    return;
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, options);
  if (response.status === 401) {
    redirectToLogin();
    return;
  }

  return response;
}

function redirectToLogin() {
  window.location.href = '/login';
}

function showPopup(message, isError = false) {
  const popup = document.getElementById('popup');
  popup.textContent = message;
  popup.className = 'popup';
  if (isError) {
    popup.classList.add('error');
  }
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
  }, 3000);
}

function copyText(element) {
  navigator.clipboard
    .writeText(element.textContent)
    .then(() => {
      alert('Text copied to clipboard!');
    })
    .catch((err) => {
      console.error('Could not copy text: ', err);
    });
}

function showClientDetails(client) {
  const clientDetailsList = document.getElementById('clientDetailsList');
  const dateOfBirth = new Date(client.dateOfBirth);
  const dateCreated = new Date(client.dateCreated);
  clientDetailsList.innerHTML = `
      <li><strong>First Name:</strong> ${client.firstName}</li>
      <li><strong>Last Name:</strong> ${client.lastName}</li>
      <li><strong>Phone Number:</strong> ${client.phoneNumber}</li>
      <li><strong>Car Number:</strong> ${client.carNumber || 'N/A'}</li>
      <li><strong>Date of Birth:</strong> ${dateOfBirth.toDateString()}</li>
      <li><strong>Date Created:</strong> ${dateCreated.toDateString()}</li>
    `;
  document.getElementById('clientDetailsModal').style.display = 'block';

  const deleteClientButton = document.getElementById('deleteClientButton');
  deleteClientButton.dataset.clientId = client.id;
}

async function fetchClients() {
  try {
    const clients = await (await makeAuthenticatedRequest('/clients')).json();
    const clientList = document.getElementById('clientList');
    const clientSelect = document.getElementById('client');

    clientList.innerHTML = '';
    clientSelect.innerHTML = '';

    clients.forEach((client) => {
      const clientTile = document.createElement('div');
      clientTile.classList.add('client-tile');
      clientTile.dataset.clientId = client.id;
      clientTile.innerHTML = `
            <h3>${client.firstName} ${client.lastName}</h3>
            <p>Car: ${client.carNumber || 'N/A'}</p>
          `;
      clientList.appendChild(clientTile);

      const option = document.createElement('option');
      option.value = client.id;
      option.textContent = `${client.firstName} ${client.lastName}`;
      clientSelect.appendChild(option);
    });
    addClientTileEventListeners(clients);
  } catch (err) {
    console.error('Error fetching clients:', err);
    showPopup('Error fetching clients', true);
  }
}

async function fetchCourts() {
  try {
    const courts = await (await makeAuthenticatedRequest('/courts')).json();
    const container = document.getElementById('courtsSwitch');
    while (container.firstChild) {
      container.firstChild.remove();
    }

    const memoryCourtId = localStorage.getItem('activeCourtId');
    if (!memoryCourtId) {
      localStorage.setItem('activeCourtId', courts[0].id);
      var activeCourtId = parseInt(courts[0].id);
    } else {
      var activeCourtId = parseInt(memoryCourtId);
    }

    courts.forEach((court) => {
      const courtContainer = document.createElement('div');
      courtContainer.classList.add('court-container');

      const button = document.createElement('img');
      button.src = 'courtInactive.jpg';
      button.alt = court.name;
      button.classList.add('court-button');
      button.dataset.courtId = court.id;
      button.addEventListener('click', (e) => {
        switchCourt(court.id);

        document.querySelectorAll('.court-button').forEach((btn) => {
          btn.src = 'courtInactive.jpg';
          btn.classList.remove('active');
          btn.parentElement.classList.remove('active');
        });
        e.target.src = `${court.surface_type}Court.jpg`;
        e.target.classList.add('active');
        e.target.parentElement.classList.add('active');

        document.querySelectorAll('.court-name').forEach((name) => {
          name.classList.remove('active');
        });
        courtName.classList.add('active');
      });

      const courtName = document.createElement('span');
      courtName.innerText = court.name;
      courtName.classList.add('court-name');

      if (court.id === activeCourtId) {
        button.src = `${court.surface_type}Court.jpg`;
        button.classList.add('active');
        courtName.classList.add('active');
        courtContainer.classList.add('active');
      }

      courtContainer.appendChild(button);
      courtContainer.appendChild(courtName);
      container.appendChild(courtContainer);
    });
    const addCourtBtnContainer = document.createElement('div');
    addCourtBtnContainer.classList.add('court-container');
    const addCourtBtn = document.createElement('button');
    addCourtBtn.id = 'addCourtButton';
    addCourtBtn.classList.add('add-court-button');
    addCourtBtn.textContent = '+';
    addCourtBtn.title = 'Add court';
    addCourtBtnContainer.appendChild(addCourtBtn);
    container.appendChild(addCourtBtnContainer);

    document.getElementById('addCourtButton').addEventListener('click', (e) => {
      document.getElementById('courtModal').style.display = 'block';
    });
  } catch (err) {
    console.error('Error fetching courts:', err);
    showPopup('Error fetching courts', true);
  }
}

fetchCourts();

function switchCourt(courtId) {
  localStorage.setItem('activeCourtId', courtId);
  document.getElementById('court').value = courtId;
  generateScheduleTable();
}

document.getElementById('clientForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const clientData = Object.fromEntries(formData.entries());

  try {
    const response = await makeAuthenticatedRequest('/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });
    const responseJson = await response.json();
    if (response.status === 400) {
      showPopup(responseJson.message, true);
    } else {
      document.getElementById('clientForm').reset();
      fetchClients();
      showPopup('Client added successfully');
    }
  } catch (err) {
    console.error('Error adding client:', err);
    showPopup(err.message, true);
  }
});

fetchClients();

async function generateScheduleTable() {
  const tableHeader = document.getElementById('tableHeader');
  const tableBody = document.getElementById('tableBody');
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const today = new Date();
  const currentHour = today.getHours();
  const activeCourtId = localStorage.getItem('activeCourtId');

  tableHeader.innerHTML = '';
  tableBody.innerHTML = '';

  const timeSlots = await (
    await makeAuthenticatedRequest('/time-slots')
  ).json();
  const bookings = await (
    await makeAuthenticatedRequest(`/bookings/${activeCourtId}`)
  ).json();

  const timeHeaderCell = document.createElement('th');
  timeHeaderCell.textContent = 'Time Slots';
  tableHeader.appendChild(timeHeaderCell);

  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    const dayName = daysOfWeek[day.getDay()];
    const dayNumber = day.getDate().toString().padStart(2, '0');
    const monthNumber = (day.getMonth() + 1).toString().padStart(2, '0');
    const headerCell = document.createElement('th');

    if (i === 0) {
      headerCell.classList.add('today');
      headerCell.innerHTML = `${dayName} (today)<br>${dayNumber}.${monthNumber}`;
    } else {
      headerCell.innerHTML = `${dayName}<br>${dayNumber}.${monthNumber}`;
    }
    tableHeader.appendChild(headerCell);
  }

  timeSlots.forEach((slot, index) => {
    const row = document.createElement('tr');
    const timeCell = document.createElement('td');
    timeCell.textContent = slot.name;
    row.appendChild(timeCell);
    if (parseInt(slot.name.split(':')[0]) === currentHour) {
      row.classList.add('current-time-slot');
    }
    for (let i = 0; i < 7; i++) {
      const cell = document.createElement('td');
      if (i === 0) {
        cell.classList.add('today');
      }
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      const dayNumber = day.getDate().toString().padStart(2, '0');
      const monthNumber = (day.getMonth() + 1).toString().padStart(2, '0');
      const dateString = `${dayNumber}.${monthNumber}`;
      const year = day.getFullYear();
      const bookingDate = `${year}-${monthNumber}-${dayNumber}`;

      const booking = bookings.find(
        (b) =>
          b.time_slot_id === slot.id && b.date.split('T')[0] === bookingDate
      );
      if (booking) {
        cell.innerHTML = `
            <em>${booking.first_name} ${booking.last_name}</em><br>
            <span class="copy-phone-number" onclick="copyText(this)">${booking.phone_number}</span><br>
            ${booking.amount_to_pay}$ / 
            ${booking.paid ? '<font color="#2E7D32">Paid</font>' : '<font color="#D32F2F">Not paid</font>'}
        `;
        cell.classList.add('booked-cell');

        const deleteButton = document.createElement('button');
        deleteButton.title = 'Delete booking';
        deleteButton.textContent = '✖';
        deleteButton.classList.add('delete-booking');
        deleteButton.dataset.bookingId = booking.id;
        cell.appendChild(deleteButton);

        if (!booking.paid) {
          const payButton = document.createElement('button');
          payButton.title = 'Mark as paid';
          payButton.textContent = '$';
          payButton.classList.add('pay-booking');
          payButton.dataset.bookingId = booking.id;
          cell.appendChild(payButton);
        }
      } else {
        const addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.title = 'Add new booking';
        addButton.classList.add('add-booking');
        addButton.dataset.timeSlot = slot.name;
        addButton.dataset.date = dateString;
        cell.appendChild(addButton);
      }
      row.appendChild(cell);
    }
    tableBody.appendChild(row);
  });

  document.querySelectorAll('.add-booking').forEach((button) => {
    button.addEventListener('click', (e) => {
      const timeSlot = e.target.dataset.timeSlot;
      const date = e.target.dataset.date;
      const activeCourtId = localStorage.getItem('activeCourtId');

      document.getElementById('timeSlot').value = timeSlot;
      document.getElementById('date').value = date;
      document.getElementById('court').value = activeCourtId;
      document.getElementById('bookingModal').style.display = 'block';
    });
  });

  document.querySelectorAll('.delete-booking').forEach((button) => {
    button.addEventListener('click', async (e) => {
      const bookingId = e.target.dataset.bookingId;
      try {
        await makeAuthenticatedRequest(`/bookings/${bookingId}`, {
          method: 'DELETE',
        });
        generateScheduleTable();
        showPopup('Booking deleted successfully');
      } catch (err) {
        console.error('Error deleting booking:', err);
        showPopup('Error deleting booking', true);
      }
    });
  });

  document.querySelectorAll('.pay-booking').forEach((button) => {
    button.addEventListener('click', async (e) => {
      const bookingId = e.target.dataset.bookingId;
      try {
        await makeAuthenticatedRequest(`/bookings/pay/${bookingId}`, {
          method: 'POST',
        });
        generateScheduleTable();
        showPopup('Booking paid successfully');
      } catch (err) {
        console.error('Error paying booking:', err);
        showPopup('Error paying booking', true);
      }
    });
  });
}

generateScheduleTable();

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const bookingData = Object.fromEntries(formData.entries());

  try {
    await makeAuthenticatedRequest('/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    document.getElementById('bookingModal').style.display = 'none';
    document.getElementById('bookingForm').reset();
    generateScheduleTable();
    showPopup('Booking created successfully');
  } catch (err) {
    console.error('Error creating booking:', err);
    showPopup('Error booking creating');
  }
});

document.getElementById('courtForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const courtData = Object.fromEntries(formData.entries());

  try {
    const response = await makeAuthenticatedRequest('/courts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courtData),
    });
    const responseJson = await response.json();
    if (response.status === 400) {
      showPopup(responseJson.message, true);
    } else {
      document.getElementById('courtModal').style.display = 'none';
      document.getElementById('courtForm').reset();
      fetchCourts();
      showPopup('Court created successfully');
    }
  } catch (err) {
    console.log(err);
    showPopup('Error creating court', true);
  }
});

function addClientTileEventListeners(clients) {
  document.querySelectorAll('.client-tile').forEach((tile) => {
    tile.addEventListener('click', (e) => {
      const clientId = e.currentTarget.dataset.clientId;
      const client = clients.find((c) => c.id === parseInt(clientId));
      showClientDetails(client);
    });
  });
}

document
  .getElementById('closeAddBookingModal')
  .addEventListener('click', () => {
    document.getElementById('bookingModal').style.display = 'none';
  });

document
  .getElementById('closeClientDetailsModal')
  .addEventListener('click', () => {
    document.getElementById('clientDetailsModal').style.display = 'none';
  });

document.getElementById('closeCourtModal').addEventListener('click', () => {
  document.getElementById('courtModal').style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === document.getElementById('bookingModal')) {
    document.getElementById('bookingModal').style.display = 'none';
  } else if (e.target === document.getElementById('clientDetailsModal')) {
    document.getElementById('clientDetailsModal').style.display = 'none';
  } else if (e.target === document.getElementById('courtModal')) {
    document.getElementById('courtModal').style.display = 'none';
  }
});

document
  .getElementById('deleteClientButton')
  .addEventListener('click', async (e) => {
    const clientId = e.target.dataset.clientId;
    try {
      await makeAuthenticatedRequest(`/clients/${clientId}`, {
        method: 'DELETE',
      });
      document.getElementById('clientDetailsModal').style.display = 'none';
      fetchClients();
      generateScheduleTable();
      showPopup('Client deleted successfully');
    } catch (err) {
      console.error('Error deleting client:', err);
      showPopup('Error deleting client', true);
    }
  });

function handleEscKeyPress(event) {
  if (event.key === 'Escape') {
    document.getElementById('bookingModal').style.display = 'none';
    document.getElementById('clientDetailsModal').style.display = 'none';
    document.getElementById('courtModal').style.display = 'none';
  }
}

document.addEventListener('keydown', handleEscKeyPress);

function updateCurrentTime() {
  const currentTimeElement = document.getElementById('currentTime');
  const now = new Date();
  const day = now.getDate().toString();
  const month = now.toLocaleString('default', { month: 'long' });
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  currentTimeElement.innerHTML = `${month} ${day}<br>${hours}:${minutes}:${seconds}`;
}

setInterval(updateCurrentTime, 1000);
updateCurrentTime();
