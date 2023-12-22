import {promises} from "fs";

export const pathToDocs = async (dic: string, files?: string[]) => {
    let paths: string[] = [];

    if(!files)
        files = [];

    let filesList = await promises.readdir(dic);
    
    for(let file in filesList){
        console.log(dic + "/" + filesList[file]);
        paths.push(dic + "/" + filesList[file]);
    }
    
    console.log("paths: ",paths);
    return paths;
}