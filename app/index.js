const bearer = localStorage.getItem('bearer')

function isConnected (){
if (localStorage.getItem('bearer') != null) {
    axios.post('localhost:8055/auth/refresh', {
        "refresh_token": localStorage.getItem('refreshToken'),
    })
        .then(response => {
            localStorage.setItem('bearer', response.data.data.access_token)
        })
        .catch(error => {
            logout()
            window.location.href='connexion.html'
        })
}
else {
    logout()
    window.location.href='connexion.html'
}}
//Home

function prograSelection(event, type){
    let day = document.getElementsByClassName("dayChoiceComp selected")[0]
    let scene = document.getElementsByClassName("sceneChoiceComp selected")[0]
    let rm = document.getElementsByClassName(type + "ChoiceComp selected")[0]
    rm.classList.remove("selected");
    if(type === "scene"){
        let actual = document.getElementById(day.id + event.id)
        document.getElementById(day.id + rm.id).style.display = "none"
        actual.style.display = "block"
    }
    else{
        let actual = document.getElementById(event.id + scene.id)
        document.getElementById(rm.id + scene.id).style.display = "none"
        actual.style.display = "block"
    }
    event.classList.add("selected")
}


function recharge(){
    let regex = /^\d{9}$/
    let regex0 = /^\d{10}$/
    let regexMontant = /^\d+$/
    let prefix = document.getElementById("prefix").value
    let number = document.getElementById("phoneNb").value
    let montant = document.getElementById("montant").value
    let errorMontant = document.getElementById("validMontant")
    let config = {
        headers: {
            'Authorization': 'Bearer ' + bearer
        }
    }
    if(number.match(regex0) && number.charAt(0) === "0" && montant.match(regexMontant)){
        number = number.substring(1)
        axios.post('http://localhost:8055/twilio', {
            number,
            prefix,
            montant
        })

        axios.get('http://localhost:8055/users/me', config)
            .then(function (response) {
                let balance = response.data.data.balance + parseFloat(montant)
                axios.patch('http://localhost:8055/users/me', {"balance": balance} ,config)
                    .then(response => window.location.href='checkout.html')
            })
    }
    else if(number.match(regex) && number.charAt(0) !== 0 && montant.match(regexMontant)){
        axios.post('http://localhost:8055/twilio', {
            number,
            prefix,
            montant
        })
        axios.get('http://localhost:8055/users/me', config)
            .then(function (response) {
                let balance = response.data.data.balance + parseFloat(montant)
                axios.patch('http://localhost:8055/users/me', {"balance": balance} ,config)
                    .then(response => window.location.href='checkout.html')
            })
    }
    else{
        errorMontant.style.display = "block"
    }
}

function getLogged() {
    axios.post('http://localhost:8055/auth/login', {
        "email": document.getElementById('id').value,
        "password": document.getElementById('password').value,
    })
        .then(response => {
            console.log(response)
            localStorage.setItem('bearer', response.data.data.access_token)
            localStorage.setItem('refreshToken', response.data.data.refresh_token)
            window.location.href = "home.html";
        })
        .catch(error => {
            document.getElementById('error').innerHTML = 'Your email or password was entered incorrectly.'
        })}

function register() {
    let name = /^[a-zA-Z\u00C0-\u00FF\u002D\u0020]*$/gm
    let number = /^[0-9]*$/gm
    let mail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/g
    let first_name= document.getElementById('name').value
    let last_name= document.getElementById('surname').value
    let ticket_nb= document.getElementById('ticketNb').value
    let email= document.getElementById('id').value
    if (first_name.match(name) && last_name.match(name) && ticket_nb.match(number) && email.match(mail)){
    axios.post('http://localhost:8055/users', {
        "first_name": first_name,
        "last_name": last_name,
        "ticket_nb": ticket_nb,
        "email": email,
        "password": document.getElementById('password').value,
        "balance": 0
    })
        .then(response => {
            console.log("gg")
            window.location.href='home.html'
            localStorage.setItem('bearer', response.data.data.access_token)
            localStorage.setItem('refreshToken', response.data.data.refresh_token)
        })
        .catch(error => {
            document.getElementById('error').innerHTML = 'Veuillez réessayer'
        })}

    else{document.getElementById('error').innerHTML = 'Veuillez des valeurs valides'}
}

function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('bearer')
    localStorage.removeItem('userId')
    window.location.href = 'connexion.html'
}

function getBalance(){
    let balance = document.getElementById('balance')
    let config = {
        headers: {
            'Authorization': 'Bearer ' + bearer
        }
    }
    axios.get('http://localhost:8055/users/me', config)
        .then(response => {balance.innerHTML = response.data.data.balance + '€'})

}

function openTicket() {
    let number = /^[0-9]*$/gm
    let numero = document.getElementById('helpPhone').value
    let objet = document.getElementById('helpObject').value
    let message = document.getElementById('helpMessage').value
    let config = {
        headers: {
            'Authorization': 'Bearer ' + bearer
        }
    }
    if (numero.match(number) && objet && message){
        axios.post('http://localhost:8055/items/tickets', {
            "phone_number": numero,
            "object": objet,
            "message": message
        }).then(function (response){
            document.getElementById('helpSend').innerHTML = 'Envoyé !'
            document.getElementById('helpPhone').value = ''
            document.getElementById('helpObject').value = ''
            document.getElementById('helpMessage').value = ''
            setTimeout(() => {
                document.getElementById('helpSend').innerHTML = 'Envoyer'
            }, "3000")
        })
    }
    else{document.getElementById('error').innerHTML = 'Veuillez des valeurs valides'
}}