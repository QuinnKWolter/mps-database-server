// TODO MODIFY TO ALSO WORK WITH EDIT PAGE
// TODO MODIFY SO ONLY NECESSARY ARE EXPOSED
window.MASS_EDIT = {
    // For edit page
    matrix_id: null,
};

$(document).ready(function () {
    var is_edit_interface = false;
    if ($('#id_matrix_item-0-reason_for_flag')[0]) {
        is_edit_interface = true;
    }

    var setup_data_selector = $('#id_setup_data');

    // FULL DATA
    var current_setup_data = [];

    // FOR ADD INTERFACE ONLY
    // ERRORS
    var setup_table_errors_selector = $('#setup_table_errors').find('.errorlist');

    // More selectors
    var study_setup_table_section = $('#study_setup_table_section');

    var table_errors = {}

    setup_table_errors_selector.find('li').each(function() {
        var current_text = $(this).text();
        var split_info = current_text.split('-')[0];
        // var prefix = split_info[0];
        // var row_index = split_info[1];
        // var column_index = split_info[2];
        var error_message = current_text.split('-').slice(1).join('-');
        table_errors[split_info] = error_message;
    });

    // FOR EDITING INTERFACE ONLY
    var form_slated_for_deletion = [];

    // ODD, NOT GOOD
    var organ_model = $('#id_organ_model');
    var protocol = $('#id_organ_model_protocol');

    var current_protocol = protocol.val();

    window.organ_model = organ_model;
    window.organ_model_protocol = protocol;

    var first_run = true;
    var keep_current = false;

    // TRICKY
    if (organ_model.val() && setup_data_selector.val()) {
        current_setup_data = JSON.parse(setup_data_selector.val());
        keep_current = true;
    }

    // CRUDE AND BAD
    // If I am going to use these, they should be ALL CAPS to indicate global status
    var item_prefix = 'matrix_item';
    var cell_prefix = 'cell';
    var setting_prefix = 'setting';
    var compound_prefix = 'compound';

    // The different components of a setup
    var prefixes = [
        'cell',
        'compound',
        'setting',
    ];

    var time_prefixes = [
        'addition_time',
        'duration'
    ];

    // DATA FOR THE VERSION
    var current_setup = {};

    // CRUDE
    // MAKE SURE ALL PREFIXES ARE PRESENT
    $.each(prefixes, function(index, prefix) {
        if(!current_setup[prefix]) {
          current_setup[prefix] = [];
        }
    });

    // SOMEWHAT TASTELESS USE OF VARIABLES TO TRACK WHAT IS BEING EDITED
    var current_prefix = '';
    var current_setup_index = 0;
    var current_row_index = null;
    var current_column_index = null;

    // DISPLAYS
    // JS ACCEPTS STRING LITERALS IN OBJECT INITIALIZATION
    var empty_html = {};
    var empty_compound_html = $('#empty_compound_html');
    var empty_cell_html = $('#empty_cell_html');
    var empty_setting_html = $('#empty_setting_html');
    var empty_error_html = $('#empty_error_html').children();
    empty_html[compound_prefix] = empty_compound_html;
    empty_html[cell_prefix] = empty_cell_html;
    empty_html[setting_prefix] = empty_setting_html;

    // var item_final_index = $('.' + item_prefix).length - 1;
    var cell_final_index = $('.' + cell_prefix).length - 1;
    var setting_final_index = $('.' + setting_prefix).length - 1;
    var compound_final_index = $('.' + compound_prefix).length - 1;

    // Due to extra=1 (A SETTING WHICH SHOULD NOT CHANGE) there will always be an empty example at the end
    // I can use these to make new forms as necessary
    // var empty_item_form = $('#' + item_prefix + '-' + item_final_index).html();
    var empty_setting_form = $('#' + setting_prefix + '-' + setting_final_index).html();
    var empty_cell_form = $('#' + cell_prefix + '-' + cell_final_index).html();
    var empty_compound_form = $('#' + compound_prefix + '-' + compound_final_index).html();

    var empty_forms = {};
    // empty_forms[item_prefix] = empty_item_form;
    empty_forms[compound_prefix] = empty_compound_form;
    empty_forms[cell_prefix] = empty_cell_form;
    empty_forms[setting_prefix] = empty_setting_form;

    // Default values
    var default_values = {};
    $.each(prefixes, function(prefix_index, prefix) {
        default_values[prefix] = {};
        var last_index = $('.' + prefix).length - 1;

        $('#' + prefix + '-' + last_index).find(':input:not(:checkbox)').each(function() {
            var split_name = $(this).attr('name').split('-');
            var current_name = split_name[split_name.length - 1];

            // CRUDE: DO NOT INCLUDE MATRIX ITEM
            if (current_name === 'matrix_item') {
                return true;
            }

            default_values[prefix][current_name] = $(this).val();
        });
    });

    var final_indexes = {};
    // final_indexes[item_prefix] = item_final_index;
    final_indexes[compound_prefix] = compound_final_index;
    final_indexes[cell_prefix] = cell_final_index;
    final_indexes[setting_prefix] = setting_final_index;

    // CREATE DIALOGS
    $.each(prefixes, function(index, prefix) {
        var current_dialog = $('#' + prefix + '_dialog');
        current_dialog.dialog({
            width: 825,
            open: function() {
                $.ui.dialog.prototype.options.open();
                // BAD
                setTimeout(function() {
                    // Blur all
                    $('.ui-dialog').find('input, select, button').blur();
                }, 150);

                // Populate the fields
                var current_data = $.extend(true, {}, current_setup_data[current_row_index][current_prefix][current_column_index]);

                var this_popup = $(this);

                this_popup.find('input').each(function() {
                    if ($(this).attr('name')) {
                        $(this).val(current_data[$(this).attr('name').replace(current_prefix + '_', '')]);
                    }
                });

                this_popup.find('select').each(function() {
                    if ($(this).attr('name')) {
                        this.selectize.setValue(current_data[$(this).attr('name').replace(current_prefix + '_', '') + '_id']);
                    }
                });

                // TODO SPECIAL EXCEPTION FOR CELL SAMPLE
                this_popup.find('input[name="' + prefix + '_cell_sample"]').val(
                    current_data['cell_sample_id']
                );

                if (current_data['cell_sample_id']) {
                    // this_popup.find('#id_cell_sample_label').text($('#cell_sample_' + current_data['cell_sample_id']).attr('data-name'));
                    this_popup.find('#id_cell_sample_label').text(window.CELLS.cell_sample_id_to_label[current_data['cell_sample_id']]);
                }
                else {
                    this_popup.find('#id_cell_sample_label').text('');
                }

                // TODO, ANOTHER BARBARIC EXCEPTION (not the best way to handle defaults...)
                // TODO PLEASE REVISE
                if (this_popup.find('#id_cell_biosensor')[0] && !current_data['biosensor_id']) {
                    this_popup.find('#id_cell_biosensor')[0].selectize.setValue(
                        2
                    );
                }

                if (!is_edit_interface || $.isEmptyObject(current_data)) {
                    // TODO SPECIAL EXCEPTION FOR TIMES
                    $.each(time_prefixes, function(index, current_time_prefix) {
                        var split_time = window.SPLIT_TIME.get_split_time(
                            current_data[current_time_prefix]
                        );

                        $.each(split_time, function(time_name, time_value) {
                            this_popup.find('input[name="' + prefix + '_' + current_time_prefix + '_' + time_name + '"]').val(time_value);
                        });
                    });
                }
            },
            buttons: [
            {
                text: 'Apply',
                click: function() {
                    // ACTUALLY MAKE THE CHANGE TO THE RESPECTIVE ENTITY
                    // TODO TODO TODO
                    var current_data = {};

                    $(this).find('input').each(function() {
                        if ($(this).attr('name')) {
                            current_data[$(this).attr('name').replace(current_prefix + '_', '')] = $(this).val();
                        }
                    });

                    $(this).find('select').each(function() {
                        if ($(this).attr('name')) {
                            current_data[$(this).attr('name').replace(current_prefix + '_', '') + '_id'] = $(this).val();
                        }
                    });

                    // SLOPPY
                    if (!is_edit_interface) {
                        $.each(time_prefixes, function(index, current_time_prefix) {
                            if (current_data[current_time_prefix + '_minute'] !== undefined) {
                                current_data[current_time_prefix] = window.SPLIT_TIME.get_minutes(
                                        current_data[current_time_prefix + '_day'],
                                        current_data[current_time_prefix + '_hour'],
                                        current_data[current_time_prefix + '_minute']
                                );
                                $.each(window.SPLIT_TIME.time_conversions, function(key, value) {
                                    delete current_data[current_time_prefix + '_' + key];
                                });
                            }
                        });
                    }

                    // Special exception for cell_sample
                    if ($(this).find('input[name="' + prefix + '_cell_sample"]')[0]) {
                        current_data['cell_sample_id'] = $(this).find('input[name="' + prefix + '_cell_sample"]').val();
                        delete current_data['cell_sample'];
                    }

                    // current_setup_data[current_row_index][current_prefix][current_column_index] = $.extend(true, {}, current_data);
                    modify_setup_data(current_prefix, current_data, current_row_index, current_column_index);

                    var html_contents = get_content_display(current_prefix, current_row_index, current_column_index, current_data);

                    $('a[data-edit-button="true"][data-row="' + current_row_index +'"][data-column="' + current_column_index +'"][data-prefix="' + current_prefix + '"]').parent().html(html_contents);

                    $(this).dialog("close");
                }
            },
            {
                text: 'Cancel',
                click: function() {
                   $(this).dialog("close");
                }
            }]
        });
        current_dialog.removeProp('hidden');
    });

    function reset_current_setup(reset_data) {
        current_setup = {};

        // MAKE SURE ALL PREFIXES ARE PRESENT
        $.each(prefixes, function(index, prefix) {
            if(!current_setup[prefix]) {
              current_setup[prefix] = [];
            }
        });

        if (reset_data) {
            current_setup_data = [];
        }
    }

    function get_display_for_field(field_name, field_value, prefix) {
        // NOTE: SPECIAL EXCEPTION FOR CELL SAMPLES
        if (field_name === 'cell_sample') {
            // TODO VERY POORLY DONE
            // return $('#' + 'cell_sample_' + field_value).attr('data-name');
            // Global here is a little sloppy, but should always succeed
            return window.CELLS.cell_sample_id_to_label[field_value];
        }
        else {
            // Ideally, this would be cached in an object or something
            var origin = $('#id_' + prefix + '_' + field_name);

            // Get the select display if select
            if (origin.prop('tagName') === 'SELECT') {
                // Convert to integer if possible, thanks
                var possible_int = Math.floor(field_value);
                if (possible_int) {
                    return origin[0].selectize.options[possible_int].text;
                }
                else {
                    return origin[0].selectize.options[field_value].text;
                }
                // THIS IS BROKEN, FOR PRE-SELECTIZE ERA
                // return origin.find('option[value="' + field_value + '"]').text()
            }
            // Just display the thing if there is an origin
            else if (origin[0]) {
                return field_value;
            }
            // Give back null to indicate this should not be displayed
            else {
                return null;
            }
        }
    }

    // TODO NEEDS MAJOR REVISION
    function get_content_display(prefix, row_index, column_index, content) {
        var html_contents = [];

        var new_display = empty_html[prefix].clone();

        // Delete button
        new_display.find('.subform-delete').attr('data-prefix', prefix).attr('data-row', row_index).attr('data-column', column_index);

        if (content && Object.keys(content).length) {
            // Hide 'edit' button
            html_contents.push(create_edit_button(prefix, row_index, column_index, true));

            $.each(content, function(key, value) {
                // html_contents.push(key + ': ' + value);
                // I will need to think about invalid fields
                var field_name = key.replace('_id', '');
                if (is_edit_interface || (field_name !== 'addition_time' && field_name !== 'duration')) {
                    var field_display = get_display_for_field(field_name, value, prefix);
                    new_display.find('.' + prefix + '-' + field_name).html(field_display);
                }
                // NOTE THIS ONLY HAPPENS WHEN IT IS NEEDED IN ADD PAGE
                else {
                    var split_time = window.SPLIT_TIME.get_split_time(
                        value
                    );

                    $.each(split_time, function(time_name, time_value) {
                        new_display.find('.' + prefix + '-' + key + '_' + time_name).html(time_value);
                    });
                }
            });

            html_contents.push(new_display.html());
        }
        else {
            // Show 'edit' button
            html_contents.push(create_edit_button(prefix, row_index, column_index, false));
        }

        html_contents = html_contents.join('<br>');

        return html_contents;
    }

    var number_of_columns = {
        'cell': 0,
        'compound': 0,
        'setting': 0,
    };

    // Table vars
    var study_setup_table = $('#study_setup_table');
    var study_setup_head = study_setup_table.find('thead').find('tr');
    var study_setup_body = study_setup_table.find('tbody');

    // MISNOMER, NOW MORE OF AN ADD BUTTON
    function create_edit_button(prefix, row_index, column_index, hidden) {
        // Sloppy
        if (hidden) {
            return '<a data-edit-button="true" data-row="' + row_index + '" data-prefix="' + prefix + '" data-column="' + column_index + '" role="button" class="btn btn-success collapse">Add</a>';
        }
        else {
            return '<a data-edit-button="true" data-row="' + row_index + '" data-prefix="' + prefix + '" data-column="' + column_index + '" role="button" class="btn btn-success">Add</a>';
        }
    }

    function create_delete_button(prefix, index) {
        if (prefix === 'row') {
            return '<a data-delete-row-button="true" data-row="' + index + '" role="button" class="btn btn-danger" style="margin-left: 5px;"><span class="glyphicon glyphicon-remove"></span></a>';
        }
        // NOTE UNFORTUNATE INLINE STYLE
        else {
            return '<a data-delete-column-button="true" data-column="' + index + '" data-prefix="' + prefix + '" role="button" class="btn btn-danger" style="margin-left: 5px;"><span class="glyphicon glyphicon-remove"></span></a>';
        }
    }

    function create_clone_button(index) {
        return '<a data-clone-row-button="true" data-row="' + index + '" role="button" class="btn btn-info"><span class="glyphicon glyphicon-duplicate"></span></a>';
    }

    function replace_setup_data() {
        setup_data_selector.val(JSON.stringify(current_setup_data));
    }

    function modify_setup_data(prefix, content, setup_index, object_index) {
        if (object_index) {
            current_setup_data[setup_index][prefix][object_index] = $.extend(true, {}, content);
        }
        else {
            current_setup_data[setup_index][prefix] = content;
        }

        setup_data_selector.val(JSON.stringify(current_setup_data));

        // EXPENSIVE, BUT ULTIMATELY PROBABLY WORTH IT
        if (is_edit_interface) {
            apply_data_to_forms();
        }
    }

    function spawn_column(prefix) {
        var column_index = number_of_columns[prefix];
        // UGLY
        study_setup_head.find('.' + prefix + '_start').last().after('<th class="new_column ' + prefix + '_start' + '">' + prefix[0].toUpperCase() + prefix.slice(1) + ' ' + (column_index + 1) + create_delete_button(prefix, column_index) +'</th>');

        // ADD TO EXISTING ROWS AS EMPTY
        study_setup_body.find('tr').each(function(row_index) {
            $(this).find('.' + prefix + '_start').last().after('<td class="' + prefix + '_start' + '">' + create_edit_button(prefix, row_index, column_index) + '</td>', false);
        });

        number_of_columns[prefix] += 1;
    }

    // JUST USES DEFAULT PROTOCOL FOR NOW
    function spawn_row(setup_to_use, add_new_row) {
        if (!setup_to_use) {
            setup_to_use = current_setup;
        }

        var new_row = $('<tr>');

        var row_index = study_setup_body.find('tr').length;

        var buttons_to_add = '';
        if (!is_edit_interface) {
            buttons_to_add = create_clone_button(row_index) + create_delete_button('row', row_index);
            new_row.append(
                $('<td>').html(
                    '<div class="no-wrap">' + buttons_to_add + '</div>'
                ).append(
                    $('<span>').text('Group ' + (row_index + 1))
                    // $('<h3>').append($('<span>')
                    //     .addClass('label label-primary')
                    //     .text('Group ' + (row_index + 1))
                    // )
                )
            );

            // SLOPPY, BAD
            var new_td = $('<td>').html(
                '<div class="error-message-section error-display important-display"></div>'
            );

            var number_of_items_input = $('#id_number_of_items')
                .clone()
                .removeAttr('id')
                .attr('data-row', row_index)

            // SLOPPY
            if (study_setup_table_section.is(':visible')) {
                number_of_items_input.attr('required', 'required');
            }

            new_td.append(
                number_of_items_input
            );

            new_row.append(
                new_td
            );
        }
        else {
            new_row.append(
                $('<td>').append(
                    $('<span>').text('Group ' + (row_index + 1))
                    // $('<h3>').append($('<span>')
                    //     .addClass('label label-primary')
                    //     .text('Group ' + (row_index + 1))
                    // )
                )
            );
            new_row.append(
                $('<td>').html(
                    '<div class="error-message-section error-display important-display"></div>'
                )
                .append(
                    $('<span>')
                        .attr('data-row', row_index)
                        .text(group_index_to_item_name[row_index].join(', '))
                )
            );
        }

        // SLOPPY
        var test_type_input = $('#id_test_type')
            .clone()
            .removeAttr('id')
            .attr('data-row', row_index)

        // SLOPPY
        if (study_setup_table_section.is(':visible')) {
            test_type_input.attr('required', 'required');
        }

        new_row.append(
            $('<td>').append(test_type_input)
        );

        // OLD
        // new_row.append(
        //     $('<td>').append(
        //         $('#id_test_type')
        //             .clone()
        //             .removeAttr('id')
        //             .attr('data-row', row_index)
        //     )
        // );

        $.each(prefixes, function(index, prefix) {
            var content_set = setup_to_use[prefix];
            if (!content_set.length) {
                if (!number_of_columns[prefix]) {
                    new_row.append(
                        $('<td>')
                            .attr('hidden', 'hidden')
                            .addClass(prefix + '_start')
                    );
                }
                else {
                    for (var i = 0; i < number_of_columns[prefix]; i++) {
                        new_row.append(
                            $('<td>')
                                .html(create_edit_button(prefix, row_index, i), false)
                                .addClass(prefix + '_start')
                        );
                    }
                }
            }
            else {
                while (number_of_columns[prefix] < content_set.length) {
                    spawn_column(prefix);
                }

                for (var i = 0; i < number_of_columns[prefix]; i++) {
                    var html_contents = get_content_display(prefix, row_index, i, content_set[i]);

                    new_row.append(
                        $('<td>')
                            .html(html_contents)
                            .addClass(prefix + '_start')
                    );
                }
            }
        });

        new_row.find('.number-of-items').val(setup_to_use['number_of_items']);
        new_row.find('.test-type').val(setup_to_use['test_type']);

        study_setup_body.append(new_row);

        if (add_new_row) {
            current_setup_data.push(
                $.extend(true, {}, setup_to_use)
            );
        }

        setup_data_selector.val(JSON.stringify(current_setup_data));
    }

    $(document).on('change', '.test-type', function() {
        modify_setup_data('test_type', $(this).val(), $(this).attr('data-row'));
    });

    $(document).on('change', '.number-of-items', function() {
        modify_setup_data('number_of_items', $(this).val(), $(this).attr('data-row'));
    });

    $(document).on('click', 'a[data-edit-button="true"]', function() {
        current_prefix = $(this).attr('data-prefix');
        current_row_index = $(this).attr('data-row');
        current_column_index = $(this).attr('data-column');
        $('#' + $(this).attr('data-prefix') + '_dialog').dialog('open');
    });

    $(document).on('click', 'a[data-delete-column-button="true"]', function() {
        current_prefix = $(this).attr('data-prefix');
        current_column_index = $(this).attr('data-column');

        if (is_edit_interface) {
            $('.subform-delete[data-column="' + current_column_index + '"][data-prefix="' + current_prefix + '"]').each(function() {
                mark_for_deletion($(this));
            });
        }
        else {
            // DELETE EVERY COLUMN FOR THIS PREFIX THEN REBUILD
            $.each(current_setup_data, function(index, current_content) {
                current_content[current_prefix].splice(current_column_index, 1);
            });

            number_of_columns[current_prefix] -= 1;
        }

        rebuild_table();
    });

    // NOT ALLOWED IN EDIT?
    $(document).on('click', 'a[data-clone-row-button="true"]', function() {
        current_row_index = Math.floor($(this).attr('data-row'));
        spawn_row(current_setup_data[current_row_index], true);

        // MAKE SURE HIDDEN COLUMNS ARE ADHERED TO
        change_matrix_visibility();
    });

    // NOT ALLOWED IN EDIT?
    $(document).on('click', 'a[data-delete-row-button="true"]', function() {
        current_row_index = Math.floor($(this).attr('data-row'));

        // JUST FLAT OUT DELETE THE ROW
        current_setup_data.splice(current_row_index, 1);

        rebuild_table();
    });

    function mark_for_deletion(subform) {
        // REDUNDANT BAD
        current_row_index = Math.floor(subform.attr('data-row'));
        current_column_index = Math.floor(subform.attr('data-column'));
        current_prefix = subform.attr('data-prefix');

        var item_ids = group_index_to_item_id[current_row_index];

        $.each(item_ids, function(i, item_id) {
            var current_form = item_id_to_relevant_forms[item_id][current_prefix][current_column_index].find('input[name$="-DELETE"]');
            var current_status = current_form.prop('checked');
            current_form.prop('checked', !current_status);
        });
    }

    $(document).on('click', '.subform-delete', function() {
        current_row_index = Math.floor($(this).attr('data-row'));
        current_column_index = Math.floor($(this).attr('data-column'));
        current_prefix = $(this).attr('data-prefix');

        if (is_edit_interface) {
            // MARK ALL SUBFORMS IN QUESTION AS DELETED
            // TODO
            mark_for_deletion($(this));
        }
        // DELETE THE DATA HERE
        else {
            current_setup_data[current_row_index][current_prefix][current_column_index] = {};
        }

        rebuild_table();
    });

    $(document).on('click', '.subform-edit', function() {
        // Chaining parents this way is foolish
        $(this).parent().parent().parent().find('a[data-edit-button="true"]').trigger('click');
    });

    $('a[data-add-new-button="true"]').click(function() {
        spawn_column($(this).attr('data-prefix'));
    });

    $('#add_group_button').click(function() {
        spawn_row(null, true);
        // MAKE SURE HIDDEN COLUMNS ARE ADHERED TO
        change_matrix_visibility();
    });

    // SLOPPY: PLEASE REVISE
    // Triggers for hiding elements
    function change_matrix_visibility() {
        $('.visibility-checkbox').each(function() {
            var class_to_hide = $(this).attr('value') + ':not([hidden])';
            if ($(this).prop('checked')) {
                $(class_to_hide).show();
            }
            else {
                $(class_to_hide).hide();
            }
        });
    }

    $('.visibility-checkbox').change(change_matrix_visibility);
    change_matrix_visibility();

    // Show details
    function show_hide_full_details() {
        var current_value_show_details = $('#show_details').prop('checked');

        // Hide all contents of "bubbles"
        // Bad selector
        $.each(prefixes, function(prefix_index, prefix) {
            $('.' + prefix + '-display').children().hide();
        });

        // If checked, unhide all
        if (current_value_show_details) {
            // Bad selector
            $.each(prefixes, function(prefix_index, prefix) {
                $('.' + prefix + '-display').children().show();
            });
        }
        // Otherwise, just unhide the first line of the "bubble"
        else {
            $('.important-display').show();
        }

        change_matrix_visibility();
    }

    $('#show_details').change(show_hide_full_details);
    show_hide_full_details();

    // function apply_protocol_setup_to_row() {
    //
    // }

    function set_new_protocol() {
        // See if the table can be displayed
        // Sloppy
        // MOVED TO ORGAN MODEL
        // if (protocol.val()) {
        //     study_setup_table_section.show('slow');
        // }
        // else {
        //     study_setup_table_section.hide('slow');
        // }

        // TERMINATE EARLY IF FIRST RUN
        if (first_run) {
            first_run = false;
            return;
        }

        reset_current_setup();

        if (protocol.val() && protocol.val() != current_protocol || protocol.val() && !Object.keys(current_setup).length) {
            // Start SPINNING
            window.spinner.spin(
                document.getElementById("spinner")
            );

            // Swap to new protocol
            current_protocol = protocol.val();

            $.ajax({
                url: "/assays_ajax/",
                type: "POST",
                dataType: "json",
                data: {
                    call: 'fetch_organ_model_protocol_setup',
                    organ_model_protocol_id: protocol.val(),
                    csrfmiddlewaretoken: window.COOKIES.csrfmiddlewaretoken,
                },
                success: function (json) {
                    // Stop spinner
                    window.spinner.stop();

                    current_setup = $.extend(true, {}, json);

                    // MAKE SURE ALL PREFIXES ARE PRESENT
                    $.each(prefixes, function(index, prefix) {
                        if(!current_setup[prefix]) {
                          current_setup[prefix] = [];
                        }
                    });

                    // FORCE INITIAL TO BE CONTROL
                    current_setup['test_type'] = 'control';

                    if (keep_current) {
                        keep_current = false;
                    }
                    else {
                        current_setup_data = [];
                    }

                    rebuild_table();
                    },
                    error: function (xhr, errmsg, err) {
                      // Stop spinner
                      window.spinner.stop();

                      console.log(xhr.status + ": " + xhr.responseText);
                    }
                });
            }
            else if (!protocol.val()) {
                current_protocol = protocol.val();
                // NO LONGER PURGES DATA
                // reset_current_setup(true);
                reset_current_setup();
                rebuild_table();
            }

        // See if the table can be displayed
        // Sloppy
        // if (protocol.val()) {
        //     study_setup_table_section.show('slow');
        // }
        // else {
        //     study_setup_table_section.hide('slow');
        // }
        //
        // window.spinner.stop();
    }

    function add_form(prefix, form) {
        var formset = $('#' + prefix);
        formset.append(form);
        $('#id_' + prefix + '-TOTAL_FORMS').val($('.' + prefix).length);
    }

    // Takes a prefix and an Object of {field_name: value} to spit out a form
    function generate_form(prefix, values_to_inject) {
        // TODO TODO TODO
        // Can't cache this, need to check every call!
        var number_of_forms = $('.' + prefix).length;
        var regex_to_replace_old_index = new RegExp("\-" + final_indexes[prefix] + "\-", 'g');

        var new_html = empty_forms[prefix].replace(regex_to_replace_old_index,'-' + number_of_forms + '-');
        var new_form = $('<div>')
            .html(new_html)
            .attr('id', prefix + '-' + number_of_forms)
            .addClass(prefix);

        // TODO TODO TODO ITEM FORMS NEED TO HAVE ROW AND COLUMN INDICES
        if (values_to_inject) {
            $.each(values_to_inject, function(field, value) {
                new_form.find('input[name$="' + field + '"]').val(value);
                // TODO NAIVE: Also set the attribute (val sets a property)
                new_form.find('input[name$="' + field + '"]').attr('value', value);
            });
        }

        return new_form;
    }

    // TESTING
    // Cache all relevant forms
    var item_id_to_relevant_forms = {};

    function apply_data_to_forms() {
        // Reset forms slated for deletion
        form_slated_for_deletion = [];
        $.each(group_index_to_item_id, function(group_index, item_ids) {
            form_slated_for_deletion.push({
                // SLOPPY
                'cell': {},
                'compound': {},
                'setting': {},
            });

            $.each(item_ids, function(item_index, item_id) {
                item_id_to_relevant_forms[item_id] = {
                    // SLOPPY
                    'cell': [],
                    'compound': [],
                    'setting': [],
                    'item': $('.matrix_item:has(input[name$="-id"][value="' + item_id + '"])')
                };

                var current_matrix_forms = item_id_to_relevant_forms[item_id];

                $.each(prefixes, function(prefix_index, prefix) {
                    $('.'  + prefix + ':has(input[name$="-matrix_item"][value="' + item_id + '"])').each(function() {
                        current_matrix_forms[prefix].push($(this));
                    });
                });
            });
        });

        // Iterate over every group and apply the values to the respective forms
        $.each(current_setup_data, function(group_index, contents) {
            if (contents) {
                $.each(group_index_to_item_id[group_index], function(item_index, item_id) {
                    var current_matrix_forms = item_id_to_relevant_forms[item_id];

                    // SET TEST TYPE BEFORE ANYTHING
                    current_matrix_forms['item'].find('select[name$="-test_type"]').val(contents['test_type']);

                    $.each(prefixes, function(prefix_index, prefix) {
                        // SET EACH VALUE
                        $.each(contents[prefix], function(content_index, current_contents) {
                            // MAKE A NEW FORM AS NECESSARY
                            if (!current_matrix_forms[prefix][content_index]) {
                                var new_form = generate_form(prefix, {'matrix_item': item_id});
                                add_form(prefix, new_form);
                                current_matrix_forms[prefix].push(new_form);
                            }
                            var current_form = current_matrix_forms[prefix][content_index];

                            if (current_contents && Object.keys(current_contents).length) {
                                $.each(current_contents, function(current_name, current_value) {
                                    var current_name = current_name.replace('_id', '');
                                    current_form.find('input[name$="-' + current_name + '"]').val(current_value);
                                });

                                if (current_form.find('input[name$="-DELETE"]').prop('checked')) {
                                    form_slated_for_deletion[group_index][prefix][content_index] = true;
                                }
                            }
                        });
                    });
                });
            }
        });

        $.each(form_slated_for_deletion, function(group_index, content) {
            $.each(content, function(prefix, current_content) {
                $.each(current_content, function(content_index, mark) {
                    if (mark) {
                        $('.subform-delete[data-prefix="' + prefix + '"][data-row="' + group_index + '"][data-column="' + content_index + '"]').parent().parent().addClass('strikethrough');
                    }
                });
            });
        });
    }

    function rebuild_table() {
        // GET RID OF ANYTHING IN THE TABLE
        study_setup_head.find('.new_column').remove();
        study_setup_body.empty();

        number_of_columns = {
            'cell': 0,
            'compound': 0,
            'setting': 0,
        };

        if (current_setup_data.length) {
            $.each(current_setup_data, function(index, content) {
                spawn_row(content, false);
            });
        }
        else {
            spawn_row(null, true);
        }

        replace_setup_data();

        // EXPENSIVE, BUT ULTIMATELY PROBABLY WORTH IT
        if (is_edit_interface) {
            apply_data_to_forms();
        }

        // MAKE SURE HIDDEN COLUMNS ARE ADHERED TO
        change_matrix_visibility();

        // Show errors if necessary (ADD)
        if (Object.keys(table_errors).length) {
            $.each(table_errors, function(current_id, error) {
                var split_info = current_id.split('|');
                var prefix = split_info[0];
                var row_index = split_info[1];
                var column_index = split_info[2];
                var field = split_info[3];
                var current_bubble = $('.subform-delete[data-prefix="' + prefix +'"][data-row="' + row_index + '"][data-column="' + column_index + '"]').parent().parent();
                current_bubble.find('.error-message-section').append(empty_error_html.clone().text(field + ': ' + error));
            });
        }
    }

    // Handling Device flow
    // Make sure global var exists before continuing
    if (window.get_organ_models) {
        organ_model.change(function() {
            // NO LONGER ALWAYS RESETS
            // reset_current_setup(true);

            // Get and display correct protocol options
            // Asynchronous
            window.get_protocols(organ_model.val());

            // Show the table if there is an organ model
            if (organ_model.val()) {
                study_setup_table_section.show('slow');
            }
            else {
                study_setup_table_section.hide('slow');
            }

            // Make the table
            rebuild_table();
        }).trigger('change');

        // NOTE THAT THIS IS TRIGGERED ON LOAD
        protocol.change(function() {
            set_new_protocol();
        }).trigger('change');
    }

    // FOR EDIT PAGE ONLY

    var field_name_to_type = {
        // CONTRIVED
        'cell_cell_sample': 'select',
    };

    $.each(prefixes, function(index, prefix) {
        var current_dialog = $('#' + prefix + '_dialog');
        current_dialog.find('input').each(function() {
            if(!field_name_to_type[$(this).attr('name')]) {
                field_name_to_type[$(this).attr('name')] = 'input';
            }
        });

        current_dialog.find('select').each(function() {
            if(!field_name_to_type[$(this).attr('name')]) {
                field_name_to_type[$(this).attr('name')] = 'select';
            }
        });
    });

    // BAD NOT DRY
    var excluded_fields = {
        'DELETE': true,
        'matrix_item': true,
        'id': true,
    };
    function get_field_name(full_field_name) {
        // To get the field name in question, I can split away everything before the terminal -
        if (full_field_name) {
            var field_name = full_field_name.split('-');
            var field_name = field_name[field_name.length-1];
            if (!excluded_fields[field_name]) {
                return field_name;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    // TRICKY: PLACE ELSEWHERE
    var group_index_to_item_name = {};
    var group_index_to_item_id = {};

    function get_groups_from_forms() {
        // LIST ALL PROFILES
        // Split into prefixes
        var unique_entities = {};
        var full_setups = {};
        var setup_to_group = {};

        var setup_id_to_name = {};

        // Get every item ID paired with its test type
        $('.matrix_item').each(function() {
            var current_setup_id = $(this).find('input[name$="-id"]').val();
            if (current_setup_id) {
                full_setups[current_setup_id] = {
                    'test_type': $(this).find('select[name$="-test_type"]').val(),
                    'cell': [],
                    'compound': [],
                    'setting': [],
                };

                setup_id_to_name[current_setup_id] = $(this).find('input[name$="-name"]').val();
            }
        });

        var all_errors = {};

        // Get every prefix
        $.each(prefixes, function(index, prefix) {
            // For every form
            $('.' + prefix).each(function() {
                var current_setup_id = $(this).find('input[name$="-matrix_item"]').val();

                if (current_setup_id) {
                    var current_setup_data = full_setups[current_setup_id][prefix];

                    var data_to_add = {};

                    // List of errors to add in a ul at the top of a display
                    if (!all_errors[current_setup_id]) {
                        all_errors[current_setup_id] = {};
                    }
                    if (!all_errors[current_setup_id][prefix] ) {
                        all_errors[current_setup_id][prefix] = [];
                    }
                    var errors = [];

                    $(this).find(':input').each(function(input_index) {
                        var field_name = get_field_name($(this).attr('name'));
                        if (field_name) {
                            var field_type = field_name_to_type[prefix + '_' + field_name];
                            if (field_type === 'input') {
                                data_to_add[field_name] = $(this).val();
                            }
                            else {
                                var possible_int = Math.floor($(this).val());
                                if (possible_int) {
                                    // THIS IS AN ID FIELD IF IT IS AN INT!
                                    data_to_add[field_name + '_id'] = possible_int;
                                }
                                else {
                                    data_to_add[field_name] = $(this).val();
                                }
                            }

                            var possible_errors = [];
                            if (!input_index) {
                                possible_errors = $(this).prev().prev().find('li');
                                $.each(possible_errors, function() {
                                    if ($(this).text()) {
                                        errors.push($(this).text());
                                    }
                                });
                            }
                            else {
                                possible_errors = $(this).prev().find('li');
                                $.each(possible_errors, function() {
                                    if ($(this).text()) {
                                        errors.push(field_name + ': ' + $(this).text());
                                    }
                                });
                            }
                        }
                    });

                    if (errors.length) {
                        all_errors[current_setup_id][prefix].push(errors);
                    }
                    else if (!all_errors[current_setup_id][prefix].length) {
                        delete all_errors[current_setup_id][prefix];
                    }

                    current_setup_data.push($.extend(true, {}, data_to_add));
                }
            });
        });

        $.each(full_setups, function(setup_id, contents) {
            var stringified_contents = JSON.stringify(contents);
            // NOTE: THIS EXCLUDES 0 VALUES
            if (unique_entities[stringified_contents] === undefined) {
                var index_to_use = current_setup_data.length;
                unique_entities[stringified_contents] = index_to_use;

                current_setup_data.push($.extend(true, {}, contents));

                group_index_to_item_id[index_to_use] = [];
                group_index_to_item_name[index_to_use] = [];

                if (all_errors[setup_id]) {
                    $.each(all_errors[setup_id], function(prefix, error_sets) {
                        $.each(error_sets, function(error_index, error_set) {
                            $.each(error_set, function(error_set_index, error) {
                                var field_name = error.split(':')[0];
                                table_errors[
                                    [
                                        prefix,
                                        index_to_use,
                                        error_index,
                                        field_name
                                    ].join('|')
                                ] = error;
                            });
                        });
                    });
                }
            }
            setup_to_group[setup_id] = unique_entities[stringified_contents];

            group_index_to_item_id[unique_entities[stringified_contents]].push(setup_id);
            group_index_to_item_name[unique_entities[stringified_contents]].push(setup_id_to_name[setup_id]);
        });

        // IF THIS IS EMPTY, TERMINATE EARLY AND SHOW AN ERROR MESSAGE
        if (!Object.keys(group_index_to_item_name).length) {
            $('#invalid_matrix_message').show();
            return;
        }

        rebuild_table();

        // Show the table
        study_setup_table_section.show('slow');
    }

    if (window.MASS_EDIT.matrix_id) {
        // PROBABLY NOT NEEDED AT THE MOMENT
        // Make sure global var exists before continuing
        // ASSUMES STUDY HAS ORGAN MODEL
        // Start SPINNING
        // window.spinner.spin(
        //     document.getElementById("spinner")
        // );
        // $.ajax({
        //         url: "/assays_ajax/",
        //         type: "POST",
        //         dataType: "json",
        //         data: {
        //         call: 'fetch_matrix_setup',
        //         matrix_id: window.MASS_EDIT.matrix_id,
        //         csrfmiddlewaretoken: window.COOKIES.csrfmiddlewaretoken,
        //     },
        //     success: function (json) {
        //         // Stop spinner
        //         window.spinner.stop();
        //
        //         // console.log(json);
        //
        //         current_setup = $.extend(true, {}, json.current_setup);
        //
        //         // SET THE CURRENT SETUP
        //         // SET THE CURRENT VALUES FOR THE GROUPS
        //         // GENERATE THE TABLE
        //         // MATCH UP TRIGGERS
        //     },
        //     error: function (xhr, errmsg, err) {
        //         first_run = false;
        //
        //         // Stop spinner
        //         window.spinner.stop();
        //
        //         console.log(xhr.status + ": " + xhr.responseText);
        //     }
        // });

        get_groups_from_forms();

        // Initially apply to forms if editing
        // if (is_edit_interface) {
        //     apply_data_to_forms();
        // }

        function burn_empty_forms() {
            // BURN EMPTY FORMS (measured by no difference from default)
            $.each(prefixes, function(prefix_index, prefix) {
                $('.' + prefix).each(function(form_index) {
                    var empty = true;

                    var current_form = $(this);

                    $.each(default_values[prefix], function(current_name, current_value) {
                        var current_form_value = current_form.find('[name$="-' + current_name + '"]').val();
                        if (current_form_value && current_form_value !== current_value) {
                            empty = false;
                        }
                    });

                    // Mark for deletion if empty
                    // Items without names should always be removed
                    if (empty) {
                        current_form.find('input[name$="-DELETE"]').prop('checked', true);
                    }
                });
            });
        }

        // SLOPPY WAY TO DO THIS
        // Post submission operation
        // Special operations for pre-submission
        $('form').submit(function() {
            // BURN EMPTY FORMS (measured by no difference from default)
            burn_empty_forms();
        });
    }
});
