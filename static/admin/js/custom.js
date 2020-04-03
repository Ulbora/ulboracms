jQuery(document).ready(function ($) {
    $(".clickable-row").click(function () {
        window.location = $(this).data("href");
    });
});

function allowDrop(ev) {
    alert("test");
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {

    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

var pageSaved;

function leavePage() {
    if (pageSaved !== true) {
        return "Page Not Saved!";
    } else {
        return;
    }
}
function savePage() {
    pageSaved = true;
}

var imageId;
function setImageId(id) {
    imageId = id;
}
function getImageId() {
    return imageId;
}


var tmplId;
var tmplName;
function setTemplateIdAndName(id, tname) {
    tmplId = id;
    tmplName = tname;
}
function getTemplateId() {
    return tmplId;
}
function getTemplateName() {
    return tmplName;
}

function test() {
    alert('test');
}

function deletePage() {
    $('.ui.basic.modal')
        .modal('show')
        ;
    // $(function () {
    //     $('.ui basic modal').modal('show');
    // });
    // $(".ui basic modal").modal({
    //     closable: true
    // });
    // document.getElementById("cont").innerHTML = "Delete Client Role " + rl + "?";
}

var imageName;
function setImageToDelete(name){
    imageName = name;
    $('.ui.basic.modal')
    .modal('show')
    ;
}

function getImageNameToDelete(){
    return imageName;
}


var templateName;
function setTemplateToDelete(name){
    templateName = name;
    $('.ui.basic.modal')
    .modal('show')
    ;
}

function getTemplateNameToDelete(){
    return templateName;
}