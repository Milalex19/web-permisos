document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value; // contraseña ingresada por el usuario

    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const user = await response.json();

        if (user && user.role) {
            if (user.role === 'supervisor') {
                window.location.href = '../html/supervisor.html';
            } else if (user.role === 'trabajador') {
                window.location.href = '../html/trabajador.html';
            } else {
                alert('Rol de usuario no reconocido');
            }
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        alert('Error al conectarse con el servidor');
    }
});

// Event listeners para las funcionalidades
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    window.location.href = '../html/login.html';
});

document.getElementById('solicitarPermiso')?.addEventListener('click', loadSolicitarPermisoForm);
document.getElementById('visualizarPermisos')?.addEventListener('click', loadVisualizarPermisos);
document.getElementById('crearPermiso')?.addEventListener('click', loadCrearPermisoForm);
document.getElementById('autorizarPermiso')?.addEventListener('click', loadAutorizarPermisoForm);
document.getElementById('verGraficos')?.addEventListener('click', loadGraficos);

function loadSolicitarPermisoForm() {
    document.getElementById('contentArea').innerHTML = `
        <h3>Solicitar Permiso</h3>
        <form id="permisoForm">
            <div class="mb-3">
                <label for="tipoPermiso" class="form-label">Tipo de Permiso</label>
                <select class="form-select" id="tipoPermiso" required>                    
                    <option value="cita medica">Cita Medica</option>
                    <option value="calamida domestica">Calamidad Domestica</option>
                    <option value="permiso personal">Permiso Personal</option>
                    <option value="otro">Otro</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="tiempoPermiso" class="form-label">Tiempo del Permiso</label>
                <select class="form-select" id="tiempoPermiso" required>
                    <option value="hora">Por Hora</option>
                    <option value="dia">Por Día</option>
                </select>
            </div>
            <div id="horaFields">
                <div class="mb-3">
                    <label for="horaInicio" class="form-label">Hora de Inicio</label>
                    <input type="time" class="form-control" id="horaInicio" required>
                </div>
                <div class="mb-3">
                    <label for="horaFin" class="form-label">Hora de Fin</label>
                    <input type="time" class="form-control" id="horaFin" required>
                </div>
            </div>
            <div id="diaFields" class="d-none">
                <div class="mb-3">
                    <label for="diaInicio" class="form-label">Día de Inicio</label>
                    <input type="date" class="form-control" id="diaInicio" required>
                </div>
                <div class="mb-3">
                    <label for="diaFin" class="form-label">Día de Fin</label>
                    <input type="date" class="form-control" id="diaFin" required>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Enviar Solicitud</button>
        </form>
    `;

    document.getElementById('tiempoPermiso').addEventListener('change', function() {
        const tiempoPermiso = document.getElementById('tiempoPermiso').value;
        document.getElementById('horaFields').classList.toggle('d-none', tiempoPermiso === 'dia');
        document.getElementById('diaFields').classList.toggle('d-none', tiempoPermiso === 'hora');
    });

    // Manejo del envío del formulario
    document.getElementById('permisoForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        // Aquí puedes agregar la lógica para enviar la solicitud de permiso
        alert('Solicitud enviada con éxito');
    });
}

function loadVisualizarPermisos() {
    document.getElementById('contentArea').innerHTML = `
        <h3>Permisos Activos</h3>
        <!-- Aquí puedes agregar un listado de permisos activos -->
    `;
}

function loadCrearPermisoForm() {
    document.getElementById('contentArea').innerHTML = `
        <h3>Crear Permiso</h3>
        <form id="crearPermisoForm">
            <div class="mb-3">
                <label for="nombreTrabajador" class="form-label">Nombre del Trabajador</label>
                <input type="text" class="form-control" id="nombreTrabajador" required>
            </div>
            <div class="mb-3">
                <label for="tipoPermiso" class="form-label">Tipo de Permiso</label>
                <select class="form-select" id="tipoPermisoCrear" required>
                    <option value="cita medica">Cita Medica</option>
                    <option value="calamida domestica">Calamidad Domestica</option>
                    <option value="permiso personal">Permiso Personal</option>
                    <option value="otro">Otro</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="tiempoPermiso" class="form-label">Tiempo de Permiso</label>
                <select class="form-select" id="tiempoPermisoCrear" required>
                    <option value="hora">Por Hora</option>
                    <option value="dia">Por Día</option>
                </select>
            </div>
            <div id="horaFieldsCrear">
                <div class="mb-3">
                    <label for="horaInicioCrear" class="form-label">Hora de Inicio</label>
                    <input type="time" class="form-control" id="horaInicioCrear" required>
                </div>
                <div class="mb-3">
                    <label for="horaFinCrear" class="form-label">Hora de Fin</label>
                    <input type="time" class="form-control" id="horaFinCrear" required>
                </div>
            </div>
            <div id="diaFieldsCrear" class="d-none">
                <div class="mb-3">
                    <label for="diaInicioCrear" class="form-label">Día de Inicio</label>
                    <input type="date" class="form-control" id="diaInicioCrear" required>
                </div>
                <div class="mb-3">
                    <label for="diaFinCrear" class="form-label">Día de Fin</label>
                    <input type="date" class="form-control" id="diaFinCrear" required>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Crear Permiso</button>
        </form>
    `;

    document.getElementById('tiempoPermisoCrear').addEventListener('change', function() {
        const tiempoPermiso = document.getElementById('tiempoPermisoCrear').value;
        document.getElementById('horaFieldsCrear').classList.toggle('d-none', tiempoPermiso === 'dia');
        document.getElementById('diaFieldsCrear').classList.toggle('d-none', tiempoPermiso === 'hora');
    });

    // Manejo del envío del formulario de creación de permiso
    document.getElementById('crearPermisoForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        // Aquí puedes agregar la lógica para crear el permiso
        alert('Permiso creado con éxito');
    });
}


document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data); // Log de la respuesta

        if (!response.ok) {
            alert(data.message || 'Error al registrar usuario');
        } else {
            alert('Usuario registrado con éxito');
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
});



function loadAutorizarPermisoForm() {
    document.getElementById('contentArea').innerHTML = `
        <h3>Autorizar Permiso</h3>
        <!-- Aquí puedes agregar un formulario o lista de permisos pendientes de autorización -->
    `;
}

function loadGraficos() {
    document.getElementById('contentArea').innerHTML = `
        <h3>Gráficos de Análisis</h3>
        <canvas id="myChart"></canvas>
    `;

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
            datasets: [{
                label: '# de Permisos',
                data: [12, 19, 3, 5, 2],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

