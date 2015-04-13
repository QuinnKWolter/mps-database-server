//    // Expose only what is needed for submission
//    window.FILTER = {
//        'target_types': target_types,
//        'organisms': organisms,
//        'log_scale': log_scale,
//        'normalize_bioactivities': normalize_bioactivities,
//        'metric': metric,
//        'method': method,
//        'chemical_properties': chemical_properties
//    };
// window.FILTER.

// This is how to expose variables for use in the respective scripts
window.FILTER = {};

$(document).ready(function () {
    // Get a list for checkboxes from returned AJAX data
    // Min is a boolean value to see if data should be restricted on min_feat_count
    function get_list(data, min) {
        if (!data || data.length == 0) {
            return [];
        }

        var result = [];
        var i;
        for (i = 0; i < data.length; i += 1) {
            // Consider refactor for min_feat_count restriction
            if (!min || data[i][1] >= min_feat_count) {
                result.push({
                    name: data[i][0],
                    is_selected: false
                });
            }
        }

        // Case insensitive sort
        result = _.sortBy(result, function (i) {
            return i.name.toLowerCase();
        });

        return result;
    }

    // Function to reset the rows after refresh
    // PLEASE BE CERTAIN TO ESCAPE CHARACTERS LIKE ' (for prime)
    function reset_rows(name, list, add) {
        // Clear current
        $('#' + name).html('');
        // Add from list
        for (var i in list) {
            // Note added 'c' to avoid confusion with graphic
            var row = "<tr id='" + add + list[i].name.replace(/ /g, "_").replace(/'/g, "&#39;") + "'>";
            row += "<td>" + "<input type='checkbox' value='" + list[i].name.replace(/'/g, "&#39;") + "'></td>";
            row += "<td>" + list[i].name + "</td>";
            $('#' + name).append(row);
        }

        // Reset select all box
        $("#all_" + name).prop('checked', false);
    }

    function refresh() {

        // Disable everything
        $(":input").prop("disabled", true);

        $.ajax({
            url: '/bioactivities/all_data',
            type: "GET",
            dataType: "json",
            data: {
                target_types: JSON.stringify(FILTER.target_types),
                organisms: JSON.stringify(FILTER.organisms)
            },
            success: function (json) {
                //console.log(json);
                targets = get_list(json.targets, true);
                compounds = get_list(json.compounds, true);
                bioactivities = get_list(json.bioactivities, true);
                drugtrials = get_list(json.drugtrials, false);
                //console.log(targets);
                //console.log(compounds);
                //console.log(bioactivities);
                //console.log(drugtrials);

                // Clear bioactivities
                reset_rows('bioactivities', bioactivities, '');

                // Clear targets
                reset_rows('targets', targets, '');

                // Clear compounds
                reset_rows('compounds', compounds, 'c');

                // Clear drugtrials
                reset_rows('drugtrials', drugtrials, '');

                // Enable everything
                $(":input").prop("disabled", false);
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);

                // Enable everything
                $(":input").prop("disabled", false);
            }
        });
    }

//    // Initial hash change
//    document.location.hash = "";

    // Currently testing, should grab these with a function in refresh (KEEP THIS FORMAT)
    window.FILTER.target_types = [];
    window.FILTER.organisms = [];
    $("#control_target_types input[type='checkbox']:checked").each(function () {
        window.FILTER.target_types.push({"name": this.value, "is_selected": this.checked});
    });
    $("#control_organisms input[type='checkbox']:checked").each(function () {
        window.FILTER.organisms.push({"name": this.value, "is_selected": this.checked});
    });

    // Functions to acquire new lists for target_types
    var control_target_types = $("#control_target_types input[type='checkbox']");
    control_target_types.change(function (evt) {
        window.FILTER.target_types = [];
        if ($("#control_target_types input[type='checkbox']:checked").length == control_target_types.length) {
            $('#all_target_types').prop('checked', true);
        }
        else {
            $('#all_target_types').prop('checked', false);
        }

        control_target_types.each(function () {
            //console.log(this.value);
            window.FILTER.target_types.push({"name": this.value, "is_selected": this.checked});
        });

        refresh();
    });
    //Change all target_types
    $('#all_target_types').change(function (evt) {
        if (this.checked) {
            control_target_types.prop('checked', true);
        }
        else {
            control_target_types.prop('checked', false);
        }
        // Please note the use of first to prevent redundant calls
        control_target_types.first().trigger('change');
    });

    // Functions to acquire new lists for organisms
    var control_organisms = $("#control_organisms input[type='checkbox']");
    control_organisms.change(function (evt) {
        window.FILTER.organisms = [];
        if ($("#control_organisms input[type='checkbox']:checked").length == control_organisms.length) {
            $('#all_organisms').prop('checked', true);
        }
        else {
            $('#all_organisms').prop('checked', false);
        }

        control_organisms.each(function () {
            //console.log(this.value);
            window.FILTER.organisms.push({"name": this.value, "is_selected": this.checked});
        });

        refresh();
    });
    //Change all organisms
    $('#all_organisms').change(function (evt) {
        if (this.checked) {
            control_organisms.prop('checked', true);
        }
        else {
            control_organisms.prop('checked', false);
        }
        // Please note the use of first to prevent redundant calls
        control_organisms.first().trigger('change');
    });

    // Function to refactor redundant code
    // Name is the general selector without #
    function track_selections(name) {
        // Check to see if the "select all" button has been clicked
        $('#all_' + name).change(function (evt) {
            // If the "all" box is checked, select all visible checkboxes
            if (this.checked) {
                $("#" + name + " input[type='checkbox']:visible").prop('checked', true);
            }
            // Otherwise deselect all checkboxes
            else {
                $("#" + name + " input[type='checkbox']:visible").prop('checked', false);
            }
        });

        // Track when any row checkbox is clicked and discern whether all visible check boxes are checked, if so then check the "all" box
        $("body").on("change", "#" + name + " input[type='checkbox']", function (event) {
            if ($("#" + name + " input[type='checkbox']:checked:visible").length == $("#" + name + " input[type='checkbox']:visible").length) {
                $('#all_' + name).prop('checked', true);
            }
            else {
                $('#all_' + name).prop('checked', false);
            }
        });
    }

    // Change all bioactivities
    track_selections('bioactivities');

    // Change all targets
    track_selections('targets');

    // Change all compounds
    track_selections('compounds');

    // Change all drugtrials
    track_selections('drugtrials');

    // Initial min_feature count
    var min_feat_count = $('#minimum_feature_count').val();
    // Listen min feature count
    $('#apply_minimum_feature_count').click(function (evt) {
        min_feat_count = $('#minimum_feature_count').val();
        refresh();
    });

    // Initial truth log scale
    window.FILTER.log_scale = $('#log_scale').prop('checked');
    // Listen log_scale
    $('#log_scale').change(function (evt) {
        window.FILTER.log_scale = $('#log_scale').prop('checked');
    });

    // Initial truth normalize
    window.FILTER.normalize_bioactivities = $('#normalize_bioactivities').prop('checked');
    // Listen normalize
    $('#normalize_bioactivities').change(function (evt) {
        window.FILTER.normalize_bioactivities = $('#normalize_bioactivities').prop('checked');
    });

    // Initial truth chem properties
    window.FILTER.chemical_properties = $('#chemical_properties').prop('checked');
    // Listen chemical properties
    $('#chemical_properties').change(function (evt) {
        window.FILTER.chemical_properties = $('#chemical_properties').prop('checked');
    });

    // Initial metric
    window.FILTER.metric = $('#metric').val();
    // Listen metric
    $('#metric').change(function (evt) {
        window.FILTER.metric = $('#metric').val();
    });

    // Initial method
    window.FILTER.method = $('#method').val();
    // Listen method
    $('#method').change(function (evt) {
        window.FILTER.method = $('#method').val();
    });

    var targets = [];
    var compounds = [];
    var bioactivities = [];
    var drugtrials = [];

    refresh();

    // Return to selection
    $('#back').click(function (evt) {
        $('#graphic').prop('hidden', true);
        $('#selection').prop('hidden', false);
//        document.location.hash = "";
//        //Why does microsoft want me to suffer?
//        if (browser.isIE && browser.verIE >= 11) {
//            $('#graphic').prop('hidden',true);
//            $('#selection').prop('hidden',false)
//        }
    });

    var bioactivity_search = $('#bioactivity_filter');
    var target_search = $('#target_filter');
    var compound_search = $('#compound_filter');
    var drugtrial_search = $('#drugtrial_filter');

    var bioactivity_string = bioactivity_search.val().toLowerCase().replace(/ /g, "_");
    var target_string = target_search.val().toLowerCase().replace(/ /g, "_");
    // Note added 'c' to compound string
    var compound_string = 'c' + compound_search.val().toLowerCase().replace(/ /g, "_");

    // Drug trials is not part of the table filter; check if exists
    if (drugtrial_search[0]) {
        var drugtrial_string = drugtrial_search.val().toLowerCase().replace(/ /g, "_");
    }

    // Function to reduce code
    // search = selector for search filter
    // string = the string typed into the input box
    // selector = the string (no #) to identify what is being acted on
    // add = string to add to the search values (used for compounds)
    function search_filter(search, string, selector, add) {
        search.on('input', function () {
            // Note the added 'c' to avoid confusion in compounds
            string = add + search.val().toLowerCase().replace(/ /g, "_");

            // For every row in the given table
            $("#" + selector + " tr").each(function () {
                // If the row contains the requested string, do not hide it
                if (this.id.toLowerCase().indexOf(string) > -1) {
                    this.hidden = false;
                }
                // If it does not contain the string hide it
                else {
                    this.hidden = true;
                }
            });

            // Check or uncheck all as necessary
            if ($("#" + selector + " input[type='checkbox']:checked:visible").length == $("#" + selector + " input[type='checkbox']:visible").length) {
                $('#all_' + selector).prop('checked', true);
            }
            else {
                $('#all_' + selector).prop('checked', false);
            }
        }).trigger('input');
    }

    // When the bioactivity search changes
    search_filter(bioactivity_search, bioactivity_string, 'bioactivities', '');

    // When the target search changes
    search_filter(target_search, target_string, 'targets', '');

    // When the compound search changes
    search_filter(compound_search, compound_string, 'compounds', 'c');

    // Drug trials is not part of the table filter; check if exists
    if (drugtrial_search[0]) {
        // When the drugtrial search changes
        search_filter(drugtrial_search, drugtrial_string, 'drugtrials', '');
    }

//    function hashChange() {
//
//        if (document.location.hash == "") {
//            $('#graphic').prop('hidden',true);
//            $('#selection').prop('hidden',false)
//        }
//
//        else {
//            $('#graphic').prop('hidden',false);
//            $('#selection').prop('hidden',true)
//        }
//    }
//
//    //This will call the hashchange function whenever the hashchanges (does not work on outdated versions of IE)
//    window.onhashchange = hashChange;
});