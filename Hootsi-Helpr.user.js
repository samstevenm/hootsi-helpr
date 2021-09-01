// ==UserScript==
// @name         Hootsi-Helpr
// @downloadURL  https://github.com/samstevenm/hootsi-helpr/raw/main/Hootsi-Helpr.user.js
// @updateURL    https://github.com/samstevenm/hootsi-helpr/raw/main/Hootsi-Helpr.user.js
// @namespace    http://tampermonkey.net/
// @version      0.0.8
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
            'border-radius:10px;height:190px;width:190px;'+
            'margin-left:auto;margin-right:auto;margin-top:3px;'+
            'margin-bottom:3px;text-align: center;">'+
            'Hootsi Helper &#129657;<br></div>';
        var crestron_copy_pasta ='<textarea cols="16" rows="2" id="crestron_pasta"'+
                                 'placeholder = "Paste Crestron serials here"></textarea><br>'+
                                 '<input value="&#128465;&#65039; Clear" id="clear" type="button"></input> '+
                                 '<input value="&#129529; Clean" id="cleanserials" type="button"></input> '+
                                 '<input value="Fill &#10145;&#65039;" id="print" type="button"></input><br><br>';
        var sonos_check = '<label><input type="checkbox" id="sonos" value="true"> Sonos ?</label>';

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

        var ls_crestron_pasta = JSON.parse(localStorage.getItem("ls_crestron_pasta"));
        $("#crestron_pasta").val(ls_crestron_pasta);

        // save widget positions
        $('#draggableDiv_links').mouseup(function() {
            var divOffset = $("#draggableDiv_links").offset();
            var left = divOffset.left;
            var top = divOffset.top;
            var bottom = divOffset.bottom;

            localStorage.setItem("ls_left", left);
            localStorage.setItem("ls_top", top);
        });

        $('#clear').click(function(e) {
            // clear ls_crestron_pasta
            localStorage.setItem("ls_crestron_pasta", JSON.stringify(""));
            $("#crestron_pasta").val(ls_crestron_pasta);
            e.preventDefault();
        });
        
        $('#cleanserials').click(function(e) {
            localStorage.setItem("ls_crestron_pasta", "CRESTRON_PASTA_DID_NOT_SET"); // Store
            var crestron_pasta = $("#crestron_pasta").val();
            //clear the text box
            //$("#crestron_pasta").val("");

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

            e.preventDefault();
        });

         $('#print').click(function(e) {
            var ls_crestron_pasta = JSON.parse(localStorage.getItem("ls_crestron_pasta"));
            $("#crestron_pasta").val(ls_crestron_pasta);
            var item = JSON.parse(localStorage.getItem("ls_crestron_pasta")).pop();
            var isGood=confirm (item);
            //if (isGood) {
                 $("#serial").val(item.split(",")[0]);
                 $("#mac").val(item.split(",")[1]);
                 ls_crestron_pasta.length = (ls_crestron_pasta.length - 1);
                 localStorage.setItem("ls_crestron_pasta", JSON.stringify(ls_crestron_pasta)); // Store
                 $("#crestron_pasta").val(ls_crestron_pasta);
                 $('button:contains("Receive Product")').click();
            // }
            e.preventDefault();
        });

        $('#sub_btn').click(function(e) {
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

        // When Sonos is checked, do some stuff
        $('#serial').blur(function(e) {
            var orig_serial = $('#serial').val();
            //remove all non-hex characters and make UPPER
            var cleaned_mac = orig_serial.replace(/[^a-fA-F0-9\s]/gi, '').toUpperCase();
            //shorten to 12 characters long
            var trim_clean_mac = cleaned_mac.substring(0,12);
            //alert( "Trim & Clean: " + trim_clean_mac);
            //update the field to the new cleaned and trimmed MAC
            if ( $("#sonos").is(':checked') ) {
                $('#mac').val(trim_clean_mac);
            }
            e.preventDefault();
        });

    });
});
