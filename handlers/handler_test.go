package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"testing"

	lg "github.com/Ulbora/Level_Logger"
)

type testObj struct {
	Valid bool   `json:"valid"`
	Code  string `json:"code"`
}

func TestCmsHandler_ProcessBody(t *testing.T) {
	var oh CmsHandler
	var l lg.Logger
	oh.Log = &l
	var robj testObj
	robj.Valid = true
	robj.Code = "3"
	// var res http.Response
	// res.Body = ioutil.NopCloser(bytes.NewBufferString(`{"valid":true, "code":"1"}`))
	var sURL = "http://localhost/test"
	aJSON, _ := json.Marshal(robj)
	r, _ := http.NewRequest("POST", sURL, bytes.NewBuffer(aJSON))
	var obj testObj
	suc, _ := oh.ProcessBody(r, nil)
	if suc || obj.Valid != false || obj.Code != "" {
		t.Fail()
	}
}
