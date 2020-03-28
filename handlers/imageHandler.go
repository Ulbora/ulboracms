package handlers

import (
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"
)

//AdminAddImage AdminAddImage
func (h *CmsHandler) AdminAddImage(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in add content: ", loggedInAuth)
		if loggedInAuth == true {
			//res := h.Service.GetImageList()
			//h.Log.Debug("image list in content add: ", *res)
			h.AdminTemplates.ExecuteTemplate(w, imageUpload, nil)
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}

//AdminUploadImage AdminUploadImage
func (h *CmsHandler) AdminUploadImage(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in new content: ", loggedInAuth)
		if loggedInAuth == true {
			name := r.FormValue("name")
			h.Log.Debug("name in image upload: ", name)

			mperr := r.ParseMultipartForm(2000000)
			h.Log.Debug("ParseMultipartForm err: ", mperr)

			file, handler, ferr := r.FormFile("tempFile")
			h.Log.Debug("image file err: ", ferr)
			defer file.Close()
			h.Log.Debug("image file : ", *handler)

			data, rferr := ioutil.ReadAll(file)
			h.Log.Debug("read file  err: ", rferr)

			suc := h.Service.AddImage(handler.Filename, data)

			if suc {
				http.Redirect(w, r, adminImages, http.StatusFound)
			} else {
				h.Log.Debug("Image upload of " + handler.Filename + " failed")
				http.Redirect(w, r, adminImages, http.StatusFound)
			}
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}

//AdminImageList AdminImageList
func (h *CmsHandler) AdminImageList(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in add content: ", loggedInAuth)
		if loggedInAuth == true {
			res := h.Service.GetImageList()
			h.Log.Debug("image list in images: ", *res)
			h.AdminTemplates.ExecuteTemplate(w, images, &res)
		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}

//AdminDeleteImage AdminDeleteImage
func (h *CmsHandler) AdminDeleteImage(w http.ResponseWriter, r *http.Request) {
	s, suc := h.getSession(r)
	h.Log.Debug("session suc", suc)
	if suc {
		loggedInAuth := s.Values["loggedIn"]
		h.Log.Debug("loggedIn in delete image: ", loggedInAuth)
		if loggedInAuth == true {
			vars := mux.Vars(r)
			name := vars["name"]

			suc := h.Service.DeleteImage(name)
			h.Log.Debug("image delete in content delete: ", suc)

			http.Redirect(w, r, adminIndex, http.StatusFound)

		} else {
			http.Redirect(w, r, login, http.StatusFound)
		}
	}
}
