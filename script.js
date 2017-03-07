// Funkcja przekierowuje na stronę główną
function mainPage() {
	window.location.href = "index.php";
}

// Przekierowuje do podstrony logującej
function login() {
	window.location.href = "login.php";
}

// Przekierowuje do formularza rejestrowania
function register() {
	window.location.href = "register.php";
}

// Wylogowuje
function logout() {
	window.location.href = "index.php?logout=yes";
}

// Pobranie dokumentacji
function downloadSpecifications() {
	window.location.href = "plytoteka-dokumentacja.pdf";
}

// Uniewidacznia elementy w centralnej części ekranu
function cleanCenter() {
	var el = document.getElementsByClassName('inner_center');
	for (var i=0; i<el.length; ++i)
		el[i].style.display = "none";
}

// Wyświetla w left_section opcje do pracy w trybie online dla osoby offline
function goServer() {
	var el = document.getElementById('offline_box');
	el.style.display = "none";

	el = document.getElementById('go_online_box');
	el.style.display = "block";
}

// Wyświetla w left_section opcje do pracy w trybie offline dla osoby offline
function goLocalOffline() {
	var el = document.getElementById('offline_box');
	el.style.display = "block";

	el = document.getElementById('go_online_box');
	el.style.display = "none";
}

// Wyświetla w left_section opcje do pracy w trybie offline dla osoby online
function goLocalOnline() {	
	var el = document.getElementById('offline_box');
	el.style.display = "block";

	el = document.getElementById('online_box');
	el.style.display = "none";
}

var db;
function isIDBsupported() {
	return "indexedDB" in window;
}

// Załadowanie bazy IndexedDB
document.addEventListener("DOMContentLoaded", function() {
	if ( !isIDBsupported() )
		return;
	
	var openRequest = indexedDB.open("data",1);
	
	openRequest.onupgradeneeded = function(e) {
		var thisDB = e.target.result;
		
		if ( !thisDB.objectStoreNames.contains("data") )
			var OS = thisDB.createObjectStore("data", {autoIncrement:true});
	}
	
	openRequest.onsuccess = function(e) {
		db = e.target.result;
	}
}, false);

// Formularz dodawania płyt do IndexedDB
function showFormOffline() {
	cleanCenter();

	var el = document.getElementById('form');
	el.style.display = "block";
	
	var str = "<fieldset><legend><b>Wprowadzenie danych lokalnie</b></legend><table>";
	str += "<tr><td>Tytuł</td><td><input type='text' id='title'/></td></tr>";
	str += "<tr><td>Wykonawca</td><td><input type='text' id='artist'/></td></tr>";
	str += "<tr><td>Gatunek</td><td><select id='genre'>";
		str += "<option>---Wybierz---</option><option>blues</option><option>classical</option><option>electronic</option><option>jazz";
		str += "</option><option>pop</option><option>rock</option><option>rap</option><option>reggae</option></select></td> </tr>";
	str += "<tr><td>Liczba utworów</td><td><input type='number' id='tracks'/></td> </tr>";
	str += "<tr><td>Ocena</td><td><select id='rating'><option>---Wybierz---</option><option>5</option>";
		str += "<option>4</option><option>3</option><option>2</option><option>1</option>";
	str += "<tr><td><button onclick='addCDOffline()'>Dodaj</button></td></tr></table></fieldset>";
	
	document.getElementById('form').innerHTML = str;
}

// Dodanie płyty do IndexedDB
function addCDOffline() {
	var title = document.getElementById('title').value;
	var artist = document.getElementById('artist').value;
	var genre = document.getElementById('genre').value;
	var tracks = document.getElementById('tracks').value;
	var rating = document.getElementById('rating').value;
	
	if (artist == "" ||  title == "" || genre == "---Wybierz---" || rating == "---Wybierz---")
	{
		alert("Uzupełnij wszystkie wymagane pola.");
		return;
	}
	
	if (tracks < 1)
	{
		alert("Liczba utworów na płycie nie może być mniejsza od 1.");
		return;
	}
	
	var transaction = db.transaction(['data'],'readwrite');
	var store = transaction.objectStore('data');
	var cursor = store.openCursor();
	
	cursor.onsuccess = function(e) {
		var res = e.target.result;
		if (res)
		{
			if (res.value['title'] == title && res.value['artist'] == artist)
			{
				alert("W bazie lokalnej znajduje się już taka sama płyta!");
				return;
			}
			res.continue();
		}
		else
		{
			var record = {
				title: title,
				artist: artist,
				genre: genre,
				tracks: tracks,
				rating: rating,
			}
	
			var request = store.add(record);
			showLocalRecords();
		}
	}
}

