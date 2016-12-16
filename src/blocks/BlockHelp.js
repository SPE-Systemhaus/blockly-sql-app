/*******************************************************************************
 * Overwriting the showHelp function of blockly, to load external html files
 * to show in the help box.
 * 
 * @author Volker Süßmann, SPE Systemhaus GmbH
 *
 ******************************************************************************/

var FirstTime = 1;

Blockly.BlockSvg.prototype.showHelp_ =
  function ()
    {
      if (this.helpUrl)
        {
          var help = document.getElementById ('help');
          var content = document.getElementById ('helpcontent');
          var col = this.getColour();
          var title;

          if (content.childNodes.length > 0)
            content.removeChild (content.childNodes [0]);

          var xhttp = new XMLHttpRequest ();
          xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            content.innerHTML =
              xhttp.response.replace(/<a href=[^>]+class="media"[^>]+">/g, '')
                            .replace (/(<img[^>]+class="media"[^>]+\/>)<\/a>/g, '$1');

            if (FirstTime == 1)
              {
                if (document.body.clientWidth < 900)
                  {
                    help.style.width = '80%';
                    help.style.left = '15%';
                  }
                else
                  {
                    help.style.width = '800px';
                    help.style.left = (document.body.clientWidth - 850) + 'px';
                  }

                var maxHeight = (document.body.clientHeight - help.offsetTop - 30);

                help.style.maxWidth = '800px';
                help.style.maxHeight = maxHeight + 'px';
                help.style.height = (maxHeight / 3) + 'px';        // 'auto';

                FirstTime = 0;
              }

            // Aktivieren, wenn Daten aus Wiki kommen.
            //help.getElementsByClassName('sectionedit1') [0].style.color = col;

            help.style.border = 'solid 3px ' + col;
            help.style.visibility = 'visible';
            help.style.display = '';
          }
              }
          // durch Post auf ein PHP Skript ersetze, wenn Daten aus dem Wiki kommen sollen
          xhttp.open("GET", 'help/' + SQLBlockly.LANG +'/' + this.type + ".html");

          // Aktivieren, wenn Daten aus Wiki kommen.
          //xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
          // Aktivieren, wenn Daten aus Wiki kommen.
          xhttp.send(/*"name=" + this.helpUrl*/);
        }
    };
