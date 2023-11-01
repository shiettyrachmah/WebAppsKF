var detailsOrder = [];
var dataHeader;
var sum = 0;
var APILocal = "https://localhost:7084/";
var js = jQuery.noConflict(true);

js(document).ready(function () {
    getHeaderData();
});

function getHeaderData() {
    js.ajax({
        url: APILocal + 'Study',
        type: 'GET',
        contentType: 'application/json',
        success: function (result) {
            dataSource = json2array(result);
            dataHeader = dataSource;
            table = js("#tblStudy").DataTable({
                data: dataSource,
                destroy: true,
                bFilter: true,
                lengthMenu: [5, 10, 25, 50],
                pageLength: 5,
                processing: false,
                columns: [
                    { data: 'studyId', targets: 0, searchable: false },
                    { data: 'versionID', targets: 1, searchable: false },
                    { data: 'protocolTitle', targets: 2, searchable: true },
                    { data: 'protocolCode', targets: 3, searchable: false },
                    { data: 'isActive', targets: 4, searchable: false },
                    {
                        data: null,
                        render: function (data, type, row, meta) {
                            //var a = "'" + data.id + "'";
                            return '<a onclick="update(' + "'" + data.id + "'" + ')" class="btn btn-primary">update</a> &nbsp; <a onclick="deleteData(' + "'" + data.id + "'" + ')" class="btn btn-primary">del</a> ';
                        }
                    },
                ],
                columnDefs: [
                    { "orderable": false, "targets": 'no-sort' }
                ]
            });

            js('.input').on('keyup', function () {
                let string = $(this).val();
                table.columns(0).data().filter(function (value, index) { 
                    return value === string ? true : false;
                }).draw();
            });

            checklistStudy();

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function deleteData(fid) {
    var ids = fid;
    Swal.fire({
        title: 'Do you want to delete this row?',
        showCancelButton: true,
        confirmButtonText: 'Del'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: APILocal + ids,
                type: "DELETE",
                contentType: false,
                success: function (response) {
                    getHeaderData();
                    Swal.fire("Success deleted");
                    console.log(response);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });   
}

function createNewData() {
    $('#createStudy').modal('show');
}

function checklistStudy() {
    if (detailsOrder.length == 0) {
        $('#listStudy').hide();
    } else {
        $('#listStudy').show();
    }
}

function json2array(json) {
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function (key) {
        result.push(json[key]);
    });
    return result;
}


function btnSaveModal() {

    var txtID = $('#txtID').val();
    var txtStudyID = $('#txtStudyID').val();
    var txtVersionID = $('#txtVersionID').val();
    var txtProtocolTitle = $('#txtProtocolTitle').val();
    var txtProtocolCode = $('#txtProtocolCode').val();
    var txtMoleculeID = $('#txtMoleculeID').val();
    var txtStatusStudyID = $('#txtStatusStudyID').val();

    var dataJson = {
        studyID: txtStudyID,
        versionID: txtVersionID,
        protocolTitle: txtProtocolTitle,
        protocolCode: txtProtocolCode,
        moleculesID: txtMoleculeID,
        statusStudyID: txtStatusStudyID,
        isActive: 1,
        isDeleted: 0,
        createdBy: "paritosh.K@innogene.com",
        createdDate: new Date().toISOString().slice(0, 19),
        updatedBy: "paritosh.K@innogene.com",
        updatedDate: new Date().toISOString().slice(0, 19),
        state: ""
    };

    var type = "";
    if (txtID != "") {
        dataJson.id = txtID;
        type = "PUT";
    } else {
        type = "POST";
    }

    var formData = new FormData();
    formData.append("jsonData", JSON.stringify(dataJson));

    // console.log(dataJson);
    $.ajax({
        type: type,
        url: APILocal + "Study",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            getHeaderData();
            Swal.fire("Data success saved", "success");
            $('#createStudy').modal('hide');
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function update(ids) {
    if (ids != null) {
        var getData = dataHeader.filter(x => x.id == ids);
        if (getData.length > 0) {
            $('#createStudy').modal('show');
            $('#txtStudyID').val(getData[0].studyId == "" ? "" : getData[0].studyId);
            $('#txtVersionID').val(getData[0].versionID == "" ? "" : getData[0].versionID);
            $('#txtProtocolTitle').val(getData[0].protocolTitle == "" ? "" : getData[0].protocolTitle);
            $('#txtProtocolCode').val(getData[0].protocolCode == "" ? "" : getData[0].protocolCode);
            $('#txtMoleculeID').val(getData[0].moleculesID == "" ? "" : getData[0].moleculesID);
            $('#txtStatusStudyID').val(getData[0].statusStudyID == "" ? "" : getData[0].statusStudyID);
            $('#txtID').val(getData[0].id);
        }
    }
}
