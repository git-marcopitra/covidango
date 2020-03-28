// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAKMVlIKZuZxNAPuI9xReNDN3i4GwgsDZY",
    authDomain: "covidango.firebaseapp.com",
    databaseURL: "https://covidango.firebaseio.com",
    projectId: "covidango",
    storageBucket: "covidango.appspot.com",
    messagingSenderId: "1096327304751",
    appId: "1:1096327304751:web:237017057b76f5bf6358da",
    measurementId: "G-X3JFV4Y25X"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();




var url = window.location.pathname;

firebase.auth().onAuthStateChanged(function(user) {

    if (user) {

    } else {
        if (url.endsWith("/user.html")) {
            window.location.href = 'https://covidango.firebaseapp.com/';
        }
    }
});

var p = false;



function inicio() {
    return firebase.database().ref('titulo').once('value').then(function(snapshot) {
        var tag1 = (snapshot.val() && snapshot.val().titulo);
        var tag2 = (snapshot.val() && snapshot.val().estados);
        document.getElementById("carregar").style.display = "none";
        document.getElementById("titulo").innerHTML = tag1;
        document.getElementById("actualizacao").innerHTML = tag2;
        document.getElementById("fonte").style.display = "block";
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                document.getElementById("sessao").innerHTML = "Sair";
                document.getElementById("conta").style.display = "block";
                document.getElementById("sessao").addEventListener("click", sair, false);
            } else {
                document.getElementById("sessao").innerHTML = "Iniciar Sessão";
                document.getElementById("conta").style.display = "none";
            }
        });
        // ...
    });
}







function registar(botao) {

    var database = firebase.database();
    var nif = document.getElementById("nif").value;
    var farmacia = document.getElementById("farmacia").value;
    var senha = document.getElementById("senha").value;
    var senha1 = document.getElementById("senha1").value;
    var contacto = document.getElementById("contacto").value;
    var local = document.getElementById("local").value;
    if (nif.length > 0 &&
        farmacia.length > 0 &&
        contacto.length > 0 &&
        local.length > 0 &&
        senha.length > 0 &&
        senha1.length > 0) {


        var regexp1 = new RegExp('\^([0-9]{9})+([A-Za-z]{2})+([0-9]{3})$');
        var regexp2 = new RegExp(/[A-Z]{2}/);
        var regexp3 = new RegExp(/[0-9]{3}/i);
        var regexp4 = new RegExp(/[0-9]{10}/i);
        var n = regexp1.test(nif.substring(0, 9)) && regexp2.test(nif.substring(9, 11)) && regexp3.test(nif.substring(11));
        var n1 = regexp4.test(nif)
        if (contacto.length > 9 || contacto.length < 9) {
            alert("Telefone Invalido");
        } else if (n == false && n1 == false) {
            alert("Nif Invalido");
        } else if (senha.length < 8)
            alert("A senha de conter no minimo 8 digitos");
        else
        if (senha1 != senha) {
            alert("Senhas Diferentes");
        } else {
            botao.style.display = "none";
            document.getElementById("carregar").style.display = "block";


            firebase.auth().createUserWithEmailAndPassword(nif + "@limite.com", senha).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
            });
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {

                    firebase.database().ref('farmacia/' + user.uid + '/' + contacto).set({

                        permissao: false,
                        localizacao: local

                    }).then(function() {
                        user.updateProfile({
                            displayName: farmacia,
                            photoURL: contacto
                        }).then(function() {
                            window.location.href = 'user.html';
                        });
                    });


                }
            });
        }
    } else {
        alert("Por Favor,Preencha todos os campos")
    }
}





function inicarSessao() {
    var nif = document.getElementById("nif").value + "@limite.com";
    var contacto = document.getElementById("contacto").value;
    var senha = document.getElementById("senha").value;
    firebase.auth().signInWithEmailAndPassword(nif, senha)
        .then(function() {

            var user = firebase.auth().currentUser.uid;

            window.location.href = 'user.html';
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("Nif ou Senha Errada");
            // ...
        });


}

function sugestao() {
    var frase = document.getElementById("sugestao").value;
    if (frase.length > 0) {
        firebase.database().ref('sugestao').set({

            sugestao: frase
        }).then(function() {
            alert("Sugestão enviada com sucesso");
            frase = " ";
        });

    }
}

function item(botao) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            if ("rgb(191, 5, 5)" != botao.style.background) {
                var preco = document.getElementById(botao.name + "1");
                preco.disabled = true;
                var localizacao1;
                firebase.database().ref('farmacia/' + user.uid + '/' + user.photoURL).once('value').then(function(snapshot) {
                    localizacao1 = (snapshot.val() && snapshot.val().localizacao);
                    var permissao1 = (snapshot.val() && snapshot.val().permissao);

                    firebase.firestore().collection("publicacao").add({
                        produto: botao.name,
                        contacto: user.photoURL,
                        localizacao: localizacao1,
                        preco: preco.value,
                        nome: user.displayName,
                        permissao: permissao1
                    });
                });


                botao.style.background = "#bf0505";
                botao.innerHTML = "<i class='fas fa-trash-alt'></i> Esgotado!";

                var b = document.createElement("b");
                b.style.background = "#28A745";
                b.style.padding = "1%";
                b.style.borderRadius = "10px";
                b.style.color = "#f3f3f3";
                b.style.fontSize = "11pt";
                b.innerHTML = " Divulgado";
                document.getElementById(botao.name).appendChild(b);
            } else {
                var preco = document.getElementById(botao.name + "1");
                preco.disabled = false;
                remover(user.photoURL, botao.name);
                botao.style.background = "#28A745";
                botao.innerHTML = "Publicitar";
                document.getElementById(botao.name).removeChild(document.getElementById(botao.name).childNodes[1]);
            }
        }
    });

}



