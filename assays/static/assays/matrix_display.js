// Functions for displaying Assay Matrices
// TODO WE MAY WANT THIS IN MULTIPLE LOCATIONS, BUT AT THE MOMENT I AM ASSUMING ADD ONLY
// TODO THIS FILE IS A MESS
$(document).ready(function () {
    // The matrix's ID
    var matrix_id = Math.floor(window.location.href.split('/')[5]);

    // Alias for the matrix selector
    var matrix_table_selector = $('#matrix_table');
    var matrix_body_selector = $('#matrix_body');

    // Allows the matrix_table to have the draggable JQuery UI element
    matrix_table_selector.selectable({
        filter: 'td',
        distance: 1,
        stop: matrix_add_content_to_selected
    });

    // Alias for device selector
    var device_selector = $('#id_device');

    // Alias for action selector
    var action_selector = $('#id_action');

    // Alias for representation selector
    var representation_selector = $('#id_representation');

    // Alias for number of rows/columns
    var number_of_items_selector = $('#id_number_of_items');
    var number_of_rows_selector = $('#id_number_of_rows');
    var number_of_columns_selector = $('#id_number_of_columns');

    // JSON Form data for items
    var item_data_selector = $('#id_item_data');
    // TODO POPULATE
    // JSON Form data for setups
    var setup_data_selector = $('#id_setup_data');
    // JSON Form data for compounds, cells, and settings (perhaps more later)
    var setup_set_data_selector = $('#id_setup_set_data');

    // Not currently used, may be helpful in future
    // var initial_number_of_rows = 0;
    // var initial_number_of_columns = 0;

    // Contains values for items
    // TODO EXPOSED FOR TESTING
    item_data = {};

    // Contains values for setups
    // A little weird, JSON of setup -> "setup_index"
    // TODO EXPOSED FOR TESTING
    setups = {};
    setups_reverse = {};
    // CONTAINS ALL OF THE SETS FOR A SETUP (the compounds, cells, settings, etc)
    // TODO EXPOSED FOR TESTING
    setup_sets = {
        'compounds': {},
        'settings': {},
        'cells': {}
    };
    // TODO EXPOSED FOR TESTING
    setup_sets_reverse = {
        'compounds': {},
        'settings': {},
        'cells': {}
    };

    // Contains prebuild HTML objects so they don't have to be processed again
    var setup_sets_html = {
        'compounds': {},
        'settings': {},
        'cells': {}
    };

    // TODO TODO TODO THESE SHOULD NOT BE MAKE LIKE THIS, DRY
    // JS Objects are SORT OF ordered, so this gets a little tricky
    // Empty setup
    var empty_setup = {
        // Don't bother with id?
        // 'id': null,
        'device_id': null,
        'device': '',
        'organ_model_id': null,
        'organ_model': '',
        'organ_model_protocol_id': null,
        'organ_model_protocol': '',
        'variance_from_organ_model_protocol': '',
        'cells': [],
        'compounds': [],
        'settings': []
    };

    // TODO
    var empty_setting = {};

    var empty_cell_sample = {
        // Don't bother with id?
        // 'id': null,
        'cell_sample_id': null,
        'cell_sample': '',
        'biosensor_id': null,
        'biosensor': '',
        'density': null,
        'density_unit_id': null,
        'density_unit': '',
        'passage': null
    };

    var empty_compound = {
        // Don't bother with id?
        // 'id': null,
        'concentration': null,
        'concentration_unit_id': null,
        'concentration_unit': '',
        'addition_time': null,
        'duration': null,
        // Subject to removal
        'addition_time_day': '',
        'duration_day': '',
        'addition_time_hour': '',
        'duration_hour': '',
        'addition_time_minute': '',
        'duration_minute': '',
        // continue
        'compound_id': null,
        'compound': '',
        'supplier_text': '',
        'lot_text': '',
        'receipt_date': ''
    };

    // Default object for item
    var empty_item = {
        'id': null,
        'name': '',
        'setup_date': '',
        // 'failure_date': '',
        'failure_time': '',
        'failure_reason_id': null,
        'scientist': '',
        'notebook': '',
        'notebook_page': '',
        'notes': '',
        'row_index': null,
        'column_index': null,
        // 'setup': {
        //     // Don't bother with id?
        //     // 'id': null,
        //     'device_id': null,
        //     'device': '',
        //     'organ_model_id': null,
        //     'organ_model': '',
        //     'organ_model_protocol_id': null,
        //     'organ_model_protocol': '',
        //     'variance_from_organ_model_protocol': '',
        //     'cells': [],
        //     'compounds': [],
        //     'settings': []
        // },
        'setup_index': null,
        'modified': '',
        // Subject to change
        'deleted': ''
    };

    // These ended up being practically unintelligible
    // TODO TODO TODO Have a template or hidden HTML for these instead
    var empty_item_html = $('<td>')
        // Name
        .append(
            $('<div>')
                .append(
                $('<span>')
                    .addClass('item-name')
                )
                .append(
                $('<span>')
                    .addClass('item-current_setup')
                )
                .attr('align', 'center')
        )
        // Setup date
        .append(
            $('<div>')
                .addClass('item-setup_date')
        )
        // Failure
        .append(
            $('<div>')
                .addClass('item-failure')
                // .append(
                //     $('<span>')
                //         .addClass('item-failure_date')
                // )
                .append(
                    $('<span>')
                        .addClass('item-failure_time')
                )
                .append(
                    $('<span>')
                        // .addClass('item-failure_reason glyphicon glyphicon-exclamation-sign')
                        .addClass('item-failure_reason')
                )
        )
        // Notes
        .append(
            $('<div>')
                .addClass('item-notes_section')
                .append(
                    $('<span>')
                        .addClass('item-scientist')
                )
                .append(
                    $('<span>')
                        .addClass('item-notebook')
                )
                .append(
                    $('<span>')
                        .addClass('item-notebook_page')
                )
                .append(
                    $('<span>')
                        // .addClass('item-notes glyphicon glyphicon-question-mark')
                        .addClass('item-notes')
                )
        )
        // Setup
        .append(
            $('<div>')
                .addClass('item-setup_section')
                .append(
                    $('<div>')
                        .addClass('item-device')
                )
                .append(
                    $('<div>')
                        .append(
                            $('<span>')
                                .addClass('item-organ_model')
                        )
                        .append(
                            $('<span>')
                                .addClass('item-organ_model_protocol')
                        )
                )
                .append(
                    $('<div>')
                    .append(
                        $('<span>')
                            // .addClass('item-variance_from_organ_model_protocol glyphicon glyphicon-question-mark')
                            .addClass('item-variance_from_organ_model_protocol')
                    )
                )
        )
        // Cells
         .append(
            $('<div>')
                .addClass('item-cells_section item-setup_set_section')
         )
        // Compounds
        .append(
            $('<div>')
                .addClass('item-compounds_section item-setup_set_section')
        )
        // Settings?
        .append(
            $('<div>')
                .addClass('item-settings_section item-setup_set_section')
        )
    ;

    var empty_compound_html = $('<div>')
        .addClass('bg-info')
        .append(
            $('<div>')
                .append(
                    $('<span>')
                        .addClass('item-compound')
                )
                .append(
                    $('<span>')
                        .addClass('item-concentration')
                )
                .append(
                    $('<span>')
                        .addClass('item-concentration_unit')
                )
        )
        .append(
            $('<div>')
                .append(
                    $('<span>')
                        .addClass('item-supplier_text')
                )
                .append(
                    $('<span>')
                        .addClass('item-lot_text')
                )
        )
        .append(
            $('<div>')
                .addClass('item-receipt_date')
        )
        .append(
            $('<div>')
                .addClass('item-addition_time_section')
                .append($('<span>').html('Added on D'))
                .append(
                    $('<span>')
                        .addClass('item-addition_time_day')
                )
                .append($('<span>').html('H'))
                .append(
                    $('<span>')
                        .addClass('item-addition_time_hour')
                )
                .append($('<span>').html('M'))
                .append(
                    $('<span>')
                        .addClass('item-addition_time_minute')
                )
        )
        .append(
            $('<div>')
                .addClass('item-duration_section')
                .append($('<span>').html('Duration of D'))
                .append(
                    $('<span>')
                        .addClass('item-duration_day')
                )
                .append($('<span>').html('H'))
                .append(
                    $('<span>')
                        .addClass('item-duration_hour')
                )
                .append($('<span>').html('M'))
                .append(
                    $('<span>')
                        .addClass('item-duration_minute')
                )
        )
    ;

    var empty_cell_html = $('<div>')
        .addClass('bg-primary')
        .append(
            $('<div>')
                .addClass('item-cell_sample')
        )
        .append(
            $('<div>')
                .addClass('item-passage')
        )
        .append(
            $('<div>')
                .addClass('item-biosensor')
        )
        .append(
            $('<div>')
                .append(
                    $('<span>')
                        .addClass('item-density')
                )
                .append(
                    $('<span>')
                        .addClass('item-density_unit')
                )
        )
    ;

    // TODO
    var empty_setting_html = $('<div>');

    var empty_html = {
        'compounds': empty_compound_html,
        'cells': empty_cell_html,
        'settings': empty_setting_html
    };

    // For converting between times
    var time_conversions = {
        'day': 1440.0,
        'hour': 60.0,
        'minute': 1.0
    };

    // TODO POOR POSITIONING
    // SUBJECT TO CHANGE REFRESH ALL INITIALLY
    if (item_data_selector.val() !== '{}') {
        // THIS IS IN POOR TASTE AND I SHOULDN'T BE DOING IT
        // console.log(item_data_selector.val());
        // item_data_selector.val(item_data_selector.val().replace(/u'(?=[^:]+')/g, "'"));
        // setup_data_selector.val(setup_data_selector.val().replace(/u'(?=[^:]+')/g, "'"));
        // setup_set_data_selector.val(setup_set_data_selector.val().replace(/u'(?=[^:]+')/g, "'"));
        // console.log(item_data_selector.val());
        item_data = JSON.parse(item_data_selector.val());
        // refresh_all_contents();
    }
    if (setup_data_selector.val() !== '{}') {
        setups = JSON.parse(setup_data_selector.val());
        setups_reverse = _.invert(setups, true);
    }
    if (setup_set_data_selector.val() !== '{}') {
        setup_sets = JSON.parse(setup_set_data_selector.val());
        // Invert with multi-value set to true
        setup_sets_reverse = {};
        $.each(_.keys(empty_html), function(i, index) {
            setup_sets_reverse[index] = _.invert(setup_sets[index], true);
        });
    }

    function get_split_time(time_in_minutes) {
        var times = {
            'day': 0,
            'hour': 0,
            'minute': 0
        };

        var time_in_minutes_remaining = time_in_minutes;
        $.each(time_conversions, function(time_unit, conversion) {
            var initial_time_for_current_field = Math.floor(time_in_minutes_remaining / conversion);
            if (initial_time_for_current_field) {
                times[time_unit] = initial_time_for_current_field;
                time_in_minutes_remaining -= initial_time_for_current_field * conversion;
            }
        });

        // Add fractions of minutes if necessary
        if (time_in_minutes_remaining) {
            times['minute'] += time_in_minutes_remaining
        }

        return times
    }

    // This function turns numbers into letters
    // Very convenient for handling things like moving from "Z" to "AA" automatically
    // Though, admittedly, the case of so many rows is somewhat unlikely
    function to_letters(num) {
        "use strict";
        var mod = num % 26,
            pow = num / 26 | 0,
            out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
        return pow ? to_letters(pow) + out : out;
    }

    function plate_style_name_creation() {
        var current_global_name = $('#id_item_name').val();
        var current_number_of_rows = number_of_rows_selector.val();
        var current_number_of_columns = number_of_columns_selector.val();

        var largest_row_name_length = Math.pow(current_number_of_columns, 1/10);

        for (var row_id=0; row_id < current_number_of_rows; row_id++) {
            // Please note + 1
            var row_name = to_letters(row_id + 1);

            for (var column_id=0; column_id < current_number_of_columns; column_id++) {
                var current_item_id = 'item_' + row_id + '_' + column_id;

                var column_name = column_id + 1 + '';
                while (column_name.length < largest_row_name_length) {
                    column_name = '0' + column_name;
                }

                item_data[current_item_id]['name'] = current_global_name + row_name + column_name;
                item_data[current_item_id]['modified'] = 'True';
            }
        }

        apply_matrix_item_contents();
        item_data_selector.val(JSON.stringify(item_data));
    }

    // This function gets the initial dimensions of the matrix
    // Please see the corresponding AJAX call as necessary
    // TODO PLEASE ADD CHECKS TO SEE IF EXISTING DATA FALLS OUTSIDE NEW BOUNDS
    // TODO PLEASE NOTE THAT THIS GETS RUN A MILLION TIMES DO TO HOW TRIGGERS ARE SET UP
    // TODO MAKE A VARIABLE TO SEE WHETHER DATA WAS ALREADY AQUIRED
    var get_matrix_dimensions = function() {
        var current_device = device_selector.val();

        var current_number_of_rows = number_of_rows_selector.val();
        var current_number_of_columns = number_of_columns_selector.val();

        if (current_device) {
            $.ajax({
                url: "/assays_ajax/",
                type: "POST",
                dataType: "json",
                data: {
                    call: 'fetch_device_dimensions',
                    // The device may be needed to specify the dimensions
                    device_id: current_device,
                    csrfmiddlewaretoken: window.COOKIES.csrfmiddlewaretoken
                },
                success: function (json) {
                    number_of_rows_selector.val(json.number_of_rows);
                    number_of_columns_selector.val(json.number_of_columns);
                    build_initial_matrix(
                        json.number_of_rows,
                        json.number_of_columns
                    );
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }

        if (current_number_of_rows > 200) {
            alert('Number of rows exceeds limit.');
            number_of_rows_selector.val(200);
            current_number_of_rows = 200;
        }

        if (current_number_of_columns > 200) {
            alert('Number of columns exceeds limit.');
            current_number_of_columns.val(200);
            current_number_of_columns = 200;
        }

        if (current_number_of_rows && current_number_of_columns) {
            build_initial_matrix(
                current_number_of_rows,
                current_number_of_columns
            );

            // initial_number_of_rows = current_number_of_rows;
            // initial_number_of_columns = current_number_of_columns;
        }

        // Set number of items
        number_of_items_selector.val(current_number_of_rows * current_number_of_columns)
    };

    var get_matrix_contents = function() {
        if (matrix_id) {
            $.ajax({
                url: "/assays_ajax/",
                type: "POST",
                dataType: "json",
                data: {
                    call: 'fetch_matrix_items_as_json',
                    // The device may be needed to specify the dimensions
                    matrix_id: matrix_id,
                    csrfmiddlewaretoken: window.COOKIES.csrfmiddlewaretoken
                },
                success: function (json) {
                    if (Object.keys(json.item_data).length > 0) {
                        item_data = json.item_data;
                        item_data_selector.val(JSON.stringify(item_data));

                        setups = json.setups;
                        setups_reverse = _.invert(setups, true);
                        setup_data_selector.val(JSON.stringify(setups));

                        setup_sets = json.setup_sets;
                        // Invert with multi-value set to true
                        setup_sets_reverse = {};
                        $.each(_.keys(empty_html), function(i, index) {
                            setup_sets_reverse[index] = _.invert(setup_sets[index], true);
                        });
                        setup_set_data_selector.val(JSON.stringify(setup_sets));

                        refresh_all_contents();
                    }
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
    };

    // Makes the initial matrix
    // TODO PURGE CELLS WHEN SHRINKING
    var build_initial_matrix = function(number_of_rows, number_of_columns) {
        matrix_body_selector.empty();

        get_matrix_contents();

        for (var row_index=0; row_index < number_of_rows; row_index++) {
            var row_id = 'row_' + row_index;
            var current_row = $('<tr>')
                .attr('id', row_id);
            // var add_row = true;
            for (var column_index=0; column_index < number_of_columns; column_index++) {
                var item_id = 'item_' + row_index + '_' + column_index;
                var new_cell = empty_item_html
                    .clone()
                    .attr('id', item_id);
                current_row.append(new_cell);

                // Add to matrix data if necessary
                if (!item_data[item_id]) {
                    // item_data[item_id] = {
                    //     'name': '',
                    //     'setup_date': '',
                    //     'failure_date': '',
                    //     'failure_time': '',
                    //     'failure_reason_id': '',
                    //     'scientist': '',
                    //     'notebook': '',
                    //     'notebook_page': '',
                    //     'notes': '',
                    //     'row_index': row_index,
                    //     'column_index': column_index,
                    //     'setup_id': ''
                    // };
                    item_data[item_id] = Object.assign({}, empty_item);
                    item_data[item_id]['row_index'] = row_index;
                    item_data[item_id]['column_index'] = column_index;
                }
            }
            matrix_body_selector.append(current_row);
        }

        // apply_matrix_item_contents();
        refresh_all_contents();

        item_data_selector.val(JSON.stringify(item_data));
    };

    function refresh_all_contents() {
        // Get rid of any old setup set content
        $('.item-setup_set_section').empty();

        $.each(item_data, function(item_id, item_contents) {
            var current_item = $('#' + item_id);

            // Initial, naive
            $.each(item_contents, function(item_field, field_value) {
                current_item.find('.item-' + item_field).text(field_value);
            });

            var current_setup = setups_reverse[item_contents['setup_index']];

            if (current_setup) {
                current_setup = JSON.parse(current_setup);

                $.each(current_setup, function(setup_field, setup_field_value) {
                    current_item.find('.item-' + setup_field).text(setup_field_value + ' ');
                });

                $.each(_.keys(empty_html), function(index, set_name) {
                    $.each(current_setup[set_name], function(i, set_index) {
                        var set_data = JSON.parse(setup_sets_reverse[set_name][set_index]);
                        var set_html = empty_html[set_name].clone();

                        $.each(set_data, function(set_field, set_field_value) {
                            set_html.find('.item-' + set_field).text(set_field_value + ' ');
                        });

                        console.log(index, set_name, i, set_index, item_id);

                        current_item.find('.item-' + set_name + '_section').append(set_html);
                    });
                });
            }
        });
    }

    function apply_matrix_item_contents() {
        $.each(item_data, function(item_id, item_contents) {
            var current_item = $('#' + item_id);

            // Initial, naive
            $.each(item_contents, function(item_field, field_value) {
                current_item.find('.item-' + item_field).text(field_value + ' ');
            });
        });
    }

    function refresh_setup_for_item(current_item_id, string_setup) {
        if (setups[string_setup] === undefined) {
            var new_index = Object.keys(setups).length;
            setups[string_setup] = new_index;
            setups_reverse[new_index] = string_setup;

            setup_data_selector.val(JSON.stringify(setups));
        }

        var original = item_data[current_item_id]['setup_index'];

        item_data[current_item_id]['setup_index'] = setups[string_setup];

        if (original !== item_data[current_item_id]['setup_index']) {
            item_data[current_item_id]['modified'] = 'True';
        }
    }

    function refresh_setup_set(set_name, current_item_id, string_new_set_content) {
        var new_index = Object.keys(setup_sets[set_name]).length;

        var setup_object = setups_reverse[item_data[current_item_id]['setup_index']];

        if (setup_object) {
            setup_object = JSON.parse(setup_object);
        }
        else {
            setup_object = $.extend({}, empty_setup);
        }

        var string_setup = undefined;

        if (setup_sets[set_name][string_new_set_content] === undefined) {
            setup_sets[set_name][string_new_set_content] = new_index;
            setup_sets_reverse[set_name][new_index] = string_new_set_content;

            setup_object[set_name].push(new_index);
            setup_object[set_name].sort();

            string_setup = JSON.stringify(setup_object);

            refresh_setup_for_item(current_item_id, string_setup);
            setup_set_data_selector.val(JSON.stringify(setup_sets));
        }
        else {
            if (setup_object[set_name].indexOf(setup_sets[set_name][string_new_set_content]) === -1) {
                setup_object[set_name].push(setup_sets[set_name][string_new_set_content]);
                setup_object[set_name].sort();

                string_setup = JSON.stringify(setup_object);

                refresh_setup_for_item(current_item_id, string_setup);
            }
        }
    }

    function add_to_item_fields(fields) {
        $('.ui-selected').each(function() {
            var current_item_id = this.id;
            var current_item = $(this);

            // Iterate over all selected
            $.each(fields, function(index, field) {
                var current_item_input = $('#id_item_' + field);
                var value = undefined;

                if (current_item_input.is('select')) {
                    value = current_item_input.children('option').filter(':selected').text();
                    current_item.find('.item-' + field).text(value + ' ');

                    if (current_item_input.val()) {
                        item_data[current_item_id][field] = value;
                        item_data[current_item_id][field + '_id'] = Math.floor(current_item_input.val());
                    }
                    else {
                        item_data[current_item_id][field] = '';
                        item_data[current_item_id][field + '_id'] = null;
                    }
                }
                else {
                    value = current_item_input.val();
                    current_item.find('.item-' + field).text(value + ' ');
                    item_data[current_item_id][field] = value;
                }

                // Indicate if the item was modified if necessary
                if (item_data[current_item_id]['id']) {
                    item_data[current_item_id]['modified'] = 'True';
                }
            });
        });
    }

    function add_to_setup_fields(fields) {
        $('.ui-selected').each(function () {
            var current_item_id = this.id;
            var current_item = $(this);

            var setup_object = setups_reverse[item_data[current_item_id]['setup_index']];

            if (setup_object) {
                setup_object = JSON.parse(setup_object);
            }
            else {
                setup_object = $.extend({}, empty_setup);
            }

            // Iterate over all selected
            $.each(fields, function(index, field) {
                var current_setup_input = $('#id_setup_' + field);

                var value = undefined;

                if (current_setup_input.is('select')) {
                    value = current_setup_input.children('option').filter(':selected').text();

                    current_item.find('.item-' + field).text(value + ' ');

                    if (current_setup_input.val()) {
                        setup_object[field] = value;
                        setup_object[field + '_id'] = Math.floor(current_setup_input.val());
                    }
                    else {
                        setup_object[field] = '';
                        setup_object[field + '_id'] = null;
                    }
                }
                else {
                    value = current_setup_input.val();

                    current_item.find('.item-' + field).text(value + ' ');

                    setup_object[field] = value;
                }

                // Changing a setup must change its id to null
                // item_data[current_item_id]['setup']['id'] = null;
            });

            var string_setup = JSON.stringify(setup_object);
            refresh_setup_for_item(current_item_id, string_setup);
        });
    }

    function chip_style_name_incrementer() {
        var original_name = $('#id_item_name').val();
        var split_name = original_name.split(/(\d+)/).filter(Boolean);

        var numeric_index = 0;
        // Increment the first number encountered
        while (!$.isNumeric(split_name[numeric_index]) && numeric_index < original_name.length) {
            numeric_index += 1;
        }

        var first_half = split_name.slice(0, numeric_index).join('');
        var second_half = split_name.slice(numeric_index + 1).join('');
        var initial_value = Math.floor(split_name[numeric_index]);

        if (isNaN(initial_value)) {
            initial_value = 1;
        }

        // Iterate over all selected
        $('.ui-selected').each(function(index) {
            var current_item_id = this.id;

            var incremented_value = index + initial_value;
            incremented_value += '';

            while (first_half.length + second_half.length + incremented_value.length < original_name.length) {
                incremented_value = '0' + incremented_value;
            }

            value = first_half + incremented_value + second_half;

            $(this).find('.item-name').html(value);
            item_data[current_item_id]['name'] = value;
        });
    }

    function default_incrementer(current_value, increment, index, increment_type) {
        var new_value = current_value;
        var result = null;

        // Add
        if (increment_type === '+') {
            result = new_value + (index * increment);
            if (result >= 0) {
                new_value = result;
            }
            else {
                new_value = 0;
            }
        }

        // Divide
        else if(increment_type === '/') {
            result = new_value / Math.pow(increment, index);
            if (isFinite(result) && result >= 0) {
                new_value = result;
            }
            else {
                new_value = 0;
            }
        }

        // Subtract
        else if(increment_type === '-') {
            result = new_value - (index * increment);
            if (result >= 0) {
                new_value = result;
            }
            else {
                new_value = 0;
            }
        }

        // Multiply
        else {
            result = new_value * Math.pow(increment, index);
            if (result >= 0) {
                new_value = result;
            }
            else {
                new_value = 0;
            }
        }

        return new_value;
    }

    function add_compounds_to_setup() {
        var compound_selector = $('#id_compound');
        var concentration_selector = $('#id_concentration');
        var concentration_unit_selctor = $('#id_concentration_unit');

        // TODO REVISE
        var compound_json = {
            'addition_time': 0.0,
            'addition_time_day': 0,
            'addition_time_hour': 0,
            'addition_time_minute': 0,
            'compound': compound_selector.children('option').filter(':selected').text(),
            'compound_id': Math.floor(compound_selector.val()),
            'concentration': concentration_selector.val(),
            'concentration_unit': concentration_unit_selctor.children('option').filter(':selected').text(),
            'concentration_unit_id': Math.floor(concentration_unit_selctor.val()),
            'duration': 0.0,
            'duration_day': 0,
            'duration_hour': 0,
            'duration_minute': 0,
            'lot_text': $('#id_lot_text').val(),
            'receipt_date': $('#id_receipt_date').val(),
            'supplier_text': $('#id_supplier_text').val()
        };

        var concentration = concentration_selector.val();
        var concentration_increment = Math.floor($('#id_concentration_increment').val());
        var concentration_increment_type = $('#id_concentration_increment_type').val();
        var concentration_increment_direction = $('#id_concentration_increment_direction').val();

        // TODO MAKE BASE COMPOUND
        // TODO DO THIS IN CONSOLIDATED WAY
        var base_compound = empty_compound_html.clone();

        base_compound.find('.item-compound').text(compound_json['compound'] + ' ');
        base_compound.find('.item-concentration_unit').text(compound_json['concentration_unit'] + ' ');
        base_compound.find('.item-supplier_text').text(compound_json['supplier_text'] + ' ');
        base_compound.find('.item-lot_text').text(compound_json['lot_text'] + ' ');
        base_compound.find('.item-receipt_date').text(compound_json['receipt_date'] + ' ');

        // var time_info = {
        //     'addition_time': 0,
        //     'duration': 0
        //     // 'addition_time_increment': 0,
        //     // 'duration_increment': 0
        // };

        // TODO DO THIS IN CONSOLIDATED WAY
        $.each(time_conversions, function(unit, conversion) {
            compound_json['addition_time_'+unit] = $('#id_addition_time_' + unit).val();
            compound_json['duration_'+unit] = $('#id_duration_' + unit).val();
            // time_info['addition_time_'+unit+'_increment'] = $('#id_addition_time_' + unit + '_increment').val();
            // time_info['duration_'+unit+'_increment'] = $('#id_duration_' + unit + '_increment').val();
            // Perform the conversion to minutes
            compound_json['addition_time'] += compound_json['addition_time_'+unit] * conversion;
            compound_json['duration'] += compound_json['duration_'+unit] * conversion;
            // time_info['addition_time_increment'] += $('#id_addition_time_' + unit + '_increment').val() * conversion;
            // time_info['duration_increment'] += $('#id_duration_' + unit + '_increment').val() * conversion;
        });

        // Need to convert day hour minute to highest possible
        var addition_times = get_split_time(compound_json['addition_time']);
        $.each(addition_times, function(unit, value) {
            compound_json['addition_time_' + unit] = value;
            base_compound.find('.item-addition_time_' + unit).text(value + ' ');
        });

        var duration_times = get_split_time(compound_json['duration']);
        $.each(duration_times, function(unit, value) {
            compound_json['duration_' + unit] = value;
            base_compound.find('.item-duration_' + unit).text(value + ' ');
        });

        var number_of_items = $('.ui-selected').length;

        // TODO FINISH
        // PLEASE NOTE THAT ADDITION TIME AND DURATION ARE NOT VARIABLE CELL TO CELL RIGHT NOW
        $('.ui-selected').each(function(index) {
            var current_item_id = this.id;
            var new_compound = base_compound.clone();

            var new_concentration = concentration;

            if (concentration_increment !== '') {
                var current_index = index;

                if (concentration_increment_direction === 'rlu') {
                    current_index = number_of_items - 1 - index;
                }

                // TODO ADD OPTION TO INCREMENTER THAT ALLOWS LEFT ONLY, RIGHT ONLY, UP ONLY AND DOWN ONLY
                new_concentration = default_incrementer(
                    concentration,
                    concentration_increment,
                    current_index,
                    concentration_increment_type
                );
            }

            new_compound.find('.item-concentration').text(new_concentration + ' ');

            compound_json.concentration = new_concentration;

            // TODO POPULATE CONCENTRATION, ADDITION, AND DURATION HERE
            $(this).find('.item-compounds_section').append(new_compound);

            // TODO
            refresh_setup_set('compounds', current_item_id, JSON.stringify(compound_json));
        });
    }

    function add_cells_to_setup() {
        // var cell_sample_id = $('#id_cell_sample').val();
        // var cell_sample_name = $('#id_cell_sample_label').text();
        //
        // var biosensor_id = $('#id_biosensor').val();
        // var biosensor_name = $('#id_biosensor').children('option').filter(':selected').text();
        //
        // var density = $('#id_density').val();
        // var density_unit_id = $('#id_density_unit').val();
        // var density_unit_name = $('#id_density_unit').children('option').filter(':selected').text();
        //
        // var passage = $('#id_passage').val();

        var cell_json = {
            cell_sample_id: $('#id_cell_sample').val(),
            cell_sample_name: $('#id_cell_sample_label').text(),
            biosensor_id: $('#id_biosensor').val(),
            biosensor_name: $('#id_biosensor').children('option').filter(':selected').text(),
            density: $('#id_density').val(),
            density_unit_id: $('#id_density_unit').val(),
            density_unit_name: $('#id_density_unit').children('option').filter(':selected').text(),
            passage: $('#id_passage').val()
        };

        var base_cell = empty_cell_html.clone();

        base_cell.find('.item-cell_sample').text(cell_json.cell_sample_name + ' ');
        base_cell.find('.item-biosensor').text(cell_json.biosensor_name + ' ');
        base_cell.find('.item-density').text(cell_json.density + ' ');
        base_cell.find('.item-density_unit').text(cell_json.density_unit_name + ' ');
        base_cell.find('.item-passage').text(cell_json.passage + ' ');

        $('.ui-selected').each(function(index) {
            var current_item_id = this.id;
            var new_cell = base_cell.clone();
            $(this).find('.item-cells_section').append(new_cell);

            // TODO
            refresh_setup_set('cells', current_item_id, JSON.stringify(cell_json));
        });
    }

    function matrix_add_content_to_selected() {
        var action = action_selector.val();

        // PLEASE NOTE THIS IS SUBJECT TO CHANGE
        // Switch statements look pretty nice, might use more often
        switch (action) {
            case 'add_name':
                chip_style_name_incrementer();
                break;
            case 'add_date':
                add_to_item_fields(['setup_date']);
                // add_to_item_field('setup_date');
                break;
            case 'add_notes':
                // add_to_item_field('scientist');
                // add_to_item_field('notebook');
                // add_to_item_field('notebook_page');
                // add_to_item_field('notes');
                add_to_item_fields([
                    'scientist',
                    'notebook',
                    'notebook_page',
                    'notes'
                ]);
                break;
            case 'add_device':
                // add_to_setup_field('device');
                // add_to_setup_field('organ_model');
                // add_to_setup_field('organ_model_protocol');
                // add_to_setup_field('variance_from_organ_model_protocol');
                add_to_setup_fields([
                    'device',
                    'organ_model',
                    'organ_model_protocol',
                    'variance_from_organ_model_protocol'
                ]);
                break;
            case 'add_settings':
                alert('TODO');
                break;
            case 'add_compounds':
                add_compounds_to_setup();
                break;
            case 'add_cells':
                add_cells_to_setup();
                break;
            case 'copy':
                alert('TODO');
                break;
            case 'clear':
                alert('TODO');
                break;
            default:
                alert('Action not recognized')
        }

        item_data_selector.val(JSON.stringify(item_data));
    }

    // Matrix Listeners
    // BE CAREFUL! THIS IS SUBJECT TO CHANGE!
    representation_selector.change(function() {
        var current_representation = representation_selector.val();

        // Hide all matrix sections
        $('.matrix-section').hide('fast');

        if (current_representation === 'chips') {
            $('#matrix_dimensions_section').show();
            // TODO CHANGE DEVICE TO NONE
            $('#id_setup_device option').show();
        }
        else if (current_representation === 'plate') {
            $('#matrix_device_and_model_section').show();
            // TODO FORCE SETUP DEVICE TO MATCH
        }
        // REMOVED
        // else if (current_representation === 'chip') {
        //     $('#matrix_device_and_model_section').show();
        //     number_of_rows_selector.val(1);
        //     number_of_columns_selector.val(1);
        //
        //     get_matrix_dimensions();
        // }
    }).trigger('change');

    device_selector.change(function() {
        get_matrix_dimensions();

        if (representation_selector.val() === 'plate') {
           $('#id_setup_device option[value!=' + device_selector.val() + ']').hide();
        }
    });

    // TODO TODO TODO RESTORE LATER
    // if (device_selector.val()) {
    //     device_selector.trigger('change');
    // }

    number_of_rows_selector.change(function() {
        get_matrix_dimensions();
    });

    number_of_columns_selector.change(function() {
        get_matrix_dimensions();
    });

    number_of_items_selector.change(function() {
        var number_of_items = Math.floor(number_of_items_selector.val());
        var first_estimate = Math.floor(Math.sqrt(number_of_items));

        var number_of_rows = first_estimate;
        var number_of_columns = first_estimate;

        var additional_columns = 0;

        while (Math.pow(first_estimate, 2) + additional_columns * number_of_rows < number_of_items) {
            additional_columns += 1;
        }

        number_of_rows_selector.val(number_of_rows);
        number_of_columns_selector.val(number_of_columns + additional_columns);

        get_matrix_dimensions();
    });

    // TODO TODO TODO RESTORE LATER
    // if (number_of_items_selector.val() && !device_selector.val()) {
    //     number_of_items_selector.trigger('change');
    // }

    action_selector.change(function() {
        $('.item-section').hide('fast');
        var current_section = $(this).val();
        $('#' + current_section + '_section').show('fast');
    }).trigger('change');

    // Testing SUBJECT TO CHANGE
    $('#apply_plate_names').click(function() {
       plate_style_name_creation();
    });

    // TODO TODO TODO TESTING
    get_matrix_dimensions();

    // Cell Samples
    // SOMEWHAT REDUNDANT, BUT THE OTHER INSTANCE OF CELL SAMPLE NEEDS TO WORK WITH INLINES
    // SHOULD REVISE TO USE CLASSES AND PEEK AT PARENT AND SO ON
    var cell_sample_search = $('#id_cell_sample_search');
    var cell_sample_id_selector = $('#id_cell_sample');
    var cell_sample_label_selector = $('#id_cell_sample_label');

    // Open and then close dialog so it doesn't get placed in window itself
    var dialog = $('#dialog');
    dialog.dialog({
        width: 900,
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

    $('#cellsamples').DataTable({
        "iDisplayLength": 50,
        // Initially sort on receipt date
        "order": [ 1, "desc" ],
        // If one wants to display top and bottom
        "sDom": '<"wrapper"fti>'
    });

    // Move filter to left
    $('.dataTables_filter').css('float', 'left');

    cell_sample_search.click(function() {
        dialog.dialog('open');
        // Remove focus
        $('.ui-dialog :button').blur();
    });

    $('.cellsample-selector').click(function() {
        var cell_sample_id = this.id;
        cell_sample_id_selector.prop('value', cell_sample_id);
        var cell_sample_name = this.attributes["name"].value;
        cell_sample_label_selector.text(cell_sample_name);
        $('#dialog').dialog('close');
    });

    // This will clear a cell sample when the button is pressed
    $('#clear_cell_sample').click(function() {
        cell_sample_id_selector.prop('value', '');
        cell_sample_label_selector.text('');
        $('#dialog').dialog('close');
    });
});