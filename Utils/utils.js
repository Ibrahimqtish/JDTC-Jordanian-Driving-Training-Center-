require('dotenv').config()

function CheckUrl(url){
       const UrlAsList= url.split(":")
       if ((UrlAsList.length > 1) && (UrlAsList[0] =="http" || UrlAsList[0] == "https")){
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
        console.log("Host " , host)
        console.log("loop") 
             if (!CheckUrl(urls[i])){
                urls[i]="http://"+host+"/"+urls[i]
                result.push(urls[i])                     
             }
       }
       return result
}
function PraperSingleImage(url,host){
    if (url && !CheckUrl(url)){
      return "http://"+host+"/"+url                     
    }
    return url
}
function formatiFloatTime(time){
  let period  = "AM"
  let Houres = Math.floor(time) 
  let Minuts = ((time - Math.floor(time)) * 60)
  Minuts=Minuts.toFixed(0)
  if (Minuts.toString().length < 2)Minuts = "0" + Minuts
  if (time > 12){
     Houres = Houres - 12
     period="PM"
  } 
  return Houres+":"+Minuts +" "+period
}
module.exports={PraperSingleImage,PraperImage,formatiFloatTime}