package handlers

import (
	"net/http"

	sr "github.com/Ulbora/ulboracms/services"
	"github.com/gorilla/mux"
)

//AdminAddContent AdminAddContent
func (h *CmsHandler) AdminAddContent(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in add content: ", loggedInAuth)
		if loggedInAuth == true {
			res := h.Service.GetImageList()
			h.Log.Debug("image list in content add: ", *res)
			h.AdminTemplates.ExecuteTemplate(w, addContent, &res)
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}

//AdminNewContent AdminNewContent
func (h *CmsHandler) AdminNewContent(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in new content: ", loggedInAuth)
		if loggedInAuth == true {
			name := r.FormValue("name")
			h.Log.Debug("name in new content: ", name)

			content := r.FormValue("content")
			h.Log.Debug("content in new content: ", content)

			title := r.FormValue("title")
			h.Log.Debug("title in new content: ", title)

			author := r.FormValue("author")
			h.Log.Debug("author in new content: ", author)

			metaKeyWords := r.FormValue("metaKeyWords")
			h.Log.Debug("metaKeyWords in new content: ", metaKeyWords)

			metaDesc := r.FormValue("desc")
			h.Log.Debug("metaDesc in new content: ", metaDesc)

			var ct sr.Content
			ct.Author = author
			ct.MetaDesc = metaDesc
			ct.MetaKeyWords = metaKeyWords
			ct.Name = name
			ct.Title = title
			ct.Text = content
			res := h.Service.AddContent(&ct)
			if res.Success {
				http.Redirect(w, r, adminIndex, http.StatusFound)
			} else {
				http.Redirect(w, r, adminAddContent, http.StatusFound)
			}
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}

//AdminUpdateContent AdminUpdateContent
func (h *CmsHandler) AdminUpdateContent(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in new content: ", loggedInAuth)
		if loggedInAuth == true {
			name := r.FormValue("name")
			h.Log.Debug("name in new content: ", name)

			content := r.FormValue("content")
			h.Log.Debug("content in new content: ", content)

			title := r.FormValue("title")
			h.Log.Debug("title in new content: ", title)

			author := r.FormValue("author")
			h.Log.Debug("author in new content: ", author)

			metaKeyWords := r.FormValue("metaKeyWords")
			h.Log.Debug("metaKeyWords in new content: ", metaKeyWords)

			metaDesc := r.FormValue("desc")
			h.Log.Debug("metaDesc in new content: ", metaDesc)

			archived := r.FormValue("archived")
			h.Log.Debug("archived in new content: ", archived)

			visible := r.FormValue("visible")
			h.Log.Debug("visible in new content: ", visible)

			var ct sr.Content
			ct.Author = author
			ct.MetaDesc = metaDesc
			ct.MetaKeyWords = metaKeyWords
			ct.Name = name
			ct.Title = title
			ct.Text = content
			if archived == "on" {
				ct.Archived = true
			} else {
				ct.Archived = false
			}

			if visible == "on" {
				ct.Visible = true
			} else {
				ct.Visible = false
			}

			res := h.Service.UpdateContent(&ct)
			if res.Success {
				http.Redirect(w, r, adminIndex, http.StatusFound)
			} else {
				//go back
				http.Redirect(w, r, adminGetContent+"/"+name, http.StatusFound)
			}

		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}

//AdminGetContent AdminGetContent
func (h *CmsHandler) AdminGetContent(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in add content: ", loggedInAuth)
		if loggedInAuth == true {
			vars := mux.Vars(r)
			name := vars["name"]
			ires := h.Service.GetImageList()
			h.Log.Debug("image list in content get: ", *ires)

			_, cres := h.Service.GetContent(name)
			h.Log.Debug("content in content get: ", *cres)
			var ci contentAndImages
			ci.Img = ires
			ci.Cont = cres
			h.Log.Debug("content and image list in get content: ", ci)

			h.AdminTemplates.ExecuteTemplate(w, updateContent, &ci)
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}

//AdminDeleteContent AdminDeleteContent
func (h *CmsHandler) AdminDeleteContent(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in add content: ", loggedInAuth)
		if loggedInAuth == true {
			vars := mux.Vars(r)
			name := vars["name"]

			res := h.Service.DeleteContent(name)
			h.Log.Debug("content delete in content delete: ", *res)

			http.Redirect(w, r, adminIndex, http.StatusFound)

		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}
