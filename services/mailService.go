package services

import ml "github.com/Ulbora/go-mail-sender"

//SendMail SendMail
func (c *CmsService) SendMail(mailer *ml.Mailer) bool {
	var rtn bool
	c.Log.Debug("mailer in SendMail: ", *mailer)
	rtn = c.MailSender.SendMail(mailer)
	c.Log.Debug("SendMail success: ", rtn)
	return rtn
}
