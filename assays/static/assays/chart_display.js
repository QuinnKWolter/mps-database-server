// Contains functions for making charts for data

// Global variable for charts
window.CHARTS = {
    // Should this be here, or in grouping?
    // refresh_function: null;
};

// Load the Visualization API and the corechart package.
// google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
// THE CALLBACK FUNCTION IS NOT DEFINED HERE BUT IN THE RESPECTIVE MAIN FILE
// SUBJECT TO CHANGE
// google.charts.setOnLoadCallback(window.CHARTS.callback);

$(document).ready(function () {
    // Charts
    var all_charts = {};
    var all_events = {};
    var all_options = {};

    // Semi-arbitrary at the moment
    var treatment_group_table = $('#treatment_group_table');
    var treatment_group_display = $('#treatment_group_display');
    var treatment_group_head = $('#treatment_group_head');
    var treatment_group_data_table = null;

    var group_display = $('#group_display');
    var group_display_body = $('#group_display_body');
    var group_display_head = $('#group_display_head');

    var show_hide_plots_popup = $('#show_hide_plots_popup');
    var show_hide_plots_table = $('#show_hide_plots_popup table');
    var show_hide_plots_body = $('#show_hide_plots_popup table tbody');
    var show_hide_plots_data_table = null;

    var chart_visibility = {};
    var chart_filter_buffer = {};

    var name_to_chart = {};

    if (show_hide_plots_popup[0]) {
        show_hide_plots_popup.dialog({
            width: 825,
            closeOnEscape: true,
            autoOpen: false,
            close: function () {
                // Purge the buffer
                chart_filter_buffer = {};
                $('body').removeClass('stop-scrolling');
            },
            open: function () {
                $('body').addClass('stop-scrolling');
            },
            buttons: [
            {
                text: 'Apply',
                click: function() {
                    // Iterate over the charts to hide
                    chart_visibility = $.extend({}, chart_filter_buffer);

                    $.each(chart_visibility, function(chart_name, status) {
                        var chart_id = name_to_chart[chart_name];
                        if (status) {
                            $(chart_id).show('slow');
                        }
                        else {
                            $(chart_id).hide('slow');
                        }
                    });

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
        show_hide_plots_popup.removeProp('hidden');
    }

    // Probably should just have full data!
    var group_to_data = [];
    var device_to_group = {};
    var all_treatment_groups = [];

    var min_height = 400;

    // Conversion dictionary
    var headers = {
        // 'device': 'Device',
        'Study': 'Study',
        'MPS Model': 'MPS Model',
        'Cells': 'Cells Added',
        'Compounds': 'Compound Treatment',
        'Settings': 'Settings (Non-Compound Treatments)',
        'Items with Same Treatment': 'Matrix Items (Chips/Wells) in Group'
    };

    // var filter_popup_header = filter_popup.find('h5');

    window.CHARTS.prepare_chart_options = function(charts) {
        var options = {};

        //$.each($('#' + charts + 'chart_options').find('input'), function() {
        // Object extraneous as there is only one option set now
        $.each($('#charting_options_tables').find('input'), function() {
            if (this.checked) {
                options[this.name] = this.value;
            }
        });

        return options;
    };

    window.CHARTS.prepare_side_by_side_charts = function(json, charts) {
        // Clear existing charts
        var charts_id = $('#' + charts);
        charts_id.empty();

        // If errors, report them and then terminate
        if (json.errors) {
            alert(json.errors);
            return;
        }

        var sorted_assays = json.sorted_assays;
        var assays = json.assays;

        // Old method
        // var previous = null;
        // for (var index in sorted_assays) {
        //     if (assays[index].length > 1) {
        //         if (!previous) {
        //             previous = $('<div>')
        //             //.addClass('padded-row')
        //                 .css('min-height', min_height);
        //             charts_id.append(previous
        //                 .append($('<div>')
        //                     .attr('id', charts + '_' + index)
        //                     .addClass('col-sm-12 col-md-6 chart-container')
        //                 )
        //             );
        //         }
        //         else {
        //             previous.append($('<div>')
        //                 .attr('id', charts + '_' + index)
        //                 .addClass('col-sm-12 col-md-6 chart-container')
        //             );
        //             previous = null;
        //         }
        //     }
        // }

        // Hide sidebar if no data
        if (assays.length < 1) {
            $('.toggle_sidebar_button').first().trigger('click');
        }

        // Revise show/hide plots
        // NOTE: POPULATE THE SELECTION TABLE
        // Clear current contents
        if (show_hide_plots_data_table) {
            show_hide_plots_data_table.clear();
            show_hide_plots_data_table.destroy();
        }

        show_hide_plots_body.empty();

        var html_to_append = [];

        for (var index in sorted_assays) {
            if (assays[index].length > 1) {
                charts_id.append($('<div>')
                    .attr('id', charts + '_' + index)
                    .addClass('col-sm-12 col-md-6 chart-container')
                    .css('min-height', min_height)
                );

                // Populate each row
                // SLOPPY NOT DRY
                var row = '<tr>';
                var full_name = sorted_assays[index];
                var title = full_name.split('\n')[0];
                var unit = full_name.split('\n')[1];

                var current_index = html_to_append.length;

                row += '<td width="10%" class="text-center"><input data-table-index="' + current_index + '" data-obj-name="' + full_name + '" class="big-checkbox chart-filter-checkbox" type="checkbox" value="' + full_name + '" checked="checked"></td>';

                // WARNING: NAIVE REPLACE
                row += '<td>' + title + '</td>';
                row += '<td>' + unit + '</td>';

                row += '</tr>';

                name_to_chart[full_name] = '#charts_' + current_index;

                html_to_append.push(row);
        }
        }

        if (!html_to_append) {
            html_to_append.push('<tr><td></td><td>No data to display.</td></tr>');
        }

        show_hide_plots_body.html(html_to_append.join(''));

        show_hide_plots_data_table = show_hide_plots_table.DataTable({
            destroy: true,
            dom: '<"wrapper"lfrtip>',
            deferRender: true,
            iDisplayLength: 10,
            order: [1, 'asc'],
            columnDefs: [
                // Try to sort on checkbox
                { "sSortDataType": "dom-checkbox", "targets": 0, "width": "10%" }
            ]
        });
    };

    window.CHARTS.prepare_row_by_row_charts = function(json, charts) {
        // Clear existing charts
        var charts_id = $('#' + charts);
        charts_id.empty();

        // If errors, report them and then terminate
        if (json.errors) {
            alert(json.errors);
            return;
        }

        var sorted_assays = json.sorted_assays;
        var assays = json.assays;

        var previous = null;
        for (var index in sorted_assays) {
            if (assays[index].length > 1) {
                new_div = $('<div>')
                //.addClass('padded-row')
                    .css('min-height', min_height);
                charts_id.append(new_div
                    .append($('<div>')
                        .attr('id', charts + '_' + index)
                        .addClass('chart-container')
                    )
                );
            }
        }
    }

    // No longer in use
    window.CHARTS.prepare_charts_by_table = function(json, charts) {
        // Clear existing charts
        var charts_id = $('#' + charts);
        charts_id.empty();

        // If errors, report them and then terminate
        if (json.errors) {
            alert(json.errors);
            return;
        }

        var sorted_assays = json.sorted_assays;
        var assays = json.assays;

        for (var index in sorted_assays) {
            if (assays[index].length > 1) {
                $('<div>')
                    .attr('id', charts + '_' + index)
                    .attr('align', 'right')
                    .addClass('chart-container')
                    .appendTo(charts_id);
            }
        }
    };

    window.CHARTS.display_treatment_groups = function(treatment_groups, header_keys) {
        device_to_group = {};
        all_treatment_groups = [];

        // TODO KIND OF UGLY
        if (!header_keys) {
            header_keys = [
                // 'device',
                'MPS Model',
                'Cells',
                'Compounds',
                'Settings',
                'Items with Same Treatment'
            ];
        }

        if (treatment_group_data_table) {
            treatment_group_table.DataTable().clear();
            treatment_group_table.DataTable().destroy();
        }

        treatment_group_display.empty();

        treatment_group_head.empty();

        var new_row =  $('<tr>').append(
            $('<th>').html('Group')
        );

        $.each(header_keys, function(index, item) {
            var new_td = $('<th>').html(headers[item]);
            new_row.append(new_td);
        });

        treatment_group_head.append(new_row);
        // Add the header to the group display as well
        group_display_head.empty();
        group_display_head.append(new_row.clone().addClass('bg-warning'));

        $.each(treatment_groups, function(index, treatment) {
            var group_index = (index + 1);
            var group_name = 'Group ' + group_index;
            var group_id = group_name.replace(' ', '_');

            var new_row = $('<tr>')
                .attr('id', group_id)
                .append(
                $('<td>').html(group_name)
            );

            $.each(header_keys, function(header_index, current_header) {
                // Replace newlines with breaks
                var new_td = $('<td>').html(treatment[current_header].split("\n").join("<br />"));
                new_row.append(new_td);

                // Somewhat sloppy conditional
                if (current_header === 'Items with Same Treatment') {
                    $.each(new_td.find('a'), function (anchor_index, anchor) {
                        device_to_group[anchor.text] = index;
                    });
                }
            });

            all_treatment_groups.push(new_row.clone());
            // group_to_data[group_index] = new_row.clone();

            treatment_group_display.append(new_row);
        });

        treatment_group_data_table = treatment_group_table.DataTable({
            // Cuts out extra unneeded pieces in the table
            dom: 'B<"row">lfrtip',
            fixedHeader: {headerOffset: 50},
            responsive: true,
            // paging: false,
            order: [[ 0, "asc" ]],
            // Needed to destroy old table
            bDestroy: true,
            // Try to get a more reasonable size for cells
            columnDefs: [
                // Treat the group column as if it were just the number
                { "type": "brute-numeric", "targets": 0, "width": "10%" }
            ]
        });

        // TODO NOT DRY
        // Swap positions of filter and length selection; clarify filter
        $('.dataTables_filter').css('float', 'left').prop('title', 'Separate terms with a space to search multiple fields');
        $('.dataTables_length').css('float', 'right');
        // Reposition download/print/copy
        $('.DTTT_container').css('float', 'none');

        // Recalculate responsive and fixed headers
        $($.fn.dataTable.tables(true)).DataTable().responsive.recalc();
        $($.fn.dataTable.tables(true)).DataTable().fixedHeader.adjust();

        // Make sure the header is fixed and active
        treatment_group_data_table.fixedHeader.enable();
    };

    // TODO THIS SHOULDN'T BE REDUNDANT
    function isNumber(obj) {
        return obj !== undefined && typeof(obj) === 'number' && !isNaN(obj);
    }

    window.CHARTS.make_charts = function(json, charts, changes_to_options) {
        // post_filter setup
        window.GROUPING.set_grouping_filtering(json.post_filter);

        // Remove triggers
        if (all_events[charts]) {
            $.each(all_events[charts], function(index, event) {
                google.visualization.events.removeListener(event);
            });
        }

        // Clear all charts
        all_charts[charts] = [];
        all_events[charts] = [];
        group_to_data[charts] = [];

        // Show the chart options
        // NOTE: the chart options are currently shown by default, subject to change

        // heatmap WIP
        // heatmap_data = json.heatmap;
        //
        // window.CHARTS.get_heatmap_dropdowns(0);

        // Naive way to learn whether dose vs. time
        var is_dose = $('#dose_select').prop('checked');

        var x_axis_label = 'Time (Days)';
        // Still need to work in dose-response
        if (is_dose) {
            x_axis_label = 'Dose (μM)';
        }

        // If nothing to show
        if (!json.assays) {
            $('#' + charts).html('No data to display');
        }

        var sorted_assays = json.sorted_assays;
        var assays = json.assays;

        var time_conversion = null;
        var time_label = null;

        // CRUDE: Perform time unit conversions
        if (document.getElementById('id_chart_option_time_unit').value != 'Day') {
            if (document.getElementById('id_chart_option_time_unit').value == 'Hour') {
                time_conversion = 24;
                time_label = 'Time (Hours)';
            }
            else {
                time_conversion = 1440;
                time_label = 'Time (Minutes)';
            }
        }

        if (time_conversion)
        {
            x_axis_label = time_label;

            $.each(assays, function(index, assay) {
                // Don't bother if empty
                assay[0][0] = time_label;
                // Crude
                $.each(assay, function(index, row) {
                    if (index) {
                        row[0] *= time_conversion;
                    }
                });
            });
        }

        for (index in sorted_assays) {
            // Don't bother if empty
            if (assays[index][1] === undefined) {
                continue;
            }

            var assay_unit = sorted_assays[index];
            var assay = assay_unit.split('\n')[0];
            var unit = assay_unit.split('\n')[1];

            var data = google.visualization.arrayToDataTable(assays[index]);

            var y_axis_label_type = '';

            // Go through y values
            $.each(assays[index].slice(1), function(index, current_values) {
                // Idiomatic way to remove NaNs
                var trimmed_values = current_values.slice(1).filter(isNumber);

                var current_max_y = Math.abs(Math.max.apply(null, trimmed_values));
                var current_min_y = Math.abs(Math.min.apply(null, trimmed_values));

                if (current_max_y > 1000 || current_max_y < 0.001) {
                    y_axis_label_type = '0.00E0';
                    return false;
                }
                else if (Math.abs(current_max_y - current_min_y) < 10 && Math.abs(current_max_y - current_min_y) > 0.1 && Math.abs(current_max_y - current_min_y) !== 0) {
                    y_axis_label_type = '0.00';
                    return false;
                }
                else if (Math.abs(current_max_y - current_min_y) < 0.1 && Math.abs(current_max_y - current_min_y) !== 0) {
                    y_axis_label_type = '0.00E0';
                    return false;
                }
            });

            var current_min_x = assays[index][1][0];
            var current_max_x = assays[index][assays[index].length - 1][0];
            var current_x_range = current_max_x - current_min_x;

            var options = {
                title: assay,
                interpolateNulls: true,
                // Changes styling and prevents flickering issue
                // tooltip: {
                //     isHtml: true
                // },
                titleTextStyle: {
                    fontSize: 18,
                    bold: true,
                    underline: true
                },
                // curveType: 'function',
                legend: {
                    position: 'top',
                    maxLines: 5,
                    textStyle: {
                        // fontSize: 8,
                        bold: true
                    }
                },
                hAxis: {
                    title: x_axis_label,
                    textStyle: {
                        bold: true
                    },
                    titleTextStyle: {
                        fontSize: 14,
                        bold: true,
                        italic: false
                    }
                    // ADD PROGRAMMATICALLY
                    // viewWindowMode:'explicit',
                    // viewWindow: {
                    //     max: current_max_x + 0.05 * current_x_range,
                    //     min: current_min_x - 0.05 * current_x_range
                    // }
                    // baselineColor: 'none',
                    // ticks: []
                },
                vAxis: {
                    title: unit,
                    // If < 1000 and > 0.001 don't use scientific! (absolute value)
                    format: y_axis_label_type,
                    textStyle: {
                        bold: true
                    },
                    titleTextStyle: {
                        fontSize: 14,
                        bold: true,
                        italic: false
                    },
                    // This doesn't seem to interfere with displaying negative values
                    minValue: 0,
                    viewWindowMode: 'explicit'
                    // baselineColor: 'none',
                    // ticks: []
                },
                pointSize: 5,
                'chartArea': {
                    'width': '75%',
                    'height': '65%'
                },
                'height':min_height,
                // Individual point tooltips, not aggregate
                focusTarget: 'datum',
                intervals: {
                    // style: 'bars'
                    'lineWidth': 0.75
                }
            };

            // NAIVE: I shouldn't perform a whole refresh just to change the scale!
            if (document.getElementById('category_select').checked) {
                options.focusTarget = 'category';
            }

            // Removed for now
/*
            if (document.getElementById(charts + 'log_x').checked) {
                options.hAxis.scaleType = 'log';
            }
            if (document.getElementById(charts + 'log_y').checked) {
                options.vAxis.scaleType = 'log';
            }
*/

            // Merge options with the specified changes
            $.extend(options, changes_to_options);

            // REMOVED FOR NOW
            // Find out whether to shrink text
            // $.each(assays[index][0], function(index, column_header) {
            //     if (column_header.length > 12) {
            //         options.legend.textStyle.fontSize = 10;
            //     }
            // });

            var chart = null;

            var num_colors = 0;

            $.each(assays[index][0].slice(1), function(index, value) {
                if (value.indexOf('     ~@i1') === -1) {
                    num_colors++;
                }
            });

            // Line chart if more than two time points and less than 101 colors
            if (assays[index].length > 3 && num_colors < 101) {
                chart = new google.visualization.LineChart(document.getElementById(charts + '_' + index));

                // Change the options
                options.hAxis.viewWindowMode = 'explicit';
                options.hAxis.viewWindow = {
                    max: current_max_x + 0.05 * current_x_range,
                    min: current_min_x - 0.05 * current_x_range
                };
            }
            // Nothing if more than 100 colors
            else if (num_colors > 100) {
                document.getElementById(charts + '_' + index).innerHTML = '<div class="alert alert-danger" role="alert">' +
                    '<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span>' +
                    '<span class="sr-only">Danger:</span>' +
                    ' <strong>' + assay + ' ' + unit + '</strong>' +
                    '<br>This plot has too many data points, please try filtering.' +
                '</div>'
            }
            // Bar chart if only one or two time points
            else if (assays[index].length > 1) {
                // Convert to categories
                data.insertColumn(0, 'string', data.getColumnLabel(0));
                // copy values from column 1 (old column 0) to column 0, converted to numbers
                for (var i = 0; i < data.getNumberOfRows(); i++) {
                    var val = data.getValue(i, 1);
                    // I don't mind this type-coercion, null, undefined (and maybe 0?) don't need to be parsed
                    if (val != null) {
                        // PLEASE NOTE: Floats are truncated to 3 decimals
                        data.setValue(i, 0, parseFloat(val.toFixed(3)) + ''.valueOf());
                    }
                }
                // remove column 1 (the old column 0)
                data.removeColumn(1);

                chart = new google.visualization.ColumnChart(document.getElementById(charts + '_' + index));
            }

            if (chart) {
                var dataView = new google.visualization.DataView(data);

                // Change interval columns to intervals
                var interval_setter = [0];

                i = 1;
                while (i < data.getNumberOfColumns()) {
                    interval_setter.push(i);
                    if (i + 2 < data.getNumberOfColumns() && assays[index][0][i+1].indexOf('     ~@i1') > -1) {
                        interval_setter.push({sourceColumn: i + 1, role: 'interval'});
                        interval_setter.push({sourceColumn: i + 2, role: 'interval'});
                        i += 2;
                    }
                    i += 1;
                }
                dataView.setColumns(interval_setter);

                chart.draw(dataView, options);

                chart.chart_index = index;

                all_charts[charts].push(chart);
            }
        }

        window.CHARTS.display_treatment_groups(json.treatment_groups, json.header_keys);

        for (var index=0; index < all_charts[charts].length; index++) {
            group_to_data[charts].push({});

            for (i=0; i < assays[index][0].length; i++) {
                if (assays[index][0][i].indexOf('     ~@i1') === -1 && assays[index][0][i].indexOf('     ~@i2') === -1) {
                    // Need to link EACH CHARTS values to the proper group
                    // EMPHASIS ON EACH CHART
                    // Somewhat naive
                    if (document.getElementById('group_select').checked) {
                        // NOTE -1
                        group_to_data[charts][index][i] = assays[index][0][i].split(' || ')[0].replace(/\D/g, '') - 1;
                    }
                    else {
                        var device = assays[index][0][i].split(' || ')[0];
                        // console.log(device);
                        // console.log(device_to_group);
                        group_to_data[charts][index][i] = device_to_group[device];
                    }
                }
            }

            // Makes use of a somewhat zany closure
            var current_event = google.visualization.events.addListener(all_charts[charts][index], 'onmouseover', (function (charts, chart_index) {
                return function (entry) {
                    // Only attempts to display if there is a valid treatment group
                    if (all_treatment_groups[group_to_data[charts][chart_index][entry.column]]) {
                        var current_pos = $(all_charts[charts][chart_index].container).position();
                        var current_top = current_pos.top + 75;
                        var current_left = $('#breadcrumbs').position.left;
                        if (entry.row === null && entry.column) {
                            var row_clone = all_treatment_groups[group_to_data[charts][chart_index][entry.column]].clone().addClass('bg-warning');
                            if (row_clone) {
                                group_display_body.empty().append(row_clone);

                                group_display.show()
                                    .css({top: current_top, left: current_left, position: 'absolute'});
                            }
                        }
                    }
                }
            })(charts, index));
            all_events[charts].push(current_event);

            current_event = google.visualization.events.addListener(all_charts[charts][index], 'onmouseout', function () {
                group_display.hide();
            });
            all_events[charts].push(current_event);
        }
    };

    // Setup triggers
    $('#charting_options_tables').find('input, select').change(function() {
        // Odd, perhaps innapropriate!
        window.GROUPING.refresh_wrapper();
    });

    // TODO TODO TODO NOT DRY
    $(document).on('click', '.chart-filter-checkbox', function() {
        var current_index = $(this).attr('data-table-index');
        chart_filter_buffer[$(this).val()] = $(this).prop('checked');

        if ($(this).prop('checked')) {
            show_hide_plots_data_table.data()[current_index][0] = show_hide_plots_data_table.data()[current_index][0].replace('>', ' checked="checked">');
        }
        else {
            show_hide_plots_data_table.data()[current_index][0] = show_hide_plots_data_table.data()[current_index][0].replace(' checked="checked">', '>');
        }
    });

    // Triggers for select all
    $('#chart_filter_section_select_all').click(function() {
        chart_filter_data_table.page.len(-1).draw();

        chart_filter_table.find('.chart-filter-checkbox').each(function() {
            $(this)
                .prop('checked', false)
                .attr('checked', false)
                .trigger('click');
        });

        chart_filter_data_table.order([[1, 'asc']]);
        chart_filter_data_table.page.len(10).draw();
    });

    // Triggers for deselect all
    $('#chart_filter_section_deselect_all').click(function() {
        chart_filter_data_table.page.len(-1).draw();

        chart_filter_table.find('.chart-filter-checkbox').each(function() {
            $(this)
                .prop('checked', true)
                .attr('checked', true)
                .trigger('click');
        });

        chart_filter_data_table.order([[1, 'asc']]);
        chart_filter_data_table.page.len(10).draw();
    });

    $('#show_hide_plots').click(function() {
        show_hide_plots_popup.dialog('open');
    });

    // CONTEXT MENU
    // $(document).on('contextmenu', '.chart-container', function() {
    //     alert('TODO: Context Menu');
    // });
});
