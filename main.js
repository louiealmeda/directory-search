/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

// Re-indent the open document according to your current indentation settings.
define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        EditorManager  = brackets.getModule("editor/EditorManager"),
        Menus          = brackets.getModule("command/Menus"),
        COMMAND_ID     = "directorySearch.search";



        ExtensionUtils.loadStyleSheet(module, "style.css");

        buildSearchButton();


        function buildSearchButton() {

            var projectFilesHeader = document.getElementById( 'project-files-header' );
    
            
            var searchBar = document.createElement("input");
            searchBar.type = "text";
            searchBar.setAttribute("placeholder", "search...");
            searchBar.id = "directory-search-bar";
            searchBar.addEventListener("keyup", filter);

            projectFilesHeader.appendChild(searchBar);

        };

        function focusToSearchBar(){

            $("input#directory-search-bar").focus();

        };
        
        function filter(e){

            console.log(e);

            if(e.keyCode == 27)
                e.srcElement.value = "";

            var val = e.srcElement.value;

            var directories = $("ul.jstree-brackets .jstree-closed");
            directories.click();
            
            $("ul.jstree-brackets .hidden").removeClass("hidden");

            var projectFiles = $("ul.jstree-brackets .jstree-leaf");

            projectFiles.each(function(i,e){

                var file = $(e);

                var escapedVal = val.replace(".", "\.");

                console.log(escapedVal);

                if( !new RegExp( escapedVal ,"i").test(file.attr("data-reactid")))
                    file.addClass("hidden");
                else
                    file.removeClass("hidden");

            });

            if(!!val.length)
            {
                $("ul.jstree-brackets .jstree-open").each(function(i,e){

                    var dir = $(e);

                    if( dir.find(".jstree-open").length == 0 && 
                        dir.find(".jstree-leaf.hidden").length == dir.find(".jstree-leaf").length
                        )
                    {

                        dir.addClass("hidden");
                    }

                });
            }
  
        };


        CommandManager.register("Search files", COMMAND_ID, focusToSearchBar);

        var menu = Menus.getMenu(Menus.AppMenuBar.FIND_MENU);
        menu.addMenuItem(COMMAND_ID, [{ "key": "Alt-F" }, { "key": "Alt-F", "platform": "mac" }]);
});
