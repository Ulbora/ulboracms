package services

import (
	"bytes"
	"compress/zlib"
	"fmt"
	"io"
	"os"
	"testing"

	lg "github.com/Ulbora/Level_Logger"
	ds "github.com/Ulbora/json-datastore"
)

func TestCmsService_DownloadBackups(t *testing.T) {
	var cs CmsService
	cs.ContentStorePath = "./testBackup/contentStore"
	cs.TemplateStorePath = "./testBackup/templateStore"
	cs.ImagePath = "./testBackup/images"
	cs.TemplateFilePath = "./testBackup/templates"

	var l lg.Logger
	l.LogLevel = lg.AllLevel
	cs.Log = &l

	s := cs.GetNew()
	suc, f := s.DownloadBackups()
	if !suc || f == nil {
		t.Fail()
	}

	fileToWrite, err := os.OpenFile("./testBackupZips/compress.dat", os.O_CREATE|os.O_RDWR, os.FileMode(600))
	fmt.Println("fileToWrite err : ", err)
	var buf = bytes.NewBuffer(*f)

	//fmt.Println("compress file data: ", buf.Bytes())
	_, err2 := io.Copy(fileToWrite, buf)
	fmt.Println("io.copy err : ", err2)
	os.Chmod("./testBackupZips/compress.dat", os.FileMode(0666))

}

func TestCmsService_UploadBackups(t *testing.T) {

	fileData, rerr := os.ReadFile("./testBackupZips/compress.dat")
	fmt.Println(rerr)

	var b bytes.Buffer
	b.Write(fileData)
	r, err := zlib.NewReader(&b)
	if err == nil {
		var out bytes.Buffer
		io.Copy(&out, r)
		r.Close()
		rtn := out.Bytes()
		os.WriteFile("./testBackupZips/uncompress.json", rtn, 0644)
	}
	var cs CmsService
	cs.ContentStorePath = "./testBackupRestore/contentStore"
	cs.TemplateStorePath = "./testBackupRestore/templateStore"
	cs.ImagePath = "./testBackupRestore/images"
	cs.TemplateFilePath = "./testBackupRestore/templates"

	var cds ds.DataStore
	cds.Path = "./testBackupRestore/contentStore"
	cs.Store = cds.GetNew()

	var tds ds.DataStore
	tds.Path = "./testBackupRestore/templateStore"
	cs.TemplateStore = tds.GetNew()

	var l lg.Logger
	l.LogLevel = lg.AllLevel
	cs.Log = &l

	s := cs.GetNew()
	suc := s.UploadBackups(&fileData)
	if !suc {
		t.Fail()
	}
}
