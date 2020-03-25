package services

import (
	"archive/tar"
	"io"
	"os"
	"path/filepath"

	lg "github.com/Ulbora/Level_Logger"
	ml "github.com/Ulbora/go-mail-sender"
	ds "github.com/Ulbora/json-datastore"
)

//Service Service
type Service interface {
	AddContent(content *Content) *Response
	UpdateContent(content *Content) *Response
	GetContent(name string) (bool, *Content)
	GetContentList() *[]Content
	DeleteContent(name string) *Response

	AddImage(name string, fileData []byte) bool
	GetImagePath(imageName string) string
	DeleteImage(name string) bool

	SendMail(mailer *ml.Mailer) bool

	SendCaptchaCall(cap Captcha) *CaptchaResponse

	AddTemplate(tpl *Template) bool
	ActivateTemplate(name string) bool
	GetTemplateList() *[]Template
	DeleteTemplate(name string) bool

	ExtractFile(tFile *TemplateFile) bool
	DeleteTemplateFile(name string) bool

	UploadBackups(bk *[]byte) bool
	DownloadBackups() (bool, *[]byte)
}

//CmsService service
type CmsService struct {
	Store             ds.JSONDatastore
	TemplateStore     ds.JSONDatastore
	ContentStorePath  string
	TemplateStorePath string
	TemplateFilePath  string
	MailSender        ml.Sender
	Log               *lg.Logger
	ImagePath         string
	CaptchaHost       string
}

//GetNew GetNew
func (c *CmsService) GetNew() Service {
	var cs Service
	cs = c
	return cs
}

func (c *CmsService) extractTarGzFile(tr *tar.Reader, h *tar.Header, dest string) error {
	var rtn error
	fname := h.Name
	c.Log.Debug("fname in extractTarGzFile: ", fname)
	switch h.Typeflag {
	case tar.TypeDir:
		err := os.MkdirAll(dest+string(filepath.Separator)+fname, 0775)
		c.Log.Debug("MkdirAll in tar.TypeDir error in extractTarGzFile: ", err)
		c.Log.Debug("MkdirAll in tar.TypeDir name in extractTarGzFile: ", dest+string(filepath.Separator)+fname)
		rtn = err
	case tar.TypeReg:
		derr := os.MkdirAll(filepath.Dir(dest+string(filepath.Separator)+fname), 0775)
		rtn = derr
		c.Log.Debug("MkdirAll in tar.TypeReg error in extractTarGzFile: ", derr)
		c.Log.Debug("MkdirAll in tar.TypeReg dir name in extractTarGzFile: ", filepath.Dir(dest+string(filepath.Separator)+fname))
		if derr == nil {
			c.Log.Debug("MkdirAll in tar.TypeReg file name in extractTarGzFile: ", dest+string(filepath.Separator)+fname)
			writer, cerr := os.Create(dest + string(filepath.Separator) + fname)
			rtn = cerr
			c.Log.Debug("os.Create error in extractTarGzFile: ", cerr)
			if cerr == nil {
				io.Copy(writer, tr)
				err := os.Chmod(dest+string(filepath.Separator)+fname, 0664)
				c.Log.Debug("os.Chmod error in extractTarGzFile: ", err)
				rtn = err
				writer.Close()
			}
		}
	}
	return rtn
}
