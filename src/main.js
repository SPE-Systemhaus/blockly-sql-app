var selected = null; 			// Object of the element to be moved
var x_pos = 0, y_pos = 0; 		// Stores x & y coordinates of the mouse pointer
var x_elem = 0, y_elem = 0; 	// Stores top, left values (edge) of the element

/*******************************************************************************
 * Start point of the Blockly SQL Generator. The main() function will be
 * executed on loading the body tag. Some Visual functions are inside here.
 ******************************************************************************/
 function main() {
	initCodeEditor();
	initHelp();
	initError();

	/* Move/Drag behaviour */
	document.onmousemove = _move_elem;
	document.onmouseup = _destroy;
	
	loadDatabaseStructure("BeerCompany");
}

function initBlockly() {
	var Toolbox = Blockly.Blocks.init();
	var blocklyDiv = document.getElementById('blocklyDiv');
	var workspace = Blockly.inject(
		blocklyDiv,
		{
			toolbox: Toolbox,
			trashcan: true,
			media: '../common/libs/blockly/media/',
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
}

/**
 * Init drag for a specific Element.
 * 
 * @param {DOMNode} elem Element that should be dragable.
 * @return {boolean} false
 */
function _drag_init (elem) {
	// Store the object of the element which needs to be moved
	selected = elem;
	x_elem = x_pos - selected.offsetLeft;
	y_elem = y_pos - selected.offsetTop;

	return false;
}

/** 
 * Will be called when user dragging an element 
 */
function _move_elem (e) {
	x_pos = document.all ? window.event.clientX : e.pageX;
	y_pos = document.all ? window.event.clientY : e.pageY;

	if (selected !== null) {
		selected.style.left = (x_pos - x_elem) + 'px';
		selected.style.top = (y_pos - y_elem) + 'px';
	}
}

/** 
 * Destroy the selected movable object when we are done.
 */
function _destroy () {
	selected = null;
}

/**
 * Init movable help container.
 */
function initHelp() {
	var helpDiv = document.getElementById ('help');
	helpDiv.style.height = "0px";
	
	document.getElementById("sqlHelpBar").onmousedown = function () {
		return _drag_init (helpDiv);
	};

	document.getElementById ("helpcontent").onmousedown = function () {
		return _drag_init (helpDiv);
	};
}

/**
 * Init movable error container.
 */
function initError() {
	var errorDiv = document.getElementById ('errorSQL');
	document.getElementById ('sqlErrorBar').onmousedown = function () {
		return _drag_init (errorDiv);
	};
}

/**
 * Initializing the ACE code editor and registering it to
 * the sqlStatement TextArea. Making this area movable.
 */
function initCodeEditor() {
	editor = ace.edit("sqlStatement");
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/sql");
	editor.setHighlightActiveLine(false);
	editor.getSession().setUseWrapMode(true);
	editor.$blockScrolling = Infinity;

	var sqlArea = document.getElementById("writeSQL")
	var sqlEditorBar = document.getElementById("sqlEditorBar");
	sqlEditorBar.onmousedown = function () {
		return _drag_init (sqlArea);
	};
}

/**
 * 
 */
function parsingSQL() {
  var currentWorkspace = Blockly.mainWorkspace;
  var sqlStatement = editor.getValue();
  var tmpWorkspace = Blockly.Xml.workspaceToDom(currentWorkspace);
  Blockly.mainWorkspace.clear();

  try {
    parser.parse(sqlStatement);
  } catch (e) {
	Blockly.Xml.domToWorkspace(tmpWorkspace, currentWorkspace);
	openErrorBox(e.message);
	console.error(e);
  }
}

/**
 * 
 */
function openErrorBox(errorMessage) {
	document.getElementById("errorSQL").style.display = "block";
	document.getElementById("sqlErrorMessage").value = errorMessage;
}

/**
 * 
 */
function closeErrorBox() {
	document.getElementById("errorSQL").style.display = "none";
	document.getElementById("sqlErrorMessage").value = "";
}

/**
 * Function which enables the select-boxes
 */
function enable() {
	document.getElementById("datenbank").disabled = false;
	document.getElementById("cdb").disabled = false;
}

/**
 * Showing the SQL-statement text
 */
function showStatement() {
	generateSQLCode();
	writeStatement();
}

/**
 * 
 */
function generateSQLCode() {
	var code = BlocklyPlugins.SQLGen.workspaceToCode(Blockly.mainWorkspace);
	if (code.length === 1 && code === ";")
		code = "";

	editor.setValue(code);
}

/**
 * Open the textarea tooltip
 */
function writeStatement() {
	document.getElementById('writeSQL').style.display = 'block';
}

/**
 * 
 */
function closeStatement() {
	document.getElementById("writeSQL").style.display = "none";	
}

/**
 * 
 */
function closeAllPopups() {
	closeStatement();
	closeHelp();
	closeTooltip();
	closeErrorBox();
}

/**
 * Closes the help div
 */
function closeHelp() {
	var help = document.getElementById('help');
	help.style.display = "none";
}

/**
 * Setting the textarea tooltip
 */
function setTooltip() {
	var a = document.getElementById('tooltip');
	a.innerHTML = SQLBlocks.Msg.User.TOOLTIP_SQL_BOX;
	a.style.display = 'block';
}

/**
 * Closing the textarea tooltip
 */
function closeTooltip() {
	var a = document.getElementById('tooltip');
	a.innerHTML = "";
	a.style.display = 'none';
}
