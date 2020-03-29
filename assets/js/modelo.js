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
        if (contacto.length > 9 || contacto.length < 9) {
            alert("Telefone Invalido");
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
           alert("Ja possui uma conta");

            });
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {

                    firebase.database().ref('farmacia/' + user.uid + '/' + contacto).set({
                        NIF: nif, 
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

            window.location.href = 'pages/user.html';
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("Nif ou Senha Errada");
            // ...
        });


}

function sugestao() {
    var frase = document.getElementById("sugestao");
    if (frase.value.length > 0) {
        firebase.database().ref('sugestao').push({

            sugestao: frase.value
        }).then(function() {
            alert("Sugestão enviada com sucesso");
            frase.value = " ";
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
    window.location.href = '../index.html';

}

function sairUser() {
    firebase.auth().signOut().then(function() {
        window.location.href = '../index.html';
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
            if(document.getElementById(doc.data().produto+"1")==null){

var pai=document.createElement("div");
pai.setAttribute("class","modal fade");
pai.setAttribute("id",doc.data().produto);
pai.setAttribute("tabindex","-1");
pai.setAttribute("role","dialog");
pai.setAttribute("aria-labelledby","exampleModalLabel");
pai.setAttribute("aria-hidden","true");


var pai1=document.createElement("div");
pai1.setAttribute("class","modal-dialog");
pai1.setAttribute("role","document");

var pai2=document.createElement("div");
pai2.setAttribute("class","modal-content");

var pai2_1=document.createElement("div");
pai2_1.setAttribute("class","modal-header");

var pai2_1_2=document.createElement("h5");
pai2_1_2.setAttribute("class","modal-title");
pai2_1_2.setAttribute("id","exampleModalLabel");
var produto;
 switch (doc.data().produto) {
                case "mascara":
                    produto = "Mascara";
                    break;
                case "luva":
                    produto = "Luvas plasticas";
                    break;
                case "alcool":
                    produto = "Alcool Etilico";
                    break;
                case "alcoolgel":
                    produto = "Alcool Gel";
                    break;
                case "gelneutro":
                    produto = "Alcool Neutro";
                    break;
                case "toalhitas":
                    produto = "Toalhitas";
                    break;
                default:
                    produto = "Sabão";

            }

pai2_1_2.innerHTML=produto;


var pai2_1_3=document.createElement("buttom");
pai2_1_3.setAttribute("class","close");
pai2_1_3.setAttribute("type","buttom");
pai2_1_3.setAttribute("data-dismiss","modal");
pai2_1_3.setAttribute("aria-label","Close");

var pai2_1_3_1=document.createElement("span");
pai2_1_3_1.innerHTML="&times;";
pai2_1_3_1.setAttribute("aria-hidden","true");


var pai2_2=document.createElement("div");
pai2_2.setAttribute("class","modal-body");
pai2_2.setAttribute("id","id"+doc.data().produto);




pai.appendChild(pai1);
pai1.appendChild(pai2);
pai2.appendChild(pai2_1);
pai2_1.appendChild(pai2_1_2);
pai2_1.appendChild(pai2_1_3);
pai2_1_3.appendChild(pai2_1_3_1);
pai2.appendChild(pai2_2);


var body=document.getElementsByTagName("body")[0].appendChild(pai);
//-------------------------------

            filho1 = document.createElement("div");
            filho1.id=doc.data().produto+"1";
            filho1.setAttribute("data-target", "#"+doc.data().produto);
            filho1.setAttribute("data-toggle", "modal");
            filho1.setAttribute("type", "buttom");
            filho1.classList.add("bloco_singular");
            filho1_1 = document.createElement("div");
            filho1_1.classList.add("foto_bloco_sigular");
            filho1_1_1 = document.createElement("div");
            filho1_1_1.classList.add("foto_conteiner");
            filho1_1_1_1 = document.createElement("img");

            filho1_1_1_1.src = "assets/img/" + doc.data().produto + ".jpg"

            filho1_1_1.appendChild(filho1_1_1_1);
            filho1_1.appendChild(filho1_1_1);
            filho1.appendChild(filho1_1);

            filho1_2 = document.createElement("div");
            filho1_2.classList.add("informacao");
            filho1_2_1 = document.createElement("h3");

filho1_2_1.innerHTML = produto;
           

            
            var farmacia = "Farmácia " + doc.data().nome;
            var preco = doc.data().preco + " akz";
            var local = doc.data().localizacao;
            var tlf = doc.data().contacto;
           
            var far=document.createElement("li");
            far.setAttribute("class","fas fa-clinic-medical");
            far.innerHTML="<b> "+farmacia+"</b>";

             var tel=document.createElement("small");
            
            tel.style.listStyle="none";
            tel.style.fontSize="12pt";
            tel.innerHTML="<small class='fas fa-phone' style='transform:scaleX(-1); '></small> <b>"+tlf+"</b>";
            var pre=document.createElement("li");
            pre.setAttribute("class","fas fa-dollar-sign");
            pre.innerHTML=" "+preco;

             var lo=document.createElement("li");
            lo.setAttribute("class","fas fa-map-marker-alt");
            lo.innerHTML=" "+local;

pai2_2.appendChild(far);
pai2_2.appendChild(document.createElement("br"));
pai2_2.appendChild(tel);
pai2_2.appendChild(document.createElement("br"));
pai2_2.appendChild(pre);
pai2_2.appendChild(document.createElement("br"));
pai2_2.appendChild(lo);
pai2_2.appendChild(document.createElement("hr"));
            filho1_2.appendChild(filho1_2_1);
            filho1.appendChild(filho1_2);

            filho.appendChild(filho1);

            itens.appendChild(filho);
            
            k++;
        }else{
              var farmacia = "Farmácia " + doc.data().nome;
            var preco = doc.data().preco + " akz";
            var local = doc.data().localizacao;
            var tlf = doc.data().contacto;
           
            var far=document.createElement("li");
            far.setAttribute("class","fas fa-clinic-medical");
            far.innerHTML="<b> "+farmacia+"</b>";

             var tel=document.createElement("small");
            
            tel.style.listStyle="none";
            tel.style.fontSize="12pt";
            tel.innerHTML="<small class='fas fa-phone' style='transform:scaleX(-1); '></small> <b>"+tlf+"</b>";
            var pre=document.createElement("li");
            pre.setAttribute("class","fas fa-dollar-sign");
            pre.innerHTML=" "+preco;

             var lo=document.createElement("li");
            lo.setAttribute("class","fas fa-map-marker-alt");
            lo.innerHTML=" "+local;

document.getElementById("id"+doc.data().produto).appendChild(far);
document.getElementById("id"+doc.data().produto).appendChild(document.createElement("br"));
document.getElementById("id"+doc.data().produto).appendChild(tel);
document.getElementById("id"+doc.data().produto).appendChild(document.createElement("br"));
document.getElementById("id"+doc.data().produto).appendChild(pre);
document.getElementById("id"+doc.data().produto).appendChild(document.createElement("br"));
document.getElementById("id"+doc.data().produto).appendChild(lo);
document.getElementById("id"+doc.data().produto).appendChild(document.createElement("hr"));
        }

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