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
		//h.Log.Debug("content in index: ", *clist)
		//h.Log.Debug("content in pg: ", *pg.Cont)
		h.Templates.ExecuteTemplate(w, index, &pg)
	}
}

//ViewPage ViewPage
func (h *CmsHandler) ViewPage(w http.ResponseWriter, r *http.Request) {
	h.Log.Debug("template: ", h.Templates)
	vars := mux.Vars(r)
	name := vars["name"]
	_, vres := h.Service.GetContent(name)
	h.Log.Debug("content in view Page: ", *vres)
	if vres.Visible {
		var pg pageList
		pg.Cont = vres
		pg.Title = vres.Title
		pg.MetaAuthor = vres.Author
		pg.MetaDesc = vres.MetaDesc
		pg.MetaKeyWords = vres.MetaKeyWords
		h.Templates.ExecuteTemplate(w, viewContent, &pg)
	} else {
		http.Redirect(w, r, indexPage, http.StatusFound)
	}
}

//BlogPosts BlogPosts
func (h *CmsHandler) BlogPosts(w http.ResponseWriter, r *http.Request) {
	var clistByDate []sr.Content
	clist := h.Service.GetContentList(true)
	h.Log.Debug("content bloo list by date in user index page ", *clist)
	for _, c := range *clist {
		if !c.Archived {
			clistByDate = append(clistByDate, c)
		}
	}
	//clistByDate := *clist
	sort.Slice(clistByDate, func(p, q int) bool {
		return (clistByDate)[p].CreateDate.After((clistByDate)[q].CreateDate)
	})
	var ppg pageList
	ppg.ContListByDate = &clistByDate
	if len(clistByDate) > 0 {
		ppg.Title = clistByDate[0].Title
		ppg.MetaAuthor = clistByDate[0].Author
		ppg.MetaDesc = clistByDate[0].MetaDesc
		ppg.MetaKeyWords = clistByDate[0].MetaKeyWords
	}
	h.Log.Debug("content blog list by date in user index page ", clistByDate)
	h.Templates.ExecuteTemplate(w, blogs, &ppg)
}

//ArchivedBlogPosts ArchivedBlogPosts
func (h *CmsHandler) ArchivedBlogPosts(w http.ResponseWriter, r *http.Request) {
	var aclistByDate []sr.Content
	aclist := h.Service.GetContentList(true)
	h.Log.Debug("content archived blog list by date in user index page ", *aclist)
	for _, ac := range *aclist {
		if ac.Archived {
			aclistByDate = append(aclistByDate, ac)
		}
	}
	//clistByDate := *clist
	sort.Slice(aclistByDate, func(p, q int) bool {
		return (aclistByDate)[p].CreateDate.After((aclistByDate)[q].CreateDate)
	})
	var appg pageList
	appg.ContListByDate = &aclistByDate
	if len(aclistByDate) > 0 {
		appg.Title = aclistByDate[0].Title
		appg.MetaAuthor = aclistByDate[0].Author
		appg.MetaDesc = aclistByDate[0].MetaDesc
		appg.MetaKeyWords = aclistByDate[0].MetaKeyWords
	}
	h.Log.Debug("content blog list by date in user index page ", aclistByDate)
	h.Templates.ExecuteTemplate(w, archivedBlogs, &appg)
}
