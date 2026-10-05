document.addEventListener('DOMContentLoaded', () => {

  // --- Toggle password visibility ---
  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      const icon = btn.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('bi-eye', 'bi-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('bi-eye-slash', 'bi-eye');
      }
    });
  });

  // --- Password strength meter ---
  const regPass = document.getElementById('regPass');
  if (regPass) {
    regPass.addEventListener('input', () => {
      const val = regPass.value;
      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const bar = document.getElementById('passStrengthBar');
      const label = document.getElementById('passStrengthLabel');
      const levels = [
        { w: '25%', bg: '#dc3545', t: 'Weak' },
        { w: '50%', bg: '#fd7e14', t: 'Fair' },
        { w: '75%', bg: '#ffc107', t: 'Good' },
        { w: '100%', bg: '#198754', t: 'Strong' },
      ];
      const level = levels[Math.max(0, score - 1)];
      if (val) {
        bar.style.width = level.w;
        bar.style.background = level.bg;
        label.textContent = level.t;
        label.style.color = level.bg;
      } else {
        bar.style.width = '0%';
        label.textContent = '';
      }
    });
  }

  // --- Login form ---
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
      }
      // Simulate success
      document.getElementById('loginSuccess').classList.remove('d-none');
      setTimeout(() => { window.location.href = '../index.html'; }, 1500);
    });
  }

  // --- Register form ---
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const pass = document.getElementById('regPass').value;
      const confirm = document.getElementById('confirmPass');

      if (confirm.value !== pass) {
        confirm.classList.add('is-invalid');
        document.getElementById('confirmFeedback').textContent = 'Passwords must match.';
        return;
      } else {
        confirm.classList.remove('is-invalid');
      }

      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
      }
      document.getElementById('registerSuccess').classList.remove('d-none');
      setTimeout(() => { window.location.href = '../index.html'; }, 1800);
    });

    // Live confirm password check
    const confirmPass = document.getElementById('confirmPass');
    if (confirmPass) {
      confirmPass.addEventListener('input', () => {
        const pass = document.getElementById('regPass').value;
        if (confirmPass.value !== pass) {
          confirmPass.classList.add('is-invalid');
        } else {
          confirmPass.classList.remove('is-invalid');
          confirmPass.classList.add('is-valid');
        }
      });
    }
  }
});
