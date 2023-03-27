package handlers

import (
	"bytes"
	"fmt"
	"html/template"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	lg "github.com/Ulbora/Level_Logger"
	sr "github.com/Ulbora/ulboracms/services"

	gss "github.com/GolangToolKits/go-secure-sessions"
	mux "github.com/GolangToolKits/grrt"
)

func TestCmsHandler_AdminAddImage(t *testing.T) {
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
	h.AdminAddImage(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 200 {
		t.Fail()
	}
}

func TestCmsHandler_AdminAddImageNotLoggedIn(t *testing.T) {
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
	s.Set("loggedIn", false)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}
	h.AdminAddImage(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminUploadImage(t *testing.T) {
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

	file, err := os.Open("../services/testUploadImages/test22.jpg")
	if err != nil {
		fmt.Println("file test image open err: ", err)
	}
	defer file.Close()

	fi, err := file.Stat()
	if err != nil {
		fmt.Println("file.Stat err: ", err)
	}
	fmt.Println("image fi name : ", fi.Name())

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("image", fi.Name())
	if err != nil {
		fmt.Println("create form err: ", err)
	}

	_, err = io.Copy(part, file)
	fmt.Println("io.Copy err: ", err)

	writer.WriteField("name", fi.Name())

	r, _ := http.NewRequest("POST", "/test", body)
	r.Header.Set("Content-Type", writer.FormDataContentType())
	fmt.Println("image upload file writer.FormDataContentType() : ", writer.FormDataContentType())

	err = writer.Close()
	if err != nil {
		fmt.Println(" writer.Close err: ", err)
	}
	w := httptest.NewRecorder()

	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", true)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h := ch.GetNew()
	h.AdminUploadImage(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminUploadImageFail(t *testing.T) {
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
	ci.ImagePath = "../services/testUploadImages1"
	ci.ImageFullPath = "../services/testUploadImages1"

	ci.Log = &l

	ch.Service = ci.GetNew()

	file, err := os.Open("../services/testImages/test.jpg")
	if err != nil {
		fmt.Println("file test image open err: ", err)
	}
	defer file.Close()

	fi, err := file.Stat()
	if err != nil {
		fmt.Println("file.Stat err: ", err)
	}
	fmt.Println("image fi name : ", fi.Name())

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("image", fi.Name())
	if err != nil {
		fmt.Println("create form err: ", err)
	}

	_, err = io.Copy(part, file)
	fmt.Println("io.Copy err: ", err)

	writer.WriteField("name", fi.Name())

	r, _ := http.NewRequest("POST", "/test", body)
	r.Header.Set("Content-Type", writer.FormDataContentType())
	fmt.Println("image upload file writer.FormDataContentType() : ", writer.FormDataContentType())

	err = writer.Close()
	if err != nil {
		fmt.Println(" writer.Close err: ", err)
	}
	w := httptest.NewRecorder()

	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", true)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h := ch.GetNew()
	h.AdminUploadImage(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminUploadImageNotLoggedIn(t *testing.T) {
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
	ci.ImagePath = "../services/testUploadImages"
	ci.ImageFullPath = "../services/testUploadImages"

	ci.Log = &l

	ch.Service = ci.GetNew()

	file, err := os.Open("../services/testImages/test.jpg")
	if err != nil {
		fmt.Println("file test image open err: ", err)
	}
	defer file.Close()

	fi, err := file.Stat()
	if err != nil {
		fmt.Println("file.Stat err: ", err)
	}
	fmt.Println("image fi name : ", fi.Name())

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("image", fi.Name())
	if err != nil {
		fmt.Println("create form err: ", err)
	}

	_, err = io.Copy(part, file)
	fmt.Println("io.Copy err: ", err)

	writer.WriteField("name", fi.Name())

	r, _ := http.NewRequest("POST", "/test", body)
	r.Header.Set("Content-Type", writer.FormDataContentType())
	fmt.Println("image upload file writer.FormDataContentType() : ", writer.FormDataContentType())

	err = writer.Close()
	if err != nil {
		fmt.Println(" writer.Close err: ", err)
	}
	w := httptest.NewRecorder()

	s, suc := ch.getSession(r)
	fmt.Println("suc: ", suc)
	s.Set("loggedIn", false)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h := ch.GetNew()
	h.AdminUploadImage(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminImageList(t *testing.T) {
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

	h.AdminImageList(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 200 {
		t.Fail()
	}
}

func TestCmsHandler_AdminImageListNotLoggedIn(t *testing.T) {
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
	s.Set("loggedIn", false)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}

	h.AdminImageList(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminDeleteImage(t *testing.T) {
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
	r, _ := http.NewRequest("DELETE", "/test", nil)
	vars := map[string]string{
		"name": "test22.jpg",
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

	h.AdminDeleteImage(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminDeleteImageNotLoggedIn(t *testing.T) {
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
	r, _ := http.NewRequest("DELETE", "/test", nil)
	vars := map[string]string{
		"name": "test22.jpg",
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

	h.AdminDeleteImage(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}
