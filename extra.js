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