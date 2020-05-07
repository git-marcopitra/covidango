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
        if (url.endsWith("/user.html") || url.endsWith("/user2.html")) {
            window.location.href = 'https://covidango.firebaseapp.com/';
        }
    }
});

var p = false;
messaging();
function messaging(){

    const messaging = firebase.messaging();

messaging.usePublicVapidKey("BAH3xCaV5kk3aSudc7aCiH-ViUIIl9VsANlFybLbKjB-8AvGXiEQGHT4LYibvXmyB5y14qclHy175NuitNJCSFY");

messaging.requestPermission().then((permission) => {
  alert("ola");
    console.log('Notification permission granted.');
    
    messaging.getToken().then((currentToken) => {
        console.log(currentToken);

}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
 
});
 

}).catch((error)=>{
   
    console.log("test" +error);
});


 messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  // ...
});

}

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


function conta(){

    firebase.auth().onAuthStateChanged(function(user) {
                if (user) {

                    firebase.database().ref('empresa/' + user.uid + '/' + user.photoURL)
                    .once('value').then(function(snapshot) {
                 


                    var tipo1=(snapshot.val() && snapshot.val().tipo);
                    if(tipo1=="farmacia"){
                        window.location="pages/user.html";

                    }else
                    window.location="pages/user2.html";
                });
                }
            });
}




function registarFarmacia(botao) {

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


            firebase.auth().createUserWithEmailAndPassword(contacto + "@limite.com", senha).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
         

            });
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {

                    firebase.database().ref('empresa/' + user.uid + '/' + contacto).set({
                        NIF: nif, 
                        permissao: false,
                        localizacao: local,
                        tipo: "farmacia"

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








function registarDistribuidor(botao) {

    var database = firebase.database();
    var nif = document.getElementById("nif").value;
    var armazem = document.getElementById("armazem").value;
    var senha = document.getElementById("senha").value;
    var senha1 = document.getElementById("senha1").value;
    var contacto = document.getElementById("contacto").value;
    var local = document.getElementById("local").value;
    if (nif.length > 0 &&
        armazem.length > 0 &&
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


            firebase.auth().createUserWithEmailAndPassword(contacto + "@limite.com", senha).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
           alert("Ja possui uma conta");

            });
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {

                    firebase.database().ref('empresa/' + user.uid + '/' + contacto).set({
                        NIF: nif, 
                        permissao: false,
                        localizacao: local,
                        tipo: "armazem"

                    }).then(function() {
                        user.updateProfile({
                            displayName: armazem,
                            photoURL: contacto
                        }).then(function() {
                            window.location.href = 'user2.html';
                        });
                    });


                }
            });
        }
    } else {
        alert("Por Favor,Preencha todos os campos")
    }
}











function iniciarSessao() {
    var email;
   if(document.getElementById("nif").style.display=="none")
         email=document.getElementById("contacto").value;
     else
        email=document.getElementById("nif").value;
   
    var senha = document.getElementById("senha").value;
    firebase.auth().signInWithEmailAndPassword(email+"@limite.com", senha)
        .then(function() {

            var user = firebase.auth().currentUser;
        
                firebase.database().ref('empresa/' + user.uid + '/' + user.photoURL).
                once('value').then(function(snapshot) {
                    var tipo=snapshot.val().tipo;
                    
                    if(tipo=="farmacia")
                        window.location.href = 'user.html';
                    else
                        window.location.href = 'user2.html';

                });
            
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
                if(preco.value.length>0){
                preco.disabled = true;
                var localizacao1;
                firebase.database().ref('empresa/' + user.uid + '/' + user.photoURL).once('value').then(function(snapshot) {
                    localizacao1 = (snapshot.val() && snapshot.val().localizacao);
                    var permissao1 = (snapshot.val() && snapshot.val().permissao);
                    var tipo1=(snapshot.val() && snapshot.val().tipo);
                    firebase.firestore().collection("publicacao").add({
                        produto: botao.name,
                        contacto: user.photoURL,
                        localizacao: localizacao1,
                        preco: preco.value,
                        nome: user.displayName,
                        permissao: permissao1,
                        tipo: tipo1,
                        id: user.uid
                    }).then(function(){
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
                    });
                });
            }else
            alert("Digite o Preço");

               
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



// Listar Produtos Farmacias Index.html-----------------------------------------
function produtosFarmacia() {
 
    if(document.getElementById("itensFarmacia").childElementCount==0){
           document.getElementById("ca").style.display="block";
    var k = 1;
    var itens = document.getElementById("itensFarmacia");
    var filho = document.createElement("div");
    filho.classList.add("bloco_conteiner");



//-------------------------------------------
    firebase.firestore().collection("publicacao").where("tipo","==","farmacia").where("permissao","==",true).get().then((querySnapshot) => {
       if(querySnapshot.size==0){
        itens.innerHTML="<h4 style='text-align: center;'>Sem Fármacos Registados</h4>"
       }
        document.getElementById("ca").style.display="none";
       
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
                case "acidoAscorbico":
                    produto="Ácido ascórbico (Vit. C)";
                    break;
                case "acidoFolico":
                    produto="Ácido Fólico";
                    break;
                case "actifed":
                    produto="Actifed";
                    break;
                case "agulhaCaneta":
                    produto="Agulhas para as canetas";
                    break;
                     case "alcool":
                    produto = "Alcool Etilico";
                    break;
                case "alcoolgel":
                    produto = "Alcool Gel";
                    break;
                case "aminofilina":
                    produto="Aminofilina";
                    break;
                case "amlodipino":
                    produto="Amlodipina";
                    break;
                case "amoxilina":
                    produto="Amoxicilina";
                    break;
                case "artemether":
                    produto="Artemeter";
                    break;
                case "aspirina":
                    produto="Aspirina";
                    break;
                case "benylin":
                    produto="Benylin";
                    break;
                case "bisolvon":
                    produto="Bisolvon";
                    break;
                case "bromexina":
                    produto="Bromexina";
                    break;
                case "calcio":
                    produto="Cálcio";
                    break;
                case "carbamazepina":
                    produto="carbamazepina";
                    break;
                case "ciprofloxacina":
                    produto="Ciprofloxacina";
                    break;
                case "clavamox":
                    produto="Clavamox";
                    break;
                case "coartem":
                    produto="Coartem";
                    break;
                case "complexoB":
                    produto="Complexo B";
                    break;
                case "cotrimoxazol":
                    produto="Cotrimoxazol";
                    break;
                case "desloratadina":
                    produto="Desloratadina";
                    break;
                case "diazepam":
                    produto="Diazepam";
                    break;
                case "diclofenacComprimido":
                    produto="Diclofenac (Comprimido)";
                    break;
                case "diclofenacPomada":
                    produto="Diclofenac (Pomada)";
                    break;
                case "domperidona":
                    produto="Domperidona";
                    break;
                case "enalapril":
                    produto="Enalapril";
                    break;
                case "fenobarbital":
                    produto="Fenobarbital";
                    break;
                case "gelneutro":
                    produto = "Alcool Neutro";
                    break;
                case "gentamicina":
                    produto="Gentamicina";
                    break;
                case "hidroclorotiazida":
                    produto="Hidroclorotiazida";
                    break;
                case "hidroxidoMagnesio":
                    produto="Hidróxido de Magnésio";
                    break;
                case "ibuprofenoPomada":
                    produto="Ibuprofen (Pomada)";
                    break;
                case "insulinaAmpola":
                    produto="Insulina (ampola)";
                    break;
                case "lisinopril":
                    produto="Lisinopril";
                    break;
                    case "luva":
                    produto = "Luvas plasticas";
                    break;
                    case "mascara":
                    produto = "Mascara";
                    break;
                case "metformina":
                    produto="Metformina";
                    break;
                case "metronidazol":
                    produto="Metronidazol";
                    break;
                case "multiVitaminas":
                    produto="Multivitaminas (comprimidos)";
                    break;
                case "naproxen":
                    produto="Naproxen (Comprimido)";
                    break;
                case "naproxenPomada":
                    produto="Naproxen (Pomada)";
                    break;
                case "omeprazol":
                    produto="Omeprazol";
                    break;
                case "paracetamolComprimido":
                    produto="Paracetmol (Comprimido)";
                    break;
                case "paracetamolSupositorio":
                    produto="Paracetamol (Supositório)";
                    break;
                case "ParacetamolXarope":
                    produto="Paracetmol (Xarope)";
                    break;
                case "penicilina":
                    produto="Penicilina";
                    break;
                case "piroxicam":
                    produto="Piroxicam (Comprimido)";
                    break;
                case "piroxicamPomada":
                    produto="Piroxicam (Pomada)";
                    break;
                case "prometazina":
                    produto="Prometazina";
                    break;
                case "ranitidina":
                    produto="Ranitidina";
                    break;
                case "rinialer":
                    produto="Rinialer";
                    break;
                case "saisFrutos":
                    produto="Sais de frutos";
                    break;
                case "salbutamol":
                    produto="Salbutamol (Comprimido)";
                    break;
                case "salbutamolInalador":
                    produto="Salbutamol (Inalador)";
                    break;
                case "seringa":
                    produto="Seringa";
                    break;
                case "symbicort":
                    produto="Symbicort";
                    break;
                case "tirasTeste":
                    produto="Tiras de teste";
                    break;
                case "toalhitas":
                    produto = "Toalhitas";
                    break;
                case "vitaminaC":
                    produto="Vitamina C";
                    break;
                case "xanax":
                    produto="Xanax";
                    break;
            }

pai2_1_2.innerHTML=produto;


var pai2_1_3=document.createElement("buttom");
pai2_1_3.setAttribute("class","close");
pai2_1_3.setAttribute("type","buttom");
pai2_1_3.style.cursor="pointer";
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
   if(document.getElementById(doc.data().nome)==null){
              var farmacia = "Farmácia " + doc.data().nome;
            var preco = doc.data().preco + " akz";
            var local = doc.data().localizacao;
            var tlf = doc.data().contacto;
           
            var far=document.createElement("li");
         
            far.setAttribute("id",doc.data().nome);
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
        }else{
      firebase.firestore().collection("publicacao").doc(doc.id).delete().then(function() {}).catch(function(error) {});
        }
}
        });
    });

}
}
//----------------------------------------------------------------------------------------------------------




