<?php

$txt = "<?xml version='1.0'?><statement><txt>Płytoteka to system umożliwiający tworzenie rozpiski własnego zbioru płyt. 
	W ramach systemu działają dwie bazdy danych off-line i on-line. 
	Dane z systemu off-line można zsynchronizować z bazą on-line przez wciśnięcie odpowiedniego przyciku. 
	Każdy rekord z bazy powinien zaiwierać informacje o wykonawcy, nazwie płyty, jej gatunku,
	liczbie utworów oraz ocenę. Narzędziem analizy danych w bazie jest wykres przedstawiający ilość 
	posiadanych płyt z różnych gatunków muzycznych.
	Strona została wykonana w ramach projektu z przemdiotu Techniki Internetowe.
	</txt></statement>";


session_start();

if ($_GET["logout"] == "yes")
{
	$_SESSION["logged"] = 0;
	header("Location: index.php");
	exit;
}

if ( isset($_GET["link"]) )
{
	$fun = $_GET["link"];
	$fun();
	exit;
}

if ($_SESSION["logged"] != 1)
	view($txt,"offlineTemplate.xsl");
else
	view($txt,"onlineTemplate.xsl");


function view($data, $page) {
	$xml = new domDocument();
	if ($data != null)
		$xml->loadXML($data);
	
	$xsl = new DOMDocument();
	$xsl->load($page);
		
	$proc = new xsltprocessor();
	$proc->importStylesheet($xsl);
	header('Content-type: text/html; charset=utf-8');
	print $proc->transformToXML($xml);
}

// Dodanie rekordu do bazy MongoDB
function add() {
	$title = $_POST['title'];
	$artist = $_POST['artist'];
	$genre = $_POST['genre'];
	$tracks = $_POST['tracks'];
	$rating = $_POST['rating'];
	
	if ($artist == "" || $title == "" || $genre == "---Wybierz---" || $rating == "---Wybierz---")
	{
		echo "<script type='text/javascript'>alert('Uzupełnij wszystkie wymagane pola.');</script>";
		exit;
	}
	
	if ($tracks < 1)
	{
		echo "<script type='text/javascript'>alert('Liczba utworów na płycie nie może być mniejsza od 1.');</script>";
		exit;
	}
	
	$conn = new Mongo( "mongodb://4weglinska:pass@localhost/4weglinska" );
	$db = $conn->selectDB("4weglinska");
	$coll = $db->selectCollection($_SESSION["username"]);
	
	$cursor = $coll->find();
	foreach ($cursor as $rec)
	{
		if ($title == $rec['title'] && $artist == $rec['artist'])
		{
			echo "<script type='text/javascript'>alert('W bazie znajduje się już taka sama płyta!');</script>";
			exit;
		}


	}
	
	$record = array (
		'title' => $title,
		'artist' => $artist,
		'genre' => $genre,
		'tracks' => $tracks,
		'rating' => $rating,
	);
	
	$coll->insert($record);
	
	header("Location: index.php?link=show");
	exit;
}


// Wyświetlenie płyt z  MongoDB
function show() {
	$conn = new Mongo( "mongodb://4weglinska:pass@localhost/4weglinska" );
	$db = $conn->selectDB("4weglinska");
	$coll = $db->selectCollection($_SESSION["username"]);
	
	$cursor = $coll->find();
	
	$xml = "<?xml version='1.0' ?><records>";
	foreach ($cursor as $rec)
	{
		$title = $rec['title'];
		$artist = $rec['artist'];
		$genre = $rec['genre'];
		$tracks = $rec['tracks'];
		$rating = $rec['rating'];
		
		$xml .= "<record><title>" . $title . "</title>";
		$xml .= "<artist>" . $artist . "</artist>";
		$xml .= "<genre>" . $genre . "</genre>";
		$xml .= "<tracks>" . $tracks . "</tracks>";
		$xml .= "<rating>" . $rating . "</rating>";
		$xml .= "<type>" . $type . "</type>";
		$xml .= "<name>" . $name . "</name></record>";
	}
	$xml .= "</records>";
	
	view($xml,"onlineTemplate.xsl");
}

?>
