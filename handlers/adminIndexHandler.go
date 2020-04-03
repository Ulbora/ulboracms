package handlers

import "net/http"

//AdminIndex  AdminIndex
func (h *CmsHandler) AdminIndex(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in add content: ", loggedInAuth)
		if loggedInAuth == true {
			h.Log.Debug("template: ", h.AdminTemplates)
			res := h.Service.GetContentList(false)
			//h.Log.Debug("content in admin index: ", *res)
			h.AdminTemplates.ExecuteTemplate(w, admIndex, &res)
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}
