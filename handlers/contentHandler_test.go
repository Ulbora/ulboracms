package handlers

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	lg "github.com/Ulbora/Level_Logger"
	ds "github.com/Ulbora/json-datastore"
	sr "github.com/Ulbora/ulboracms/services"

	gss "github.com/GolangToolKits/go-secure-sessions"
	mux "github.com/GolangToolKits/grrt"
)

func TestCmsHandler_Index(t *testing.T) {
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
	ch.Templates = template.Must(template.ParseFiles("testHtmls/test.html"))

	var ci sr.CmsService
	ci.ContentStorePath = "../services/testBackup/contentStore"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testBackup/contentStore"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("GET", "/test", nil)
	vars := map[string]string{
		"name": "books1",
	}
	r = mux.SetURLVars(r, vars)
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	h.Index(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 200 {
		t.Fail()
	}
}

func TestCmsHandler_IndexNoParam(t *testing.T) {
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
	ch.Templates = template.Must(template.ParseFiles("testHtmls/test.html"))

	var ci sr.CmsService
	ci.ContentStorePath = "../services/testBackup/contentStore"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testBackup/contentStore"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("GET", "/test", nil)
	// vars := map[string]string{
	// 	"name": "books1",
	// }
	// r = mux.SetURLVars(r, vars)
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	h.Index(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 200 {
		t.Fail()
	}
}

func TestCmsHandler_ViewPage(t *testing.T) {
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
	ch.Templates = template.Must(template.ParseFiles("testHtmls/test.html"))

	var ci sr.CmsService
	ci.ContentStorePath = "../services/testBackup/contentStore"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testBackup/contentStore"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("GET", "/test", nil)
	vars := map[string]string{
		"name": "books1",
	}
	r = mux.SetURLVars(r, vars)
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	h.ViewPage(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 200 {
		t.Fail()
	}
}

func TestCmsHandler_ViewPageNotVisible(t *testing.T) {
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
	ch.Templates = template.Must(template.ParseFiles("testHtmls/test.html"))

	var ci sr.CmsService
	ci.ContentStorePath = "../services/testBackup/contentStore"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testBackup/contentStore"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("GET", "/test", nil)
	vars := map[string]string{
		"name": "books3",
	}
	r = mux.SetURLVars(r, vars)
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	h.ViewPage(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_BlogPosts(t *testing.T) {
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
	ch.Templates = template.Must(template.ParseFiles("testHtmls/test.html"))

	var ci sr.CmsService
	ci.ContentStorePath = "../services/testBackup/contentStore"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testBackup/contentStore"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("GET", "/test", nil)
	// vars := map[string]string{
	// 	"name": "books1",
	// }
	// r = mux.SetURLVars(r, vars)
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	h.BlogPosts(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 200 {
		t.Fail()
	}
}

func TestCmsHandler_ArchivedBlogPosts(t *testing.T) {
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
	ch.Templates = template.Must(template.ParseFiles("testHtmls/test.html"))

	var ci sr.CmsService
	ci.ContentStorePath = "../services/testBackup/contentStore"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testBackup/contentStore"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("GET", "/test", nil)
	// vars := map[string]string{
	// 	"name": "books1",
	// }
	// r = mux.SetURLVars(r, vars)
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	h.ArchivedBlogPosts(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 200 {
		t.Fail()
	}
}
