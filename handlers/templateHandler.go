package handlers

import "html/template"

//LoadTemplate LoadTemplate
func (h *CmsHandler) LoadTemplate() {
	h.ActiveTemplateName = h.Service.GetActiveTemplateName()
	h.Log.Debug("ActiveTemplateName: ", h.ActiveTemplateName)

	//var tperr error
	// tp, tperr := template.ParseFiles("./static/templates/"+h.ActiveTemplateName+"/index.html", "./static/templates/"+h.ActiveTemplateName+"/header.html",
	// 	"./static/templates/"+h.ActiveTemplateName+"/footer.html", "./static/templates/"+h.ActiveTemplateName+"/navbar.html",
	// 	"./static/templates/"+h.ActiveTemplateName+"/contact.html")

	tp, tperr := template.ParseFiles(h.ActiveTemplateLocation+"/"+h.ActiveTemplateName+"/index.html", h.ActiveTemplateLocation+"/"+h.ActiveTemplateName+"/header.html",
		h.ActiveTemplateLocation+"/"+h.ActiveTemplateName+"/footer.html", h.ActiveTemplateLocation+"/"+h.ActiveTemplateName+"/navbar.html",
		h.ActiveTemplateLocation+"/"+h.ActiveTemplateName+"/contact.html", h.ActiveTemplateLocation+"/"+h.ActiveTemplateName+"/viewContent.html")

	h.Log.Debug("template error: ", tperr)
	h.Templates = template.Must(tp, tperr)
}
