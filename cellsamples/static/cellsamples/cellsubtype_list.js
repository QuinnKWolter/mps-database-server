$(document).ready(function() {
    $('#cellsubtypes').DataTable({
        dom: 'B<"row">lfrtip',
        "iDisplayLength": 50,
        // Initially sort on organ
        "order": [ 1, "asc" ],
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
});
