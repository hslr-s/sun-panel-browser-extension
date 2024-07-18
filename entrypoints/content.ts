
export default defineContentScript({
  matches: ['*'],
  main() {
    browser.contextMenus.create({title:"将网页添加到 Sun-Panel",visible:true},()=>{
      
    })
    console.log('Hello content.');
  },
});

 

// const menu:Menus.CreateCreatePropertiesType={}
// browser.contextMenus.create()