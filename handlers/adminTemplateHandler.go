package handlers

import (
	"io/ioutil"
	"net/http"
	"strings"

	sr "github.com/Ulbora/ulboracms/services"
	"github.com/gorilla/mux"
)

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
			//h.Log.Debug("templates in admin template list: ", *res)
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

//AdminUploadTemplate AdminUploadTemplate
func (h *CmsHandler) AdminUploadTemplate(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in upload template: ", loggedInAuth)
		if loggedInAuth == true {

			mperr := r.ParseMultipartForm(2000000)
			h.Log.Debug("ParseMultipartForm err: ", mperr)

			file, handler, ferr := r.FormFile("tempFile")
			h.Log.Debug("template file err: ", ferr)
			defer file.Close()
			//h.Log.Debug("template file : ", *handler)

			data, rferr := ioutil.ReadAll(file)
			h.Log.Debug("read file  err: ", rferr)

			i := strings.Index(handler.Filename, ".")
			var tname = string(handler.Filename[:i])
			h.Log.Debug("tname: ", tname)

			suc := h.Service.AddTemplateFile(tname, handler.Filename, data)
			var tasus bool
			if suc {
				var tmp sr.Template
				tmp.Name = tname
				tasus = h.Service.AddTemplate(&tmp)
			}
			if tasus {
				http.Redirect(w, r, adminTemplates, http.StatusFound)
			} else {
				h.Log.Debug("Template upload of " + handler.Filename + " failed")
				h.AdminTemplates.ExecuteTemplate(w, templateUpload, nil)
			}
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}

//AdminActivateTemplate AdminActivateTemplate
func (h *CmsHandler) AdminActivateTemplate(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in templateList: ", loggedInAuth)
		if loggedInAuth == true {
			h.Log.Debug("template: ", h.AdminTemplates)
			vars := mux.Vars(r)
			name := vars["name"]
			res := h.Service.ActivateTemplate(name)
			if res {
				h.LoadTemplate()
			}
			h.Log.Debug("activate templates in admin: ", res)
			http.Redirect(w, r, adminTemplates, http.StatusFound)
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}

//AdminDeleteTemplate AdminDeleteTemplate
func (h *CmsHandler) AdminDeleteTemplate(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in templateList: ", loggedInAuth)
		if loggedInAuth == true {
			h.Log.Debug("template: ", h.AdminTemplates)
			vars := mux.Vars(r)
			name := vars["name"]
			suc := h.Service.DeleteTemplate(name)
			if suc {
				suc = h.Service.DeleteTemplateFile(name)
			}
			h.Log.Debug("delete templates in admin: ", suc)
			http.Redirect(w, r, adminTemplates, http.StatusFound)
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}
