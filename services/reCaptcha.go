package services

import (
	"encoding/json"
	"net/http"
	"time"
)

//Captcha Captcha
type Captcha struct {
	Secret   string `json:"secret"`
	Response string `json:"response"`
	Remoteip string `json:"remoteip"`
}

//CaptchaResponse res
type CaptchaResponse struct {
	Success     bool      `json:"success"`
	ChallengeTs time.Time `json:"challenge_ts"`
	Hostname    string    `json:"hostname"`
	ErrorCodes  []string  `json:"error-codes"`
	Code        int       `json:"code"`
}

//SendCaptchaCall SendCaptchaCall
func (c *CmsService) SendCaptchaCall(cap Captcha) *CaptchaResponse {
	var rtn = new(CaptchaResponse)
	if c.MockCaptcha {
		rtn.Success = c.MockCaptchaSuccess
		rtn.Code = c.MockCaptchaCode

	} else {
		var sURL = c.CaptchaHost + "?secret=" + cap.Secret + "&response=" + cap.Response + "&remoteip=" + cap.Remoteip

		req, rErr := http.NewRequest(http.MethodPost, sURL, nil)
		if rErr == nil {
			code := c.processServiceCall(req, &rtn)
			rtn.Code = code
		}
	}
	c.Log.Debug("CaptchaResponse: ", *rtn)
	return rtn
}

func (c *CmsService) processServiceCall(req *http.Request, obj interface{}) int {
	var code int
	client := &http.Client{}
	resp, cErr := client.Do(req)
	c.Log.Debug("resp in processServiceCall: ", resp)
	c.Log.Debug("cErr in processServiceCall: ", cErr)
	if cErr == nil {
		c.Log.Debug("resp.Body processServiceCall: ", resp.Body)
		defer resp.Body.Close()
		c.processResponse(resp, obj)
		code = resp.StatusCode
	} else {
		code = http.StatusBadRequest
	}
	c.Log.Debug("leaving processServiceCall ")
	return code
}

func (c *CmsService) processResponse(resp *http.Response, obj interface{}) bool {
	var rtn bool
	c.Log.Debug("in processResponse ")
	if resp != nil {
		decoder := json.NewDecoder(resp.Body)
		var err error
		if obj != nil {
			err = decoder.Decode(obj)
			c.Log.Debug("processResponse err: ", err)
		}
		if err == nil {
			rtn = true
		}
	} else {
		c.Log.Debug("response = nil in processResponse")
	}
	c.Log.Debug("leaving processResponse ")
	return rtn
}
