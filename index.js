const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const html = require('./html');

const url = `https://telegcrack.com/ru/found.php?offset=`;
let pageCount = 33;
const author = "Cat Cat";


const fetcher = async url => {
    const res = await axios.get(url);
    return res.data;
};

const checkAuthor = async post => {
    const x = cheerio.load(await post);
    const authorName = x('address a').first().text();
    return authorName == author?true:false;
}

const getIndexList = async html =>{
 let href = [];
 const $ = cheerio.load(await html);
 $('li a').each((i,elem)=>{
    href.push($(elem).attr('href'));
 });
//  href = href.slice(20,30);
 console.log(href,"  --- href");
 return href;
}

(async function(){
    const res = await fetcher(url+pageCount);
    const pageHtml = res.data;

    const allPosts = await getIndexList(pageHtml);
    const filterPost = []; // const filterPosts = await allPosts().filter(async elem=>await checkAuthor(await fetcher(elem)))); Оказывается filter с async нельзя писать,не работает, так что пришлось через циклы
    for( const linkPost of allPosts){
        const res = await fetcher(linkPost);
        const check = await checkAuthor(res);
        if(check){
            filterPost.push(linkPost);
        }
    }

})();
