const status = document.getElementById('status');
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const ws = new WebSocket('ws://localhost:3000');

function setStstus(value, color){
    status.innerHTML = value;
    status.classList.add(color)

}

function printMessage(value) {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = "> "+value;
    messages.appendChild(li);
}

form.addEventListener('submit', event => {
    event.preventDefault();
    ws.send(input.value);
    input.value = "";
})

ws.onopen = () => { setStstus('ONLINE', 'text-success') }
ws.onclose = () => { setStstus('DISCONNECT', 'text-danger') }
ws.onmessage = response => { 
    printMessage(response.data)
 }




