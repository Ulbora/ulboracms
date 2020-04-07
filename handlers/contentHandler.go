package handlers

import (
	"net/http"
	"sort"

	sr "github.com/Ulbora/ulboracms/services"
	"github.com/gorilla/mux"
)

type pageList struct {
	Title          string
	MetaDesc       string
	MetaKeyWords   string
	MetaAuthor     string
	ContListByName *[]sr.Content
	ContListByDate *[]sr.Content
	Cont           *sr.Content
}

//Index  Index
func (h *CmsHandler) Index(w http.ResponseWriter, r *http.Request) {
	h.Log.Debug("template: ", h.Templates)
	vars := mux.Vars(r)
	name := vars["name"]
	if name != "favicon.ico" {
		if name == "" {
			h.Log.Debug("Setting name to home ")
			name = "home"
		}
		_, ires := h.Service.GetContent(name)
		h.Log.Debug("content in user index page ", name, " :", *ires)
		clist := h.Service.GetContentList(true)
		clistByDate := *clist
		sort.Slice(clistByDate, func(p, q int) bool {
			return (clistByDate)[p].CreateDate.After((clistByDate)[q].CreateDate)
		})
		h.Log.Debug("content list by date in user index page ", clistByDate)

		clistByName := *clist
		sort.Slice(clistByName, func(p, q int) bool {
			return clistByName[p].Name < clistByName[q].Name
		})
		h.Log.Debug("content list by date in user index page ", clistByDate)
		var pg pageList
		pg.ContListByDate = &clistByDate
		pg.ContListByName = &clistByName
		if ires.Visible {
			pg.Cont = ires
			pg.Title = ires.Title
			pg.MetaAuthor = ires.Author
			pg.MetaDesc = ires.MetaDesc
			pg.MetaKeyWords = ires.MetaKeyWords
		} else {
			if len(*clist) > 0 {
				pg.Cont = &(*clist)[0]
				pg.Title = (*clist)[0].Title
				pg.MetaAuthor = (*clist)[0].Author
				pg.MetaDesc = (*clist)[0].MetaDesc
				pg.MetaKeyWords = (*clist)[0].MetaKeyWords
			}
		}
		h.Service.HitCheck()
		// if c.HitTotal >= c.HitLimit {
		// 	c.SaveHits()
		// }
		//h.Log.Debug("content in index: ", *clist)
		//h.Log.Debug("content in pg: ", *pg.Cont)
		h.Templates.ExecuteTemplate(w, index, &pg)
	}
}

// //ViewPage ViewPage
// func (h *CmsHandler) ViewPage(w http.ResponseWriter, r *http.Request) {
// 	h.Log.Debug("template: ", h.Templates)
// 	vars := mux.Vars(r)
// 	name := vars["name"]
// 	_, res := h.Service.GetContent(name)
// 	h.Log.Debug("content in view Page: ", *res)
// 	if res.Visible {
// 		h.Templates.ExecuteTemplate(w, viewContent, &res)
// 	} else {
// 		http.Redirect(w, r, indexPage, http.StatusFound)
// 	}

// }
