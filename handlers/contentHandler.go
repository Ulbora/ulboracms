package handlers

import (
	"net/http"

	"github.com/gorilla/mux"
)

//Index  Index
func (h *CmsHandler) Index(w http.ResponseWriter, r *http.Request) {
	h.Log.Debug("template: ", h.Templates)
	res := h.Service.GetContentList(true)
	h.Log.Debug("content in index: ", *res)
	h.Templates.ExecuteTemplate(w, index, &res)
}

//ViewPage ViewPage
func (h *CmsHandler) ViewPage(w http.ResponseWriter, r *http.Request) {
	h.Log.Debug("template: ", h.Templates)
	vars := mux.Vars(r)
	name := vars["name"]
	_, res := h.Service.GetContent(name)
	h.Log.Debug("content in view Page: ", *res)
	if res.Visible {
		h.Templates.ExecuteTemplate(w, viewContent, &res)
	} else {
		http.Redirect(w, r, indexPage, http.StatusFound)
	}

}
