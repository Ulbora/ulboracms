package handlers

import "net/http"

//AdminIndex  AdminIndex
func (h *CmsHandler) AdminIndex(w http.ResponseWriter, r *http.Request) {
	h.Log.Debug("template: ", h.AdminTemplates)
	res := h.Service.GetContentList(false)
	h.Log.Debug("content in admin index: ", *res)
	h.AdminTemplates.ExecuteTemplate(w, admIndex, &res)
}
