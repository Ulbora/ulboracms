package services

import (
	"encoding/json"
	"path/filepath"
	"sync"
)

// Template template
type Template struct {
	Name       string `json:"name"`
	Active     bool   `json:"active"`
	ScreenShot string `json:"screenShot"`
}

var tmu sync.Mutex

// AddTemplateFile AddTemplateFile
func (c *CmsService) AddTemplateFile(name string, originalFileName string, fileData []byte) bool {
	tmu.Lock()
	defer tmu.Unlock()
	var rtn bool
	c.Log.Debug("template file name in add: ", name)
	var tpl TemplateFile
	tpl.FileData = fileData
	tpl.Name = name
	tpl.OriginalFileName = originalFileName
	//c.Log.Debug("tpl in add: ", tpl)
	rtn = c.ExtractFile(&tpl)
	//var templateName = c.TemplateFilePath + string(filepath.Separator) + name
	//c.Log.Debug("template complete file name in add: ", templateName)
	//err := os.WriteFile(templateName, fileData, 0644)
	return rtn
}

// AddTemplate AddTemplate
func (c *CmsService) AddTemplate(tpl *Template) bool {
	var rtn bool
	c.Log.Debug("tpl template in add: ", *tpl)
	if tpl != nil && tpl.Name != "" {
		tpl.Active = false
		exis := c.TemplateStore.Read(tpl.Name)
		c.Log.Debug("existing template in add: ", *exis)
		if *exis == nil {
			rtn = c.TemplateStore.Save(tpl.Name, tpl)
			c.Log.Debug("template add suc: ", rtn)
		}
	}
	return rtn
}

// GetActiveTemplateName GetActiveTemplateName
func (c *CmsService) GetActiveTemplateName() string {
	var rtn string
	res := c.TemplateStore.ReadAll()
	//c.Log.Debug("tpls template get active: ", *res)
	for r := range *res {
		var t Template
		err := json.Unmarshal((*res)[r], &t)
		c.Log.Debug("found template in list: ", t)
		if err == nil && t.Active {
			rtn = t.Name
			break
		}
	}
	return rtn
}

// GetTemplateList GetTemplateList
func (c *CmsService) GetTemplateList() *[]Template {
	var rtn []Template
	res := c.TemplateStore.ReadAll()
	//c.Log.Debug("tpls template get list: ", *res)
	for r := range *res {
		var t Template
		err := json.Unmarshal((*res)[r], &t)
		c.Log.Debug("found template in list: ", t)
		if err == nil {
			t.ScreenShot = ".." + string(filepath.Separator) + "templates" + string(filepath.Separator) + t.Name + string(filepath.Separator) + "screenshot.png"
			rtn = append(rtn, t)
		}
	}
	return &rtn
}

// ActivateTemplate ActivateTemplate
func (c *CmsService) ActivateTemplate(name string) bool {
	var rtn bool
	res := c.TemplateStore.ReadAll()
	//c.Log.Debug("tpls template get list: ", *res)
	for r := range *res {
		var t Template
		err := json.Unmarshal((*res)[r], &t)
		c.Log.Debug("found template in list in activate: ", t)
		if err == nil {
			t.Active = false
			c.TemplateStore.Save(t.Name, t)
		}
	}
	etpl := c.TemplateStore.Read(name)
	if *etpl != nil {
		var t Template
		err := json.Unmarshal(*etpl, &t)
		c.Log.Debug("found template in activate: ", t)
		if err == nil {
			t.Active = true
			rtn = c.TemplateStore.Save(t.Name, t)
			c.Log.Debug("template activate suc: ", rtn)
		}
	}
	return rtn
}

// DeleteTemplate DeleteTemplate
func (c *CmsService) DeleteTemplate(name string) bool {
	var rtn bool
	detpl := c.TemplateStore.Read(name)
	if *detpl != nil {
		var t Template
		err := json.Unmarshal(*detpl, &t)
		c.Log.Debug("found template in delete: ", t)
		if err == nil {
			if !t.Active {
				rtn = c.TemplateStore.Delete(name)
				c.Log.Debug("template delete suc: ", rtn)
			}
		}
	}
	return rtn
}
