const loadlogin = function(){
	const btnLogin = document.querySelector('#btnLogin');
	btnLogin.addEventListener('click',function(){
		User.save(document.querySelector('#username').value);
		localStorage.setItem('carro',"");
		window.location.href = "home.html";
	})
}

const logOut = function() {
	User.remove();
	localStorage.removeItem('carro');
	window.location.href = "index.html";
}

const buscarCategoria = function(nom){
	let similitudes = [];
	if(nom!=''){
		for(let i=0;i<getCantProducts();i++){
			if(getProduct(i).categoria.indexOf(nom)!=-1){
				similitudes.push(getProduct(i));
			}
		}		
	}
	return similitudes;
}

const buscarProducto = function(nom){
	let similitudes = [];
	if(nom!=''){
		for(let i=0;i<getCantProducts();i++){
			if(getProduct(i).name.indexOf(nom)!=-1){
				similitudes.push(getProduct(i));
			}
		}		
	}
	return similitudes;
}

const redireccionBusqueda = function(){
	let nom = document.querySelector('#search').value;
	if(nom!=''){
		localStorage.setItem('busqueda',nom);
		console.log(localStorage.getItem('busqueda'));
		window.location.href = "search.html";
	}
}

const busqueda = function(){
	let nom = localStorage.getItem('busqueda');
	let resultados = buscarProducto(nom);
	const titulo = document.querySelector('.busqueda h3');
	let leyenda = "";
	console.log(resultados);
	if(resultados.length!=0){
		titulo.innerHTML = leyenda.concat('Resultados para "',nom,'"');
		let j=0;
		let maxI = resultados.length;
		for(let i=0;i<maxI;i++){
			if((i+1)%4==0){
				bajarLinea();
				maxI++;
			}else{
				renderProduct(resultados[j],false,(i+1)%4==0);
				j++;
			}
		}
	}
	else{
		console.log("NADA")
		titulo.innerHTML = leyenda.concat('No hay resultados para "',nom,'"');
	}
	localStorage.removeItem('busqueda');

}

const showUsername = function() {
	const username = document.querySelector('.username');
	const usernameText = document.createTextNode(User.get() || 'Anonimo');
	username.appendChild(usernameText);
}

const searchInit = function(){
	document.querySelector(".logout").addEventListener('click',logOut);
	document.querySelector("#btnSearch").addEventListener('click',redireccionBusqueda);
	document.querySelector("#btnShopping").addEventListener('click',redireccionCarrito);
	showUsername();
	busqueda();
	agregarEventComprar();
}
const carritoInit = function(){
	document.querySelector(".logout").addEventListener('click',logOut);
	document.querySelector("#btnSearch").addEventListener('click',redireccionBusqueda);
	document.querySelector("#btnShopping").addEventListener('click',redireccionCarrito);
	document.querySelector("#pagar").addEventListener('click',pagar);
	showUsername();
	mostrarCarrito();
	mostrarTotal();

}

const pagar = function(){
	localStorage.setItem('carro',"");
	alert('Gracias por completar su compra!' );
}

const mostrarTotal = function() {
	var total = 0;
	let guardado = localStorage.getItem('carro');
	let resultados = [];
	resultados = JSON.parse(guardado);
	for(let i=0;i<resultados.length;i++){
		total += parseFloat(resultados[i].precio);
	}
	const titulo = document.querySelector('.total h1');
	let leyenda = "";
	if(total!=0){
		titulo.innerHTML = leyenda.concat("Total: $",total);
	}
}


const init = function(){
	document.querySelector(".logout").addEventListener('click',logOut);
	document.querySelector("#btnSearch").addEventListener('click',redireccionBusqueda);
	document.querySelector("#btnShopping").addEventListener('click',redireccionCarrito);
	showUsername();
	renderProduct(getProduct(0),false);
	renderProduct(getProduct(1),false);
	renderProduct(getProduct(2),false);
	agregarEventComprar();
}

