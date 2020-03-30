package main

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
	"strconv"

	lg "github.com/Ulbora/Level_Logger"
	ml "github.com/Ulbora/go-mail-sender"
	ds "github.com/Ulbora/json-datastore"
	han "github.com/Ulbora/ulboracms/handlers"
	sr "github.com/Ulbora/ulboracms/services"
	"github.com/gorilla/mux"
)

func main() {
	var u han.User
	var captchaSecret string
	var captchaDataSiteKey string
	var captchaHost string
	var contactMailSenderAddress string
	var cantactMailSubject string

	if os.Getenv("CMS_USERNAME") != "" {
		u.Username = os.Getenv("CMS_USERNAME")
	} else {
		u.Username = "admin"
	}

	if os.Getenv("CMS_PASSWORD") != "" {
		u.Password = os.Getenv("CMS_PASSWORD")
	} else {
		u.Password = "admin123"
	}

	if os.Getenv("CMS_CAPTCHA_SECRET") != "" {
		captchaSecret = os.Getenv("CMS_CAPTCHA_SECRET")
	}

	if os.Getenv("CMS_CAPTCHA_DATA_SITE_KEY") != "" {
		captchaDataSiteKey = os.Getenv("CMS_CAPTCHA_DATA_SITE_KEY")
	}

	if os.Getenv("CONTACT_MAIL_SENDER_ADDRESS") != "" {
		contactMailSenderAddress = os.Getenv("CONTACT_MAIL_SENDER_ADDRESS")
	}

	if os.Getenv("CONTACT_MAIL_SUBJECT") != "" {
		cantactMailSubject = os.Getenv("CONTACT_MAIL_SUBJECT")
	} else {
		cantactMailSubject = "Ulbora CMS Message"
	}

	if os.Getenv("CMS_CAPTCHA_HOST") != "" {
		captchaHost = os.Getenv("CMS_CAPTCHA_HOST")
	} else {
		captchaHost = "https://www.google.com/recaptcha/api/siteverify"
	}

	var l lg.Logger
	l.LogLevel = lg.AllLevel

	var ms ml.SecureSender

	var ch han.CmsHandler
	ch.AdminTemplates = template.Must(template.ParseFiles("./static/admin/index.html", "./static/admin/header.html",
		"./static/admin/footer.html", "./static/admin/navbar.html", "./static/admin/contentNavbar.html",
		"./static/admin/addContent.html", "./static/admin/images.html", "./static/admin/templates.html",
		"./static/admin/updateContent.html", "./static/admin/mailServer.html", "./static/admin/templateUpload.html",
		"./static/admin/imageUpload.html"))

	ch.Log = &l
	ch.User = &u

	ch.CaptchaSecret = captchaSecret
	ch.CaptchaDataSitekey = captchaDataSiteKey
	ch.ContactMailSenderAddress = contactMailSenderAddress
	ch.ContactMailSubject = cantactMailSubject

	var ccs sr.CmsService
	ccs.Log = &l

	var cds ds.DataStore
	cds.Path = "./data/contentStore"
	ccs.Store = cds.GetNew()
	ccs.ContentStorePath = "./data/contentStore"

	var tds ds.DataStore
	tds.Path = "./data/templateStore"
	ccs.TemplateStore = tds.GetNew()
	ccs.TemplateStorePath = "./data/templateStore"

	ccs.TemplateFilePath = "./data/templates"
	ccs.ImagePath = "./data/images"
	ccs.ImageFullPath = "./data/images"
	ccs.CaptchaHost = captchaHost

	ccs.MailSender = &ms

	ch.Service = ccs.GetNew()

	router := mux.NewRouter()
	port := "8080"
	envPort := os.Getenv("PORT")
	if envPort != "" {
		portInt, _ := strconv.Atoi(envPort)
		if portInt != 0 {
			port = envPort
		}
	}

	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./static/")))

	fmt.Println("Starting server Oauth2 Server on " + port)
	http.ListenAndServe(":"+port, router)

}

//go mod init github.com/Ulbora/ulboracms
