package services

import (
	"archive/tar"
	"compress/gzip"
	"io"
	"os"
	"path/filepath"
	"strings"
)

//TemplateFile TemplateFile
type TemplateFile struct {
	Name             string
	OriginalFileName string
	FileData         []byte
}

//ExtractFile extract
func (c *CmsService) ExtractFile(t *TemplateFile) bool {
	var rtn = false
	i := strings.Index(t.OriginalFileName, ".tar.gz")
	if i > -1 {
		var tmptFile = c.TemplateFilePath + string(filepath.Separator) + t.Name + ".tar.gz"
		fo, oerr := os.Create(tmptFile)
		c.Log.Debug("create temp tile error in extract file: ", oerr)
		if oerr == nil {
			s, werr := fo.Write(t.FileData)
			c.Log.Debug("write temp tile error in extract file: ", werr)
			if werr == nil {
				fo.Close()
				f, roerr := os.Open(tmptFile)
				c.Log.Debug("reopen temp tile error in extract file: ", roerr)
				if roerr == nil {
					c.Log.Debug("template saved, size: ", s)
					gzr, nrerr := gzip.NewReader(f)
					c.Log.Debug("new reader error in extract file: ", nrerr)
					if nrerr == nil {
						tr := tar.NewReader(gzr)
						for {
							hdr, err := tr.Next()
							c.Log.Debug("new reader next error in extract file: ", err)
							if err == io.EOF {
								break
							}
							eName := c.TemplateFilePath + string(filepath.Separator) + t.Name
							c.Log.Debug("eName in extract file: ", eName)
							err2 := c.extractTarGzFile(tr, hdr, eName)
							c.Log.Debug("extractTarGzFile error in extract file: ", err2)
						}
					}
					defer gzr.Close()
					f.Close()
					err3 := os.Remove(tmptFile)
					c.Log.Debug("tmptFile remove error in extract file: ", err3)
					if err3 == nil {
						rtn = true
					}
				}
			}
		}
	}
	return rtn
}

//DeleteTemplateFile delete template files
func (c *CmsService) DeleteTemplateFile(namedir string) bool {
	var rtn = false
	var tmptDir = c.TemplateFilePath + string(filepath.Separator) + namedir
	err := os.RemoveAll(tmptDir)
	c.Log.Debug("RemoveAll extractTarGzFile in DeleteTemplateFile: ", err)
	if err == nil {
		rtn = true
	}
	return rtn
}