// Listar Produtos Armazem Alimentos Index.html-----------------------------------------
function produtosAlimentos() {
     
    if(document.getElementById("itensFarmacia").childElementCount==0){
         document.getElementById("ca1").style.display="block";
    var k = 1;
    var itens = document.getElementById("alimentos");
    var filho = document.createElement("div");
    filho.classList.add("bloco_conteiner");

//-------------------------------------------
    firebase.firestore().collection("publicacao").where("tipo","==","armazem").where("categoria","==","alimento").where("permissao","==",true).get()
 .then((querySnapshot) => {
         if(querySnapshot.size==0){
        itens.innerHTML="<h4 style='text-align: center;'>Sem Mantimentos Registados</h4>"
       }
        document.getElementById("ca1").style.display="none";

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
var titulo;

                
                switch(doc.data().produto){
                    case "azeite":
                        titulo="Azeite";
                        break;
                    case "leite":
                        titulo="Caixa de Leite";
                        break;
                    case "massa":
                        titulo="Caixa de Massa";
                        break;
                    case "oleo":
                        titulo="Caixa de Oleo";
                        break;
                    case "ovo":
                        titulo="Cartão de Ovos";
                        break;
                    case "vinagre":
                        titulo="Vinagre";
                        break;
                    case "farinha":
                        titulo="Farinha Trigo";
                        break;
                    case "sal":
                        titulo="Sal";
                        break;
                    case "acucar":
                        titulo="Açucar";
                        break;
                    case "coxa":
                        titulo="Caixa de Coxa";
                        break;
                    case "caixafrango":
                        titulo="Caixa de Frango";
                        break;
                    case "peitofrango":
                        titulo="Caixa de Peito de Frango";
                        break;
                    case "alho":
                        titulo="Alho";
                        break;
                    case "batataRena":
                        titulo="Saco de Batata Rena";
                        break;
                    case "batataDoce":
                        titulo="Saco de Batata Doce";
                        break;
                    case "cebola":
                        titulo="Saco de Cebola";
                        break;
                    case "fuba":
                        titulo="Saco de Fuba";
                        break;
                    case "agua":
                        titulo="Grade de Água";
                        break;
                    case "feijao":
                        titulo="Feijão";
                        break;
                }

pai2_1_2.innerHTML=titulo;


var pai2_1_3=document.createElement("buttom");
pai2_1_3.setAttribute("class","close");
pai2_1_3.setAttribute("type","buttom");
pai2_1_3.style.cursor="pointer";
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

            filho1_1_1_1.src = "assets/img/prods/" + doc.data().produto + ".jpg"

            filho1_1_1.appendChild(filho1_1_1_1);
            filho1_1.appendChild(filho1_1_1);
            filho1.appendChild(filho1_1);

            filho1_2 = document.createElement("div");
            filho1_2.classList.add("informacao");
            filho1_2_1 = document.createElement("h3");

filho1_2_1.innerHTML = titulo;
 
    var dados =document.createElement("li");
    dados.innerHTML="Dados do Armazém";
    dados.style="list-style: none;  font-size: 19px; font-weight: bold";
     
    var divDados=document.createElement("div");
     divDados.style="margin-left: 8%;";
   
    
      var detalhes =document.createElement("li");
    detalhes.innerHTML="Detalhes do Produto";
    detalhes.style="list-style: none;  font-size: 19px; font-weight: bold";
     
    var divDetalhes=document.createElement("div");
     divDetalhes.style="margin-left: 8%;";

            
           
            var nomeArmazem=document.createElement("li");
            nomeArmazem.style=" font-weight: 500;";
            nomeArmazem.setAttribute("class","fas fa-clinic-medical");
            nomeArmazem.innerHTML=" "+doc.data().nome;
            nomeArmazem.setAttribute("id",doc.data().nome);

             var tel=document.createElement("small");
            tel.style="none;font-size: 12pt;font-weight: 500;";
            tel.style.listStyle="none";
            tel.style.fontSize="12pt";
            tel.innerHTML="<small class='fas fa-phone' style='transform:scaleX(-1);font-weight: 500; '></small> "+doc.data().contacto+"";
            var preco=document.createElement("li");

            preco.setAttribute("class","fas fa-dollar-sign");
            preco.style=" font-weight: 500;";
            preco.innerHTML=" "+doc.data().preco + " akz";

             var local=document.createElement("li");
             local.style="font-weight: 500;";
            local.setAttribute("class","fas fa-map-marker-alt");
            local.innerHTML=" "+doc.data().localizacao;


 divDados.appendChild(nomeArmazem);
                divDados.appendChild(document.createElement("br"));
                divDados.appendChild(tel);
                divDados.appendChild(document.createElement("br"));
                divDados.appendChild(local);         
                divDetalhes.appendChild(preco);
switch(doc.data().produto){
            case "acucar":
            case "coxa":
            case "caixafrango":
            case "peitofrango":
                 var marca=document.createElement("li");
                 marca.setAttribute("class","fas fa-layer-group");
                 marca.style=" font-weight: 500;";
                 marca.innerHTML=" "+doc.data().marca;
                 var peso=document.createElement("li");
                 peso.style=" font-weight: 500;";
                 peso.setAttribute("class","fas fa-balance-scale-right");
                 peso.innerHTML=" "+doc.data().peso+" "+doc.data().unidade;  

             
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(marca);
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(peso);
                
            break;
                case "azeite":
             case "leite":
             case "massa":
             case "oleo":
             case "ovo":
             case "vinagre":
             case "farinha":
             case "sal":
                var qtd=document.createElement("li");
                qtd.setAttribute("class","fas fa-archive");
                qtd.style=" font-weight: 500;";
                 qtd.innerHTML=" "+doc.data().quantidade+" Unidades";
                  var marca=document.createElement("li");
                   marca.setAttribute("class","fas fa-layer-group");
                   marca.style=" font-weight: 500;";
                 marca.innerHTML=" "+doc.data().marca;

                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(marca);
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(qtd);


            
               
                break;
                 case "agua":
                   var qtd=document.createElement("li");
                 qtd.innerHTML=doc.data().peso+" Unidades";
                 qtd.style=" font-weight: 500;";
                  var marca=document.createElement("li");
                  marca.setAttribute("class","fas fa-layer-group");
                 marca.innerHTML=doc.data().unidade;
                 marca.style=" font-weight: 500;";

                 
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(marca);
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(qtd);
                break;
                 case "feijao":
                  var qtd=document.createElement("li");
                  qtd.setAttribute("class","fas fa-balance-scale-right");
                 qtd.innerHTML=doc.data().peso+" "+doc.data().unidade;
                 qtd.style=" font-weight: 500;";
                  var tipo=document.createElement("li");
                  tipo.setAttribute("class","fas fa-window-restore");
                 tipo.innerHTML=" "+doc.data().ftipo;
                 tipo.style=" font-weight: 500;";
                 

                
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(tipo);
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(qtd); 
        }

            pai2_2.appendChild(dados);
           pai2_2.appendChild(divDados);
           pai2_2.appendChild(detalhes);
           pai2_2.appendChild(divDetalhes);
           pai2_2.appendChild(document.createElement("hr"));

            filho1_2.appendChild(filho1_2_1);
            filho1.appendChild(filho1_2);

            filho.appendChild(filho1);
        
            itens.appendChild(filho);
            
            k++;
        }else{
   if(document.getElementById(doc.data().nome)==null){

                 var dados =document.createElement("li");
    dados.innerHTML="Dados do Armazém";
    dados.style="list-style: none;  font-size: 19px; font-weight: bold";
     
    var divDados=document.createElement("div");
     divDados.style="margin-left: 8%;";
   
    
      var detalhes =document.createElement("li");
    detalhes.innerHTML="Detalhes do Produto";
    detalhes.style="list-style: none;  font-size: 19px; font-weight: bold";
     
    var divDetalhes=document.createElement("div");
     divDetalhes.style="margin-left: 8%;";

            
           
            var nomeArmazem=document.createElement("li");
            nomeArmazem.style=" font-weight: 500;";
            nomeArmazem.setAttribute("class","fas fa-clinic-medical");
            nomeArmazem.innerHTML=" "+doc.data().nome;

             var tel=document.createElement("small");
            tel.style="none;font-size: 12pt;font-weight: 500;";
            tel.style.listStyle="none";
            tel.style.fontSize="12pt";
            tel.innerHTML="<small class='fas fa-phone' style='transform:scaleX(-1);font-weight: 500; '></small> "+doc.data().contacto+"";
            var preco=document.createElement("li");

            preco.setAttribute("class","fas fa-dollar-sign");
            preco.style=" font-weight: 500;";
            preco.innerHTML=" "+doc.data().preco + " akz";

             var local=document.createElement("li");
             local.style="font-weight: 500;";
            local.setAttribute("class","fas fa-map-marker-alt");
            local.innerHTML=" "+doc.data().localizacao;


  divDados.appendChild(nomeArmazem);
                divDados.appendChild(document.createElement("br"));
                divDados.appendChild(tel);
                divDados.appendChild(document.createElement("br"));
                divDados.appendChild(local);         
                divDetalhes.appendChild(preco);
switch(doc.data().produto){
            case "acucar":
            case "coxa":
            case "caixafrango":
            case "peitofrango":
                 var marca=document.createElement("li");
                 marca.setAttribute("class","fas fa-layer-group");
                 marca.style=" font-weight: 500;";
                 marca.innerHTML=" "+doc.data().marca;
                 var peso=document.createElement("li");
                 peso.style=" font-weight: 500;";
                 peso.setAttribute("class","fas fa-balance-scale-right");
                 peso.innerHTML=" "+doc.data().peso+" "+doc.data().unidade;  

                
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(marca);
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(peso);
                
            break;
                case "azeite":
             case "leite":
             case "massa":
             case "oleo":
             case "ovo":
             case "vinagre":
             case "farinha":
             case "sal":
                var qtd=document.createElement("li");
                qtd.setAttribute("class","fas fa-archive");
                qtd.style=" font-weight: 500;";
                 qtd.innerHTML=" "+doc.data().quantidade+" Unidades";
                  var marca=document.createElement("li");
                   marca.setAttribute("class","fas fa-layer-group");
                   marca.style=" font-weight: 500;";
                 marca.innerHTML=" "+doc.data().marca;

               
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(marca);
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(qtd);


            break;

                 case "agua":
                   var qtd=document.createElement("li");
                 qtd.innerHTML=doc.data().peso+" Unidades";
                 qtd.style=" font-weight: 500;";
                  var marca=document.createElement("li");
                  marca.setAttribute("class","fas fa-layer-group");
                 marca.innerHTML=doc.data().unidade;
                 marca.style=" font-weight: 500;";

                 
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(marca);
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(qtd);
                break;
                 case "feijao":
                  var qtd=document.createElement("li");
                  qtd.setAttribute("class","fas fa-balance-scale-right");
                 qtd.innerHTML=doc.data().peso+" "+doc.data().unidade;
                 qtd.style=" font-weight: 500;";
                  var tipo=document.createElement("li");
                  tipo.setAttribute("class","fas fa-window-restore");
                 tipo.innerHTML=" "+doc.data().ftipo;
                 tipo.style=" font-weight: 500;";
                 

              
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(tipo);
                divDetalhes.appendChild(document.createElement("br"));
                divDetalhes.appendChild(qtd); 
        }
        

        document.getElementById("id"+doc.data().produto).appendChild(dados);
          document.getElementById("id"+doc.data().produto).appendChild(divDados);
          document.getElementById("id"+doc.data().produto).appendChild(detalhes);
           document.getElementById("id"+doc.data().produto).appendChild(divDetalhes);
          document.getElementById("id"+doc.data().produto).appendChild(document.createElement("hr"));
        }else{

           firebase.firestore().collection("publicacao").doc(doc.id).delete().then(function() {}).catch(function(error) {});

        }
}
        })
    });

}
}
//----------------------------------------------------------------------------------------------------------



