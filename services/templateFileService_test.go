package services

import (
	"fmt"
	"io"
	"os"
	"testing"

	lg "github.com/Ulbora/Level_Logger"
)

func TestTemplateFileService_ExtractFile(t *testing.T) {
	var cs CmsService
	cs.TemplateFilePath = "./testDownloads"

	var l lg.Logger
	l.LogLevel = lg.AllLevel
	cs.Log = &l

	s := cs.GetNew()

	tf, err := os.Open("./testUploads/testTxt.tar.gz")
	if err != nil {
		fmt.Println("tar file not found!")
		os.Exit(1)
	}
	defer tf.Close()
	var ts TemplateFile
	ts.OriginalFileName = tf.Name()
	ts.Name = "newTemplate"
	data, err := io.ReadAll(tf)
	if err != nil {
		fmt.Println(err)
	} else {
		ts.FileData = data
	}
	fmt.Print("file name: ")
	fmt.Println(ts.OriginalFileName)
	res := s.ExtractFile(&ts)
	if res != true {
		t.Fail()
	}
}

func TestTemplateFileService_DeleteTemplate(t *testing.T) {
	var cs CmsService
	cs.TemplateFilePath = "./testDownloads"

	var l lg.Logger
	l.LogLevel = lg.AllLevel
	cs.Log = &l

	s := cs.GetNew()

	res := s.DeleteTemplateFile("newTemplate")
	if res != true {
		t.Fail()
	}
}
