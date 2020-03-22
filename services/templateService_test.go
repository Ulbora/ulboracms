package services

import (
	"testing"

	lg "github.com/Ulbora/Level_Logger"
	ds "github.com/Ulbora/json-datastore"
)

var cit CmsService
var csit Service

func TestCmsService_AddTemplate(t *testing.T) {

	var ds ds.DataStore
	ds.Path = "./testTemplateFiles"
	ds.Delete("temp1")
	cit.TemplateStore = ds.GetNew()

	var l lg.Logger
	l.LogLevel = lg.AllLevel
	cit.Log = &l

	csit = cit.GetNew()

	var tmp Template
	tmp.Name = "temp1"
	suc := csit.AddTemplate(&tmp)
	if !suc {
		t.Fail()
	}
}

func TestCmsService_GetTemplateList(t *testing.T) {
	tlist := csit.GetTemplateList()
	if len(*tlist) != 2 {
		t.Fail()
	}
}

func TestCmsService_ActivateTemplate(t *testing.T) {
	suc := csit.ActivateTemplate("temp1")
	if !suc {
		t.Fail()
	}
}

func TestCmsService_DeleteTemplate(t *testing.T) {
	suc := csit.DeleteTemplate("temp1")
	if suc {
		t.Fail()
	}
}

func TestCmsService_ActivateTemplat2e(t *testing.T) {
	suc := csit.ActivateTemplate("temp2")
	if !suc {
		t.Fail()
	}
}

func TestCmsService_DeleteTemplate2(t *testing.T) {
	suc := csit.DeleteTemplate("temp1")
	if !suc {
		t.Fail()
	}
}
