<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" encoding="UTF-8" indent="no" doctype-system="about:legacy-compat"/>

<xsl:template match="/">

<html>

	<head>
		<title>Płytoteka</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<script type="text/javascript" src="script.js"></script>
		<link rel='stylesheet' type='text/css' href='style.css'/>
	</head>


	<body>
		<div id="container">
			<header>Płytoteka</header>
  
			<div id="left_section">
				<button class="menuButtons" onclick="mainPage()">Strona główna</button>
				<button class="menuButtons" onclick="goLocalOffline()">Tryb off-line</button>
				<button class="menuButtons" onclick="goServer()">Tryb on-line</button>
				<button class="menuButtons" onclick="downloadSpecifications()">Dokumentacja</button>
			</div>
  
			<div id="center">
				<div id="welcome_text" class="inner_center"><xsl:apply-templates select="//statement" /></div>
				<div id="form" class="inner_center"></div>
				<div id="data" class="inner_center"></div>
			</div>

			<div id="right_section">
				<div id="offline_box" style="display:none">
				<button class="menuButtons" onclick="showFormOffline()">Dodaj płytę</button>
				<button class="menuButtons" onclick="showLocalRecords()">Lista płyt</button>
				</div>

				<div id="go_online_box" style="display:block">
				<button class="menuButtons" onclick="login()">Zaloguj się</button>
				<button class="menuButtons" onclick="register()">Zarejestruj się</button>
				</div>
			</div>
  
			<footer>Copyright © 2016 W. Węglińska</footer>

		</div>
	</body>

</html>

</xsl:template>

</xsl:stylesheet>
