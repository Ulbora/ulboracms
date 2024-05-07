package handlers

import (
	"io"
	"net/http"
)

// AdminBackup AdminBackup
func (h *CmsHandler) AdminBackup(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Get("loggedIn")
		h.Log.Debug("loggedIn in backups: ", loggedInAuth)
		if loggedInAuth == true {
			h.AdminTemplates.ExecuteTemplate(w, backups, nil)
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}

// AdminBackupUpload AdminBackupUpload
func (h *CmsHandler) AdminBackupUpload(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Get("loggedIn")
		h.Log.Debug("loggedIn in backups: ", loggedInAuth)
		if loggedInAuth == true {
			h.AdminTemplates.ExecuteTemplate(w, backupUpload, nil)
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}

// AdminDownloadBackups AdminDownloadBackups
func (h *CmsHandler) AdminDownloadBackups(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Get("loggedIn")
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
				//w.WriteHeader(http.StatusOK)
				// out, err := os.Create(h.BackupFileName)
				// if err == nil {
				// 	defer out.Close()
				// 	// Write the body to file
				// _, err = io.Copy(out, resp.Body)
				// }
			}
			//http.Redirect(w, r, adminBackups, http.StatusFound)
			//h.AdminTemplates.ExecuteTemplate(w, backups, nil)
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}

// AdminUploadBackups AdminUploadBackups
func (h *CmsHandler) AdminUploadBackups(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		bkloggedInAuth := s.Get("loggedIn")
		h.Log.Debug("loggedIn in new content: ", bkloggedInAuth)
		if bkloggedInAuth == true {

			bkerr := r.ParseMultipartForm(50000000)
			h.Log.Debug("ParseMultipartForm err: ", bkerr)

			file, handler, ferr := r.FormFile("backupFile")
			if ferr == nil {
				defer file.Close()
			}
			h.Log.Debug("backup file err: ", ferr)

			//h.Log.Debug("image file : ", *handler)

			bkdata, rferr := io.ReadAll(file)
			h.Log.Debug("read file  err: ", rferr)

			h.Log.Debug("handler.Filename: ", handler.Filename)
			var suc bool
			if ferr == nil && rferr == nil {
				suc = h.Service.UploadBackups(&bkdata)
			}

			if suc {
				h.LoadTemplate()
				http.Redirect(w, r, adminBackups, http.StatusFound)
			} else {
				h.Log.Debug("backup upload of " + handler.Filename + " failed")
				http.Redirect(w, r, adminBackups, http.StatusFound)
			}
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}
