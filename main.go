package main

import (
	"context"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"time"

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
	var mailHost string
	var mailUser string
	var mailPassword string
	var mailPort string

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

	if os.Getenv("EMAIL_HOST") != "" {
		mailHost = os.Getenv("EMAIL_HOST")
	}

	if os.Getenv("EMAIL_USER") != "" {
		mailUser = os.Getenv("EMAIL_USER")
	}

	if os.Getenv("EMAIL_PASSWORD") != "" {
		mailPassword = os.Getenv("EMAIL_PASSWORD")
	}

	if os.Getenv("EMAIL_PORT") != "" {
		mailPort = os.Getenv("EMAIL_PORT")
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
	//////l.LogLevel = lg.AllLevel

	var ms ml.SecureSender
	ms.MailHost = mailHost
	ms.User = mailUser
	ms.Password = mailPassword
	ms.Port = mailPort

	var ch han.CmsHandler
	ch.AdminTemplates = template.Must(template.ParseFiles("./static/admin/index.html", "./static/admin/header.html",
		"./static/admin/footer.html", "./static/admin/navbar.html", "./static/admin/contentNavbar.html",
		"./static/admin/addContent.html", "./static/admin/images.html", "./static/admin/templates.html",
		"./static/admin/updateContent.html", "./static/admin/mailServer.html", "./static/admin/templateUpload.html",
		"./static/admin/imageUpload.html", "./static/admin/login.html", "./static/admin/backups.html",
		"./static/admin/backupUpload.html"))

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

	ccs.TemplateFilePath = "./static/templates"
	ccs.ImagePath = "./static/images"
	ccs.CaptchaHost = captchaHost

	ccs.MailSender = &ms
	ccs.HitLimit = 10

	ch.Service = ccs.GetNew()

	ch.ActiveTemplateLocation = "./static/templates"

	ch.BackupFileName = "UlboraCmsBackup.dat"

	ch.LoadTemplate()

	router := mux.NewRouter()

	port := "8080"
	envPort := os.Getenv("PORT")
	if envPort != "" {
		portInt, _ := strconv.Atoi(envPort)
		if portInt != 0 {
			port = envPort
		}
	}
	srv := &http.Server{
		Addr: "0.0.0.0:" + port,
		// Good practice to set timeouts to avoid Slowloris attacks.
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      router, // Pass our instance of gorilla/mux in.
	}

	h := ch.GetNew()

	//site screen routes
	router.HandleFunc("/", h.Index).Methods("GET")
	router.HandleFunc("/{name}", h.Index).Methods("GET")
	router.HandleFunc("/view/{name}", h.ViewPage).Methods("GET")

	router.HandleFunc("/blog/posts", h.BlogPosts).Methods("GET")
	router.HandleFunc("/blog/archived", h.ArchivedBlogPosts).Methods("GET")

	router.HandleFunc("/contact/form", h.ContactForm).Methods("GET")
	router.HandleFunc("/contact/send", h.ContactFormSend).Methods("POST")

	//admin screen routes
	router.HandleFunc("/admin/login", h.Login).Methods("GET")
	router.HandleFunc("/admin/loginUser", h.LoginUser).Methods("POST")
	router.HandleFunc("/admin/logout", h.Logout).Methods("GET")
	router.HandleFunc("/admin/index", h.AdminIndex).Methods("GET")
	router.HandleFunc("/admin/getContent/{name}", h.AdminGetContent).Methods("GET")
	router.HandleFunc("/admin/addContent", h.AdminAddContent).Methods("GET")
	router.HandleFunc("/admin/newContent", h.AdminNewContent).Methods("POST")
	router.HandleFunc("/admin/updateContent", h.AdminUpdateContent).Methods("POST")
	router.HandleFunc("/admin/deleteContent/{name}", h.AdminDeleteContent).Methods("GET")
	router.HandleFunc("/admin/imageList", h.AdminImageList).Methods("GET")
	router.HandleFunc("/admin/deleteImage/{name}", h.AdminDeleteImage).Methods("GET")
	router.HandleFunc("/admin/addImage", h.AdminAddImage).Methods("GET")
	router.HandleFunc("/admin/uploadImage", h.AdminUploadImage).Methods("POST")
	router.HandleFunc("/admin/templates", h.AdminTemplateList).Methods("GET")
	router.HandleFunc("/admin/addTemplate", h.AdminAddTemplate).Methods("GET")
	router.HandleFunc("/admin/uploadTemplate", h.AdminUploadTemplate).Methods("POST")
	router.HandleFunc("/admin/deleteTemplate/{name}", h.AdminDeleteTemplate).Methods("GET")
	router.HandleFunc("/admin/templateActive/{name}", h.AdminActivateTemplate).Methods("GET")
	router.HandleFunc("/admin/backups", h.AdminBackup).Methods("GET")
	router.HandleFunc("/admin/downloadBackup", h.AdminDownloadBackups).Methods("GET")
	router.HandleFunc("/admin/backupUpload", h.AdminBackupUpload).Methods("GET")
	router.HandleFunc("/admin/uploadBackup", h.AdminUploadBackups).Methods("POST")

	router.HandleFunc("/rs/loglevel", h.SetLogLevel).Methods("POST")

	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./static/")))

	fmt.Println("Ulbora CMS is Running on Port " + port)
	go func() {
		if err := srv.ListenAndServe(); err != nil {
			log.Println(err)
		}
	}()

	c := make(chan os.Signal, 1)
	// We'll accept graceful shutdowns when quit via SIGINT (Ctrl+C)
	// SIGKILL, SIGQUIT or SIGTERM (Ctrl+/) will not be caught.
	signal.Notify(c, os.Interrupt)

	// Block until we receive our signal.
	<-c

	// Create a deadline to wait for.
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15)
	defer cancel()

	// Doesn't block if no connections, but will otherwise wait
	// until the timeout deadline.
	srv.Shutdown(ctx)

	ccs.SaveHits()
	log.Println("Shutting Down Ulbora CMS")

	log.Println("Exit")
	os.Exit(0)

}

//go mod init github.com/Ulbora/ulboracms
