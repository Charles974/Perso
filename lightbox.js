'use strict'

let lightbox = {
	modules : {}
};


lightbox.modules = (function () {

	//handler Fermer l'image
    $('#modal_close').click((event)=>{
      closeImg();
    });

    //handler pour afficher l'image précédente
    $('#modal_previous').click((event)=>{
      previous();
    });

    //handler pour afficher l'image suivante
    $('#modal_next').click((event)=>{
      next();
    });

    //handler pour ajouter un commentaire a une image spécifique
    $('#modal_content img').click((event)=>{
      ajouter();
    });

    //handler pour afficher les commentaires d'une image
    $('#modal_com').click((event)=>{
      afficheCommentaire();
    });

	let cible='';
	let imageCourante;
	//fonction de ajouter l'image
	let addImg = (function (){
		$(".vignette").click((event) => {

			let modal = $(".modal");
			let content = $("#modal_content");
			let img = $("#bigImg");

			cible=$(event.target);
			let src = cible.data("img");
          	let desc=cible.next()[0].innerText;

			img.attr("src", src);
			modal.toggle("slow");

		});
	})

	//Fonction pour fermer une image
	let closeImg = (function () {
		let unBtn = document.querySelector("#modal_close");
			let modal = $(".modal");
			modal.hide("slow");
	})

	//Fonction pour afficher l'image suivante par rapport à celle actuelle
	let next = (function () {
		let btnNext = document.querySelector("#modal_next");

        //Erreur avec cible.find
		if(cible.parent().next().find("img").length!==0){
         	cible=cible.parent().next().find("img");
        }
        else
        {
          	let lastCible = cible;
          	while(cible.length!==0){
            	lastCible=cible;
            	cible=cible.parent().prev().find("img");
          	}
          	cible=lastCible;
        }

        let src=cible.data('img');
        let desc=cible.next()[0].innerText;
        let modWindow=document.querySelector('#modal_content img');
        modWindow.setAttribute('src',src);
        let modDiv=document.querySelector('#modal_content div');
        modDiv.innerText=desc;
	})

	//Fonction pour afficher l'image précédente
	let previous = (function () {

        //Erreur avec cible.parent
		if(cible.parent().prev().find("img").length!==0){
        	cible=cible.parent().prev().find("img");
        }
        else{
        	let lastCible = cible;
        	while(cible.length!==0){
        		lastCible=cible;
        		cible=cible.parent().next().find("img");
        	}
          	cible=lastCible;
        }

        let src=cible.data('img');
        let desc=cible.next()[0].innerText;
        let modWindow=document.querySelector('#modal_content img');
        modWindow.setAttribute('src',src);
        let modDiv=document.querySelector('#modal_content div');
        modDiv.innerText=desc;

	})

	//Fonction pour ajouter un commentaire
	let ajouter = (function () {
		let commentaire=prompt("Ajoutez un commentaire");

        if(commentaire!==null){
        	let nom=cible.data("img");
        	let tab = [];
        	if(localStorage.getItem(nom)!=null){
        		tab=JSON.parse(localStorage.getItem(nom));
        		tab[tab.length]=commentaire;
        	}
        	else{
        		tab[0]=commentaire;
        	}
        	//console.table(tab);
        	localStorage.setItem(nom,JSON.stringify(tab));
        }
	})

	//Fonction pour afficher un commentaire
	let afficheCommentaire = (function () {
		let modaldiv=document.querySelector('#modal_content div');
        let nom=cible.data("img");
        let tab =JSON.parse(localStorage.getItem(nom));

        if(tab!=null){
        	for(let i=0;i<tab.length+1;i++){
        		if(tab[i]!=null){
					let p=document.createElement("p");
	 				let span=document.createElement("span");
					let desc=document.createTextNode(tab[i]);

					span.appendChild(desc)
					span.setAttribute('class','commentaire');
					span.setAttribute('data-id',i);

					p.appendChild(span);
					p.setAttribute('class','commentaire_cadre');
					
					if(modaldiv.childNodes[i+1]){
						modaldiv.replaceChild(p,modaldiv.childNodes[i+1]);
					}
					else{
						modaldiv.appendChild(p);
					}
				}
				else
				{
					if(modaldiv.childNodes[i+1]){
						modaldiv.removeChild(modaldiv.childNodes[i+1]);
					}
				}
          	}
        }
	})
    
    //////////
    //Gestion de navigation avec les touches
    /*Ne fonctionne pas*/
    //////////
    $(document).keydown(function (e) {
        switch (e.which) {
            case 37:
                previous();
                break;
            case 39:
                next();
                break;
            case 27:
                closeImg();
                break;
        }
    });

	return {
		addImg,
		closeImg,
		next,
		previous,
		ajouter,
		afficheCommentaire
	}
}) ();

window.addEventListener("load", ()=> {lightbox.modules.addImg()})

