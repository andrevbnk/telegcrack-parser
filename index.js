const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const html = require('./html');

const url = `https://telegcrack.com/ru/found.php?offset=`;
let pageCount = 33;
const author = "Cat Cat";


const checkError = html=> cheerio.load(html)('b').first().text()=="Fatal error";
const sleep = (ms=10000) => new Promise((res,rej)=>setTimeout(res,ms));//Ставить задержку не меньше 5 секунд,

const fetcher = async url => {
    const res = await axios.get(url);
    if(checkError(res.data)){
        await sleep(10000);
        fetcher(url);
    }
    return res.data;
};

const checkAuthor = async post => {
    const $ = cheerio.load(await post);
    const authorName = $('address a').first().text();
    return authorName == author?true:false;
}

const getIndexList = async html =>{
 let href = [];
 const $ = cheerio.load(await html);
//  console.log(html);
 $('li a').each((i,elem)=>{
    href.push($(elem).attr('href'));
 });
 return href;
}

(async function(){
    const pageHtml = await fetcher(url+pageCount);

    const allPosts = await getIndexList(pageHtml);
    const filterPost = []; // const filterPosts = await allPosts().filter(async elem=>await checkAuthor(await fetcher(elem)))); Оказывается filter с async нельзя писать,не работает, так что пришлось через циклы
    for( const linkPost of allPosts){
        const res = await fetcher(linkPost);
        const check = await checkAuthor(res);
        if(check){
            filterPost.push(linkPost);
        }
    }
    console.log(filterPost);
    fs.appendFile("html.txt",filterPost,(err)=>{
        if(err){
            throw error;
        }
    });

})();
