package services

import (
	"testing"

	lg "github.com/Ulbora/Level_Logger"
	ml "github.com/Ulbora/go-mail-sender"
)

func TestCmsService_SendMail(t *testing.T) {
	var ci CmsService

	var l lg.Logger
	l.LogLevel = lg.AllLevel
	ci.Log = &l

	var ms ml.MockSecureSender
	ms.MockSuccess = true
	ci.MailSender = ms.GetNew()

	s := ci.GetNew()

	var m ml.Mailer
	m.Subject = "test"
	m.Body = "this is a test"
	m.Recipients = []string{"tester@tester.com"}
	m.SenderAddress = "somedude@sender.com"

	suc := s.SendMail(&m)
	if !suc {
		t.Fail()
	}

}
