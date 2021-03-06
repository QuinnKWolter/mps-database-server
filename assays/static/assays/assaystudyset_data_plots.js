// TODO NOT DRY
$(document).ready(function() {
    // Load core chart package
    google.charts.load('current', {'packages':['corechart']});
    // Set the callback
    google.charts.setOnLoadCallback(show_plots);

    var charts_name = 'charts';

    // TODO TODO TODO
    window.GROUPING.refresh_function = show_plots;

    var study_set_id = Math.floor(window.location.href.split('/')[5]);

    window.CHARTS.call = 'fetch_data_points_from_study_set';
    window.CHARTS.study_set_id = study_set_id;

    // PROCESS GET PARAMS INITIALLY
    window.GROUPING.process_get_params();

    // TO DEAL WITH INITIAL POST FILTER, SHOULD IT EXIST
    var first_run = true;

    function show_plots() {
        var data = {
            // TODO TODO TODO CHANGE CALL
            call: 'fetch_data_points_from_study_set',
            intention: 'charting',
            study_set_id: study_set_id,
            filters: JSON.stringify(window.GROUPING.filters),
            criteria: JSON.stringify(window.GROUPING.get_grouping_filtering()),
            post_filter: JSON.stringify(window.GROUPING.current_post_filter),
            csrfmiddlewaretoken: window.COOKIES.csrfmiddlewaretoken
        };

        window.CHARTS.global_options = window.CHARTS.prepare_chart_options();
        var options = window.CHARTS.global_options.ajax_data;

        data = $.extend(data, options);

        // Show spinner
        window.spinner.spin(
            document.getElementById("spinner")
        );

        $.ajax({
            url: "/assays_ajax/",
            type: "POST",
            dataType: "json",
            data: data,
            success: function (json) {
                // Stop spinner
                window.spinner.stop();

                if (first_run && $.urlParam('p')) {
                    first_run = false;

                    window.GROUPING.set_grouping_filtering(json.post_filter);
                    window.GROUPING.process_get_params();
                    window.GROUPING.refresh_wrapper();
                }
                else {
                    window.CHARTS.prepare_side_by_side_charts(json, charts_name);
                    window.CHARTS.make_charts(json, charts_name);

                    // Recalculate responsive and fixed headers
                    $($.fn.dataTable.tables(true)).DataTable().responsive.recalc();
                    $($.fn.dataTable.tables(true)).DataTable().fixedHeader.adjust();
                }
            },
            error: function (xhr, errmsg, err) {
                first_run = false;

                // Stop spinner
                window.spinner.stop();

                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    }

    // On load
    document.getElementById('id_current_url_input').value = window.location.href

    // On click of copy to URL button (DEPRECATED)
    $('#id_copy_url_button').click(function() {
        var current_url = document.getElementById('id_current_url_input'); current_url.select();
        document.execCommand('copy');
    });
});
