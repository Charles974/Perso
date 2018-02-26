'use strict'

//Création des namespace
let monster={
	modules:{}
};

monster.modules={
	//Actions du monstres
	actions:(function(){
		let nom='';
		let life=0;
		let money=0;
		let experience=0;
		let niveau=1;
		let evolution='';
		let partie=0;
		let awake=true;

		let showMe=()=>{
			status="endormis";
			if(awake){
				status="reveillé";
			}
			monster.modules.app.displayStatus(life,money,status);
			let text=nom+" a "+life+"pv et "+money+"po. Il est "+status+".";
			monster.modules.app.log(text);
		};

		let init=(surnom,vie,argent,reveil,rez=null)=>{
			nom=surnom;
			life=vie;
			if(money===0){
				money=argent;
			}
			if(!rez){
				experience=0;
				niveau=1;
				evolution='Salameche';
			}else if(rez===null){
				experience=0;
				niveau=1;
				evolution='Salameche';
				partie=0;
			}
			awake=true;
		};

		let run=()=>{
			if(life>0){
				if(awake){
					life--;
					monster.modules.app.log("Cours");
				}else{
					monster.modules.app.log("Quand on dors, on ne cours pas !");
				}
			}else{
				monster.modules.app.log("On ne cours pas quand on est mort ou presque...");
			}
			monster.modules.app.displayStatus(life,money,status);
		};

		let fight=()=>{
			if(life>2){
				if(awake){
					life-=3;
					experience+=2;
					let maxexp=niveau*10;
					if(experience>=maxexp){
						experience=0;
						niveau++;
						life=100;
						money+=10*niveau;
					}
					if(niveau===16){
						evolution='Reptincel';
					}
					if(niveau===36){
						evolution='Dracaufeu';
					}
					if(niveau===100){ //On ne dépasse pas le niveau 100 !
						experience=0;
					}
					let test=Math.floor(Math.random()*(5-1)+1);
					switch(test){
						case 1:
							if(evolution==='Reptincel'){
								monster.modules.app.log("Combat de térribles créatures avec Frappe Atlas");
							}else{
								monster.modules.app.log("Combat de térribles créatures avec Poing-Karaté");
							}
							break;
						case 2:
							if(evolution==='Dracaufeu'){
								monster.modules.app.log("Combat de térribles créatures avec Vol");
							}else{
								monster.modules.app.log("Combat de térribles créatures avec Tunnel");
							}
							break;
						case 3:
							monster.modules.app.log("Combat de térribles créatures avec Dracogriffe");
							break;
						case 4:
							monster.modules.app.log("Combat de térribles créatures avec son Poing de Feu");
							break;
					}
				}else{
					monster.modules.app.log("Quand on dors, on ne combat pas !");
				}
			}else{
				monster.modules.app.log("On ne combat pas quand on est mort ou presque...");
			}
			monster.modules.app.displayStatus(life,money,status);
		};

		let work=()=>{
			if(life>0){
				if(awake){
					life--;
					money+=2;
					monster.modules.app.log("Travaille durement");
				}else{
					monster.modules.app.log("Quand on dors, on ne travail pas !");
				}
			}else{
				monster.modules.app.log("On ne travail pas quand on est mort ou presque...");
			}
			monster.modules.app.displayStatus(life,money,status);
		};

		let eat=()=>{
			let maxvie=life+2;
			if(life>0 && life<100 && money>3){
				if(awake){
					life+=2;
					money-=3;
					monster.modules.app.log("Mange calmement");
				}else{
					monster.modules.app.log("Quand on dors, on ne mange pas !");
				}
			}else if(maxvie>=100){
				monster.modules.app.log("N'a plus faim");
			}else{
				monster.modules.app.log("On ne mange pas quand on est mort ou presque...");
			}
			monster.modules.app.displayStatus(life,money,status);
		};

		let sleep=()=>{
			if(life>0){
				awake=false;
				status="endormis";
				monster.modules.app.log("Dors paisiblement");
				monster.modules.app.displayStatus(life,money,status);
				setTimeout(function(){
						awake=true;
						monster.modules.app.log("Se réveille");
						life++;
						status="reveillé";
						monster.modules.app.displayStatus(life,money,status);
					}, 10000);
			}else{
				monster.modules.app.log("On ne dors pas quand on est mort ou presque...");
			}
		};
		
		let hasard=()=>{
			setInterval(function(){
				let test=Math.floor(Math.random()*(6-1)+1);
				switch(test){
					case 1:
						monster.modules.actions.run();
						break;
					case 2:
						monster.modules.actions.fight();
						break;
					case 3:
						monster.modules.actions.work();
						break;
					case 4:
						monster.modules.actions.eat();
						break;
					case 5:
						monster.modules.actions.sleep();
						break;
				}
			},12000);
		};

		let kill=()=>{
			life=0;
			monster.modules.app.log("Meurs dans d'atroce souffrance !");
			monster.modules.app.displayStatus(life,money,status);
		};

		let reset=()=>{
			if(money>=500 && life<=0){
				money-=500;
				monster.modules.actions.init(monster.modules.actions.getNom(),100,money,true,false);
				monster.modules.app.log("Reviens à la vie par l'intervention du nécromancien !");
				monster.modules.app.displayStatus(life,money,status);
			}else if(life<=0){
				partie++;
				monster.modules.app.log("Quel dommage, vous n'avez pas assez d'argent... Vous avez "+money+" alors qu'il faut 500...");
				monster.modules.app.log("Un nouveau monstre a été généré...");
				monster.modules.actions.init("Franky"+partie,100,50,true,true);
				monster.modules.app.displayStatus(life,money,status);
			}
		};

		let getNom=()=>{
			return nom;
		};

		let getNiveau=()=>{
			return niveau;
		};

		let getEvolution=()=>{
			return evolution;
		};

		return{
			showMe,
			init,
			run,
			fight,
			work,
			eat,
			sleep,
			hasard,
			kill,
			reset,
			getNom,
			getNiveau,
			getEvolution
		};
	})(),

	//Application
	app:(function(){

		let show=document.querySelector("#show");
		let run=document.querySelector("#run");
		let fight=document.querySelector("#fight");
		let work=document.querySelector("#work");
		let sleep=document.querySelector("#sleep");
		let eat=document.querySelector("#eat");
		let reset=document.querySelector("#reset");
		let kill=document.querySelector("#kill");
		let actionBox=document.querySelector("#actionbox");
		let status=document.querySelector("#status");
		let monstre=document.querySelector(".monster");
		let titre=document.querySelector("#titre");
		
		//Démarrage de l'application et déclaration des handlers
		let start=(surnom,vie,argent,reveil)=>{

			monster.modules.actions.init('Franky',100,50,true,false);
			monster.modules.app.showUs();
			monster.modules.actions.hasard();

			show.addEventListener("click", (event) => {
				monster.modules.app.showUs();
			});

			run.addEventListener("click", (event) => {
				monster.modules.actions.run();
			});

			fight.addEventListener("click", (event) => {
				monster.modules.actions.fight();
			});

			work.addEventListener("click", (event) => {
				monster.modules.actions.work();
			});

			eat.addEventListener("click", (event) => {
				monster.modules.actions.eat();
			});

			sleep.addEventListener("click", (event) => {
				monster.modules.actions.sleep();
			});

			kill.addEventListener("click", (event) => {
				monster.modules.actions.kill();
			});

			reset.addEventListener("click", (event) => {
				monster.modules.actions.reset();
			});
		};

		let showUs=()=>{
			monster.modules.actions.showMe();
		};

		let log=(message)=>{
			let p=document.createElement("p");
			let t=document.createTextNode(message);
			p.appendChild(t);
			let premier=actionBox.firstChild;
			actionBox.insertBefore(
				p,
				premier
			);
		};

		let displayStatus=(life,money,awake)=>{
			let liVie=document.createElement("li");
			let vie=document.createTextNode("Life:"+life);
			liVie.appendChild(vie);
			let liArgent=document.createElement("li");
			let argent=document.createTextNode("Money:"+money);
			liArgent.appendChild(argent);
			let liAwake=document.createElement("li");
			let etat=document.createTextNode(awake);
			liAwake.appendChild(etat);
			
			let p1=document.createElement("p");
			let p2=document.createElement("p");
			let p3=document.createElement("p");
			let textNom=document.createTextNode(monster.modules.actions.getNom());
			let textNiveau=document.createTextNode("Niveau:"+monster.modules.actions.getNiveau());
			let textEvolution=document.createTextNode("Forme:"+monster.modules.actions.getEvolution());
			p1.appendChild(textNom);
			p2.appendChild(textNiveau);
			p3.appendChild(textEvolution);

			let textNecromancien=document.createTextNode("Necromancien");
			let textTitre=document.createTextNode("La vie incroyable de "+monster.modules.actions.getNom());

			let consigneStyle='';
			if(life>=75){
				consigneStyle=consigneStyle+'background-color: green; color: white;';
			}else if(life>=50){
				consigneStyle=consigneStyle+'background-color: blue; color: white;';
			}else if(life>=25){
				consigneStyle=consigneStyle+'background-color: orange; color: white;';
			}else if(life>0){
				consigneStyle=consigneStyle+'background-color: red; color: white;';
			}else if(life<=0){
				consigneStyle=consigneStyle+'background-color: black; color: white;';
			}
			let consigneStyleM='background-color: black; color: white; width: 150px; text-align: center;';
			if(money>=200){
				consigneStyleM=consigneStyleM+'border: 5px solid gold;';
			}else if(money>=100){
				consigneStyleM=consigneStyleM+'border: 4px solid gold;';
			}else if(money>=50){
				consigneStyleM=consigneStyleM+'border: 3px solid gold;';
			}else if(money>=0){
				consigneStyleM=consigneStyleM+'border: 2px solid gold;';
			}else if(money<=0){
				consigneStyleM=consigneStyleM+'border: 1px solid gold;';
			}
			
			status.setAttribute('style',consigneStyle);
			monstre.setAttribute('style',consigneStyleM);
			monstre.replaceChild(p1,monstre.childNodes[1]);
			monstre.replaceChild(p2,monstre.childNodes[2]);
			if(monstre.childNodes[3]){
				monstre.replaceChild(p3,monstre.childNodes[3]);
			}else{
				monstre.appendChild(p3);
			}
			status.replaceChild(liVie,status.childNodes[1]);
			status.replaceChild(liArgent,status.childNodes[2]);
			status.replaceChild(liAwake,status.childNodes[3]);
			reset.replaceChild(textNecromancien,reset.childNodes[0]);
			titre.replaceChild(textTitre,titre.childNodes[0]);
		};

		return{
			start,
			showUs,
			log,
			displayStatus
		};
	})()
};

//Déclaration et appel listener
window.addEventListener("load", monster.modules.app.start);









