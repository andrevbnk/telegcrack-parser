const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const express = require("express");
const app = express();  



const urlTelecrack = `https://telegcrack.com/ru/found.php?offset=`;


const dbConfig = require('./db.config');

const author = dbConfig.AUTHOR;
const db = require("./models");
const Post = db.post;


db.mongoose
  .connect(`mongodb+srv://${dbConfig.HOST}:${dbConfig.PASSWORD}@cluster0.fmmbl.mongodb.net/${dbConfig.DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
  

const checkError = html=> cheerio.load(html)('b').first().text()=="Fatal error";
const sleep = (ms=60000) => new Promise((res,rej)=>setTimeout(res,ms));//Ставить задержку не меньше 30 секунд,

async function fetcher(url,ms) {
    try{
        const res = await axios.get(url);
        if(checkError(res.data)){
            console.log('Fatal Error');
            await sleep(ms);
            return fetcher(url);
        }
        return res.data;
    }
    catch(err){
        console.log('----------------------------------');
        console.log(err?.response?.status,err?.status);
        console.log('---------------------------------');
        if(err?.status == 404 || err?.response?.status==404){
            console.log('404');
            return false;
        }

        await sleep(ms);
        return fetcher(url)
    }

};

const checkAuthor = async post => {
    if(!post){
        return false
    }
    const $ = cheerio.load(await post);
    const authorName = $('address a').first().text();
    return authorName == author?true:false;
}

const getIndexList = async html =>{
 let href = [];
 const $ = cheerio.load(await html);
//  console.log(html);
 $('li a').each((i,elem)=>{
    //  console.log($(elem).text(),$(elem).text().length);
    if($(elem).text().length >= 8){
        href.push($(elem).attr('href'));
    }
 });
 return href;
}

(async function(){
    for(let pageCount of [...Array(365)].map((elem,i)=>i).slice(8,365)){
        await sleep(180000);
        console.log(urlTelecrack+pageCount);

        const pageHtml = await fetcher(urlTelecrack+pageCount,180000);
        // console.log(pageHtml, 'page');
        let allPosts = await getIndexList(pageHtml);
        console.log(allPosts);

        // const filterPost = []; // const filterPosts = await allPosts().filter(async elem=>await checkAuthor(await fetcher(elem)))); Оказывается filter с async нельзя писать,не работает, так что пришлось через циклы
        
        for (const linkPost of allPosts){
            const res = await fetcher(linkPost,1500);
            const check = await checkAuthor(res);
            console.log(check,linkPost)
            if(check){

                const postModel = new Post({
                    link:linkPost,
                    author:author,
                    pageTelecrack:pageCount,
                  });
                  
                postModel.save((err,data)=>{
                    if(err){
                        console.log('err');
                    }
                    console.log(data);
                  });

            }
        }

    }

})();


const server = app.listen(dbConfig.PORT, function() {
    console.log('server running on port '+PORT);
  });
