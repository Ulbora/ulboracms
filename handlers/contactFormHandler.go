package handlers

import (
	"net"
	"net/http"

	ml "github.com/Ulbora/go-mail-sender"
	sr "github.com/Ulbora/ulboracms/services"
)

type captchaData struct {
	CaptchaDataSitekey string
}

//ContactForm ContactForm
func (h *CmsHandler) ContactForm(w http.ResponseWriter, r *http.Request) {
	h.Log.Debug("template: ", h.AdminTemplates)
	var cp captchaData
	cp.CaptchaDataSitekey = h.CaptchaDataSitekey
	h.Log.Debug("CaptchaDataSitekey: ", cp.CaptchaDataSitekey)
	h.Templates.ExecuteTemplate(w, contactForm, &cp)
}

//ContactFormSend ContactFormSend
func (h *CmsHandler) ContactFormSend(w http.ResponseWriter, r *http.Request) {
	var proceed bool
	var sendSuc bool

	fromEmail := r.FormValue("fromEmail")
	h.Log.Debug("fromEmail in contact: ", fromEmail)
	//fmt.Println("fromEmail: ", fromEmail)

	text := r.FormValue("text")
	h.Log.Debug("text in contact: ", text)
	//fmt.Println("text: ", text)

	recaptchaResp := r.FormValue("g-recaptcha-response")
	h.Log.Debug("recaptchaResp in new content: ", recaptchaResp)
	if recaptchaResp != "" {
		// do recaptcha
		var ipAddr string

		addrs, _ := net.InterfaceAddrs()
		for _, a := range addrs {
			if ipnet, ok := a.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
				if ipnet.IP.To4() != nil {
					ipAddr = ipnet.IP.String()
					break
				}
			}
		}
		h.Log.Debug("ipAddr in contact: ", ipAddr)

		h.Log.Debug("captcha secret in contact: ", h.CaptchaSecret)
		var cap sr.Captcha
		cap.Remoteip = ipAddr
		cap.Secret = h.CaptchaSecret
		cap.Response = recaptchaResp
		res := h.Service.SendCaptchaCall(cap)
		if res.Success {
			proceed = true
		}
		h.Log.Debug("proceed in contact: ", proceed)
	}
	if proceed {
		h.Log.Debug("ContactMailSubject in contact: ", h.ContactMailSubject)
		h.Log.Debug("ContactMailSenderAddress in contact: ", h.ContactMailSenderAddress)
		var m ml.Mailer
		m.Subject = h.ContactMailSubject
		m.Body = text
		m.Recipients = []string{h.ContactMailSenderAddress}
		m.SenderAddress = fromEmail

		sendSuc = h.Service.SendMail(&m)
		h.Log.Debug("sendSuc in contact: ", sendSuc)
	}
	http.Redirect(w, r, indexPage, http.StatusFound)
}
