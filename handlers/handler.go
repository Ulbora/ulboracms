package handlers

import (
	"html/template"
	"net/http"

	lg "github.com/Ulbora/Level_Logger"
	gs "github.com/Ulbora/go-sessions"
	"github.com/Ulbora/ulboracms/services"
	sr "github.com/Ulbora/ulboracms/services"
	"github.com/gorilla/sessions"
)

const (
	//Urls
	loginFailedURL  = "/login?error=Login Failed"
	login           = "/admin/login"
	logout          = "/admin/logout"
	adminIndex      = "/admin/index"
	adminGetContent = "/admin/getContent"
	adminAddContent = "/admin/addContent"

	//pages
	admlogin      = "login.html"
	admIndex      = "index.html"
	addContent    = "addContent.html"
	updateContent = "updateContent.html"
)

//Handler Handler
type Handler interface {
	Login(w http.ResponseWriter, r *http.Request)
	LoginUser(w http.ResponseWriter, r *http.Request)
	Logout(res http.ResponseWriter, req *http.Request)
	AdminIndex(w http.ResponseWriter, r *http.Request)
	AdminAddContent(w http.ResponseWriter, r *http.Request)
	AdminNewContent(w http.ResponseWriter, r *http.Request)
	AdminUpdateContent(w http.ResponseWriter, r *http.Request)
	AdminGetContent(w http.ResponseWriter, r *http.Request)
	AdminDeleteContent(w http.ResponseWriter, r *http.Request)
}

//CmsHandler CmsHandler
type CmsHandler struct {
	Service        sr.Service
	Log            *lg.Logger
	AdminTemplates *template.Template
	Session        gs.GoSession
	Store          *sessions.CookieStore
	User           *User
}

//User User
type User struct {
	Username string
	Password string
}

type contentAndImages struct {
	Cont *services.Content
	Img  *[]services.Image
}

//GetNew GetNew
func (h *CmsHandler) GetNew() Handler {
	var hd Handler
	hd = h
	return hd
}

func (h *CmsHandler) getSession(r *http.Request) (*sessions.Session, bool) {
	//fmt.Println("getSession--------------------------------------------------")
	var suc bool
	var srtn *sessions.Session
	if h.Store == nil {
		h.Session.Name = "goauth2"
		h.Session.MaxAge = 3600
		h.Store = h.Session.InitSessionStore()
		//gob.Register(&AuthorizeRequestInfo{})
	}
	if r != nil {
		// fmt.Println("secure in getSession", h.Session.Secure)
		// fmt.Println("name in getSession", h.Session.Name)
		// fmt.Println("MaxAge in getSession", h.Session.MaxAge)
		// fmt.Println("SessionKey in getSession", h.Session.SessionKey)

		//h.Session.HTTPOnly = true

		//h.Session.InitSessionStore()
		s, err := h.Store.Get(r, h.Session.Name)
		//s, err := store.Get(r, "temp-name")
		//s, err := store.Get(r, "goauth2")

		loggedInAuth := s.Values["loggedIn"]
		//userAuth := s.Values["user"]
		h.Log.Debug("loggedIn: ", loggedInAuth)
		//h.Log.Debug("user: ", userAuth)

		//larii := s.Values["authReqInfo"]
		//h.Log.Debug("arii-----login", larii)

		h.Log.Debug("session error in getSession: ", err)
		if err == nil {
			suc = true
			srtn = s
		}
	}
	//fmt.Println("exit getSession--------------------------------------------------")
	return srtn, suc
}
