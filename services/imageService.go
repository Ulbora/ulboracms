package services

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"sync"
)

var mu sync.Mutex

//Image Image
type Image struct {
	Name     string
	ImageURL string
}

//AddImage AddImage
func (c *CmsService) AddImage(name string, fileData []byte) bool {
	mu.Lock()
	defer mu.Unlock()
	var rtn bool
	c.Log.Debug("image file name in add: ", name)
	var imageName = c.ImagePath + string(filepath.Separator) + name
	c.Log.Debug("image complete file name in add: ", imageName)
	err := ioutil.WriteFile(imageName, fileData, 0644)
	if err == nil {
		rtn = true
	}
	return rtn
}

//GetImageList GetImageList
func (c *CmsService) GetImageList() *[]Image {
	var rtn []Image
	ifiles, err := ioutil.ReadDir(c.ImagePath)
	if err == nil {
		for _, ifile := range ifiles {
			if !ifile.IsDir() {
				//fmt.Println("sfile: ", sfile)
				var imgfile Image
				imgfile.Name = ifile.Name()
				imgfile.ImageURL = c.ImageFullPath + string(filepath.Separator) + ifile.Name()
				c.Log.Debug("image ImageURL in list: ", imgfile.ImageURL)
				rtn = append(rtn, imgfile)
			}
		}
	}
	return &rtn
}

//GetImagePath GetImagePath
func (c *CmsService) GetImagePath(imageName string) string {
	return c.ImageFullPath + string(filepath.Separator) + imageName
}

//DeleteImage DeleteImage
func (c *CmsService) DeleteImage(name string) bool {
	mu.Lock()
	defer mu.Unlock()
	var rtn bool
	var imageName = c.ImagePath + string(filepath.Separator) + name
	c.Log.Debug("image complete file name in delete: ", imageName)
	jerr := os.Remove(imageName)
	if jerr == nil {
		rtn = true
	}
	return rtn
}
