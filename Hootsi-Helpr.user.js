// ==UserScript==
// @name         Hootsi-Helpr
// @downloadURL  https://github.com/samstevenm/hootsi-helpr/raw/main/Hootsi-Helpr.user.js
// @updateURL    https://github.com/samstevenm/hootsi-helpr/raw/main/Hootsi-Helpr.user.js
// @namespace    http://tampermonkey.net/
// @version      0.0.10
// @description  Improve Hootsi functionality!
// @author       Sam Myers
// @match        https://www.hootsi.com/*
// @icon         https://github.com/samstevenm/hootsi-helpr/raw/main/favico.png
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require      http://code.jquery.com/ui/1.9.2/jquery-ui.js
// @grant        none
// ==/UserScript==

jQuery(function($){
    $(document).ready(function($) {
        var _highest = 0;

        //localStorage.clear();

        //figure out which div is highest so widget stays on top
        $("div").each(function() {
            var _current = parseInt($(this).css("zIndex"), 10);
            if(_current > _highest) {
                _highest = _current + 1;
            }
        });

        //check if widget has been dragged before
        if (localStorage.getItem("ls_left") === null ){
            var left = 0;
            } else {
                var left = localStorage.getItem("ls_left")
                }
        if (localStorage.getItem("ls_top") === null ){
            var top = 0;
            } else {
                var top = localStorage.getItem("ls_top")
                }

        var html = '<div id="draggableDiv_links"'+
            'style="position:absolute;top:'+top+'px;left:'+left+'px;'+
            'z-index:'+_highest+';background:#FFF;border:1px solid #000000;'+
            'border-radius:10px;height:240px;width:190px;'+
            'margin-left:auto;margin-right:auto;margin-top:3px;'+
            'margin-bottom:3px;text-align: center;">'+
            '<a href="#" id="reset">&#128260;   </a>'+
            'Hootsi Helper &#129657;<br></div>';
        var crestron_copy_pasta ='<textarea cols="16" rows="2" id="crestron_pasta"'+
                                 '></textarea><br>'+
                                 '<label><input type="checkbox" id="serials_only" value="true"> Serials Only? </label><br>'+
                                 // the line below adds a clear button"
                                 //'<input value="Clear &#128465;&#65039;" id="btn_clear" type="button"></input> '+
                                 '<input value="*tron Clean &#x1F4E7; &#129529;" id="btn_clean_crestron" type="button"></input> '+
                                 '<label><input type="checkbox" id="auto_rec" value="true"> Auto-Receive? </label>'+
                                 '<input value="Fill &#10145;&#65039;" id="fill" type="button"></input><br>';
        var sonos_check = '<label><input type="checkbox" id="is_sonos" value="true">Sonos?</label>';

        //prepend the widget to the navigation area
        $("#navigation").prepend(html);

        //append additional HTML to draggableDiv_links
        $(crestron_copy_pasta).appendTo('#draggableDiv_links');
        $(sonos_check).appendTo('#draggableDiv_links');

        //make the widget draggable
        $("#draggableDiv_links").draggable();

        // assign some actual IDs
        //give an ID of "mac" to the mac field
        $("[name='mac']").prop("id","mac");
        //give an ID of "serial" to the serial field
        $("[name='serial']").prop("id","serial");
        //give an ID of "sub_btn" to the submit button
        $('button:contains("Receive Product")').prop("id","sub_btn");

        // get whatever is in local storage (TRUE||FALSE)
        var ls_crestron_pasta = JSON.parse(localStorage.getItem("ls_crestron_pasta"));
        // set the checkbox to the value (TRUE||FALSE)
        $("#crestron_pasta").val(ls_crestron_pasta);
        
        // get whatever is in local storage (TRUE||FALSE)
        var ls_is_sonos = JSON.parse(localStorage.getItem("ls_is_sonos"));
        // set the checkbox to the value (TRUE||FALSE)
        $("#is_sonos").attr("checked", ls_is_sonos);
        
        // get whatever is in local storage (TRUE||FALSE)
        var ls_serials_only = JSON.parse(localStorage.getItem("ls_serials_only"));
        // set the checkbox to the value (TRUE||FALSE)
        $("#serials_only").attr("checked", ls_serials_only);

        // get whatever is in local storage (TRUE||FALSE)
        var ls_auto_rec = JSON.parse(localStorage.getItem("ls_auto_rec"));
        // set the checkbox to the value (TRUE||FALSE)
        $("#auto_rec").attr("checked", ls_auto_rec);

        // change placeholder based on whether we're doing serials only or serials & macs
        if ( ls_serials_only ) {
            $("#crestron_pasta").prop("placeholder","Paste Crestron/Lutron Serials Here");
            //alert ("ls_serials_only: " + ls_serials_only);
        } else {
            $("#crestron_pasta").prop("placeholder","Paste Crestron/Lutron Serials & MACs Here");
            //alert ("ls_serials_only: " + ls_serials_only);
        }



        // save widget positions
        $('#draggableDiv_links').mouseup(function() {
            var divOffset = $("#draggableDiv_links").offset();
            var left = divOffset.left;
            var top = divOffset.top;
            var bottom = divOffset.bottom;

            localStorage.setItem("ls_left", left);
            localStorage.setItem("ls_top", top);
        });

        $('#reset').click(function(e) {
            // clear all local storage
            localStorage.clear();
            // empty the text area
            $("#crestron_pasta").val("");
            e.preventDefault();
        });
        //save checkbox status in local storage
        $('#serials_only').click(function(e) {
            if ( $("#serials_only").is(':checked') ) {
                localStorage.setItem("ls_serials_only", true);
                var ls_serials_only = JSON.parse(localStorage.getItem("ls_serials_only"));
                //Change placeholder based on status of checkbox
                $("#crestron_pasta").prop("placeholder","Paste Crestron Serials Here");
                alert ("ls_serials_only: " + ls_serials_only);
            } else {
                localStorage.setItem("ls_serials_only", false);
                var ls_serials_only = JSON.parse(localStorage.getItem("ls_serials_only"));
                //Change placeholder based on status of checkbox
                $("#crestron_pasta").prop("placeholder","Paste Crestron Serials & MACs Here");
                alert ("ls_serials_only: " + ls_serials_only);
            }
        });
        //save checkbox status in local storage
        $('#auto_rec').click(function(e) {
            if ( $("#auto_rec").is(':checked') ) {
                localStorage.setItem("ls_auto_rec", true);
                var ls_auto_rec = JSON.parse(localStorage.getItem("ls_auto_rec"));
                alert ("ls_auto_rec: " + ls_auto_rec);
            } else {
                localStorage.setItem("ls_auto_rec", false);
                var ls_auto_rec = JSON.parse(localStorage.getItem("ls_auto_rec"));
                alert ("ls_auto_rec: " + ls_auto_rec);
            }
        });
        //save checkbox status in local storage
        $('#is_sonos').click(function(e) {
            if ( $("#is_sonos").is(':checked') ) {
                localStorage.setItem("ls_is_sonos", true);
                var ls_is_sonos = JSON.parse(localStorage.getItem("ls_is_sonos"));
                alert ("ls_is_sonos: " + ls_is_sonos);
            } else {
                localStorage.setItem("ls_is_sonos", false);
                var ls_is_sonos = JSON.parse(localStorage.getItem("ls_is_sonos"));
                alert ("ls_is_sonos: " + ls_is_sonos);
            }
        });
        $('#btn_clean_crestron').click(function(e) {
            // if we're processing serials ONLY
            if ( $("#serials_only").is(':checked') ) {
                alert ("ls_serials_only: " + $("#serials_only").is(':checked'));
                localStorage.setItem("ls_crestron_pasta", "CRESTRON_PASTA_DID_NOT_SET"); // Store
                var crestron_pasta = $("#crestron_pasta").val();
                //remove spaces
                var crestron_pasta = crestron_pasta.replace(/ /g, '');
                //replace linefeeds with commas
                var crestron_pasta = crestron_pasta.replace(/\r?\n|\r/g, ',');
                //replace double commas ,, with single comman
                var crestron_pasta = crestron_pasta.replace(/,,/g, ',');
                //remove S/N:
                var crestron_pasta = crestron_pasta.replace(/S\/N:/g, "");
                //use commas to split into array
                var crestron_pasta = crestron_pasta.split(",");
                // Store the array in local storage as ls_crestron_pasta
                localStorage.setItem("ls_crestron_pasta", JSON.stringify(crestron_pasta));
                // Get the array from local storage as ls_crestron_pasta
                var ls_crestron_pasta = JSON.parse(localStorage.getItem("ls_crestron_pasta"));
                // Update the crestron_pasta textarea
                $("#crestron_pasta").val(ls_crestron_pasta);
            // if we're processig serials AND MAC addresses
            } else {
                alert ("ls_serials_only: " + $("#serials_only").is(':checked'));
                localStorage.setItem("ls_crestron_pasta", "CRESTRON_PASTA_DID_NOT_SET"); // Store
                var crestron_pasta = $("#crestron_pasta").val();
                //remove spaces
                var crestron_pasta = crestron_pasta.replace(/ /g, '');
                //remove commas ,
                var crestron_pasta = crestron_pasta.replace(/,/g, '');
                //remove linefeeds
                var crestron_pasta = crestron_pasta.replace(/\r?\n|\r/g, '');
                //replace open paren ( with ,
                var crestron_pasta = crestron_pasta.replace(/\(/g, ',');
                //remove S/N:
                var crestron_pasta = crestron_pasta.replace(/S\/N:/g, "");
                //remove MACADDR:
                var crestron_pasta = crestron_pasta.replace(/MACADDR:/g, "");
    
                //use close paren ) to split into array
                var crestron_pasta = crestron_pasta.split("\)");
    
                //remove the last item TODO find out why there's an extra item
                crestron_pasta.length = (crestron_pasta.length - 1);
    
                // Store the array in local storage as ls_crestron_pasta
                localStorage.setItem("ls_crestron_pasta", JSON.stringify(crestron_pasta));
    
                // Get the array from local storage as ls_crestron_pasta
                var ls_crestron_pasta = JSON.parse(localStorage.getItem("ls_crestron_pasta"));
                // Update the crestron_pasta textarea
                $("#crestron_pasta").val(ls_crestron_pasta);
            }

            e.preventDefault();
        });

         $('#fill').click(function(e) {
            var ls_crestron_pasta = JSON.parse(localStorage.getItem("ls_crestron_pasta"));
            $("#crestron_pasta").val(ls_crestron_pasta);
            var item = JSON.parse(localStorage.getItem("ls_crestron_pasta")).pop();
            //if (isGood) {
                 $("#serial").val(item.split(",")[0]);
                 $("#mac").val(item.split(",")[1]);
                 ls_crestron_pasta.length = (ls_crestron_pasta.length - 1);
                 localStorage.setItem("ls_crestron_pasta", JSON.stringify(ls_crestron_pasta)); // Store
                 $("#crestron_pasta").val(ls_crestron_pasta);
                 if ( $("#auto_rec").is(':checked') ) {
                     //var isGood=confirm (item);
                     $('button:contains("Receive Product")').click();
                 }
            //}
            e.preventDefault();
        });

        // This is the function for the clear button
        /*
        $('#btn_clear').click(function(e) {
            //alert ("clear pressed");
            localStorage.setItem("ls_crestron_pasta", JSON.stringify("")); // Store
            var ls_crestron_pasta = JSON.parse(localStorage.getItem("ls_crestron_pasta"));
            $("#crestron_pasta").val(ls_crestron_pasta);
            //e.preventDefault();
        });
        */

        $('#submit_btn').click(function(e) {
            var ls_crestron_pasta = JSON.parse(localStorage.getItem("ls_crestron_pasta"));
            $("#crestron_pasta").val(ls_crestron_pasta);
            //e.preventDefault();
        });

        //do validation on the MAC field to ensure its a valid MAC address
        $('#mac').blur(function(e) {
            var orig_mac = $('#mac').val();
            //alert( "Original MAC:" + orig_mac);
            //remove all non-hex characters and make UPPER
            var cleaned_mac = orig_mac.replace(/[^a-fA-F0-9\s]/gi, '').toUpperCase();
            //shorten to 12 characters long
            var trim_clean_mac = cleaned_mac.substring(0,12);
            //alert( "Trim & Clean: " + trim_clean_mac);
            //update the field to the new cleaned and trimmed MAC
            $('#mac').val(trim_clean_mac);
            e.preventDefault();
        });

        //do validation on the Serial field to clear commas
        // Sam changes for Al 2022-06-06
        $('#serial').blur(function(e) {
            var orig_serial = $('#serial').val();
            //alert( "Untrimmed: " + orig_serial );
            //if the serial has a comma in it
            if (orig_serial.includes(',') ){
            //split at the comma and only get the actual serial array[1]
            var cleaned_serial = orig_serial.split(',')[1];
            } else {
                //if there is no comma, just use the whole serial
                var cleaned_serial = orig_serial;
            }
            //update the field to the new cleaned and trimmed serial
            $('#serial').val(cleaned_serial);
            e.preventDefault();
        });

        // When Sonos is checked, do some stuff
        $('#serial').blur(function(e) {
            var orig_serial = $('#serial').val();
            //remove all non-hex characters and make UPPER
            var cleaned_mac = orig_serial.replace(/[^a-fA-F0-9\s]/gi, '').toUpperCase();
            //shorten to 12 characters long
            var trim_clean_mac = cleaned_mac.substring(0,12);
            //alert( "Trim & Clean: " + trim_clean_mac);
            //update the field to the new cleaned and trimmed MAC
            if ( $("#is_sonos").is(':checked') ) {
                $('#mac').val(trim_clean_mac);
            }
            e.preventDefault();
        });

    });
});
