<?php
	session_start();
	$dbconnection = new Mongo( "mongodb://4weglinska:pass@localhost/4weglinska" );
        $mongodb = $dbconnection->selectDB("4weglinska");
        $coll = $mongodb->selectCollection($_SESSION["username"]);
	$cursor = $coll->find();
	
	$genres = array (
		"blues" => 0,
		"classical" => 0,
		"electronic" => 0,
		"jazz" => 0,
		"pop" => 0,
		"rock" => 0,
		"rap" => 0,
		"reggae" => 0,
	);
	
	foreach ($cursor as $rec)
		$genres[$rec['genre']]++;
	
	echo json_encode($genres, JSON_PRETTY_PRINT);
?>
