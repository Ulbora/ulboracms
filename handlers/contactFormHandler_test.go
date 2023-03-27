package handlers

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	gss "github.com/GolangToolKits/go-secure-sessions"
	lg "github.com/Ulbora/Level_Logger"
	ml "github.com/Ulbora/go-mail-sender"
	ds "github.com/Ulbora/json-datastore"
	sr "github.com/Ulbora/ulboracms/services"
)

func TestCmsHandler_ContactForm(t *testing.T) {
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
	h.ContactForm(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 200 {
		t.Fail()
	}
}

func TestCmsHandler_ContactFormSend(t *testing.T) {
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

	ch.ContactMailSenderAddress = "someSender@test.com"
	ch.ContactMailSubject = "Ulbora CMS V3 message"
	ch.CaptchaSecret = "abaap"
	ch.CaptchaDataSitekey = "1235444"

	var ci sr.CmsService
	//ci.ContentStorePath = "../services/testBackup/contentStore"
	ci.CaptchaHost = "https://www.google.com/recaptcha/api/siteverify"
	ci.MockCaptcha = true
	ci.MockCaptchaSuccess = true

	var ms ml.MockSecureSender
	ms.MockSuccess = true
	ci.MailSender = ms.GetNew()

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testBackup/contentStore"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	h := ch.GetNew()
	r, _ := http.NewRequest("POST", "/test", strings.NewReader("fromEmail=someSender@test.com&text=pleas send help&g-recaptcha-response=555rgt"))
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
	h.ContactFormSend(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}
