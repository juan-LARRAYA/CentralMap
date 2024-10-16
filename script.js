// Función para añadir más inputs
document.getElementById('addInputBtn').addEventListener('click', function() {
    const addressInputs = document.getElementById('addressInputs');
    const newInputDiv = document.createElement('div');
    newInputDiv.classList.add('row', 'address-input');
    newInputDiv.innerHTML = `
        <div class="col-10">
            <input type="text" class="form-control" name="address[]" placeholder="Ingresa la dirección">
        </div>
    `;
    addressInputs.appendChild(newInputDiv);
});

// Función para calcular el punto medio
document.getElementById('calculateBtn').addEventListener('click', async function() {
    const form = document.getElementById('addressForm');
    const formData = new FormData(form);
    const addresses = formData.getAll('address[]').filter(address => address.trim() !== '');

    if (addresses.length < 2) {
        alert('Por favor ingresa al menos dos direcciones.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ addresses: addresses })
        });

        const result = await response.json();
        document.getElementById('result').textContent = `Centro de masa (Latitud, Longitud): ${result.center}`;
    } catch (error) {
        console.error('Error al calcular el punto medio:', error);
        document.getElementById('result').textContent = 'Ocurrió un error al calcular el punto medio.';
    }
});
