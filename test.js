const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = `https://telegcrack.com/ru/found.php?offset=`;


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
const sleep = (ms=60000) => new Promise((res,rej)=>setTimeout(res,ms)); //Ставить задержку не меньше 60 секунд, иначе сайт упадёт минимум на 3 часа 

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

(async function(){



    const res = await fetcher('https://telegra.ph/YAponskie-svechi-Modeli-yaponskih-svechej-12-15',1500);
const check = await checkAuthor(res);
console.log(check);
if(check){

                          

}
})();

