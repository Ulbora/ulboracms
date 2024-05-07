package services

import (
	"fmt"
	"io"
	"os"
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
	if len(*tlist) < 1 {
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

func TestCmsService_AddTemplateFile(t *testing.T) {
	ci.TemplateFilePath = "./testUploadTemplates"
	//ci.ImageFullPath = "./testUploadTemplates"

	var l lg.Logger
	l.LogLevel = lg.AllLevel
	ci.Log = &l

	csi = ci.GetNew()
	tmpfile, err := os.Open("./testUploads/testTxt.tar.gz")
	fmt.Println("tmpfile: ", tmpfile.Name())
	if err != nil {
		fmt.Println("tmp file not found!")
		os.Exit(1)
	}
	defer tmpfile.Close()
	var originalFileName = tmpfile.Name()
	//i := strings.Index(originalFileName, ".")
	//var fileName = string(originalFileName[:i])
	fmt.Println("originalFileName in add template file: ", originalFileName)
	//fmt.Println("fileName in add template file: ", fileName)
	data, err := io.ReadAll(tmpfile)
	if err != nil {
		fmt.Println(err)
	}
	suc := csi.AddTemplateFile("testTxt", originalFileName, data)
	if !suc {
		t.Fail()
	}
}

func TestCmsService_GetActiveTemplateName(t *testing.T) {
	var cs CmsService

	var ds ds.DataStore
	ds.Path = "./testTemplateFiles"
	cs.TemplateStore = ds.GetNew()

	var l lg.Logger
	l.LogLevel = lg.AllLevel
	cs.Log = &l

	s := cs.GetNew()

	name := s.GetActiveTemplateName()
	fmt.Println("active template name: ", name)
	if name == "" {
		t.Fail()
	}
}
