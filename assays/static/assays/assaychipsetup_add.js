// TODO refactor
// Global variables are in poor taste
var id = null;

function search(elem) {
    id = elem.id.replace(/\D/g,'');
    $("#dialog").dialog('open');
    // Remove focus
    $('.ui-dialog :button').blur();
}

$(document).ready(function() {

    var date = $("#id_setup_date");
    var curr_date = date.val();
    //Add datepicker to assay and readout start time
    date.datepicker();
    date.datepicker("option", "dateFormat", "yy-mm-dd");
    date.datepicker("setDate", curr_date);

    // Open and then close dialog so it doesn't get placed in window itself
    var dialog = $('#dialog');
    dialog.dialog({
        width: 825,
        height: 500,
        closeOnEscape: true,
        autoOpen: false,
        close: function() {
            $('body').removeClass('stop-scrolling');
        },
        open: function() {
            $('body').addClass('stop-scrolling');
        }
    });
    dialog.removeProp('hidden');

    var warning = $('#warning');
    warning.dialog({
        height:200,
        modal: true,
        closeOnEscape: true,
        autoOpen: false,
        buttons: {
            Yes: function() {
                    $(this).dialog("close");
                },
            No: function() {
                    $('#id_chip_test_type').val('compound');
                    $('#id_chip_test_type').trigger('change');
                    $(this).dialog("close");
                }
        },
        close: function() {
            $('body').removeClass('stop-scrolling');
        },
        open: function() {
            $('body').addClass('stop-scrolling');
        }
    });
    warning.removeProp('hidden');

    function toggle_warning(first) {
        if (test_type == 'control' && compound) {
            $('#control_warning').prop('hidden',false);
            if (!first) {
                $('#warning').dialog('open');
            }
        }
        else{
            $('#control_warning').prop('hidden',true);
        }
    }

    var test_type_selector = $('#id_chip_test_type');
    var compound_selector = $('#id_compound');

    var test_type = test_type_selector.val();
    var compound = compound_selector.val();

    toggle_warning(true);

    test_type_selector.change(function() {
        test_type = test_type_selector.val();
        toggle_warning(false);
    });

    compound_selector.change(function() {
        compound = compound_selector.val();
        toggle_warning(false);
    });

    $('.cellsample').click(function (evt) {
        var cellsampleId = this.id;
        var selectedInput = $('#id_assaychipcells_set-' + id + '-cell_sample');
        selectedInput.prop('value', cellsampleId);
        var cellsampleName = this.attributes["name"].value;
        var selectedLabel = $('#id_assaychipcells_set-' + id + '-cell_sample_label');
        selectedLabel.text(cellsampleName);
        $('#dialog').dialog('close');
    });

    $('#cellsamples').DataTable({
        "iDisplayLength": 50,
        // Initially sort on receipt date
        "order": [ 0, "desc" ],
        // If one wants to display top and bottom
        "sDom": '<"wrapper"fti>'
    });

    // Move filter to left
    $('.dataTables_filter').css('float', 'left');

    // This code should populate cell labels when data is already given
    var current_id = 0;
    var current_input = $('#id_assaychipcells_set-' + current_id + '-cell_sample');
    while(current_input[0]) {
        if(current_input.val()) {
            var cell_name = $('#' + current_input.val()).attr('name');
            $('#id_assaychipcells_set-' + current_id + '-cell_sample_label').text(cell_name);
        }
        current_id += 1;
        current_input = $('#id_assaychipcells_set-' + current_id + '-cell_sample');
    }

    // This will clear a cell sample when the button is pressed
    $('#clear_cell_sample').click(function() {
        var selectedInput = $('#id_assaychipcells_set-' + id + '-cell_sample');
        selectedInput.prop('value', '');
        var selectedLabel = $('#id_assaychipcells_set-' + id + '-cell_sample_label');
        selectedLabel.text('');
        $('#dialog').dialog('close');
    });

    var device = $('#id_device');
    var organ_model = $('#id_organ_model');
    var protocol = $('#id_organ_model_protocol');

    var protocol_display = $('#protocol_display');

    var organ_model_div = $('#organ_model_div');
    var protocol_div = $('#protocol_div');
    var variance_div = $('#variance_div');

    var middleware_token = $('[name=csrfmiddlewaretoken]').attr('value');

    function get_organ_models(device) {
        if (device) {
            $.ajax({
                url: "/assays_ajax",
                type: "POST",
                dataType: "json",
                data: {
                    call: 'fetch_organ_models',
                    device: device,
                    csrfmiddlewaretoken: middleware_token
                },
                success: function (json) {
                    var options = json.context;
                    var current_value = organ_model.val();
                    organ_model.html(options);
                    if (current_value && $('#id_organ_model option[value=' + current_value + ']')[0]) {
                        organ_model.val(current_value);
                    }
                    else {
                        organ_model.val('');
                    }

                    organ_model_div.show('fast');
                    get_protocols(organ_model.val());
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
        else {
            // Clear selections
            organ_model.html('');
            organ_model.val('');
            protocol.html('');
            protocol.val('');

            // Hide
            organ_model_div.hide('fast');
            protocol_div.hide('fast');
            variance_div.hide('fast');
        }
    }

    function get_protocols(organ_model) {
        if (organ_model) {
            $.ajax({
                url: "/assays_ajax",
                type: "POST",
                dataType: "json",
                data: {
                    call: 'fetch_protocols',
                    organ_model: organ_model,
                    csrfmiddlewaretoken: middleware_token
                },
                success: function (json) {
                    var options = json.context;
                    var current_value = protocol.val();
                    protocol.html(options);
                    if (current_value && $('#id_organ_model_protocol option[value=' + current_value + ']')[0]) {
                        protocol.val(current_value);
                    }

                    if (protocol.val()) {
                        variance_div.show('fast');
                    }
                    else {
                        variance_div.hide('fast');
                    }

                    protocol_div.show('fast');
                    display_protocol(protocol.val());
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
        else {
            protocol.html('');
            protocol.val('');

            // Hide
            protocol_div.hide('fast');
            variance_div.hide('fast');
        }
    }

    function display_protocol(protocol) {
        if (protocol) {
            $.ajax({
                url: "/assays_ajax",
                type: "POST",
                dataType: "json",
                data: {
                    call: 'fetch_protocol',
                    protocol: protocol,
                    csrfmiddlewaretoken: middleware_token
                },
                success: function (json) {
                    if (json) {
                        protocol_display.attr('href', json.href);
                        protocol_display.text(json.file_name);
                        variance_div.show('fast');
                    }
                    else {
                        protocol_display.text();
                    }
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
        else {
            // Clear protocol display
            protocol_display.text('');
            protocol_display.attr('href', '');

            // Hide
            variance_div.hide('fast');
        }
    }

    // Handling Device flow
    device.change(function() {
        // Get organ models
        get_organ_models(device.val());
    });

    organ_model.change(function() {
        // Get and display correct protocol options
        get_protocols(organ_model.val());
    });

    protocol.change(function() {
        display_protocol(protocol.val());
    });

    device.trigger('change');
    organ_model.trigger('change');
    protocol.trigger('change');
});