const fetchData = (url) => {
    return new Promise(async (resolve, reject) => {
        try{
            const data = await fetch(url);
            const json = await data.json();
            resolve(json);
        } catch(error){
            reject(error);
        }
    });
}

export default fetchData;
