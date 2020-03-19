package services

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"sync"
)

var mu sync.Mutex

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

//GetImagePath GetImagePath
func (c *CmsService) GetImagePath(imageName string) string {
	return c.ImagePath + string(filepath.Separator) + imageName
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
