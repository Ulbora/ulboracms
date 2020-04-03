package handlers

import (
	"net/http"
)

//AdminBackup AdminBackup
func (h *CmsHandler) AdminBackup(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in backups: ", loggedInAuth)
		if loggedInAuth == true {
			h.AdminTemplates.ExecuteTemplate(w, backups, nil)
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}

//AdminDownloadBackups AdminDownloadBackups
func (h *CmsHandler) AdminDownloadBackups(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in backups: ", loggedInAuth)
		if loggedInAuth == true {
			suc, file := h.Service.DownloadBackups()
			h.Log.Debug("download backup suc: ", suc)
			if suc {
				w.Header().Set("Content-Disposition", "attachment; filename="+h.BackupFileName)
				w.Header().Set("Content-Type", r.Header.Get("Content-Type"))
				w.Write(*file)
				//var buf = bytes.NewBuffer(*file)
				//io.Copy(w, buf)
				w.WriteHeader(http.StatusOK)
				// out, err := os.Create(h.BackupFileName)
				// if err == nil {
				// 	defer out.Close()
				// 	// Write the body to file
				// _, err = io.Copy(out, resp.Body)
				// }
			}
			//h.AdminTemplates.ExecuteTemplate(w, backups, nil)
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}
