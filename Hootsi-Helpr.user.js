// ==UserScript==
// @name         Hootsi-Helpr
// @downloadURL  https://drive.google.com/uc?export=download&id=1R2N0JoPimmtR2_P2W57n-YPXL319i1Mp
// @updateURL    https://drive.google.com/uc?export=download&id=1R2N0JoPimmtR2_P2W57n-YPXL319i1Mp
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Iprove Hootsi functionality!
// @author       Sam Myers
// @match        https://www.hootsi.com/*
// @icon         https://www.google.com/s2/favicons?domain=stackoverflow.com
// @require      https://code.jquery.com/jquery-3.6.0.js
// @require      https://code.jquery.com/ui/1.13.0-alpha.1/jquery-ui.min.js
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
            var left = 0
            } else {
                var left = localStorage.getItem("ls_left")
                }
        if (localStorage.getItem("ls_top") === null ){
            var top = 0
            } else {
                var top = localStorage.getItem("ls_top")
                }

        var html =  '<div id="draggableDiv_links"'+ //class is stolen from SFDC
            'style="position:absolute;top:'+top+'px;left:'+left+'px;'+
            'z-index:'+_highest+';background:#FFF;border:1px solid #000000;'+
            'border-radius:10px;height:150px;width:190px;'+
            'margin-left:auto;margin-right:auto;margin-top:3px;'+
            'margin-bottom:3px;text-align: center;">'+
            'Hootsi Helper &#129657;<br></div>';
        var crestron_copy_pasta ='<textarea cols="16" rows="2" id="crestron_pasta"'+
                                 'placeholder = "Paste Crestron serials here"></textarea><br>'+
                                 '<input value="Fill Product" id="fillprod" type="button"></input><br>';
        var sonos_check = '<label><input type="checkbox" id="sonos" value="true">Sonos ?</label>';

        //var cal_copypaste = '<input value="&#128197; -> &#10697;" id="copycal" type="button">'+
            '<input value="&#128203; -> &#128222;" id="pastecal" type="button">';


        $("#navigation").prepend(html);

        $(crestron_copy_pasta).appendTo('#draggableDiv_links');
        $(sonos_check).appendTo('#draggableDiv_links');
        //$(cal_copypaste).appendTo('#draggableDiv_links');



        $("#draggableDiv_links").draggable(); //make it draggable



        $('#draggableDiv_links').mouseup(function() {
            //alert('Set the x and y values using GM_getValue.');
            //localStorage.setItem("ls_divOffset", "DIVOFFSET_DID_NOT_SET"); // Initilize
            //localStorage.setItem("ls_left", "LEFT_DID_NOT_SET"); // Initilize
            //localStorage.setItem("ls_top", "TOP_DID_NOT_SET"); // Initilize

            var divOffset = $("#draggableDiv_links").offset();
            var left = divOffset.left;
            var top = divOffset.top;
            var bottom = divOffset.bottom;

            localStorage.setItem("ls_left", left); // Initilize
            localStorage.setItem("ls_top", top); // Initilize

            //alert("Set left to " + left + " and top to " + top);

        });

        $('#fillprod').click(function(e) {
            //$("[name='serial']").val("Serial Number");
            //$("[name='mac']").val("MAC Address");

            localStorage.setItem("ls_crestron_pasta", "CRESTRON_PASTA_DID_NOT_SET"); // Store
            var crestron_pasta = $("#crestron_pasta").val();
            //clear the text box
            $("#crestron_pasta").val("");
            //remove spaces
            var crestron_pasta = crestron_pasta.replace(/ /g, '');
            //remove commas ,
            var crestron_pasta = crestron_pasta.replace(/,/g, '');
            //remove linefeeds
            var crestron_pasta = crestron_pasta.replace(/\r?\n|\r/g, '');
            //replace open paren ( with ,
            var crestron_pasta = crestron_pasta.replace(/\(/g, ',');

            var crestron_pasta = crestron_pasta.replace(/S\/N:/g, "");
            var crestron_pasta = crestron_pasta.replace(/MACADDR:/g, "");

            //replace close paren ) with line feed
            var crestron_pasta = crestron_pasta.split('\)');
            //split at line-feeds
            //var crestron_pasta = crestron_pasta.split('\r\n');

            //var crestron_pasta = crestron_pasta.replace(/MACADDR:/, "");
            localStorage.setItem("ls_crestron_pasta", crestron_pasta); // Store
            var ls_crestron_pasta = localStorage.getItem("ls_crestron_pasta")
            $("#crestron_pasta").val(ls_crestron_pasta);           

            var i = crestron_pasta.length;

            while (i--) {
                var isGood=confirm (crestron_pasta[i].split(","));
                if (isGood) {
                    //$("#crestron_pasta").val().append(crestron_pasta[i].split("MACADDR:")[0] + crestron_pasta[i].split("MACADDR:")[1]);
                    $("[name='serial']").val(crestron_pasta[i].split(",")[0]);
                    $("[name='mac']").val(crestron_pasta[i].split(",")[1]);
                   // $('button:contains("Receive Product")').click();
                } else {
                    break;
                }
                }


            //let ls_crestron_pasta = crestron_pasta.split('S/N:');
            //alert (ls_crestron_pasta[2]);
            //localStorage.setItem("ls_crestron_pasta", ls_crestron_pasta); // Store

            e.preventDefault();
        });

    // Sam changes for Al 2021-08-10
    // Strips non-hex characters and makes MAC field uppercase
    $("#sonos").click(function(e) {
            $("[name='mac']").prop("id","mac");
            $("[name='serial']").prop("id","serial");



        $('#serial').blur(function(e) {
           // if ("#sonos".is(':checked')) {
            //alert("BLUR");
            var orig_serial = $('#serial').val();
            //alert( "Untrimmed: " + orig_serial );
            //remove all non-hex characters and make UPPER
            var cleaned_mac = orig_serial.replace(/[^a-fA-F0-9\s]/gi, '').toUpperCase();
            //shorten to 12 characters long
            var trim_clean_mac = cleaned_mac.substring(0,12);
            //alert( "Trim & Clean: " + trim_clean_mac);
            //update the field to the new cleaned and trimmed MAC
            if ( $("#sonos").is(':checked') ) {
            $('#mac').val(trim_clean_mac);
            }
            //e.preventDefault();
           // }
        });


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

        //e.preventDefault();
            });

    });
});
