import axios from 'axios';
import * as fs from 'fs';


export async function get_version_pin_score(url:string[]): Promise<number>{
    //set up the url string Formatting
    //let splitURL:string[] = url.split("/");    
    //const GITHUB_TOKEN = 'YOUR_PAT';
    //const OWNER = splitURL[3];
    //const REPO = splitURL[4];

    
    const FILE_PATH = '/HEAD/package.json';
    const apiUrl = 'https://raw.githubusercontent.com/' + url[0] +'/' + url[1] + FILE_PATH;

    return new Promise ((resolve, reject) =>{
    axios.get(apiUrl)
    .then((response) => {
      if (response.status === 200) {
        const packageJson = response.data;

        //regexes 
        const fullPinnedEX = /^[0-9]*\.[0-9]*\.[0-9]*/;
        const majorMinorEX = /^[0-9]*\.[0-9]*\.[0-9]*/;

        //initialize counts 
        let count:number = 0;
        let fullPinned: number = 0;
        let majorMinor: number = 0;

        for (const i in packageJson.dependencies) {
          let curVer: string = packageJson.dependencies[i];
          count += 1;
          if(fullPinnedEX.test(curVer))
            fullPinned += 1;
          else if(majorMinorEX.test(curVer))
            majorMinor += 1;
        }
        let score:number;
        let correctlyPinned:number = (majorMinor + fullPinned);

        //calculate score
        if(count == 0)
          score = 1;
        else
          score = correctlyPinned/count;

        score = Math.trunc(score * 1000) / 1000;
        resolve(score);

      } else {
        console.error('Failed to fetch package.json');
        reject(-1);
      }
    })
    .catch((error) => {
      console.error('Error fetching package.json:', error);
      reject(-1);
    });
  });
  }