// Listar Produtos Armazem Higiene Index.html-----------------------------------------
function produtosHigiene() {

    if(document.getElementById("higiene").childElementCount==0){
        document.getElementById("ca1").style.display="block";
    var k = 1;
    var itens = document.getElementById("higiene");
    var filho = document.createElement("div");
    filho.classList.add("bloco_conteiner");

//-------------------------------------------
    firebase.firestore().collection("publicacao").where("tipo","==","armazem").where("categoria","==","higiene").where("permissao","==",true).get().then((querySnapshot) => {
           if(querySnapshot.size==0){
        itens.innerHTML="<h4 style='text-align: center;'>Sem Produtos de Higienização Registados</h4>"
       }
        document.getElementById("ca1").style.display="none";
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
var titulo;
 switch (doc.data().produto) {
         case "creme":
         titulo="Creme Para Pele";
         break;
        case "gelbanho":
        titulo="Gel de Banho";
         break;
        case "sabaoliquido":
        titulo="Sabão em Liquido";
         break;
        case "lixivia":
        titulo="Lixívia";
         break;
        case "omo":
        titulo="OMO";
         break;
        case "sabonete":
        titulo="Sabonete";
         break;
         default:
         titulo="Sabão";
            }

pai2_1_2.innerHTML=titulo;


var pai2_1_3=document.createElement("buttom");
pai2_1_3.setAttribute("class","close");
pai2_1_3.setAttribute("type","buttom");
pai2_1_3.style.cursor="pointer";
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

            filho1_1_1_1.src = "assets/img/prods/" + doc.data().produto + ".jpg"

            filho1_1_1.appendChild(filho1_1_1_1);
            filho1_1.appendChild(filho1_1_1);
            filho1.appendChild(filho1_1);

            filho1_2 = document.createElement("div");
            filho1_2.classList.add("informacao");
            filho1_2_1 = document.createElement("h3");

filho1_2_1.innerHTML = titulo;
 
               var dados =document.createElement("li");
    dados.innerHTML="Dados do Armazém";
    dados.style="list-style: none;  font-size: 19px; font-weight: bold";
     
    var divDados=document.createElement("div");
     divDados.style="margin-left: 8%;";
   
    
      var detalhes =document.createElement("li");
    detalhes.innerHTML="Detalhes do Produto";
    detalhes.style="list-style: none;  font-size: 19px; font-weight: bold";
     
    var divDetalhes=document.createElement("div");
     divDetalhes.style="margin-left: 8%;";

            
           
            var nomeArmazem=document.createElement("li");
            nomeArmazem.style=" font-weight: 500;";
            nomeArmazem.setAttribute("class","fas fa-clinic-medical");
            nomeArmazem.innerHTML=" "+doc.data().nome;

             var tel=document.createElement("small");
            tel.style="none;font-size: 12pt;font-weight: 500;";
            tel.style.listStyle="none";
            tel.style.fontSize="12pt";
            tel.innerHTML="<small class='fas fa-phone' style='transform:scaleX(-1);font-weight: 500; '></small> "+doc.data().contacto+"";
            var preco=document.createElement("li");

            preco.setAttribute("class","fas fa-dollar-sign");
            preco.style=" font-weight: 500;";
            preco.innerHTML=" "+doc.data().preco + " akz";

             var local=document.createElement("li");
             local.style="font-weight: 500;";
            local.setAttribute("class","fas fa-map-marker-alt");
            local.innerHTML=" "+doc.data().localizacao;

                divDados.appendChild(nomeArmazem);
                divDados.appendChild(document.createElement("br"));
                divDados.appendChild(tel);
                divDados.appendChild(document.createElement("br"));
                divDados.appendChild(local);         
                divDetalhes.appendChild(preco);

switch(doc.data().produto){
            case "creme":
             case "gelbanho":
             case "sabaoliquido":
             case "lixivia":
             case "sabonete":
                 var marca=document.createElement("li");
                marca.setAttribute("class","fas fa-layer-group");
                   marca.style=" font-weight: 500;";
                 marca.innerHTML=" "+doc.data().marca;
                 divDetalhes.appendChild(document.createElement("br"));
                 divDetalhes.appendChild(marca);
                 break;
            case "omo":
               var marca=document.createElement("li");
                marca.setAttribute("class","fas fa-layer-group");
                   marca.style=" font-weight: 500;";
                 marca.innerHTML=" "+doc.data().marca;
               
                var tamanho=document.createElement("li");
                tamanho.innerHTML=doc.data().tamanho;
                tamanho.setAttribute("class","fas fa-window-restore");
                tamanho.style=" font-weight: 500;";
                  divDetalhes.appendChild(marca);
                  divDetalhes.appendChild(document.createElement("br"));
                   divDetalhes.appendChild(tamanho);


}

            pai2_2.appendChild(dados);
           pai2_2.appendChild(divDados);
           pai2_2.appendChild(detalhes);
           pai2_2.appendChild(divDetalhes);
           pai2_2.appendChild(document.createElement("hr"));


            filho1_2.appendChild(filho1_2_1);
            filho1.appendChild(filho1_2);

            filho.appendChild(filho1);
        
            itens.appendChild(filho);
            
            k++;
        }else{
   if(document.getElementById(doc.data().nome)==null){
           
               var dados =document.createElement("li");
    dados.innerHTML="Dados do Armazém";
    dados.style="list-style: none;  font-size: 19px; font-weight: bold";
     
    var divDados=document.createElement("div");
     divDados.style="margin-left: 8%;";
   
    
      var detalhes =document.createElement("li");
    detalhes.innerHTML="Detalhes do Produto";
    detalhes.style="list-style: none;  font-size: 19px; font-weight: bold";
     
    var divDetalhes=document.createElement("div");
     divDetalhes.style="margin-left: 8%;";

            
           
            var nomeArmazem=document.createElement("li");
            nomeArmazem.style=" font-weight: 500;";
            nomeArmazem.setAttribute("class","fas fa-clinic-medical");
            nomeArmazem.innerHTML=" "+doc.data().nome;

             var tel=document.createElement("small");
            tel.style="none;font-size: 12pt;font-weight: 500;";
            tel.style.listStyle="none";
            tel.style.fontSize="12pt";
            tel.innerHTML="<small class='fas fa-phone' style='transform:scaleX(-1);font-weight: 500; '></small> "+doc.data().contacto+"";
            var preco=document.createElement("li");

            preco.setAttribute("class","fas fa-dollar-sign");
            preco.style=" font-weight: 500;";
            preco.innerHTML=" "+doc.data().preco + " akz";

             var local=document.createElement("li");
             local.style="font-weight: 500;";
            local.setAttribute("class","fas fa-map-marker-alt");
            local.innerHTML=" "+doc.data().localizacao;

                divDados.appendChild(nomeArmazem);
                divDados.appendChild(document.createElement("br"));
                divDados.appendChild(tel);
                divDados.appendChild(document.createElement("br"));
                divDados.appendChild(local);         
                divDetalhes.appendChild(preco);

switch(doc.data().produto){
            case "creme":
             case "gelbanho":
             case "sabaoliquido":
             case "lixivia":
             case "sabonete":
                 var marca=document.createElement("li");
                marca.setAttribute("class","fas fa-layer-group");
                   marca.style=" font-weight: 500;";
                 marca.innerHTML=" "+doc.data().marca;
                  divDetalhes.appendChild(document.createElement("br"));
                 divDetalhes.appendChild(marca);
                 break;
            case "omo":
               var marca=document.createElement("li");
                marca.setAttribute("class","fas fa-layer-group");
                   marca.style=" font-weight: 500;";
                 marca.innerHTML=" "+doc.data().marca;
               
                var tamanho=document.createElement("li");
                tamanho.innerHTML=doc.data().tamanho;
                tamanho.setAttribute("class","fas fa-window-restore");
                tamanho.style=" font-weight: 500;";
                  divDetalhes.appendChild(marca);
                  divDetalhes.appendChild(document.createElement("br"));
                   divDetalhes.appendChild(tamanho);


}

            document.getElementById("id"+doc.data().produto).appendChild(dados);
          document.getElementById("id"+doc.data().produto).appendChild(divDados);
           document.getElementById("id"+doc.data().produto).appendChild(detalhes);
           document.getElementById("id"+doc.data().produto).appendChild(divDetalhes);
          document.getElementById("id"+doc.data().produto).appendChild(document.createElement("hr"));


        }else{
           firebase.firestore().collection("publicacao").doc(doc.id).delete().then(function() {}).catch(function(error) {});
        }
}
        });
    });

}
}
//----------------------------------------------------------------------------------------------------------



















