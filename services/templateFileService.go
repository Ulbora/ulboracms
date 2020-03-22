package services

//TemplateFile TemplateFile
type TemplateFile struct {
	Name             string
	OriginalFileName string
	FileData         []byte
	Destination      string
}

// //ExtractFile extract
// func (t *TemplateFileService) ExtractFile() bool {
// 	var rtn = false
// 	i := strings.Index(t.OriginalFileName, ".tar.gz")
// 	if i > -1 {
// 		var tmptFile = t.Destination + string(filepath.Separator) + t.Name + ".tar.gz"
// 		fo, err := os.Create(tmptFile)
// 		if err != nil {
// 			fmt.Println(err)
// 		} else {
// 			s, err := fo.Write(t.FileData)
// 			if err != nil {
// 				fmt.Println(err)
// 				fo.Close()
// 			} else {
// 				fo.Close()
// 				f, err := os.Open(tmptFile)
// 				if err != nil {
// 					fmt.Println(err)
// 				}
// 				fmt.Print("template saved, size: ")
// 				fmt.Println(s)
// 				gzr, err := gzip.NewReader(f)
// 				if err != nil {
// 					fmt.Println(err)
// 				} else {
// 					tr := tar.NewReader(gzr)
// 					for {
// 						hdr, err := tr.Next()
// 						if err == io.EOF {
// 							break
// 						} else if err != nil {
// 							fmt.Println(err)
// 							break
// 						}
// 						eName := t.Destination + string(filepath.Separator) + t.Name
// 						err2 := extractTarGzFile(tr, hdr, eName)
// 						if err2 != nil {
// 							fmt.Print("File extract Error: ")
// 							fmt.Println(err2)
// 							break
// 						}
// 					}
// 				}
// 				defer gzr.Close()
// 				f.Close()
// 				//fmt.Print("removing: ")
// 				//fmt.Println(tmptFile)
// 				err3 := os.Remove(tmptFile)
// 				if err3 != nil {
// 					fmt.Print("File remove Error: ")
// 					fmt.Println(err)
// 				} else {
// 					rtn = true
// 				}
// 			}
// 		}
// 	}
// 	return rtn
// }
// func extractTarGzFile(tr *tar.Reader, h *tar.Header, dest string) error {
// 	var rtn error
// 	fname := h.Name
// 	//fmt.Print("file: ")
// 	//fmt.Println(h.Name)
// 	switch h.Typeflag {
// 	case tar.TypeDir:
// 		err := os.MkdirAll(dest+string(filepath.Separator)+fname, 0775)
// 		if err != nil {
// 			fmt.Println(err)
// 			rtn = err
// 		}
// 	case tar.TypeReg:
// 		err := os.MkdirAll(filepath.Dir(dest+string(filepath.Separator)+fname), 0775)
// 		if err != nil {
// 			fmt.Println(err)
// 		}
// 		//fmt.Println("Untarring :", fname)
// 		writer, err := os.Create(dest + string(filepath.Separator) + fname)
// 		if err != nil {
// 			fmt.Println(err)
// 			rtn = err
// 		}
// 		io.Copy(writer, tr)
// 		err = os.Chmod(dest+string(filepath.Separator)+fname, 0664)
// 		if err != nil {
// 			fmt.Println(err)
// 			rtn = err
// 		}
// 		writer.Close()
// 	}
// 	return rtn
// }

// //DeleteTemplate delete template files
// func (t *TemplateFileService) DeleteTemplate() bool {
// 	var rtn = false
// 	var tmptDir = t.Destination + string(filepath.Separator) + t.Name
// 	//fmt.Print("deleting :")
// 	//fmt.Println(tmptDir)
// 	err := os.RemoveAll(tmptDir)
// 	if err != nil {
// 		fmt.Print("delete template dir error: ")
// 		fmt.Println(err)
// 	} else {
// 		rtn = true
// 	}
// 	return rtn
// }
