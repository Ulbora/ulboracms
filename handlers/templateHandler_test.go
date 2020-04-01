package handlers

import (
	"fmt"
	"html/template"
	"testing"

	lg "github.com/Ulbora/Level_Logger"
	ds "github.com/Ulbora/json-datastore"
	sr "github.com/Ulbora/ulboracms/services"
	//"github.com/gorilla/mux"
)

func TestCmsHandler_LoadTemplate(t *testing.T) {
	var ch CmsHandler
	var l lg.Logger
	l.LogLevel = lg.AllLevel
	ch.Log = &l
	ch.AdminTemplates = template.Must(template.ParseFiles("testHtmls/test.html"))

	var ci sr.CmsService
	ci.TemplateStorePath = "../data/templateStore"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../data/templateStore"
	ci.TemplateStore = ds.GetNew()
	ch.Service = ci.GetNew()

	ch.ActiveTemplateLocation = "../static/templates"

	h := ch.GetNew()

	h.LoadTemplate()

	fmt.Println("template in use: ", ch.ActiveTemplateName)
	if ch.ActiveTemplateName != "default" {
		t.Fail()
	}
}
