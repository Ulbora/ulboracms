//Package handlers ...
package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	lg "github.com/Ulbora/Level_Logger"
)

//LogLevel LogLevel
type LogLevel struct {
	Level string `json:"logLevel"`
}

//LogResponse LogResponse
type LogResponse struct {
	Success  bool   `json:"success"`
	LogLevel string `json:"logLevel"`
}

const (
	defaultLoggingKey = "45sdbb2345"

	debugLevel = "DEBUG"
	infoLevel  = "INFO"
	allLevel   = "ALL"
	offLevel   = "OFF"
)

//SetLogLevel SetLogLevel
func (h *CmsHandler) SetLogLevel(w http.ResponseWriter, r *http.Request) {
	var logRes LogResponse
	h.SetContentType(w)
	logContOk := h.CheckContent(r)

	//fmt.Println("conOk: ", logContOk)

	if !logContOk {
		http.Error(w, "json required", http.StatusUnsupportedMediaType)
	} else {
		var loggingKey string
		if os.Getenv("LOGGING_KEY") != "" {
			loggingKey = os.Getenv("LOGGING_KEY")
		} else {
			loggingKey = defaultLoggingKey
		}
		loggingKeyHdr := r.Header.Get("Logging_KEY")
		if loggingKey == loggingKeyHdr {
			var lv LogLevel
			lgsuc, lgerr := h.ProcessBody(r, &lv)
			//fmt.Println("lgsuc: ", lgsuc)
			//fmt.Println("LogLevel: ", lv)
			//fmt.Println("lgerr: ", lgerr)
			if !lgsuc && lgerr != nil {
				http.Error(w, lgerr.Error(), http.StatusBadRequest)
			} else {
				switch strings.ToUpper(lv.Level) {
				case debugLevel:
					h.Log.LogLevel = lg.DebugLevel
					logRes.Success = true
					logRes.LogLevel = debugLevel
				case infoLevel:
					h.Log.LogLevel = lg.InfoLevel
					logRes.Success = true
					logRes.LogLevel = infoLevel
				case allLevel:
					h.Log.LogLevel = lg.AllLevel
					logRes.Success = true
					logRes.LogLevel = allLevel
				case offLevel:
					h.Log.LogLevel = lg.OffLevel
					logRes.Success = true
					logRes.LogLevel = offLevel
				}
			}
		} else {
			w.WriteHeader(http.StatusUnauthorized)
		}
		resJSON, _ := json.Marshal(logRes)
		fmt.Fprint(w, string(resJSON))
	}
}
