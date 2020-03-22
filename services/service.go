package services

import (
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

	// ExtractFile(tFile *TemplateFile) bool
	// DeleteTemplateFile(name string) bool
}

//CmsService service
type CmsService struct {
	Store         ds.JSONDatastore
	TemplateStore ds.JSONDatastore
	MailSender    ml.Sender
	Log           *lg.Logger
	ImagePath     string
	CaptchaHost   string
}

//GetNew GetNew
func (c *CmsService) GetNew() Service {
	var cs Service
	cs = c
	return cs
}
