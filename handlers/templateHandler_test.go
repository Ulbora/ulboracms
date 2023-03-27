package handlers

import (
	"fmt"
	"html/template"
	"log"
	"testing"

	gss "github.com/GolangToolKits/go-secure-sessions"
	lg "github.com/Ulbora/Level_Logger"
	ds "github.com/Ulbora/json-datastore"
	sr "github.com/Ulbora/ulboracms/services"
)

func TestCmsHandler_LoadTemplate(t *testing.T) {
	var cf gss.ConfigOptions
	cf.MaxAge = 3600
	cf.Path = "/"
	sessionManager, err := gss.NewSessionManager("dsdfsadfs61dsscfsdfdsdsfsdsdllsd", cf)
	if err != nil {
		fmt.Println(err)
		log.Println("Session err: ", err)
	}
	var ch CmsHandler
	ch.SessionManager = sessionManager
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
	if ch.ActiveTemplateName == "" {
		t.Fail()
	}
}