const categoriaInit = function(){
	document.querySelector(".logout").addEventListener('click',logOut);
	document.querySelector("#btnSearch").addEventListener('click',redireccionBusqueda);
	document.querySelector("#btnShopping").addEventListener('click',redireccionCarrito);
	showUsername();
	mostrarCategoria();
	agregarEventComprar();
}

const mostrarCategoria = function(){
	let resultados = products;
	const titulo = document.querySelector('.busqueda h1');
	let leyenda = "";
	if(resultados!=null){
		titulo.innerHTML = leyenda.concat("Categoria");
		let j=0;
		let maxI = resultados.length;
		for(let i=0;i<maxI;i++){
			if((i+1)%4==0){
				bajarLinea();
				maxI++;
			}else{
				renderProduct(resultados[j],false);
				j++;
			}
		}
	}
	else{
		titulo.innerHTML = leyenda.concat('No hay elementos en esta categoria.');
	}
}

const redireccionCategoria = function(){
	window.location.href = "categoria.html"
}

const mostrarCarrito = function(){
	let guardado = localStorage.getItem('carro');
	let resultados = [];
	resultados = JSON.parse(guardado);
	const titulo = document.querySelector('.busqueda h1');
	let leyenda = "";
	if(resultados!=null){
		titulo.innerHTML = leyenda.concat('Carrito de compra');
		let j=0;
		let maxI = resultados.length;
		for(let i=0;i<maxI;i++){
			if((i+1)%4==0){
				bajarLinea();
				maxI++;
			}else{
				renderProduct(resultados[j],true);
				j++;
			}
		}
	}
	else{
		titulo.innerHTML = leyenda.concat('El carrito esta vacio.');
	}
}

const bajarLinea = function(){
	let divPadre = document.querySelector('.busqueda');
	let divPrincipal = document.createElement('div');
	divPrincipal.classList.add('seccion');
	divPrincipal.classList.add('productos');
	divPadre.appendChild(divPrincipal);
}

const redireccionCarrito = function(){
	window.location.href = "carrito.html"
}

const agregarEventComprar = function(){
	let botones = document.querySelectorAll(".btnCompra");
	for(let i=0;i<botones.length;i++){
		botones[i].addEventListener('click',agregarCompra);
	}
}

const agregarCompra = function(){
	const guardado = localStorage.getItem('carro');
	carrito = [];
	if(guardado!=""){
		const resultados = JSON.parse(guardado);
		for(let i=0;i<resultados.length;i++){
			carrito.push(resultados[i]);
		}
	}
	carrito.push(getProduct(this.id));
	console.log(carrito);
	localStorage.setItem('carro',JSON.stringify(carrito));
	alert('Se añadio "'+ getProduct(this.id).name + '" a tu carrito!' );
}

class User{
	static key = 'username';
	constructor () {
	}
	static save (user) { 
		localStorage.setItem(this.key,user);
	}

	static get () {
		return localStorage.getItem(this.key);
	}

	static remove() {
		localStorage.removeItem(this.key);
	}
}

const renderProduct = function(producto,btn) {
	let divPadre = document.querySelectorAll('.productos');
	let divPrincipal = divPadre[divPadre.length-1];
	let divContenedor = document.createElement('div');
	divContenedor.classList.add('producto');
	divPrincipal.appendChild(divContenedor);
	divContenedor.appendChild(createImg(`img/productos/${producto.img}.png`));
	divContenedor.appendChild(createName(producto.name));
	let signo = "$ ";
	divContenedor.appendChild(createPrecio(signo.concat(producto.precio)));
	if(btn==false)
		divContenedor.appendChild(createButton(producto.id));
}

const createButton = function(iden){
	const productButton = document.createElement('button');
	productButton.classList.add('btn-relleno');
	productButton.classList.add('btnCompra');
	productButton.innerHTML = "comprar";
	productButton.id = iden;
	return productButton;
}
const createImg = function(url) {
	const productImg = document.createElement('img');
	productImg.src = url;
	productImg.classList.add('image');
	return productImg;
}

