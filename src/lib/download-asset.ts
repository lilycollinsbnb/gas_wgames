export function download(fileUrl: string, fileName?: string, ) {
    var a = document.createElement('a');
    a.href = fileUrl;
    if(fileName){
        a.setAttribute('download', `${fileName}`);
    }
    a.click();
 }