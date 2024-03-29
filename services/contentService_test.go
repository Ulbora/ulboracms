package services

import (
	"fmt"
	"testing"

	lg "github.com/Ulbora/Level_Logger"
	ds "github.com/Ulbora/json-datastore"
)

var c CmsService
var cs Service

func TestContentService_AddContent(t *testing.T) {

	var ds ds.DataStore
	ds.Path = "./testFiles"
	ds.Delete("books1")
	c.Store = ds.GetNew()

	var l lg.Logger
	l.LogLevel = lg.AllLevel
	c.Log = &l

	cs = c.GetNew()

	var ct Content
	ct.Name = "books1"
	ct.Author = "ken"
	ct.MetaAuthorName = "ken"
	ct.MetaDesc = "a book"
	ct.Text = "some book text"
	ct.Title = "the best book ever"
	ct.Visible = true
	res := cs.AddContent(&ct)
	fmt.Println("add suc: ", res)
	if !res.Success {
		t.Fail()
	}
}

func TestContentService_AddContentExist(t *testing.T) {

	var ct Content
	ct.Name = "books1"
	ct.MetaAuthorName = "ken"
	ct.MetaDesc = "a book"
	ct.Text = "some book text"
	ct.Title = "the best book ever"
	suc := cs.AddContent(&ct)
	if suc.Success || suc.FailCode != 1001 {
		t.Fail()
	}
}

func TestContentService_UpdateContent(t *testing.T) {

	var ct Content
	ct.Name = "books1"
	ct.MetaAuthorName = "ken test stuff"
	ct.MetaDesc = "a booktest stuff"
	ct.Text = "some book text test stuff"
	ct.Title = "the best book ever ever"
	ct.Visible = true
	res := cs.UpdateContent(&ct)
	fmt.Println("update suc: ", res)
	if !res.Success {
		t.Fail()
	}
}

func TestContentService_UpdateContentNotExist(t *testing.T) {

	var ct Content
	ct.Name = "books11"
	ct.MetaAuthorName = "ken test stuff"
	ct.MetaDesc = "a booktest stuff"
	ct.Text = "some book text test stuff"
	ct.Title = "the best book ever ever"
	res := cs.UpdateContent(&ct)
	fmt.Println("update suc: ", res)
	if res.Success || res.FailCode != contentNotFoundCode {
		t.Fail()
	}
}

func TestContentService_GetContent(t *testing.T) {
	suc, res := cs.GetContent("books1")
	fmt.Println("get Content suc: ", suc)
	fmt.Println("get Content: ", res)
	fmt.Println("get Content total hits: ", c.HitTotal)
	fmt.Println("get Content books1 hits: ", c.ContentHits["books1"])
	if !suc || res.Text != "some book text test stuff" || c.HitTotal != 1 || c.ContentHits["books1"] != 1 {
		t.Fail()
	}
}

func TestContentService_GetContent2(t *testing.T) {
	suc, res := cs.GetContent("books1")
	fmt.Println("get Content suc: ", suc)
	fmt.Println("get Content: ", res)
	fmt.Println("get Content total hits: ", c.HitTotal)
	fmt.Println("get Content books1 hits: ", c.ContentHits["books1"])
	if !suc || res.Text != "some book text test stuff" || c.HitTotal != 2 || c.ContentHits["books1"] != 2 {
		t.Fail()
	}
}

func TestContentService_GetContentFail(t *testing.T) {
	suc, res := cs.GetContent("books11")
	fmt.Println("get Content failed success: ", suc)
	fmt.Println("get Content failed: ", res)
	if suc {
		t.Fail()
	}
}

func TestContentService_GetContentList(t *testing.T) {
	res := cs.GetContentList(false)
	fmt.Println("get Content List: ", *res)
	if *res == nil || len(*res) < 1 {
		t.Fail()
	}
}

func TestContentService_GetContentListNotVisible(t *testing.T) {
	res := cs.GetContentList(true)
	fmt.Println("get Content List: ", *res)
	if *res == nil || len(*res) < 1 {
		t.Fail()
	}
}

func TestContentService_DeleteContent(t *testing.T) {
	res := cs.DeleteContent("books1")
	fmt.Println("delete Content: ", *res)
	if !res.Success {
		t.Fail()
	}
}

func TestContentService_DeleteContent2(t *testing.T) {
	res := c.DeleteContent("books1")
	fmt.Println("delete Content 2: ", *res)
	if res.Success {
		t.Fail()
	}
}

func TestCmsService_SaveHits(t *testing.T) {
	var cmsc CmsService

	var ds ds.DataStore
	ds.Path = "./testFiles"
	cmsc.Store = ds.GetNew()

	var l lg.Logger
	l.LogLevel = lg.AllLevel
	cmsc.Log = &l

	cmsc.HitLimit = 4
	cmsc.HitTotal = 4

	cmss := cmsc.GetNew()

	var ct Content
	ct.Name = "books100"
	ct.Author = "ken"
	ct.MetaAuthorName = "ken"
	ct.MetaDesc = "a book"
	ct.Text = "some book text"
	ct.Title = "the best book ever"
	ct.Visible = true
	res := cmss.AddContent(&ct)

	ct.Name = "books200"
	res2 := cmss.AddContent(&ct)

	fmt.Println("add in save hits: ", res.Success)
	fmt.Println("add in save hits2: ", res2.Success)
	cmsc.ContentHits["books100"] = 4
	cmsc.ContentHits["books200"] = 1

	cmss.HitCheck()

	// if cmsc.HitTotal >= cmsc.HitLimit {
	// 	cmss.SaveHits()
	// }
	_, b1 := cmss.GetContent("books100")
	fmt.Println("b1: ", *b1)
	fmt.Println("b1.Hits: ", b1.Hits)
	fmt.Println("cmsc.HitTotal: ", cmsc.HitTotal)
	if cmsc.HitTotal != 1 || b1.Hits != 4 {
		t.Fail()
	}
	cmss.DeleteContent("books100")
	cmss.DeleteContent("books200")

}
