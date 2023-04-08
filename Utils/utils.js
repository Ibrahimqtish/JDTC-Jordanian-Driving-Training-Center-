require('dotenv').config()

function CheckUrl(url){
       const UrlAsList= url.split(":")
       if ((UrlAsList.length > 1) && UrlAsList[0] =="http" || UrlAsList[0] == "https"){
         console.log(UrlAsList)    
         return true
       }
       else{
        console.log(UrlAsList)
        return false
       }
}
function PraperImage(urls,host){
       const result = []
       for (let i = 0; i < urls.length;i++){
        console.log("loop") 
             if (!CheckUrl(urls[i])){
                urls[i]="http://"+host+"/"+urls[i]                     
             }
       }
       return result
}
function PraperSingleImage(url,host){
    if (url && !CheckUrl(url)){
      return "http://"+host+"/"+url                     
    }
}
module.exports={PraperSingleImage,PraperImage}