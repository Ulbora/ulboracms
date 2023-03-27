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
	ds "github.com/Ulbora/json-datastore"
	sr "github.com/Ulbora/ulboracms/services"

	gss "github.com/GolangToolKits/go-secure-sessions"
)

func TestCmsHandler_AdminBackup(t *testing.T) {
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
	s.Set("loggedIn", true)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}
	// cookie := http.Cookie{
	// 	Name:   "goauth2",
	// 	Value:  	"AwwAAAUEAP4cIAMMAAAKDAAHZ29hdXRoMgQMAAEvDv+BBAEC/4IAARABEAAAIP+CAAEGc3RyaW5nDAoACGxvZ2dlZEluBGJvb2wCAgAB",

	// 	MaxAge: 300,
	// }
	//"AwwAAAUEAP4cIAMMAAAKDAAHZ29hdXRoMgQMAAEvDv+BBAEC/4IAARABEAAAIP+CAAEGc3RyaW5nDAoACGxvZ2dlZEluBGJvb2wCAgAB"

	h.AdminBackup(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 200 {
		t.Fail()
	}
}

func TestCmsHandler_AdminBackupNotLoggedIn(t *testing.T) {
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
	ci.ContentStorePath = "../services/testBackup/contentStore"

	ci.ContentStorePath = "../services/testBackup/contentStore"
	ci.TemplateStorePath = "../services/testBackup/templateStore"
	ci.ImagePath = "../services/testBackup/images"
	ci.TemplateFilePath = "../services/testBackup/templates"

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
	h.AdminBackup(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminDownloadBackups(t *testing.T) {
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
	//ci.ContentStorePath = "../services/testBackup/contentStore"

	ci.ContentStorePath = "../services/testBackup/contentStore"
	ci.TemplateStorePath = "../services/testBackup/templateStore"
	ci.ImagePath = "../services/testBackup/images"
	ci.TemplateFilePath = "../services/testBackup/templates"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testBackup/contentStore"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	ch.BackupFileName = "backup.dat"

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
	h.AdminDownloadBackups(w, r)
	fmt.Println("download backup w.code: ", w.Code)
	fmt.Println("download body: ", w.Body)

	if w.Code != 200 {
		t.Fail()
	}
}

func TestCmsHandler_AdminDownloadBackupsNotLoggedIn(t *testing.T) {
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
	//ci.ContentStorePath = "../services/testBackup/contentStore"

	ci.ContentStorePath = "../services/testBackup/contentStore"
	ci.TemplateStorePath = "../services/testBackup/templateStore"
	ci.ImagePath = "../services/testBackup/images"
	ci.TemplateFilePath = "../services/testBackup/templates"

	ci.Log = &l
	var ds ds.DataStore
	ds.Path = "../services/testBackup/contentStore"
	ci.Store = ds.GetNew()
	ch.Service = ci.GetNew()

	ch.BackupFileName = "backup.dat"

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
	h.AdminDownloadBackups(w, r)
	fmt.Println("download backup code: ", w.Code)
	fmt.Println("download body: ", w.Body)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminUploadBackups(t *testing.T) {
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
	// ci.ImagePath = "../services/testImages"
	// ci.ImageFullPath = "../services/testImages"
	ci.ContentStorePath = "./testBackupRestore/contentStore"
	ci.TemplateStorePath = "./testBackupRestore/templateStore"
	ci.ImagePath = "./testBackupRestore/images"
	ci.TemplateFilePath = "./testBackupRestore/templates"

	var cds ds.DataStore
	cds.Path = "./testBackupRestore/contentStore"
	ci.Store = cds.GetNew()

	var tds ds.DataStore
	tds.Path = "./testBackupRestore/templateStore"
	ci.TemplateStore = tds.GetNew()

	ch.ActiveTemplateLocation = "../services/testDownloads"

	ci.Log = &l

	ch.Service = ci.GetNew()

	file, err := os.Open("./testBackupZips/compress.dat")
	if err != nil {
		fmt.Println("file test backup open err: ", err)
	}
	defer file.Close()

	fi, err := file.Stat()
	if err != nil {
		fmt.Println("file.Stat err: ", err)
	}
	fmt.Println("backup fi name : ", fi.Name())

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("backupFile", fi.Name())
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
	h.AdminUploadBackups(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminUploadBackupsFail(t *testing.T) {
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
	// ci.ImagePath = "../services/testImages"
	// ci.ImageFullPath = "../services/testImages"
	// ci.ContentStorePath = "./testBackupRestore/contentStore"
	// ci.TemplateStorePath = "./testBackupRestore/templateStore"
	// ci.ImagePath = "./testBackupRestore/images"
	// ci.TemplateFilePath = "./testBackupRestore/templates"

	ci.Log = &l

	ch.Service = ci.GetNew()

	file, err := os.Open("./testBackupZips/test.jpg")
	if err != nil {
		fmt.Println("file test backup open err: ", err)
	}
	defer file.Close()

	fi, err := file.Stat()
	if err != nil {
		fmt.Println("file.Stat err: ", err)
	}
	fmt.Println("backup fi name : ", fi.Name())

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("backupFile", fi.Name())
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
	h.AdminUploadBackups(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminUploadBackupsNotLoggedIn(t *testing.T) {
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
	// ci.ImagePath = "../services/testImages"
	// ci.ImageFullPath = "../services/testImages"
	ci.ContentStorePath = "./testBackupRestore/contentStore"
	ci.TemplateStorePath = "./testBackupRestore/templateStore"
	ci.ImagePath = "./testBackupRestore/images"
	ci.TemplateFilePath = "./testBackupRestore/templates"

	ci.Log = &l

	ch.Service = ci.GetNew()

	file, err := os.Open("./testBackupZips/compress.dat")
	if err != nil {
		fmt.Println("file test backup open err: ", err)
	}
	defer file.Close()

	fi, err := file.Stat()
	if err != nil {
		fmt.Println("file.Stat err: ", err)
	}
	fmt.Println("backup fi name : ", fi.Name())

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("backupFile", fi.Name())
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
	h.AdminUploadBackups(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}

func TestCmsHandler_AdminBackupUpload(t *testing.T) {
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
	s.Set("loggedIn", true)
	s.Save(w)
	cook3 := w.Result().Cookies()
	if len(cook3) > 0 {
		r.AddCookie(cook3[0])
	}
	h.AdminBackupUpload(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 200 {
		t.Fail()
	}
}

func TestCmsHandler_AdminBackupUploadNotLoggedIn(t *testing.T) {
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
	h.AdminBackupUpload(w, r)
	fmt.Println("code: ", w.Code)

	if w.Code != 302 {
		t.Fail()
	}
}
