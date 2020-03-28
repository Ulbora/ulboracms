package handlers

import "net/http"

//AdminTemplateList AdminTemplateList
func (h *CmsHandler) AdminTemplateList(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in templateList: ", loggedInAuth)
		if loggedInAuth == true {
			h.Log.Debug("template: ", h.AdminTemplates)
			res := h.Service.GetTemplateList()
			h.Log.Debug("templates in admin template list: ", *res)
			h.AdminTemplates.ExecuteTemplate(w, templateList, &res)
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}

//AdminAddTemplate AdminAddTemplate
func (h *CmsHandler) AdminAddTemplate(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in add template: ", loggedInAuth)
		if loggedInAuth == true {
			h.Log.Debug("template: ", h.AdminTemplates)
			h.AdminTemplates.ExecuteTemplate(w, templateUpload, nil)
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}
