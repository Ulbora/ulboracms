package handlers

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	lg "github.com/Ulbora/Level_Logger"
	ds "github.com/Ulbora/json-datastore"
	sr "github.com/Ulbora/ulboracms/services"

	gss "github.com/GolangToolKits/go-secure-sessions"
	mux "github.com/GolangToolKits/grrt"
)

func TestCmsHandler_AdminAddContent(t *testing.T) {
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
	ci.ImagePath = "../services/testImages"
	ci.ImageFullPath = "../services/testImages"

	ci.Log = &l

	ch.Service = ci.GetNew()
	h := ch.GetNew()
	r, _ := http.NewRequest("GET", "/test", nil)
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", true)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}
	h.AdminAddContent(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 200 {
		t.Fail()
	}
}

func TestCmsHandler_AdminAddContentNotLoggedIn(t *testing.T) {
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
	ci.ImagePath = "../services/testImages"
	ci.ImageFullPath = "../services/testImages"
	ch.Service = ci.GetNew()
	h := ch.GetNew()
	r, _ := http.NewRequest("GET", "/test", nil)
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", false)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}
	h.AdminAddContent(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminNewContent(t *testing.T) {
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
	ci.ContentStorePath = "../services/testFiles"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testFiles"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("POST", "/test", strings.NewReader("content=test content&author=ken&title=test doc&name=testdoc1&metaKeyWords=someKeyWord&desc=some meta desc"))
	r.Header.Set("Content-Type", "application/x-www-form-urlencoded; param=value")
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", true)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h.AdminNewContent(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminNewContent2(t *testing.T) {
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
	ci.ContentStorePath = "../services/testFiles"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testFiles"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("POST", "/test", strings.NewReader("content=test content&author=ken&title=test doc&name=testdoc1&metaKeyWords=someKeyWord&desc=some meta desc&blogpost=on&visible=on"))
	r.Header.Set("Content-Type", "application/x-www-form-urlencoded; param=value")
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", true)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h.AdminNewContent(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminNewContentFailedDuplicate(t *testing.T) {
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
	ci.ContentStorePath = "../services/testFiles"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testFiles"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("POST", "/test", strings.NewReader("content=test content&author=ken&title=test doc&name=testdoc1&metaKeyWords=someKeyWord&desc=some meta desc"))
	r.Header.Set("Content-Type", "application/x-www-form-urlencoded; param=value")
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", true)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h.AdminNewContent(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminNewContentNotLoggedIn(t *testing.T) {
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
	ci.ContentStorePath = "../services/testFiles"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testFiles"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("POST", "/test", strings.NewReader("content=test content&author=ken&title=test doc&name=testdoc1&metaKeyWords=someKeyWord&desc=some meta desc"))
	r.Header.Set("Content-Type", "application/x-www-form-urlencoded; param=value")
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", false)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h.AdminNewContent(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminUpdateContent(t *testing.T) {
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
	ci.ContentStorePath = "../services/testFiles"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testFiles"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("POST", "/test", strings.NewReader("content=test content updated&author=ken2&title=test doc2&name=testdoc1&metaKeyWords=someKeyWord2&desc=some meta desc2&archived=on&visible=on"))
	r.Header.Set("Content-Type", "application/x-www-form-urlencoded; param=value")
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", true)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h.AdminUpdateContent(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminUpdateContentFailed(t *testing.T) {
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
	ci.ContentStorePath = "../services/testFiles"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testFiles"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("POST", "/test", strings.NewReader("content=test content updated&author=ken2&title=test doc2&name=testdoc111&metaKeyWords=someKeyWord2&desc=some meta desc2&archived=on&visible=on&blogpost=on"))
	r.Header.Set("Content-Type", "application/x-www-form-urlencoded; param=value")
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", true)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h.AdminUpdateContent(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminUpdateContentVisibleOff(t *testing.T) {
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
	ci.ContentStorePath = "../services/testFiles"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testFiles"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("POST", "/test", strings.NewReader("content=test content updated&author=ken2&title=test doc2&name=testdoc1&metaKeyWords=someKeyWord2&desc=some meta desc2&archived=off&visible=off&blogpost=off"))
	r.Header.Set("Content-Type", "application/x-www-form-urlencoded; param=value")
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", true)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h.AdminUpdateContent(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminUpdateContentNotLoggedIn(t *testing.T) {
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
	ci.ContentStorePath = "../services/testFiles"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testFiles"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("POST", "/test", strings.NewReader("content=test content updated&author=ken2&title=test doc2&name=testdoc1&metaKeyWords=someKeyWord2&desc=some meta desc2&archived=off&visible=off"))
	r.Header.Set("Content-Type", "application/x-www-form-urlencoded; param=value")
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", false)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h.AdminUpdateContent(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminGetContent(t *testing.T) {
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
	ci.ImagePath = "../services/testImages"
	ci.ImageFullPath = "../services/testImages"

	var ds ds.DataStore
	ds.Path = "../services/testFiles"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	ci.Log = &l

	ch.Service = ci.GetNew()
	h := ch.GetNew()
	r, _ := http.NewRequest("GET", "/test", nil)
	vars := map[string]string{
		"name": "testdoc1",
	}
	r = mux.SetURLVars(r, vars)
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", true)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h.AdminGetContent(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 200 {
		t.Fail()
	}
}

func TestCmsHandler_AdminGetContentNotLoggedIn(t *testing.T) {
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
	ci.ImagePath = "../services/testImages"
	ci.ImageFullPath = "../services/testImages"

	var ds ds.DataStore
	ds.Path = "../services/testFiles"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	ci.Log = &l

	ch.Service = ci.GetNew()
	h := ch.GetNew()
	r, _ := http.NewRequest("GET", "/test", nil)
	vars := map[string]string{
		"name": "testdoc1",
	}
	r = mux.SetURLVars(r, vars)
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", false)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h.AdminGetContent(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminDeleteContent(t *testing.T) {
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
	ci.ImagePath = "../services/testImages"
	ci.ImageFullPath = "../services/testImages"

	var ds ds.DataStore
	ds.Path = "../services/testFiles"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	ci.Log = &l

	ch.Service = ci.GetNew()
	h := ch.GetNew()
	r, _ := http.NewRequest("DELETE", "/test", nil)
	vars := map[string]string{
		"name": "testdoc1",
	}
	r = mux.SetURLVars(r, vars)
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", true)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h.AdminDeleteContent(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminDeleteContentNotLoggedIn(t *testing.T) {
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
	ci.ImagePath = "../services/testImages"
	ci.ImageFullPath = "../services/testImages"

	var ds ds.DataStore
	ds.Path = "../services/testFiles"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	ci.Log = &l

	ch.Service = ci.GetNew()
	h := ch.GetNew()
	r, _ := http.NewRequest("DELETE", "/test", nil)
	vars := map[string]string{
		"name": "testdoc1",
	}
	r = mux.SetURLVars(r, vars)
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", false)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h.AdminDeleteContent(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}
