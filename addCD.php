<?php
	session_start();	
	$dbconnection = new Mongo( "mongodb://4weglinska:pass@localhost/4weglinska" );
	$mongodb = $dbconnection->selectDB("4weglinska");
	$record = $mongodb->selectCollection($_SESSION["username"]);

	$title = $_POST['title'];
	$artist = $_POST['artist'];
	$genre = $_POST['genre'];
	$tracks = $_POST['tracks'];
	$rating = $_POST['rating'];
	
	$cursor = $record->find();
	foreach ($cursor as $rec)
	{
		if ($title == $rec['title'] && $artist == $rec['artist'])
			exit;
	}
	
	$CD = array (
		'title' => $title,
		'artist' => $artist,
		'genre' => $genre,
		'tracks' => $tracks,
		'rating' => $rating,
	);
	
	$record->insert($CD);
	
?>
