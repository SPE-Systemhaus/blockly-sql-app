/*******************************************************************************
 * Start point of the Blockly SQL Generator. The main() function will be
 * executed on loading the body tag. Some Visual functions are inside here.
 ******************************************************************************/
 function main() {
	var Toolbox = Blockly.Blocks.init();
	var blocklyDiv = document.getElementById('blocklyDiv');
	var workspace = Blockly.inject(
		blocklyDiv,
		{
			toolbox: Toolbox,
			trashcan: true,
			media: 'libs/blockly/media/',
			zoom: {
				controls: true,
				wheel: true,
				startScale: 1.0,
				maxScale: 3,
				minScale: 0.3,
				scaleSpeed: 1.2
			},
			scrollbars: true
		}
	);

	getdb('first');
	initCodeEditor();

	workspace.addChangeListener(onBlockChange);
}

function onBlockChange(event) {
	generateSQLCode();
}

function initCodeEditor() {
	editor = ace.edit("sqlstatement");
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/sql");
	editor.setHighlightActiveLine(false);
	editor.getSession().setUseWrapMode(true);
}

function parsingSQL() {
  var sqlStatement = editor.getValue();
  Blockly.mainWorkspace.clear();
  document.getElementById("errorSQL").style.display = "none";

  try {
    parser.parse(sqlStatement);
  } catch (e) {
	document.getElementById("errorSQL").style.display = "block";
	document.getElementById("sqlerror").value = e.message;
    console.error(e);
  }
}

function closeErrorBox() {
	document.getElementById("errorSQL").style.display = "none";
	document.getElementById("sqlerror").value = "";
}

/*------------------------------------------------------------------
 * Function to contact the db for the first time
 *-----------------------------------------------------------------*/
function choosedb() {
	document.getElementById("cdb").disabled = true;
	document.getElementById("datenbank").disabled = true;
	if (document.getElementById("cdb").value != "") {
		var db = document.getElementById("cdb").value;
		document.getElementById("datenbank").value = db;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", 'backend/Datenbankanbindung.php', false);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlhttp.onload = function() {
			console.log(this.responseText);
		};
		xmlhttp.send('datenbank=' + db);
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				console.log(xmlhttp.response);
			}
		};
		document.getElementById("OK").style.display = "none";
		document.getElementById("wait").style.display = "block";
	}
}
/*------------------------------------------------------------------
 * Function contact the db, in cause of a db change
 *
 * @returns {undefined}
 *-----------------------------------------------------------------*/
function selectdb() {
	document.getElementById("datenbank").disabled = true;
	if (document.getElementById("datenbank").value != "") {

		var db = document.getElementById("datenbank").value;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", 'backend/Datenbankanbindung.php', true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlhttp.onload = function() {
			console.log(this.responseText);
		};
		xmlhttp.send('datenbank=' + db);
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				console.log(xmlhttp.response);
			}
		};
		var html = "<p id='choosingText' style='padding:40px;margin-top:50px;'> Please wait, while the Application is loading the data from the database.</p>";
		document.getElementById("selectfirstdb").innerHTML = html;
		document.getElementById("choose").style.visibility = 'visible';
		Blockly.mainWorkspace.clear();
	}
}
/*------------------------------------------------------------------
 * Function to handle the data from db
 *
 * @param{type} task- identifies the way in whisch the db was choosen
 * @returns {undefined}
 *-----------------------------------------------------------------*/
function getdb(task) {
	//loading db the first time
	if (task == 'first') {
		getData();
	}
}
/*------------------------------------------------------------------
 * Function to save the XML, which holds the block
 *
 * @returns {undefined}
 *-----------------------------------------------------------------*/
function save() {
	if (confirm("Do you really want to save the actual workspace?")) {
		if (document.getElementById("name").value != "") {
			// saving objects into a xml-format
			var xmlDom = window.Blockly.Xml.workspaceToDom(window.Blockly.mainWorkspace);
			var xmlBlockly = window.Blockly.Xml.domToText(xmlDom);
			var name = document.getElementById("name").value;

			// sending xml to the save.php
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("POST", 'backend/save.php', true);
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlhttp.onload = function() {
				console.log(this.responseText);
			};
			xmlhttp.send('xml=' + xmlBlockly + '&name=' + name + "_Blockly");
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					console.log(xmlhttp.response);
				}
			};
		}
	}
}
/*------------------------------------------------------------------
 * Function to load teh XML, which holds the block
 *
 * @returns {undefined}
 *-----------------------------------------------------------------*/
function load() {
	if (document.getElementById('help').style.display == 'block') {
		var help = document.getElementById('help');
		var close = document.getElementById('close');
		help.style.display = "none";
		close.style.visibility = 'hidden';
	} else {
		if (document.getElementById('writeSQL').style.display == 'block') {
			var help = document.getElementById('writeSQL');
			var close = document.getElementById('closea');
			var area = help.childNodes[3];
			area.value = '';
			help.style.display = "none";
			close.style.visibility = 'hidden';
		}
		else {
			if (document.getElementById('showTestSQL').style.display == 'block') {
				var help = document.getElementById('showTestSQL');
				var close = document.getElementById('closed');
				help.style.display = "none";
				close.style.visibility = 'hidden';
			}
		}
	}

	if (confirm("Are you sure to load a new SQL statement into the workspace?")) {
		if (document.getElementById('name').value != "") {
			// loading selected p2fXML
			var xml = loadXMLDoc("samples/" +
					document.getElementById('name').value + "_Blockly.XML");
			// clearing workspaceBlockly
			Blockly.mainWorkspace.clear();

			// importing into workspace
			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace,
					xml.firstChild);
			// rendering workspace
			Blockly.mainWorkspace.render();
		} else {
			window.alert("Enter a name for your workspace!");
		}
	}
}

/*------------------------------------------------------------------
 * Function which enables the select-boxes
 *---------------------------------------------------------------- */
function enable() {
	document.getElementById("datenbank").disabled = false;
	document.getElementById("cdb").disabled = false;
}

/*------------------------------------------------------------------
 * Showing the SQL-statement text
 *----------------------------------------------------------------*/
function showtext() {
	generateSQLCode();
	opentextarea();
}

function generateSQLCode() {
	var code = Blockly.SQL.workspaceToCode(Blockly.mainWorkspace);
	editor.setValue(code);
}

/*------------------------------------------------------------------
 * Open the textarea tooltip
 *----------------------------------------------------------------*/
function opentextarea() {
	if (document.getElementById('help').style.display == 'block') {
		var help = document.getElementById('help');
		var close = document.getElementById('close');
		help.style.display = "none";
		close.style.visibility = 'hidden';
	} else {
		if (document.getElementById('showTestSQL').style.display == 'block') {
			var help = document.getElementById('showTestSQL');
			var close = document.getElementById('closed');
			help.style.display = "none";
			close.style.visibility = 'hidden';
		}
	}
	document.getElementById('writeSQL').style.display = 'block';
	document.getElementById('closea').style.visibility = 'visible';
}
/*------------------------------------------------------------------
 * Setting the textarea tooltip
 *----------------------------------------------------------------*/
function settooltip() {
	var a = document.getElementById('tooltip');
	a.innerHTML = "To convert your statemt into blocks, just type it in.<br> Be sure to check you spelling and set all the blanks.<br> Then klick ok.";
	a.style.display = 'block';
}
/*------------------------------------------------------------------
 * Closing the textarea tooltip
 *----------------------------------------------------------------*/
function closetooltip() {
	var a = document.getElementById('tooltip');
	a.innerHTML = "";
	a.style.display = 'none';
}
