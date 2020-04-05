package handlers

import (
	"fmt"
	"html/template"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	lg "github.com/Ulbora/Level_Logger"
	ml "github.com/Ulbora/go-mail-sender"
	ds "github.com/Ulbora/json-datastore"
	sr "github.com/Ulbora/ulboracms/services"
)

func TestCmsHandler_ContactForm(t *testing.T) {
	var ch CmsHandler
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
	s.Values["loggedIn"] = false
	s.Save(r, w)
	h.ContactForm(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 200 {
		t.Fail()
	}
}

func TestCmsHandler_ContactFormSend(t *testing.T) {
	var ch CmsHandler

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
	s.Values["loggedIn"] = false
	s.Save(r, w)
	h.ContactFormSend(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}