// Remover item conta user.html e user2.html
function remover(tel, id) {
    firebase.firestore().collection("publicacao")
        .where('contacto', '==', tel)
        .where('produto', '==', id).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

                firebase.firestore().collection("publicacao").doc(doc.id).delete().then(function() {}).catch(function(error) {});

            });
        });
}
//----------------------------------------------------------------------------------------------------------

// Carregar dados Uer.html e user2.html
function carregar(contacto) {
     firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
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
});
}

//---------------------------------------------------




//Adicionar Alimento Armazem Conta user2.html-----------------------------------
function itemproduto(botao){
 firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            if ("rgb(191, 5, 5)" != botao.style.background) {

                var precoAntes=document.getElementById(botao.name+"1").value;
                
                var titulo;
                switch(botao.name){
                    case "azeite":
                        titulo="Azeite";
                        break;
                    case "leite":
                        titulo="Caixa de Leite";
                        break;
                    case "massa":
                        titulo="Caixa de Massa";
                        break;
                    case "oleo":
                        titulo="Caixa de Oleo";
                        break;
                    case "ovo":
                        titulo="Cartão de Ovos";
                        break;
                    case "vinagre":
                        titulo="Vinagre";
                        break;
                    case "farinha":
                        titulo="Farinha Trigo";
                        break;
                    case "sal":
                        titulo="Sal";
                        break;
                    case "acucar":
                        titulo="Açucar";
                        break;
                    case "coxa":
                        titulo="Caixa de Coxa";
                        break;
                    case "caixafrango":
                        titulo="Caixa de Frango";
                        break;
                    case "peitofrango":
                        titulo="Caixa de Peito de Frango";
                        break;
                    case "alho":
                        titulo="Alho";
                        break;
                    case "batataRena":
                        titulo="Saco de Batata Rena";
                        break;
                    case "batataDoce":
                        titulo="Saco de Batata Doce";
                        break;
                    case "cebola":
                        titulo="Saco de Cebola";
                        break;
                    case "fuba":
                        titulo="Saco de Fuba";
                        break;
                    case "agua":
                        titulo="Grade de Água";
                        break;
                    case "feijao":
                        titulo="Feijão";
                        break;
                }
   document.getElementById("titulo").innerHTML=titulo;

        switch(botao.name){
            case "acucar":
            case "coxa":
            case "caixafrango":
            case "peitofrango":
                 document.getElementById("formulario").innerHTML="<form><div class='form-group'><label for='marcaProduto' class='col-form-label'>Marca</label><input type='text' class='form-control' id='marcaProduto'></div><div class='form-group'><label for='precoProduto' class='col-form-label'>Preço</label><input type='number' class='form-control' id='precoProduto'></div><div class='form-row'><div class='form-group col-md-6'><label for='peso'>Peso</label><input type='text' class='form-control' id='peso'></div><div class='form-group col-md-4'><label for='unidade'>Unidade</label><select id='unidade' class='form-control'><option selected disabled>Unidade</option><option>Kg</option><option>g</option></select></div></div></form>";
                 document.getElementById("precoProduto").value=precoAntes;
             break;
             case "azeite":
             case "leite":
             case "massa":
             case "oleo":
             case "ovo":
             case "vinagre":
             case "farinha":
             case "sal":

                document.getElementById("formulario").innerHTML="<form><div class='form-group'><label for='marcaProduto' class='col-form-label'>Marca</label><input type='text' class='form-control' id='marcaProduto'></div><div class='form-group'><label for='precoProduto' class='col-form-label'>Preço</label><input type='number' class='form-control' id='precoProduto'></div><div class='form-row'><div class='form-group col-md-6'><label for='quantidade'>Quantidade</label><input type='number' class='form-control' id='quantidade'></div><div class='form-group col-md-4'></div></div></form>";
                 document.getElementById("precoProduto").value=precoAntes;
            break;

           
            case "agua":
            document.getElementById("formulario").innerHTML="<form><div class='form-group'><label for='marcaProduto' class='col-form-label'>Marca</label><input type='text' class='form-control' id='marcaProduto'></div><div class='form-group'><label for='precoProduto' class='col-form-label'>Preço</label><input type='number' class='form-control' id='precoProduto'></div><div class='form-row'><div class='form-group col-md-6'><label for='peso'>Peso</label><input type='text' class='form-control' id='peso'></div><div class='form-group col-md-4'><label for='unidade'>Unidade</label><select id='unidade' class='form-control'><option selected disabled>Unidade</option><option>L</option><option>ml</option></select></div></div></form>";
             document.getElementById("precoProduto").value=precoAntes;
            break;
            case "feijao":
            document.getElementById("formulario").innerHTML="<form><div class='form-group'><label for='precoProduto' class='col-form-label'>Preço</label><input type='number' class='form-control' id='precoProduto'></div><div class='form-row'><div class='form-group col-md-6'><label for='peso'>Peso</label><input type='number' class='form-control' id='peso'></div><div class='form-group col-md-4'><label for='unidade'>Unidade</label><select id='unidade' class='form-control'><option selected>Unidade</option><option>Kg</option><option>g</option></select></div><div class='form-group col-md-4'><label for='tipo'>Tipo</label><select id='tipo' class='form-control'><option selected disabled>Tipo</option><option>Catarina</option><option>Espera Cunhado</option><option> Macunde</option><option>Manteiga</option><option>Preto</option><option>Verde</option></select></div></div></form>";
             document.getElementById("precoProduto").value=precoAntes;
           

        }

 var b = document.createElement("b");
                document.getElementById("confirmar").addEventListener("click",
                 function ola(){
                   



switch(botao.name){
            case "acucar":
            case "coxa":
            case "caixafrango":
            case "peitofrango":
                
                var localizacao1;
                var marca1=document.getElementById("marcaProduto").value;
                var precoProduto1=document.getElementById("precoProduto").value;
                var unidade1=document.getElementById("unidade").value;
                var peso1=document.getElementById("peso").value;

                if(marca1.length>0 && precoProduto1.length>0 && unidade1.length>0 && peso1.length>0)
                firebase.database().ref('empresa/' + user.uid + '/' + user.photoURL).once('value').then(function(snapshot) {
                    localizacao1 = (snapshot.val() && snapshot.val().localizacao);
                    var permissao1 = (snapshot.val() && snapshot.val().permissao);
                    var tipo1=(snapshot.val() && snapshot.val().tipo);
                    firebase.firestore().collection("publicacao").add({
                        produto: botao.name,
                        contacto: user.photoURL,
                        localizacao: localizacao1,
                        nome: user.displayName,
                        permissao: permissao1,
                        tipo: tipo1,
                        categoria: "alimento",
                        marca: marca1,
                        preco: precoProduto1,
                        unidade: unidade1,
                        peso: peso1,
                        id: user.uid

                    }).then(function(){
                        botao.setAttribute("data-toggle","");
                    botao.setAttribute("data-target","#");
                    b.style.background = "#28A745";
                b.style.padding = "1%";
                b.style.borderRadius = "10px";
                b.style.color = "#f3f3f3";
                b.style.fontSize = "11pt";
                botao.style.background = "#bf0505";
                botao.innerHTML = "<i class='fas fa-trash-alt'></i> Esgotado!";
                  b.innerHTML = " Divulgado";
                         var preco = document.getElementById(botao.name + "1");
                preco.disabled = true;
                if(document.getElementById(botao.name).childElementCount<1)
                document.getElementById(botao.name).appendChild(b);
                    });
                });
            else
                alert("Pro favor, Preencha Todos os Campos");

             break;
             case "azeite":
             case "leite":
             case "massa":
             case "oleo":
             case "ovo":
             case "vinagre":
             case "farinha":
             case "sal":

                var localizacao1;
                var marca1=document.getElementById("marcaProduto").value;
                var precoProduto1=document.getElementById("precoProduto").value;
                var quantidade1=document.getElementById("quantidade").value;
                if(marca1.length>0 && precoProduto1.length>0 && quantidade1.length>0)
                firebase.database().ref('empresa/' + user.uid + '/' + user.photoURL).once('value').then(function(snapshot) {
                    localizacao1 = (snapshot.val() && snapshot.val().localizacao);
                    var permissao1 = (snapshot.val() && snapshot.val().permissao);
                    var tipo1=(snapshot.val() && snapshot.val().tipo);
                    firebase.firestore().collection("publicacao").add({
                        produto: botao.name,
                        contacto: user.photoURL,
                        localizacao: localizacao1,
                        nome: user.displayName,
                        permissao: permissao1,
                        tipo: tipo1,
                        categoria: "alimento",
                        marca: marca1,
                        preco: precoProduto1,
                        quantidade: quantidade1,
                        id: user.uid

                    }).then(function(){
                        botao.setAttribute("data-toggle","");
                    botao.setAttribute("data-target","#");
                    b.style.background = "#28A745";
                b.style.padding = "1%";
                b.style.borderRadius = "10px";
                b.style.color = "#f3f3f3";
                b.style.fontSize = "11pt";
                botao.style.background = "#bf0505";
                botao.innerHTML = "<i class='fas fa-trash-alt'></i> Esgotado!";
                  b.innerHTML = " Divulgado";
                         var preco = document.getElementById(botao.name + "1");
                        preco.disabled = true;
                if(document.getElementById(botao.name).childElementCount<1)
                document.getElementById(botao.name).appendChild(b);
                    });
                });
                else
                alert("Pro favor, Preencha Todos os Campos");

            break;


            case "agua":
             var localizacao1;
                 var marca1=document.getElementById("marcaProduto").value;
                var precoProduto1=document.getElementById("precoProduto").value;
                var unidade1=document.getElementById("unidade").value;
                var peso1=document.getElementById("peso").value;
                 if(marca1.length>0 && precoProduto1.length>0 && peso1.length>0 && unidade1.length>0)
                  firebase.database().ref('empresa/' + user.uid + '/' + user.photoURL).once('value').then(function(snapshot) {
                    localizacao1 = (snapshot.val() && snapshot.val().localizacao);
                    var permissao1 = (snapshot.val() && snapshot.val().permissao);
                    var tipo1=(snapshot.val() && snapshot.val().tipo);
                    firebase.firestore().collection("publicacao").add({
                        produto: botao.name,
                        contacto: user.photoURL,
                        localizacao: localizacao1,
                        nome: user.displayName,
                        permissao: permissao1,
                        tipo: tipo1,
                        categoria: "alimento",
                        marca: marca1,
                        preco: precoProduto1,
                        unidade: unidade1,
                        peso: peso1,
                        id: user.uid

                    }).then(function(){
                        botao.setAttribute("data-toggle","");
                    botao.setAttribute("data-target","#");
                    b.style.background = "#28A745";
                b.style.padding = "1%";
                b.style.borderRadius = "10px";
                b.style.color = "#f3f3f3";
                b.style.fontSize = "11pt";
                botao.style.background = "#bf0505";
                botao.innerHTML = "<i class='fas fa-trash-alt'></i> Esgotado!";
                  b.innerHTML = " Divulgado";
                         var preco = document.getElementById(botao.name + "1");
                preco.disabled = true;
                if(document.getElementById(botao.name).childElementCount<1)
                document.getElementById(botao.name).appendChild(b);
                    });
                });
                  else
                alert("Pro favor, Preencha Todos os Campos");

            break;
            case "feijao":
            var localizacao1;
                var unidade1=document.getElementById("unidade").value;
                var precoProduto1=document.getElementById("precoProduto").value;
                var tipo2=document.getElementById("tipo").value;
                var peso1=document.getElementById("peso").value;
                 if(unidade1.length>0 && precoProduto1.length>0 && tipo2.length>0 && peso1.length>0)
                  firebase.database().ref('empresa/' + user.uid + '/' + user.photoURL).once('value').then(function(snapshot) {
                    localizacao1 = (snapshot.val() && snapshot.val().localizacao);
                    var permissao1 = (snapshot.val() && snapshot.val().permissao);
                    var tipo1=(snapshot.val() && snapshot.val().tipo);
                    firebase.firestore().collection("publicacao").add({
                        produto: botao.name,
                        contacto: user.photoURL,
                        localizacao: localizacao1,
                        nome: user.displayName,
                        permissao: permissao1,
                        tipo: tipo1,
                        categoria: "alimento",
                        preco: precoProduto1,
                        ftipo: tipo2,
                        peso: peso1,
                        id: user.uid,
                        unidade: unidade1


                    }).then(function(){
                        botao.setAttribute("data-toggle","");
                    botao.setAttribute("data-target","#");

                botao.style.background = "#bf0505";
                botao.innerHTML = "<i class='fas fa-trash-alt'></i> Esgotado!";
                  b.innerHTML = " Divulgado";
                  b.style.background = "#28A745";
                b.style.padding = "1%";
                b.style.borderRadius = "10px";
                b.style.color = "#f3f3f3";
                b.style.fontSize = "11pt";
                         var preco = document.getElementById(botao.name + "1");
                preco.disabled = true;
                if(document.getElementById(botao.name).childElementCount<1)
                document.getElementById(botao.name).appendChild(b);
                    });
                });
                  else
                alert("Pro favor, Preencha Todos os Campos");

            
        }

                }, false);



                
              

                botao.setAttribute("data-toggle","modal");
                    botao.setAttribute("data-target","#caixafrango2");
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
//--------------------------------------------------------------------------------------------------------------------------





function itemProduto1(botao){
 firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            if ("rgb(191, 5, 5)" != botao.style.background) {
                var preco = document.getElementById(botao.name + "1");
                if(preco.value.length>0){
                document.getElementById("titulo").innerHTML=botao.name; 

     

 var b = document.createElement("b");
            var localizacao1;
                
                
                firebase.database().ref('empresa/' + user.uid + '/' + user.photoURL).once('value').then(function(snapshot) {
                    localizacao1 = (snapshot.val() && snapshot.val().localizacao);
                    var permissao1 = (snapshot.val() && snapshot.val().permissao);
                    var tipo1=(snapshot.val() && snapshot.val().tipo);
                    firebase.firestore().collection("publicacao").add({
                        produto: botao.name,
                        contacto: user.photoURL,
                        localizacao: localizacao1,
                        nome: user.displayName,
                        permissao: permissao1,
                        tipo: tipo1,
                        categoria: "alimento",
                        preco: preco.value,
                        id: user.uid

                    }).then(function(){
                       
                         var preco = document.getElementById(botao.name + "1");
                preco.disabled = true;
                if(document.getElementById(botao.name).childElementCount<1)
                document.getElementById(botao.name).appendChild(b);

                b.style.background = "#28A745";
                b.style.padding = "1%";
                b.style.borderRadius = "10px";
                b.style.color = "#f3f3f3";
                b.style.fontSize = "11pt";
                botao.style.background = "#bf0505";
                botao.innerHTML = "<i class='fas fa-trash-alt'></i> Esgotado!";
                  b.innerHTML = " Divulgado";
                    });
                });

                }else
                 alert("Digite o Preço");
                
               
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








//-------------------------------------------------------------------------------------------------------------------------------

function itemHigiene(botao){
 firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            if ("rgb(191, 5, 5)" != botao.style.background) {
                var precoAntes=document.getElementById(botao.name+"1").value;
                document.getElementById("titulo").innerHTML=botao.name; 

        switch(botao.name){
            
             case "creme":
             case "gelbanho":
             case "sabaoliquido":
             case "lixivia":
                document.getElementById("formulario").innerHTML="<form><div class='form-group'><label for='marcaProduto' class='col-form-label'>Marca</label><input type='text' class='form-control' id='marcaProduto'></div><div class='form-group'><label for='precoProduto' class='col-form-label'>Preço</label><input type='number' class='form-control' id='precoProduto'></div></form>";
                document.getElementById("precoProduto").value=precoAntes;
            break;

           
            case "omo":
            document.getElementById("formulario").innerHTML="<form><div class='form-group'><label for='marcaProduto' class='col-form-label'>Marca</label><input type='text' class='form-control' id='marcaProduto'></div><div class='form-group'><label for='precoProduto' class='col-form-label'>Preço</label><input type='number' class='form-control' id='precoProduto'></div><div class='form-row'><div class='form-group col-md-4'><label for='unidade'>tamanho</label><select id='unidade' class='form-control'><option selected disabled>tamanho</option><option>Grande</option><option>Medio</option><option>Pequeno</option></select></div></div></form>";
            document.getElementById("precoProduto").value=precoAntes;
            break;
        }

 var b = document.createElement("b");
                document.getElementById("confirmar").addEventListener("click",
                 function ola(){
                    botao.setAttribute("data-toggle","");
                    botao.setAttribute("data-target","#");

                botao.style.background = "#bf0505";
                botao.innerHTML = "<i class='fas fa-trash-alt'></i> Esgotado!";
                  b.innerHTML = " Divulgado";
switch(botao.name){
            case "creme":
             case "gelbanho":
             case "sabaoliquido":
             case "lixivia":
             case "sabonete":
                
                var localizacao1;
                var marca1=document.getElementById("marcaProduto").value;
                var precoProduto1=document.getElementById("precoProduto").value;
                if(marca1.length>0 && precoProduto1.length>0)
                firebase.database().ref('empresa/' + user.uid + '/' + user.photoURL).once('value').then(function(snapshot) {
                    localizacao1 = (snapshot.val() && snapshot.val().localizacao);
                    var permissao1 = (snapshot.val() && snapshot.val().permissao);
                    var tipo1=(snapshot.val() && snapshot.val().tipo);
                    firebase.firestore().collection("publicacao").add({
                        produto: botao.name,
                        contacto: user.photoURL,
                        localizacao: localizacao1,
                        nome: user.displayName,
                        permissao: permissao1,
                        tipo: tipo1,
                        categoria: "higiene",
                        marca: marca1,
                        preco: precoProduto1,
                        id: user.uid

                    }).then(function(){
                       
                         var preco = document.getElementById(botao.name + "1");
                preco.disabled = true;
                if(document.getElementById(botao.name).childElementCount<1)
                document.getElementById(botao.name).appendChild(b);
                    });
                });
            else
                alert("Por favor, Preencha Todos os Campos");

             break;
             case "omo":
            

                var localizacao1;
                var marca1=document.getElementById("marcaProduto").value;
                var precoProduto1=document.getElementById("precoProduto").value;
                var quantidade1=document.getElementById("unidade").value;
                if(marca1.length>0 && precoProduto1.length>0 && quantidade1.length>0)
                firebase.database().ref('empresa/' + user.uid + '/' + user.photoURL).once('value').then(function(snapshot) {
                    localizacao1 = (snapshot.val() && snapshot.val().localizacao);
                    var permissao1 = (snapshot.val() && snapshot.val().permissao);
                    var tipo1=(snapshot.val() && snapshot.val().tipo);
                    firebase.firestore().collection("publicacao").add({
                        produto: botao.name,
                        contacto: user.photoURL,
                        localizacao: localizacao1,
                        nome: user.displayName,
                        permissao: permissao1,
                        tipo: tipo1,
                        categoria: "higiene",
                        marca: marca1,
                        preco: precoProduto1,
                        tamanho: quantidade1,
                        id: user.uid

                    }).then(function(){
                       
                         var preco = document.getElementById(botao.name + "1");
                        preco.disabled = true;
                if(document.getElementById(botao.name).childElementCount<1)
                document.getElementById(botao.name).appendChild(b);
                    });
                });
                else
                alert("Por favor, Preencha Todos os Campos");

            break;  
        }
                }, false);


                //--------------------------------------------------------------------
                
                var localizacao1;               
                b.style.background = "#28A745";
                b.style.padding = "1%";
                b.style.borderRadius = "10px";
                b.style.color = "#f3f3f3";
                b.style.fontSize = "11pt";
                botao.setAttribute("data-toggle","modal");
                    botao.setAttribute("data-target","#caixafrango2");
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





function itemHigiene1(botao){
 firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            if ("rgb(191, 5, 5)" != botao.style.background) {
                  var preco = document.getElementById(botao.name + "1");
                  if(preco.value.length>0){ 
                document.getElementById("titulo").innerHTML=botao.name; 

     

 var b = document.createElement("b");
            var localizacao1;
                
                
                firebase.database().ref('empresa/' + user.uid + '/' + user.photoURL).once('value').then(function(snapshot) {
                    localizacao1 = (snapshot.val() && snapshot.val().localizacao);
                    var permissao1 = (snapshot.val() && snapshot.val().permissao);
                    var tipo1=(snapshot.val() && snapshot.val().tipo);
                    firebase.firestore().collection("publicacao").add({
                        produto: botao.name,
                        contacto: user.photoURL,
                        localizacao: localizacao1,
                        nome: user.displayName,
                        permissao: permissao1,
                        tipo: tipo1,
                        categoria: "higiene",
                        preco: preco.value,
                        id: user.uid

                    }).then(function(){
                       
                         var preco = document.getElementById(botao.name + "1");
                preco.disabled = true;
                if(document.getElementById(botao.name).childElementCount<1)
                document.getElementById(botao.name).appendChild(b);

                b.style.background = "#28A745";
                b.style.padding = "1%";
                b.style.borderRadius = "10px";
                b.style.color = "#f3f3f3";
                b.style.fontSize = "11pt";
                botao.style.background = "#bf0505";
                botao.innerHTML = "<i class='fas fa-trash-alt'></i> Esgotado!";
                  b.innerHTML = " Divulgado";
                    });
                });


                //--------------------------------------------------------------------
                
                
               }else
                alert("Digite o Preço");
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

function newsletter(){
    
    var email=document.getElementById("emailsub").value;
    if(/^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/.test(email)){
    document.getElementById("subscreverform").style.display="none";
    document.getElementById("subscrevertext").innerHTML="<strong>Subscrito!<strong><br> Em breve receberá as actualizações por email";
    document.getElementById("subscrevertitle").innerHTML="Agradecemos a sua preferência";
      firebase.firestore().collection("Subscritores").add({
        email: email 
     });
     if (Notification.permission !== "granted"){
        messaging();
    }
    }else{
        alert("Email invalido");
    }
   

}

function noticias(){
    firebase.database().ref("noticias/").once('value').then(function(result){
         document.getElementById("carregarNoticias").style.display="none";
        if(result.numChildren()==0)
            document.getElementById("semNoticias").style.display="block";
        result.forEach(function(dado) {
            var chave=dado.key;
            var imagem=dado.val().link;
            var titulo=dado.val().titulo;
            var resumo=dado.val().resumo;
            var texto=dado.val().texto;
            var fonte=dado.val().fonte;
            var data=dado.val().data;
            
            var div=document.createElement("div");    
            div.setAttribute("class","bloco_singular");   
            div.setAttribute('type',"button");
            div.setAttribute("data-toggle",'modal');
            div.setAttribute("data-target",'#'+chave);
           
        div.innerHTML="<div class='segurador'></div><div class='foto_conteiner'><img src="+imagem+" style='height: 228px;'></div><div class='texto_noticia' style='margin-top: 190px; width: 100%;'><h5 style='margin-bottom: 0;margin-left: 15px;'>"+titulo+"</h5><p style='overflow-wrap: anywhere; padding-top: 0;'>"+resumo+"<br><br><span>Fonte: "+fonte+"</span><br><span>"+data+"</span></p></div><a style='cursor: pointer;'>Mais detalhes...</a>";
      document.getElementById("carregarNoticias").style.display="none";
        document.getElementById("localNoticias").insertBefore(div, document.getElementById("localNoticias").childNodes[0]);
        
      var pai=document.createElement("div");
pai.setAttribute("class","modal fade");
pai.setAttribute("id",chave);
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
pai2_1_2.innerHTML="Notícia";

    var pai2_1_3=document.createElement("buttom");
pai2_1_3.setAttribute("class","close");
pai2_1_3.setAttribute("type","buttom");
pai2_1_3.style.cursor="pointer";
pai2_1_3.setAttribute("data-dismiss","modal");
pai2_1_3.setAttribute("aria-label","Close");

var pai2_1_3_1=document.createElement("span");
pai2_1_3_1.innerHTML="&times;";
pai2_1_3_1.setAttribute("aria-hidden","true");


var pai2_2=document.createElement("div");
pai2_2.setAttribute("class","modal-body");
pai2_2.style="padding: 1rem;overflow-wrap: anywhere;";
pai2_2.innerHTML="<h4>"+titulo+"</h4><p style='margin-left: 15px;'>"+texto+"</p><br><small>Fonte: "+fonte+"</small><br><small>"+data+"</small>";




pai.appendChild(pai1);
pai1.appendChild(pai2);
pai2.appendChild(pai2_1);
pai2_1.appendChild(pai2_1_2);
pai2_1.appendChild(pai2_1_3);
pai2_1_3.appendChild(pai2_1_3_1);
pai2.appendChild(pai2_2);

document.getElementsByTagName("body")[0].appendChild(pai);

    });
    });
    



}