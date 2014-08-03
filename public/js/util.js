function mediaUpdate() {
    //alert("test");
    //alert(document.getElementById("actionUrl").value);
    var addMediaUrl = document.getElementById("actionUrl").value;
    document.getElementById("mediaForm").setAttribute("action", addMediaUrl);
    document.getElementById("mediaForm").submit();
}

function productFileUpdate() {
    //alert("test");
    //alert(document.getElementById("actionUrl").value);
    var addFileUrl = document.getElementById("actionUrl").value;
    document.getElementById("productFileForm").setAttribute("action", addFileUrl);
    document.getElementById("productFileForm").submit();
}

function articleUpdate() {
    //alert("test");
    //alert(document.getElementById("actionUrl").value);
    var addArticleUrl = document.getElementById("actionUrl").value;
    document.getElementById("articleForm").setAttribute("action", addArticleUrl);
    document.getElementById("articleForm").submit();
}

function isNumberKey(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode !== 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
        return false;

    return true;
}
