// TODO WE ARE NOW CALLING THEM GROUPS AGAIN, I GUESS
$(document).ready(function () {
    // TEMPORARY
    var series_data_selector = $('#id_series_data');

    // FULL DATA
    // TEMPORARY
    var full_series_data = JSON.parse(series_data_selector.val());

    if (series_data_selector.val() === '{}') {
        full_series_data = {
            series_data: [],
            // Plates is an array, kind of ugly, but for the moment one has to search for the current plate on the plate page
            plates: [],
            // The ID needs to be in individual chip objects, they don't exist initially (unlike plates!)
            chips: []
        };
    }

    // TODO WE NEED TO SPLIT OUT MATRIX ITEM DATA
    var chips = full_series_data.chips;

    // SERIES DATA
    var series_data = full_series_data.series_data;
    // var matrix_item_data = full_series_data.matrix_item_data;

    // FOR ADD INTERFACE ONLY
    // ERRORS
    var setup_table_errors_selector = $('#setup_table_errors').find('.errorlist');

    var table_errors = {};

    setup_table_errors_selector.find('li').each(function() {
        var current_text = $(this).text();
        var split_info = current_text.split('-')[0];
        var error_message = current_text.split('-').slice(1).join('-');
        table_errors[split_info] = error_message;
    });

    // ODD, NOT GOOD
    var organ_model = $('#id_organ_model');
    var protocol = $('#id_organ_model_protocol');

    var organ_model_full = $('#id_organ_model_full');
    var organ_model_protocol_full = $('#id_organ_model_protocol_full');

    // var current_protocol = protocol.val();

    window.organ_model = organ_model;
    window.organ_model_protocol = protocol;

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
        if (!current_setup[prefix]) {
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
    var empty_item_html = $('#empty_matrix_item_html').children();
    var empty_compound_html = $('#empty_compound_html');
    var empty_cell_html = $('#empty_cell_html');
    var empty_setting_html = $('#empty_setting_html');
    var empty_error_html = $('#empty_error_html').children();
    empty_html[item_prefix] = empty_item_html;
    empty_html[compound_prefix] = empty_compound_html;
    empty_html[cell_prefix] = empty_cell_html;
    empty_html[setting_prefix] = empty_setting_html;

    // Specific to compounds, this checkbox will indicate whether to use the increment
    // var use_compound_concentration_increment = $('#id_use_compound_concentration_increment');
    // var compound_compound_increment = $('#id_compound_compound_increment');
    // var compound_compound_increment_type = $('#id_compound_compound_increment_type');
    // var compound_concentration_increment_direction = $('#id_compound_concentration_increment_direction');

    // var selection_dialog_selected_items = $('#selection_dialog_selected_items');
    // var series_selector = $('#id_series_selector');
    // var selection_dialog_naming_section = $('.selection_dialog_naming_section');
    // var use_chip_naming = $('#id_use_chip_naming');
    // var chip_naming = $('#id_chip_naming');

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
                var current_data = $.extend(true, {}, series_data[current_row_index][current_prefix][current_column_index]);

                var this_popup = $(this);

                // Apply current data to popup inputs
                this_popup.find('input').each(function() {
                    if ($(this).attr('name')) {
                        $(this).val(current_data[$(this).attr('name').replace(current_prefix + '_', '')]);
                    }
                });

                // Apply current data to selects
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

                // TODO SPECIAL EXCEPTION FOR TIMES
                $.each(time_prefixes, function(index, current_time_prefix) {
                    var split_time = window.SPLIT_TIME.get_split_time(
                        current_data[current_time_prefix]
                    );

                    $.each(split_time, function(time_name, time_value) {
                        this_popup.find('input[name="' + prefix + '_' + current_time_prefix + '_' + time_name + '"]').val(time_value);
                    });
                });
            },
            buttons: [
            {
                text: 'Apply',
                click: function() {
                    // ACTUALLY MAKE THE CHANGE TO THE RESPECTIVE ENTITY
                    // TODO TODO TODO
                    var current_data = {};

                    // Apply the values from the inputs
                    $(this).find('input').each(function() {
                        if ($(this).attr('name')) {
                            current_data[$(this).attr('name').replace(current_prefix + '_', '')] = $(this).val();
                        }
                    });

                    // Apply the values from the selects
                    $(this).find('select').each(function() {
                        if ($(this).attr('name')) {
                            current_data[$(this).attr('name').replace(current_prefix + '_', '') + '_id'] = $(this).val();
                        }
                    });

                    // SLOPPY
                    // DEAL WITH SPLIT TIMES
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

                    // Special exception for cell_sample
                    if ($(this).find('input[name="' + prefix + '_cell_sample"]')[0]) {
                        current_data['cell_sample_id'] = $(this).find('input[name="' + prefix + '_cell_sample"]').val();
                        delete current_data['cell_sample'];
                    }

                    // Modify the setup data
                    modify_series_data(current_prefix, current_data, current_row_index, current_column_index);

                    // Get the display for the current content
                    var html_contents = get_content_display(current_prefix, current_row_index, current_column_index, current_data, true);

                    // Apply the content
                    $('a[data-edit-button="true"][data-row="' + current_row_index +'"][data-column="' + current_column_index +'"][data-prefix="' + current_prefix + '"]').parent().html(html_contents);

                    // Overkill
                    rebuild_table();

                    $(this).dialog('close');
                }
            },
            {
                text: 'Cancel',
                click: function() {
                   $(this).dialog('close');
                }
            }]
        });
        current_dialog.removeProp('hidden');
    });

    // Resets the data for the current_setup
    function reset_current_setup(reset_data) {
        current_setup = {};

        // MAKE SURE ALL PREFIXES ARE PRESENT
        $.each(prefixes, function(index, prefix) {
            if(!current_setup[prefix]) {
              current_setup[prefix] = [];
            }
        });

        if (reset_data) {
            series_data = [];
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
                    if (origin[0].selectize.options[field_value]) {
                        return origin[0].selectize.options[field_value].text;
                    }
                    // If the current selection is blank, return the empty string
                    else {
                        return '';
                    }
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
    function get_content_display(prefix, row_index, column_index, content, editable) {
        var html_contents = [];

        // Clone the empty_html for a starting point
        var new_display = empty_html[prefix].clone();

        // KILL EDIT FOR PREVIEW
        if (!editable)
        {
            new_display.find('.subform-delete').remove();
            new_display.find('.subform-edit').remove();
        }

        // Delete button
        if (editable) {
            new_display.find('.subform-delete').attr('data-prefix', prefix).attr('data-row', row_index).attr('data-column', column_index);
        }

        if (content && Object.keys(content).length) {
            if (editable) {
                // Hide 'edit' button
                html_contents.push(create_edit_button(prefix, row_index, column_index, true));
            }

            $.each(content, function(key, value) {
                // html_contents.push(key + ': ' + value);
                // I will need to think about invalid fields
                var field_name = key.replace('_id', '');
                if ((field_name !== 'addition_time' && field_name !== 'duration')) {
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

    // To discern how many columns are needed for the table display
    // Obviously, the largest number of columns found for any series
    var number_of_columns = {
        'cell': 0,
        'compound': 0,
        'setting': 0,
    };

    // Table vars
    var study_setup_table = $('#study_setup_table');
    var study_setup_head = study_setup_table.find('thead').find('tr');
    var study_setup_body = study_setup_table.find('tbody');

    // PREVIEW
    var series_table_preview = $('#series_table_preview');

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
        // Change clone button to read "Copy"
        // return '<a data-clone-row-button="true" data-row="' + index + '" role="button" class="btn btn-info"><span class="glyphicon glyphicon-duplicate"></span></a>';
        return '<a data-clone-row-button="true" data-row="' + index + '" role="button" class="btn btn-info">Copy</a>';
    }

    // Swaps out the data we are saving to the form
    // TODO TODO TODO XXX REVISE TO USE ALL_DATA
    function replace_series_data() {
        series_data_selector.val(JSON.stringify(full_series_data));
    }

    // TODO REVISE FOR TRUE ID
    function add_chip(setup_index) {
        chips.push({
            'name': chips.length + 1,
            'group_id': setup_index
        });
    }

    // TODO REVISE FOR TRUE ID
    function remove_chip(setup_index) {
        $.each(chips, function(index, chip) {
            // NOTE: group_id is just an index for the moment
            // Really, it needs to be changed to an actual ID
            if (chip.group_id === setup_index) {
                chips.splice(index, 1);
                // Break after removal
                return false;
            }
        });
    }

    function modify_chip_data(number_of_chips, setup_index) {
        var current_number_of_chips = 0;

        $.each(chips, function(index, chip) {
            // NOTE: group_id is just an index for the moment
            // Really, it needs to be changed to an actual ID
            if (chip.group_id === setup_index) {
                current_number_of_chips += 1;
            }
        });

        while (current_number_of_chips > number_of_chips) {
            remove_chip(setup_index);
            current_number_of_chips -= 1;
        }

        while (current_number_of_chips < number_of_chips) {
            add_chip(setup_index);
            current_number_of_chips += 1;
        }

        console.log(chips);

        replace_series_data();
    }

    // Modify the setup data for the given contents
    function modify_series_data(prefix, content, setup_index, object_index) {
        if (object_index) {
            series_data[setup_index][prefix][object_index] = $.extend(true, {}, content);
        }
        else {
            series_data[setup_index][prefix] = content;
        }

        replace_series_data();
    }

    function spawn_column(prefix) {
        var column_index = number_of_columns[prefix];
        // UGLY
        // Finds the correct place to put a new button
        study_setup_head.find('.' + prefix + '_start').last().after('<th class="new_column ' + prefix + '_start' + '">' + prefix[0].toUpperCase() + prefix.slice(1) + ' ' + (column_index + 1) + create_delete_button(prefix, column_index) +'</th>');

        // ADD TO EXISTING ROWS AS EMPTY
        study_setup_body.find('tr').each(function(row_index) {
            $(this).find('.' + prefix + '_start').last().after('<td class="' + prefix + '_start' + '">' + create_edit_button(prefix, row_index, column_index) + '</td>', false);
        });

        // Increment columns for this prefix
        number_of_columns[prefix] += 1;
    }

    // JUST USES DEFAULT PROTOCOL FOR NOW
    function spawn_row(setup_to_use, add_new_row) {
        // TODO: SHOULD REMOVE, WHOLE CONCEPT OF current_setup NEED TO BE REVISED
        if (!setup_to_use) {
            setup_to_use = current_setup;
        }

        var new_row = $('<tr>');

        var row_index = study_setup_body.find('tr').length;

        new_row.attr('data-series', row_index + 1);

        var buttons_to_add = '';
        buttons_to_add = create_clone_button(row_index) + create_delete_button('row', row_index);
        new_row.append(
            $('<td>').html(
                '<div class="no-wrap">' + buttons_to_add + '</div>'
            ).append(
                $('<strong>').text('Group ' + (row_index + 1))
            )
        );

        // SLOPPY, BAD
        // var new_td = $('<td>').html(
        //     '<div class="error-message-section error-display important-display"></div>'
        // );

        // new_row.append(
        //     new_td
        // );

        // Let's just have text instead, saves space among other things
        // SLOPPY
        // var organ_model_input = $('#id_organ_model_full')
        //     .clone()
        //     .removeAttr('id')
        //     .attr('name', 'organ_model')
        //     .attr('data-row', row_index)
        //     .addClass('organ-model');

        // SLOPPY
        // organ_model_input.attr('required', 'required');

        var organ_model_input = $('<div>')
            .append($('<div>')
                .attr('data-row', row_index)
                .addClass('organ-model')
            ).append($('<div>')
                .attr('data-row', row_index)
                .addClass('organ-model-protocol')
            )

        new_row.append(
            $('<td>').append(organ_model_input).append(
                $('<div>')
                .append(
                    $('<span>').addClass(
                        'btn btn-primary btn-block glyphicon glyphicon-search query-versions'
                    ).attr(
                        'data-row-index', row_index
                    )
                )
            )
        );

        var name_input = $('#id_group_name')
            .clone()
            .removeAttr('id')
            .addClass('group-name')
            .attr('data-row', row_index);

        new_row.append(
            $('<td>').append(name_input)
        );

        // organ_model_input.selectize();

        // TODO: ONLY SHOW FOR CHIPS
        // TODO: MAKE FUNCTIONAL
        var number_of_items_input = $('#id_number_of_items')
                .clone()
                .removeAttr('id')
                .addClass('number-of-items')
                .attr('data-row', row_index);

        new_row.append(
            $('<td>').append(number_of_items_input)
        );

        // SLOPPY
        var test_type_input = $('#id_test_type')
            .clone()
            .removeAttr('id')
            .attr('data-row', row_index)
            .addClass('test-type')
            // Contrived: prevent from getting smashed
            .css('min-width', 100);

        // SLOPPY
        test_type_input.attr('required', 'required');

        new_row.append(
            $('<td>').append(test_type_input)
        );

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
                    for (var i=0; i < number_of_columns[prefix]; i++) {
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

                for (var i=0; i < number_of_columns[prefix]; i++) {
                    var html_contents = get_content_display(prefix, row_index, i, content_set[i], true);

                    new_row.append(
                        $('<td>')
                            .html(html_contents)
                            .addClass(prefix + '_start')
                    );
                }
            }
        });

        // new_row.find('.organ-model')[0].selectize.setValue(setup_to_use['organ_model_id']);

        // Set the organ model and porotocol
        new_row.find('.organ-model').text(
            organ_model_full.find('option[value="' + setup_to_use['organ_model_id'] + '"]').text()
        );
        if (setup_to_use['organ_model_protocol_id']) {
            new_row.find('.organ-model-protocol').text(
                'Version: ' +
                organ_model_protocol_full.find('option[value="' + setup_to_use['organ_model_protocol_id'] + '"]').text()
            );
        }

        if (setup_to_use['device_type'] === 'plate') {
            new_row.find('.number-of-items')
                .val(0)
                .attr('disabled', 'disabled')
                .attr('title', 'The Group is for Plates Only')
        }
        else {
            new_row.find('.number-of-items')
                .val(setup_to_use['number_of_items'])
                .removeAttr('disabled');
        }

        new_row.find('.group-name').val(setup_to_use['name']);
        new_row.find('.test-type').val(setup_to_use['test_type']);

        study_setup_body.append(new_row);

        if (add_new_row) {
            series_data.push(
                $.extend(true, {}, setup_to_use)
            );

            // Crude way to make sure the chips get generated
            new_row.find('.number-of-items').trigger('change');
        }
        else if (setup_to_use['device_type'] === 'plate') {
            new_row.find('.number-of-items').trigger('change');
        }

        replace_series_data();

        // Add group to selectors
        // series_selector.append(new Option('Group ' + (row_index + 1), row_index + 1));
    }

    $(document).on('change', '.test-type', function() {
        // CRUDE SOLUTION FOR IDIOSYNCRATIC BEHAVIOR: INVESTIGATE ASAP
        $('option[value="' + this.value + '"]', this)
            .attr('selected', true).siblings()
            .removeAttr('selected')
        modify_series_data('test_type', $(this).val(), $(this).attr('data-row'));

        // Overkill
        rebuild_table();
    });

    $(document).on('change', '.number-of-items', function() {
        modify_series_data('number_of_items', $(this).val(), $(this).attr('data-row'));

        modify_chip_data($(this).val(), $(this).attr('data-row'));

        // Overkill
        rebuild_table();
    });

    $(document).on('change', '.group-name', function() {
        modify_series_data('name', $(this).val(), $(this).attr('data-row'));

        // Overkill
        rebuild_table();
    });

    // $(document).on('change', '.organ-model', function() {
    //     modify_series_data('organ_model_id', $(this).val(), $(this).attr('data-row'));
    // });

    $(document).on('click', 'a[data-edit-button="true"]', function() {
        current_prefix = $(this).attr('data-prefix');
        current_row_index = $(this).attr('data-row');
        current_column_index = $(this).attr('data-column');
        $('#' + $(this).attr('data-prefix') + '_dialog').dialog('open');
    });

    $(document).on('click', 'a[data-delete-column-button="true"]', function() {
        current_prefix = $(this).attr('data-prefix');
        current_column_index = $(this).attr('data-column');

        // DELETE EVERY COLUMN FOR THIS PREFIX THEN REBUILD
        $.each(series_data, function(index, current_content) {
            current_content[current_prefix].splice(current_column_index, 1);
        });

        number_of_columns[current_prefix] -= 1;

        rebuild_table();
    });

    // NOT ALLOWED IN EDIT?
    $(document).on('click', 'a[data-clone-row-button="true"]', function() {
        current_row_index = Math.floor($(this).attr('data-row'));
        spawn_row(series_data[current_row_index], true);

        // MAKE SURE HIDDEN COLUMNS ARE ADHERED TO
        change_matrix_visibility();
    });

    // NOT ALLOWED IN EDIT?
    $(document).on('click', 'a[data-delete-row-button="true"]', function() {
        current_row_index = Math.floor($(this).attr('data-row'));

        // A somewhat odd way to kill the chips
        // Set the number of items to zero and trigger it
        $('.number-of-items[data-row="' + $(this).attr('data-row') + '"]').val(0).trigger('change');

        // TODO: WE NEED TO DEAL WITH THE CONSEQUENCES OF DELETION!
        // Iterate over matrix_item and reset the current series
        // var all_keys = Object.keys(matrix_item_data);
        // $.each(all_keys, function(index, item_row_column) {
        //     var contents = matrix_item_data[item_row_column];
        //     // Delete if this is associated with the series to be removed
        //     if (contents.series - 1 === current_row_index) {
        //         delete matrix_item_data[item_row_column];

        //         // Unset the label
        //         unset_label($(item_display_class + '[data-row-column="' + item_row_column + '"]'));
        //     }
        //     // Decrement if this comes after the series to be removed
        //     else if (contents.series - 1 > current_row_index) {
        //         contents.series = contents.series - 1;

        //         // Reset the label
        //         set_label($(item_display_class + '[data-row-column="' + item_row_column + '"]'), contents.series);
        //     }
        // });

        // JUST FLAT OUT DELETE THE ROW
        series_data.splice(current_row_index, 1);

        rebuild_table();
    });

    $(document).on('click', '.subform-delete', function() {
        current_row_index = Math.floor($(this).attr('data-row'));
        current_column_index = Math.floor($(this).attr('data-column'));
        current_prefix = $(this).attr('data-prefix');

        // DELETE THE DATA HERE
        series_data[current_row_index][current_prefix][current_column_index] = {};

        rebuild_table();
    });

    $(document).on('click', '.subform-edit', function() {
        // Chaining parents this way is foolish
        $(this).parent().parent().parent().find('a[data-edit-button="true"]').trigger('click');
    });

    $('a[data-add-new-button="true"]').click(function() {
        spawn_column($(this).attr('data-prefix'));
    });

    $('#add_series_button').click(function() {
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

    function get_device_type(is_new) {
        if (organ_model.val()) {
            // Get the organ_model type
            // Start SPINNING
            window.spinner.spin(
                document.getElementById("spinner")
            );
            $.ajax({
                url: "/assays_ajax/",
                type: "POST",
                dataType: "json",
                data: {
                    call: 'fetch_organ_model_type',
                    organ_model_id: organ_model.val(),
                    csrfmiddlewaretoken: window.COOKIES.csrfmiddlewaretoken,
                },
                success: function (json) {
                    // Stop spinner
                    window.spinner.stop();

                    series_data[current_setup_index]['device_type'] = json;

                    get_protocol(is_new);
                },
                error: function (xhr, errmsg, err) {
                    // Stop spinner
                    window.spinner.stop();

                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
        else {
            get_protocol(is_new);
        }
    }

    function get_protocol(is_new) {
        if (is_new) {
            // Set organ_model_id
            series_data[current_setup_index]['organ_model_id'] = organ_model.val();
            series_data[current_setup_index]['organ_model_protocol_id'] = protocol.val();
        }

        // if (protocol.val() && protocol.val() != current_protocol || protocol.val() && !Object.keys(current_setup).length) {
        if (protocol.val()) {
            // Start SPINNING
            window.spinner.spin(
                document.getElementById("spinner")
            );

            // Swap to new protocol
            // current_protocol = protocol.val();

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

                    // series_data[current_setup_index] = $.extend(true, {}, json);

                    if (is_new) {
                        // MAKE SURE ALL PREFIXES ARE PRESENT
                        $.each(prefixes, function(index, prefix) {
                            if (json[prefix]) {
                                // Slow, but rare operation
                                series_data[current_setup_index][prefix] = JSON.parse(JSON.stringify(json[prefix]));
                            }
                        });

                        // FORCE INITIAL TO BE CONTROL
                        // series_data[current_setup_index]['test_type'] = 'control';

                        // console.log(series_data);

                        rebuild_table();
                    }
                    // Contrived make preview
                    else {
                        series_table_preview.empty();
                        var new_row = $('<tr>');

                        $.each(json, function(prefix, content_set) {
                            for (var i=0; i < content_set.length; i++) {
                                var html_contents = get_content_display(prefix, 0, i, content_set[i], false);

                                new_row.append(
                                    $('<td>')
                                        .html(html_contents)
                                );
                            }
                        });

                        series_table_preview.append(new_row);
                    }
                },
                error: function (xhr, errmsg, err) {
                    // Stop spinner
                    window.spinner.stop();

                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
        else if (!protocol.val()) {
            if (is_new) {
                reset_current_setup();
                rebuild_table();
            }
            else {
                series_table_preview.empty();
            }
        }
    }

    function set_new_protocol(is_new) {
        get_device_type(is_new);
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

        // Empty series selector
        // series_selector.empty();

        console.log(series_data);

        if (series_data.length) {
            $.each(series_data, function(index, content) {
                spawn_row(content, false);
            });
        }
        else {
            spawn_row(null, true);
        }

        replace_series_data();

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

        // Also remake the difference table
        window.GROUPS.make_difference_table();
    }

    // TESTING
    rebuild_table();

    var version_dialog = $('#version_dialog');
    version_dialog.dialog({
        width: 900,
        height: 500,
        open: function() {
            $.ui.dialog.prototype.options.open();
            // BAD
            setTimeout(function() {
                // Blur all
                $('.ui-dialog').find('input, select, button').blur();
            }, 150);
        },
        buttons: [
        {
            text: 'Apply',
            click: function() {
                // Get the version data and apply to row
                set_new_protocol(true);

                $(this).dialog('close');
            }
        },
        {
            text: 'Cancel',
            click: function() {
               $(this).dialog('close');
            }
        }]
    });
    version_dialog.removeProp('hidden');

    $(document).on('click', '.query-versions', function() {
        current_setup_index = $(this).attr('data-row-index');
        current_setup = series_data[current_setup_index];
        version_dialog.dialog('open');
    });

    // Handling Device flow
    // Make sure global var exists before continuing
    if (window.get_organ_models) {
        organ_model.change(function() {
            // Get and display correct protocol options
            // Asynchronous
            window.get_protocols(organ_model.val());
        }).trigger('change');

        protocol.change(function() {
            set_new_protocol(false);
        });
    }
});