// Wypisanie płyt z IndexedDB
function showLocalRecords() {

	cleanCenter();

	var el = document.getElementById('data');
	el.style.display = "block";

	var transaction = db.transaction(['data'],'readonly');
	var store = transaction.objectStore('data');
	var cursor = store.openCursor();
	
	var str = "<table><caption><b>Płyty dodane lokalnie</b></caption>";
	str += "<tr><th>Tytuł</th><th>Wykonawca</th><th>Gatunek</th><th>Liczba utworów</th><th>Ocena</th></tr>";
	
	cursor.onsuccess = function(e) {
		var res = e.target.result;
		if (res)
		{
			str += "<tr id='enhance'>";
			for (var field in res.value)
			{
				if (field == "tracks" || field == "rating")
					str += "<td id='table_numeric_val'>" + res.value[field] + "</td>";
				else
					str += "<td>" + res.value[field] + "</td>";
			}
			res.continue();
		}
		else
		{
			str += "</tr></table>";
			document.getElementById('data').innerHTML = str;
		}
	}
}

// Wyświetla w left_section opcje do pracy w trybie online 
function goServerOnline() {
	var el = document.getElementById('offline_box');
	el.style.display = "none";

	el = document.getElementById('online_box');
	el.style.display = "block";
}


// Formularz dodawania płyt do MongoDB
function showGlobalAddForm() {
	cleanCenter();

	var el = document.getElementById('form');
	el.style.display = "block";

	var str = "<fieldset><legend><b>Wprowadzenie danych na serwer</b></legend>";
	str += "<form name='form' action='index.php?link=add' method='post'><table>";
	str += "<tr><td>Tytuł</td><td><input type='text' name='title'/></td></tr>";
	str += "<tr><td>Wykonawca</td><td><input type='text' name='artist'/></td></tr>\n";
	str += "<tr><td>Gatunek</td><td><select name='genre'>";
		str += "<option>---Wybierz---</option><option>blues</option><option>classical</option><option>electronic</option>"
		str += "<option>jazz</option><option>pop</option><option>rock</option><option>rap</option><option>reggae</option>";
		str += "</select></td></tr>";
	str += "<tr><td>Liczba utworów</td><td><input type='number' name='tracks'/></td> </tr>";
	str += "<tr><td>Ocena</td><td><select name='rating'>";
		str += "<option>---Wybierz---</option><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option>";
	str += "<tr> <td><input type='submit' value='Dodaj'/></td> </tr></table></form></fieldset>";
	
	document.getElementById('form').innerHTML = str;
}

// Wyświetlanie płyt z MongoDB
function showGlobalRecords() {
	window.location = "index.php?link=show";
}

// Synchronizacja po wciśnięciu przycisku
function synchronizeData() {
	var transaction = db.transaction(['data'],'readwrite');
	var store = transaction.objectStore('data');
	var countRequest = store.count();
	
	countRequest.onsuccess = function() {
		if (countRequest.result == 0)
		{
			alert('Brak danych do synchronizacji!');
			return;
		}
		else
		{
			var XHR = new XMLHttpRequest();
			var cursor = store.openCursor();
			
			var params = "";
			cursor.onsuccess = function(e) {
				var res = e.target.result;
				if (res)
				{
					for (var field in res.value)
					{
						params += field + "=" + res.value[field];
						if (field != "rating")
						params += "&";
					}
			
					XHR.open("POST", "addCD.php", true);
					  XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					XHR.send(params);
			
					params = "";
					res.continue();
				}
				else 
				{
					var request = store.clear();
					//to w tym miejscu następuje przeładowanie!
					showGlobalRecords();
				}
			}
		}
	}
}

// Rysowanie wykresu kołowego
function drawPlot() {
	cleanCenter();

	var el = document.getElementById('chart_container');
	el.style.display = "block";

	var XHR = new XMLHttpRequest();
	if (XHR)
	{
		XHR.open("GET","statistics.php",true);
		XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		
		XHR.onreadystatechange = function()
		{
			if (XHR.readyState == 4 && XHR.status == 200)
			{
				var types = JSON.parse( XHR.responseText );
				var ctx = document.getElementById("myChart").getContext('2d');
				var myChart = new Chart(ctx, {
					type: 'doughnut',
					data: {
						labels: ["blues", "classical", "electronic", "jazz", "pop", "rock", "rap", "reggae"],
						datasets: [{
						backgroundColor: [
							"#2ecc71",
							"#3498db",
							"#95a5a6",
							"#9b59b6",
							"#f1c40f",
							"#e74c3c",
							"#34495e",
							"white"
							],
						data: [types["blues"], types["classical"], types["electronic"], types["jazz"], types["pop"], types["rock"], types["rap"], types["reggae"]]
						}]
					}
				});
			}
		}
		XHR.send();
	}
}

