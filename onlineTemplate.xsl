<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" encoding="UTF-8" indent="no" doctype-system="about:legacy-compat"/>

<xsl:template match="/">

<html>

	<head>
		<title>Płytoteka</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<script type="text/javascript" src="script.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.min.js"></script>
		<link rel='stylesheet' type='text/css' href='style.css'/>
	</head>

	<body>
		<div id="container">
			<header>Płytoteka</header>
		  
			<div id="left_section">
				<button class="menuButtons" onclick="mainPage()">Strona główna</button>
				<button class="menuButtons" onclick="goLocalOnline()">Tryb off-line</button>
				<button class="menuButtons" onclick="goServerOnline()">Tryb on-line</button>
				<button class="menuButtons" onclick="downloadSpecifications()">Dokumentacja</button>
			</div>
	  
			<div id="center">

			<div id="chart_container" class="inner_center" style="display:none">
			<canvas id="myChart"></canvas>
			</div>

				<div id="welcome_text" class="inner_center"><xsl:apply-templates select="//statement"/></div>
				<div id="form" class="inner_center"></div>
				<div id="data" class="inner_center">
				<div id="global_rec" style="dispaly:none">
				<xsl:apply-templates select="//records" />
				</div>
			</div>

			</div>


			<div id="right_section">
				<div id="offline_box" style="display:none">
				<button class="menuButtons" onclick="showFormOffline()">Dodaj płytę</button>
				<button class="menuButtons" onclick="showLocalRecords()">Lista płyt</button>
				</div>

				<div id="online_box" style="display:block" >
				<button class="menuButtons" onclick="showGlobalAddForm()">Dodaj płytę</button>
				<button class="menuButtons" onclick="showGlobalRecords()">Lista płyt</button>
				<button class="menuButtons" onclick="synchronizeData();showGlobalRecords;">Synchronizuj</button>
				<button class="menuButtons" onclick="drawPlot()">Pokaż wykres</button>
				<button class="menuButtons" onclick="logout()">Wyloguj</button>
				</div>

			</div>

			<footer>Copyright © 2016 W. Węglińska</footer>
		</div>
	</body>

</html>

</xsl:template>

<xsl:template match="records">
	<script> goServerOnline(); </script>
	<table>
		<caption style='font-weight:bold; font-size:22px'>Dane dodane na serwer</caption>
		<tr><th>Tytuł</th><th>Wykonawca</th>
		<th>Gatunek</th><th>Liczba utworów</th>
		<th>Ocena</th></tr>


		<xsl:for-each select="//record">
		<tr id='enhance'>
			<td><xsl:value-of select="title"/></td>
			<td><xsl:value-of select="artist"/></td>
			<td><xsl:value-of select="genre"/></td>
			<td id="table_numeric_val"><xsl:value-of select="tracks"/> </td>
			<td id="table_numeric_val"><xsl:value-of select="rating"/> </td>
		</tr>
		</xsl:for-each>
	</table>
</xsl:template>

</xsl:stylesheet>
