package services

import (
	"fmt"
	"net/http"
	"testing"

	lg "github.com/Ulbora/Level_Logger"
)

func TestCaptchaService_SendCaptchaCall(t *testing.T) {
	var ci CmsService

	var l lg.Logger
	l.LogLevel = lg.AllLevel
	ci.Log = &l

	//var c CaptchaService
	ci.CaptchaHost = "https://www.google.com/recaptcha/api/siteverify"

	c := ci.GetNew()
	var cp Captcha
	cp.Secret = "abaap"
	cp.Remoteip = "10.0.0.1"
	cp.Response = "lsljdiididi"

	res := c.SendCaptchaCall(cp)
	fmt.Println("Google ReCaptcha Resp: ", res)
	if res.Success == true {
		t.Fail()
	}
}

func TestCaptchaService_processServiceCall(t *testing.T) {
	var ci CmsService

	var l lg.Logger
	l.LogLevel = lg.AllLevel
	ci.Log = &l

	req, rErr := http.NewRequest(http.MethodPost, "//", nil)
	fmt.Println("rErr: ", rErr)
	code := ci.processServiceCall(req, nil)
	fmt.Println("code: ", code)
	if code != 400 {
		t.Fail()
	}
}

func TestCmsService_processResponse(t *testing.T) {
	var ci CmsService

	var l lg.Logger
	l.LogLevel = lg.AllLevel
	ci.Log = &l

	suc := ci.processResponse(nil, nil)
	if suc {
		t.Fail()
	}
}
