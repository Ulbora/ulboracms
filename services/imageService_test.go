package services

import (
	"fmt"
	"io"
	"os"
	"strings"
	"testing"

	lg "github.com/Ulbora/Level_Logger"
)

var ci CmsService
var csi Service

func TestCmsService_AddImage(t *testing.T) {
	ci.ImagePath = "./testUploadImages"
	ci.ImageFullPath = "./testUploadImages"

	var l lg.Logger
	l.LogLevel = lg.AllLevel
	ci.Log = &l

	csi = ci.GetNew()
	imgfile, err := os.Open("./testImages/test.jpg")
	fmt.Println("imgfile: ", imgfile.Name())
	if err != nil {
		fmt.Println("jpg file not found!")
		os.Exit(1)
	}
	defer imgfile.Close()
	var originalFileName = imgfile.Name()
	i := strings.LastIndex(originalFileName, ".")
	var ext = string(originalFileName[i:])
	fmt.Println("ext: ", ext)
	data, err := io.ReadAll(imgfile)
	if err != nil {
		fmt.Println(err)
	}
	suc := csi.AddImage("testImage"+ext, data)
	if !suc {
		t.Fail()
	}
}

func TestCmsService_GetImagePath(t *testing.T) {
	fn := csi.GetImagePath("testImage.jpg")
	if fn != "./testUploadImages/testImage.jpg" {
		t.Fail()
	}
}

func TestCmsService_GetImageList(t *testing.T) {
	res := csi.GetImageList()
	fmt.Println("imageList: ", *res)
	if res == nil {
		t.Fail()
	}
}

func TestCmsService_DeleteImage(t *testing.T) {
	suc := csi.DeleteImage("testImage.jpg")
	if !suc {
		t.Fail()
	}
}
