$(document).ready(function() {
    // Load core chart package
    google.charts.load('current', {'packages':['corechart']});
    // Set the callback
    google.charts.setOnLoadCallback(get_readouts);

    var charts = $('#charts');
    var study_id = Math.floor(window.location.href.split('/')[4]);

    // Name for the charts for binding events etc
    var charts_name = 'charts';

    var ids = [
        '#setups',
        '#plate_setups'
    ];

    $.each(ids, function(index, table_id) {
        if ($(table_id)[0]) {
            $(table_id).DataTable({
                "iDisplayLength": 10,
                dom: 'B<"row">lfrtip',
                fixedHeader: {headerOffset: 50},
                responsive: true,
                // Initially sort on start date (descending), not ID
                "order": [[1, "asc"], [2, "desc"]],
                "aoColumnDefs": [
                    {
                        "bSortable": false,
                        "aTargets": [0]
                    },
                    {
                        "width": "10%",
                        "targets": [0]
                    }
                ]
            });
        }
    });

    function get_readouts() {
        var data = {
            call: 'fetch_readouts',
            study: study_id,
            csrfmiddlewaretoken: window.COOKIES.csrfmiddlewaretoken
        };

        var options = window.CHARTS.prepare_chart_options(charts_name);

        data = $.extend(data, options);

        $.ajax({
            url: "/assays_ajax/",
            type: "POST",
            dataType: "json",
            data: data,
            success: function (json) {
                window.CHARTS.prepare_side_by_side_charts(json, charts_name);
                window.CHARTS.make_charts(json, charts_name);

                // Recalculate responsive and fixed headers
                $($.fn.dataTable.tables(true)).DataTable().responsive.recalc();
                $($.fn.dataTable.tables(true)).DataTable().fixedHeader.adjust();
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    }

    // Setup triggers
    $('#' + charts_name + 'chart_options').find('input').change(function() {
        get_readouts();
    });

    $('#exportinclude_all').change(function() {
        var export_button = $('#export_button');
        if ($(this).prop('checked')) {
            export_button.attr('href', export_button.attr('href') + '?include_all=true');
        }
        else {
            export_button.attr('href', export_button.attr('href').split('?')[0]);
        }
    }).trigger('change');
});
