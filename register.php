<?php

function validateData($login, $pass) {
	$dbh = dba_open( "users.db", "r" );
	
	for ($key = dba_firstkey($dbh); $key !== false; $key = dba_nextkey($dbh))
	{
		$value = dba_fetch( $key, $dbh );
		$undata = unserialize($value);
		
		if ($key == $login)
		{
			dba_close($dbh);
			return true;
		}
	}
	
	dba_close($dbh);
	return false;
}

if ($_POST["send"] == 1)
{
	if ( !empty($_POST["login"]) && !empty($_POST["pass"]) )
	{
		if ( !validateData($_POST["login"],$_POST["pass"]) )
		{
			$dbh = dba_open( "users.db", "c" );
			$data = serialize($_POST["pass"]);
			dba_insert( $_POST["login"], $data, $dbh );
			dba_close($dbh);
			
			echo "<script type='text/javascript'>alert('Pomyślnie zarejestrowano użytkownika! Teraz możesz się zalogować.');</script>";
			echo "<script type='text/javascript'>	window.location.href = 'index.php';</script>";

		}
		else
			echo "<script type='text/javascript'>alert('Taki użytkownik już istnieje.');</script>";

	}
	else
		echo "<script type='text/javascript'>alert('Uzupełnij wszystkie pola!');</script>";

	echo "<script type='text/javascript'>window.location.href='register.php';</script>";
}
else
	echo "<head>
		<meta charset='UTF-8'/>
		<title>Zarejestruj się</title>
		<link rel='stylesheet' type='text/css' href='style.css'/>
		</head>

		<body>
		<div id='logreg'>
			<fieldset><legend style='font-weight:bold'>Zarejestruj się</legend>
			<form action='register.php' method='post'>
				Login: <input type='text' name='login'/><br>
				Hasło: <input type='password' name='pass'/>

			<input type='hidden' value='1' name='send'/>
			<br/><input type='submit' value='Wyślij' style='float:right'/></form>
			<a href='index.php'>Powrót</a></fieldset>
		</div>
		</body>";

?>
