package handlers

import (
	"fmt"
	"html/template"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	lg "github.com/Ulbora/Level_Logger"
	//"github.com/gorilla/sessions"
)

func TestCmsHandler_Login(t *testing.T) {
	var ch CmsHandler
	var l lg.Logger
	ch.Log = &l
	ch.AdminTemplates = template.Must(template.ParseFiles("testHtmls/test.html"))
	h := ch.GetNew()
	r, _ := http.NewRequest("GET", "/test", nil)
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	h.Login(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 200 {
		t.Fail()
	}
}

func TestOauthWebHandler_LoginUser(t *testing.T) {
	var ch CmsHandler
	var l lg.Logger
	l.LogLevel = lg.AllLevel
	ch.Log = &l
	ch.AdminTemplates = template.Must(template.ParseFiles("testHtmls/test.html"))
	var u User
	u.Username = "tester"
	u.Password = "tester"
	ch.User = &u
	h := ch.GetNew()
	r, _ := http.NewRequest("POST", "/test", strings.NewReader("username=tester&password=tester"))
	r.Header.Set("Content-Type", "application/x-www-form-urlencoded; param=value")
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	h.LoginUser(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestOauthWebHandler_LoginUserFail(t *testing.T) {
	var ch CmsHandler
	var l lg.Logger
	l.LogLevel = lg.AllLevel
	ch.Log = &l
	ch.AdminTemplates = template.Must(template.ParseFiles("testHtmls/test.html"))
	var u User
	u.Username = "tester1"
	u.Password = "tester"
	ch.User = &u
	h := ch.GetNew()
	r, _ := http.NewRequest("POST", "/test", strings.NewReader("username=tester&password=tester"))
	r.Header.Set("Content-Type", "application/x-www-form-urlencoded; param=value")
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	h.LoginUser(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestOauthWebHandler_LoginUserBadsession(t *testing.T) {
	var ch CmsHandler
	var l lg.Logger
	l.LogLevel = lg.AllLevel
	ch.Log = &l
	ch.AdminTemplates = template.Must(template.ParseFiles("testHtmls/test.html"))
	var u User
	u.Username = "tester1"
	u.Password = "tester"
	ch.User = &u
	h := ch.GetNew()
	//r, _ := http.NewRequest("POST", "/test", strings.NewReader("username=tester&password=tester"))
	//r.Header.Set("Content-Type", "application/x-www-form-urlencoded; param=value")
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	h.LoginUser(w, nil)
	fmt.Println("code: ", w.Code)

	if w.Code != 500 {
		t.Fail()
	}
}
func TestCmsHandler_Logout(t *testing.T) {
	var ch CmsHandler
	var l lg.Logger
	ch.Log = &l
	ch.AdminTemplates = template.Must(template.ParseFiles("testHtmls/test.html"))
	h := ch.GetNew()
	r, _ := http.NewRequest("GET", "/test", nil)
	//r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	h.Logout(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}