function sair() {
    firebase.auth().signOut().then(function() {
        location.reload();
    }).catch(function(error) {
        // An error happened.
    });
    window.location.href = 'index.html';

}

function sairUser() {
    firebase.auth().signOut().then(function() {
        window.location.href = 'index.html';
    }).catch(function(error) {
        // An error happened.
    });


}



function verifica() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            document.getElementById("sessao").innerHTML = "Sair";
            document.getElementById("conta").style.display = "block";
            document.getElementById("sessao").addEventListener("click", sair, false);
        } else {
            document.getElementById("sessao").innerHTML = "Iniciar Sessão";
            document.getElementById("conta").style.display = "none";
        }
    });

}



function produtos() {
    var k = 1;
    var itens = document.getElementById("itens");
    var filho = document.createElement("div");
    filho.classList.add("bloco_conteiner");
    firebase.firestore().collection("publicacao").where("permissao", "==", true).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (k == 3) {
                filho = document.createElement("div");
                filho.classList.add("bloco_conteiner");
                k = 1;
            }
            filho1 = document.createElement("div");
            filho1.classList.add("bloco_singular");
            filho1_1 = document.createElement("div");
            filho1_1.classList.add("foto_bloco_sigular");
            filho1_1_1 = document.createElement("div");
            filho1_1_1.classList.add("foto_conteiner");
            filho1_1_1_1 = document.createElement("img");

            filho1_1_1_1.src = "img/" + doc.data().produto + ".jpg"

            filho1_1_1.appendChild(filho1_1_1_1);
            filho1_1.appendChild(filho1_1_1);
            filho1.appendChild(filho1_1);

            filho1_2 = document.createElement("div");
            filho1_2.classList.add("informacao");
            filho1_2_1 = document.createElement("h3");

            switch (doc.data().produto) {
                case "mascara":
                    filho1_2_1.innerHTML = "Mascara";
                    break;
                case "luva":
                    filho1_2_1.innerHTML = "Luvas plasticas";
                    break;
                case "alcool":
                    filho1_2_1.innerHTML = "Alcool Etilico";
                    break;
                case "alcoolgel":
                    filho1_2_1.innerHTML = "Alcool Gel";
                    break;
                case "gelneutro":
                    filho1_2_1.innerHTML = "Alcool Neutro";
                    break;
                case "toalhitas":
                    filho1_2_1.innerHTML = "Toalhitas";
                    break;
                default:
                    filho1_2_1.innerHTML = "Sabão";

            }

            filho1_2_nome = document.createElement("p");
            filho1_2_nome.style.marginBottom = "0px";
            filho1_2_nome.innerHTML = "Farmácia " + doc.data().nome;

            filho1_2_1_1 = document.createElement("p");
            filho1_2_1_1.style.marginBottom = "0px";
            filho1_2_1_1.innerHTML = doc.data().preco + " akz";
            filho1_2_1_1_1 = document.createElement("p");
            filho1_2_1_1_1.style.marginBottom = "0px";
            filho1_2_1_1_1.innerHTML = doc.data().localizacao;
            filho1_2_1_1_1_1 = document.createElement("p");
            filho1_2_1_1_1_1.style.marginBottom = "0px";
            filho1_2_1_1_1_1.innerHTML = doc.data().contacto;

            filho1_2.appendChild(filho1_2_1);
            filho1_2.appendChild(filho1_2_1_1);
            filho1_2.appendChild(filho1_2_nome);

            filho1_2.appendChild(filho1_2_1_1_1_1);
            filho1_2.appendChild(filho1_2_1_1_1);
            filho1.appendChild(filho1_2);

            filho.appendChild(filho1);

            itens.appendChild(filho);
            console.log(doc.data().produto);
            k++;

        });
    });
}


function remover(tel, id) {
    firebase.firestore().collection("publicacao")
        .where('contacto', '==', tel)
        .where('produto', '==', id).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

                firebase.firestore().collection("publicacao").doc(doc.id).delete().then(function() {}).catch(function(error) {});

            });
        });
}

function carregar(contacto) {

    firebase.firestore().collection("publicacao").where("contacto", "==", contacto).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var preco = document.getElementById(doc.data().produto + "1");
            preco.disabled = true;
            preco.value = doc.data().preco;
            document.getElementsByName(doc.data().produto)[0].style.background = "#bf0505";
            document.getElementsByName(doc.data().produto)[0].innerHTML = "<i class='fas fa-trash-alt'></i> Esgotado!";
            document.getElementsByName("farmaciaNome").length
            var f = 0;
            while (f < document.getElementsByName("farmaciaNome").length) {
                document.getElementsByName("farmaciaNome")[f] = doc.data().nome;
                f++;
            }
            var b = document.createElement("b");
            b.style.background = "#28A745";
            b.style.padding = "1%";
            b.style.borderRadius = "10px";
            b.style.color = "#f3f3f3";
            b.style.fontSize = "11pt";
            b.innerHTML = " Divulgado";
            document.getElementById(doc.data().produto).appendChild(b);
        });
    });
}