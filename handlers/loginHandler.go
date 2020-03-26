package handlers

import "net/http"

//LoginError LoginError
type LoginError struct {
	Error string
}

//Login  login handler
func (h *CmsHandler) Login(w http.ResponseWriter, r *http.Request) {
	loginErr := r.URL.Query().Get("error")
	var lge LoginError
	lge.Error = loginErr
	h.AdminTemplates.ExecuteTemplate(w, admlogin, &lge)
}

//LoginUser LoginUser
func (h *CmsHandler) LoginUser(w http.ResponseWriter, r *http.Request) {
	//fmt.Println("in login form submit--------------------------------------")
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		// fmt.Println("store s", s.Store())
		// fmt.Println("name in getSession s", s.Name())
		// fmt.Println("id getSession s", s.ID)
		// fmt.Println("Options in getSession s", s.Options)
		// fmt.Println("session name", s.Name())
		// fmt.Println("SessionKey in getSession", h.Session.SessionKey)

		//larii := s.Values["authReqInfo"]
		//h.Log.Debug("arii", larii)
		//if larii != nil {
		//lari := larii.(*AuthorizeRequestInfo)
		//h.Log.Debug("ari", *lari)
		username := r.FormValue("username")
		password := r.FormValue("password")
		h.Log.Debug("username", username)
		h.Log.Debug("password", password)

		var loginSuc bool
		if username == h.User.Username && password == h.User.Password {
			loginSuc = true
			h.Log.Debug("loginSuc", loginSuc)
		}
		// var lg au.Login
		// lg.ClientID = lari.ClientID
		// lg.Username = username
		// lg.Password = password
		// suc := h.Manager.UserLogin(&lg)
		h.Log.Debug("login suc", loginSuc)
		if loginSuc {
			//if lari.ResponseType == codeRespType || lari.ResponseType == tokenRespType {
			s.Values["loggedIn"] = true
			//s.Values["user"] = username
			serr := s.Save(r, w)
			h.Log.Debug("serr", serr)
			//session, sserr := store.Get(r, "temp-name")
			//fmt.Println("sserr", sserr)
			//session.Store()
			//session.Options.Path = "/oauth/"
			//session.Values["loggedIn"] = true
			//fmt.Println("store", session.Store())
			//session.Save(r, w)

			//clintStr := strconv.FormatInt(lari.ClientID, 10)
			http.Redirect(w, r, adminIndex, http.StatusFound)
			//} else {
			//http.Redirect(w, r, invalidGrantErrorURL, http.StatusFound)
			//}
		} else {
			http.Redirect(w, r, loginFailedURL, http.StatusFound)
		}
		//} else {
		// http.Redirect(w, r, invalidGrantErrorURL, http.StatusFound)
		//http.Redirect(w, r, loginFailedURL, http.StatusFound)
		//}
	} else {
		w.WriteHeader(http.StatusInternalServerError)
	}
}

//Logout Logout
func (h *CmsHandler) Logout(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		s.Values["loggedIn"] = false
		http.Redirect(w, r, login, http.StatusFound)
	}
}
