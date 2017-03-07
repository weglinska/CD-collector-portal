<?php

function validateUser($login, $pass) {
	$dbh = dba_open( "users.db", "r" );
	
	for ($key = dba_firstkey($dbh); $key !== false; $key = dba_nextkey($dbh))
	{
		$value = dba_fetch( $key, $dbh );
		$undata = unserialize($value);
		
		if ($key == $login)
		{
			if ($undata == $pass)
			{
				dba_close($dbh);
				return true;
			}
		}
	}
	
	dba_close($dbh);
	return false;
}

session_start();
$_SESSION["logged"] = 0;
if ( empty($_SESSION["logged"]) )
	$_SESSION["logged"] = 0;


if ($_POST["send"] == 1)
{
	if ( !empty($_POST["login"]) && !empty($_POST["pass"]) )
	{
		if ( validateUser($_POST["login"],$_POST["pass"]) )
		{
			$_SESSION["logged"] = 1;
			$_SESSION["username"] = $_POST["login"];
			header("Location: index.php");
			exit;
		}
		else
			echo "<script type='text/javascript'>alert('Wprowadzono niepoprawne dane!');</script>";
	}
	else
		echo "<script type='text/javascript'>alert('Proszę uzupełnić wszystkie pola.');</script>";

	echo "<script type='text/javascript'>window.location.href='login.php';</script>";
}
else
	echo "<head>
		<meta charset='UTF-8' />
		<title>Zaloguj się</title>
		<link rel='stylesheet' type='text/css' href='style.css'/>
		</head>

		<body>
		<div id='logreg'>
			<fieldset><legend style='font-weight:bold'>Zaloguj się</legend>
			<form action='login.php' method='post'>
				Login: <input type='text' name='login' /><br>
				Hasło: <input type='password' name='pass' />

			<input type='hidden' value='1' name='send' />
			<br/><input type='submit' value='Zaloguj' style='float:right' /></form>
			<a href='index.php'>Powrót</a></fieldset>
		</div>
		</body";

?>
