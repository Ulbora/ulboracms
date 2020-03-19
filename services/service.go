package services

import (
	lg "github.com/Ulbora/Level_Logger"
	ds "github.com/Ulbora/json-datastore"
)

//Service Service
type Service interface {
	AddContent(content *Content) *Response
	UpdateContent(content *Content) *Response
	GetContent(name string) (bool, *Content)
	GetContentList() *[]Content
	//DeleteContent(name string) *Response
}

//CmsService service
type CmsService struct {
	Store ds.JSONDatastore
	Log   *lg.Logger
}

//GetNew GetNew
func (c *CmsService) GetNew() Service {
	var cs Service
	cs = c
	return cs
}