const createName = function (name) {
	const productName = document.createElement('h2');
	const text = document.createTextNode(name);
	productName.appendChild(text);
	productName.classList.add('texto');
	return productName;
}

const createPrecio = function(precio){
	const productPrecio = document.createElement('h2');
	const text = document.createTextNode(precio);
	productPrecio.appendChild(text);
	productPrecio.classList.add('texto');
	return productPrecio;
}

const getProduct = function (index) {
	return  products[index];
}
const getCantProducts = function (){
	return products.length;
}
let carrito = [];
const products = [
	{
		id: '0',
		name: 'TV Philips 32 Pulgadas 720p HD',
		img: '0',
		precio: 2999
	},
	{
		id: '1',
		name: 'TV Samsung 43 Pulgadas 1080p Full HD',
		img: '1',
		precio: 5999
	},
	{
		id: '2',
		name: 'TV Samsung 55 Pulgadas 4K Ultra HD',
		img: '2',
		precio: 9974
	},
	{
		id: '3',
		name: 'TV Hisense 65 Pulgadas 4K Ultra HD',
		img: '3',
		precio: 11999
	},
	{
		id: '4',
		name: 'Pantalla 58 pulgadas 4K Ultra HD Hisense',
		img: '4',
		precio: 11680
	},
	{
		id: '5',
		name: 'TV Philips 50 Pulgadas 2160p 4K',
		img: '5',
		precio: 7999
	},
	{
		id: '6',
		name: 'TV Samsung 65 Pulgadas 4K Ultra HD Curva',
		img: '6',
		precio: 39999
	},
	{
		id: '7',
		name: 'PANTALLA LG 43 Pulgadas LG',
		img: '7',
		precio: 8999
	},
	{
		id: '8',
		name: 'TV Samsung 75 Pulgadas 4K',
		img: '8',
		precio: 25800
	},
	{
		id: '9',
		name: 'Pantalla JVC 43 Pulgadas',
		img: '9',
		precio: 5999
	},
	{
		id: '10',
		name: 'TV LG 43 Pulgadas 4K Ultra HD',
		img: '10',
		precio: 8999
	},
	{
		id: '11',
		name: 'TV Smart Full HD Sharp',
		img: '11',
		precio: 5834
	},
	{
		id: '12',
		name: 'TV Sony 49 Pulgadas 4K Ultra HD',
		img: '12',
		precio: 14039
	},
	{
		id: '13',
		name: 'TV RCA 32 Pulgadas HD',
		img: '13',
		precio: 3999
	},
	{
		id: '14',
		name: 'Tv Hisense 75 Pulgadas 4K Ultra HD',
		img: '14',
		precio: 31999
	},
	{
		id: '15',
		name: 'Pantalla Ultra HD 4K 65 Pulgadas Hisense',
		img: '15',
		precio: 13999
	},
	{
		id: '16',
		name: ' 49 pulgadas Makena',
		img: '16',
		precio: 7519
	},
	{
		id: '17',
		name: 'TV LG 65 Pulgadas 4K Ultra HD',
		img: '17',
		precio: 23999
	},
	{
		id: '18',
		name: 'Tv Sharp 32 Pulgadas 720p HD',
		img: '18',
		precio: 4499
	},
	{
		id: '19',
		name: 'Pantalla Hisense 50 Pulgadas 4K Hisense',
		img: '19',
		precio: 7999
	},
	{
		id: '20',
		name: 'TV Hisense 65 Pulgadas 4K Ultra HD',
		img: '20',
		precio: 13999
	},
	{
		id: '21',
		name: 'TV Samsung 32 Pulgadas HD',
		img: '21',
		precio: 4799
	},
	{
		id: '22',
		name: 'TV Vizio 65 Pulgadas 4K Ultra HD',
		img: '22',
		precio: 10999
	},
	{
		id: '23',
		name: 'TV HD Panasonic 32 Pulgadas',
		img: '23',
		precio: 7670
	}
]