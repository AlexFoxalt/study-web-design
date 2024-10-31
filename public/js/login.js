document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();

  if (response.ok) {
    // Store the token in local storage
    localStorage.setItem('token', result.token);
    window.location.href = '/dashboard';
  } else {
    document.getElementById('message').textContent = result.message;
  }
});
