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

    var focusedElemenent = null;
    var originallyOpenedDir = [];
        ExtensionUtils.loadStyleSheet(module, "style.css");

        buildSearchButton();


        function buildSearchButton() {

            var projectFilesHeader = document.getElementById( 'project-files-header' );
            var defaultPlaceholder = "Alt + F to start searching";

            
            var searchBar = document.createElement("input");
            searchBar.type = "text";
            searchBar.setAttribute("placeholder", defaultPlaceholder);
            searchBar.id = "directory-search-bar";
            searchBar.addEventListener("keydown", filter);

            projectFilesHeader.appendChild(searchBar);

            $("input#directory-search-bar").on("blur", function(){
                $(this).attr("placeholder", defaultPlaceholder);
            });

            $("input#directory-search-bar").on("focus", function(){
                $(this).attr("placeholder", "search...");
            });

            
            var input = $("input#directory-search-bar");
                
            if(input.val().length == 0)
            {
                
                $("input#directory-search-bar")
                .on("focus", function(){
                    saveDirectoryState();
                })
                .on("blur", function(){

                    loadDirectoryState();
                });

            }
        };

        function focusToSearchBar(){

            focusedElemenent = $(":focus");

            var input = $("input#directory-search-bar");
            input.focus();

            input = input[0];
            
            input.setSelectionRange(0, input.value.length);
            
            
            
        };
        
        function nameFiles(projectFiles){
            
            
            projectFiles.each(function(i,e){
                
                var file = $(e);
                
                var parts = file.find("a span");
                
                file.attr("data-file-name", parts.text());
                
            });
            
        };
    
        function saveDirectoryState(){
            
            originallyOpenedDir = [];
            
            $(".jstree-closed").each(function (i,e) {
               
                originallyOpenedDir.push($(e).attr("data-reactid"));
                
            });
            
        };
    
        function loadDirectoryState(){
            
            
           
            for(i in originallyOpenedDir)
            {
                var dir = $("[data-reactid='"+originallyOpenedDir[i]+"'].jstree-open");
                
                dir.click();
            }
            
            
//            $("ul.jstree-brackets .originally-closed").removeClass("originally-closed").click();
        };
    
        function filter(e){

            var projectFiles = $("ul.jstree-brackets .jstree-leaf");
//             console.log(e);

            if(e.keyCode == 27){
                
                var prev = e.srcElement.value;
                if(e.srcElement.value == "")
                {
                    focusedElemenent.focus();
                }
                
                e.srcElement.value = "";
                
                
                    loadDirectoryState();
                
                if(prev == "")
                    return;
            }
            

            var val = e.srcElement.value;

            var directories = $("ul.jstree-brackets .jstree-closed");
            directories.click();
            
            if($(".jstree-leaf:not([data-file-name]").length != 0)
                nameFiles(projectFiles);
            
            $("ul.jstree-brackets .hidden").removeClass("hidden");

            
            projectFiles.each(function(i,e){

                var file = $(e);

                var escapedVal = val.replace(".", "\.");

//                if( !new RegExp( escapedVal ,"i").test(file.attr("data-reactid")))
                if( !new RegExp( escapedVal ,"i").test(file.attr("data-file-name")))
                    file.addClass("hidden");
                else
                    file.removeClass("hidden");

            });

            if(!!val.length)
            {
                $("ul.jstree-brackets .jstree-open").each(function(i,e){

                    var dir = $(e);

                    if( dir.find(".jstree-leaf.hidden").length == dir.find(".jstree-leaf").length )
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
