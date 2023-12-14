'use strict';

import { Request, Response } from 'express';
import { respondWithCode } from '../utils/writer'; // Import the response function
import type { AuthenticationRequest, AuthenticationToken, PackageName, PackageRegEx, PackageData, PackageMetadata, PackageID, PackageRating, Package, List, newUser } from '../utils/types';
import * as path from 'path';
import { satisfies } from 'compare-versions';
import {
  ConnectionOptions,
  ResultSetHeader,
  RowDataPacket,
  ProcedureCallPacket
} from 'mysql2/promise';
import * as jwt from "jsonwebtoken";
import * as authHelper from '../authentication/authenticationHelper';
const cheerio = require('cheerio');

const { db, promisePool } = require("../database_files/database_connect");

// const queryAsync = util.promisify(pool.query);

/**
 * Create an access token.
 *
 * @param body AuthenticationRequest 
 * @returns AuthenticationToken
 **/
export async function CreateAuthToken(body: AuthenticationRequest) {
    //console.log("authentication endpoint hit");
    if (authHelper.getAuthEnable() == '0') {
      return respondWithCode(501, "This system does not support authentication.");
    }
    //console.log("User: " + body.User.name + " pass: " + body.Secret.password);
  
    // get user credentials
    const username = body.User.name;
    const password = body.Secret.password;
  

    //make database access

    const [result, fields] = await promisePool.execute('SELECT * FROM Auth WHERE user = ?', [username]);
    //console.log("result at service: " + JSON.stringify(result));
    //console.log("fields at service: " + JSON.stringify(fields));
    if(result.length == 0) {
      //console.log("AUTH:", authHelper.getAuthEnable())
      return respondWithCode(401, "User is not in database");
    }

    //console.log("result: " + JSON.stringify(result));
    //console.log("AUTH TABLE ROW: " + JSON.stringify(result));

    // If credentials are valid, create a JWT with permissions that correspond to that of the user
    //console.log("password check: incoming = " + password + " database = "+ result[0].pass);
    if (password === result[0].pass) {

      //create a jwt that contains relevant user permissions
      const token = authHelper.createToken({ 
        user: username, 
        pass: result[0].pass,
        isAdmin: result[0].isAdmin, 
        canSearch: result[0].canSearch,
        canUpload: result[0].canUpload,
        canDownload: result[0].canDownload
      });

      return respondWithCode(200, "\"bearer "+ token + "\"");

    } else {
      //console.log("bad password");
      //console.log("Given pw: " + password);
      //console.log("DB pw:    " + result[0].pass);
      return respondWithCode(401, "User exists. Wrong password");
    }

  return ''; // You can return the actual value here
}

/**
 * Delete all versions of this package.
 *
 * @param xAuthorization AuthenticationToken 
 * @param name PackageName 
 * @returns void
 **/



export async function PackageByNameGet(name: PackageName, xAuthorization: AuthenticationToken) {
  var query = 'SELECT * FROM PackageMetadata WHERE Name = ?';

  try {
    const [rows, fields] = await db.promise().execute(query, [name]);

    console.log('Results:', rows);

    if (rows.length > 0) {
      // Construct an array of packages in the desired format
      const output = rows.map((pkg: RowDataPacket) => ({
        User: {
          name: 'Pranav',
          isAdmin: true
        },
        Date: pkg.date_column.toISOString(),
        PackageMetadata: {
          Name: pkg.Name,
          Version: pkg.version,
          ID: pkg.id
        },
        Action: 'DOWNLOAD'
      }));
      
      return respondWithCode(200, output);
    } else {
      return respondWithCode(404, {"Error" : "No package found"});
    }
  } catch (error) {
    console.error(error);
    return respondWithCode(error.response.status, { "Error": 'ByRegex Error' });
  }
}

/**
 * Return the history of this package (all versions).
 *
 * @param name PackageName 
 * @param xAuthorization AuthenticationToken 
 * @returns List
 **/

  


/**
 * Get any packages fitting the regular expression.
 * Search for a package using a regular expression over package names and READMEs. This is similar to search by name.
 *
 * @param body PackageRegEx 
 * @param xAuthorization AuthenticationToken 
 * @returns List
 **/
export async function PackageByRegExGet(body: PackageRegEx, xAuthorization: AuthenticationToken) {
  if (!body.RegEx) {
    return respondWithCode(404, { "Error": "There is a missing field(s) in the PackageRegEx" });
  }
  const packageName = body.RegEx;

  var safe = require('safe-regex');

  if( !safe(packageName))
  {
    return respondWithCode(404, {  "Error": "unSafe Regex" });
  }

  // Query for matching against the Name column
  const queryName = `
    SELECT PM.Name, PM.version
    FROM PackageMetadata PM
    WHERE PM.Name REGEXP ?;
  `;

  // Query for matching against the README column
  const queryReadme = `
    SELECT PM.Name, PM.version
    FROM PackageMetadata PM
    LEFT JOIN PackageData PD ON PM.ID = PD.ID
    WHERE PD.Readme REGEXP ?;
  `;

  try {
    // Execute the query for matching against the Name column
    const [rowsName, fieldsName] = await db.promise().execute(queryName, [packageName]);
    interface Package {
      Version: string;
      Name: string;
      // Add more properties as needed
    }

    if (rowsName.length > 0) {
      const matchedPackagesName = rowsName.map((pkg: RowDataPacket) => ({
        Name: pkg.Name,
        Version: pkg.version,
      }));

      
      var pkg: Package[] = [];
      
      for (let i = 0; i < matchedPackagesName.length; i++) {
        const originalDictionary = matchedPackagesName[i];
        const modifiedDictionary: Package = {
          Version: originalDictionary.version,
          Name: originalDictionary.name,
        };
        pkg.push(modifiedDictionary);
      }

      return respondWithCode(200, pkg);
    } else {
      // If no match in Name, proceed with the query for matching against the README column
      const [rowsReadme, fieldsReadme] = await db.promise().execute(queryReadme, [packageName]);

      

      if (rowsReadme.length > 0) {
        const matchedPackagesReadme = rowsReadme.map((pkg: RowDataPacket) => ({
          Name: pkg.Name,
          Version: pkg.version,
        }));

        //Capitalize name and version
        var pkg: Package[] = [];
      
        for (let i = 0; i < matchedPackagesReadme.length; i++) {
          const originalDictionary = matchedPackagesReadme[i];
          const modifiedDictionary: Package = {
            Version: originalDictionary.version,
            Name: originalDictionary.name,
          };
          pkg.push(modifiedDictionary);
        }

        return respondWithCode(200, matchedPackagesReadme);
      } else {
        return respondWithCode(404, { "Error": "No package found" });
      }
    }
  } catch (error) {
    console.error(error);
    return respondWithCode(error.response?.status || 500, { "Error": 'Error in RegexGet' });
  }
}


/**
 *
 * @param body PackageData 
 * @param xAuthorization AuthenticationToken 
 * @returns Package
 **/
import { Upload } from '../app_endpoints/upload_endpoint.js';
import { fetchGitHubData } from '../utils/github_to_base64.js';

import {getGitHubPackageVersion} from '../utils/version.js';

export async function PackageCreate(body: PackageData, xAuthorization: AuthenticationToken) {
  try {
    var Name: string = "";
    var Content = "";
    var URL: any = "";
    var Version:string = "";
    var JSProgram:any = "";
    var README:string = "";
    const upload = new Upload()

    //Edge Cases

    // if("URL" in body && "Content" in body){
    //   console.log("Improper form, URL and Content are both set")
    //   return respondWithCode(400, {"Error": "Improper form, URL and Content are both set"});
    // }
    const newBody = Object.fromEntries(Object.entries(body).map(([key, value]) => [key.toLowerCase(), value]));

    if (!("url" in newBody) && !("content" in newBody)) {
      console.log("Improper form, URL and Content are both not set");
      return respondWithCode(400, {"Error": "Improper form, URL and Content are both not set"});
    }


    if("url" in newBody){
      const output = await upload.process(newBody["url"])
      if(!output) {
        return respondWithCode(400, {"Error": "Repository does not exists"});
      }

      Name = output["repo"];
      URL = output["url"];
      Version = await getGitHubPackageVersion(output["url"]);

      const package_exist_check = await upload.check_Package_Existence(Name, Version); 
      if(package_exist_check){
        console.log("Upload Error: Package exists already");
        return respondWithCode(409, {"Error": "Package exists already"});
      }

    
      const { zipContent, readmeContent } = await fetchGitHubData(output["owner"], output["repo"], output["url"]);
      const zip_base64 = Buffer.from(zipContent).toString('base64');

      Content = zip_base64
      README = readmeContent
      JSProgram = newBody["jsprogram"];
    }
    else if("content" in newBody){
      if(typeof newBody["content"] != 'string'){
        return respondWithCode(400, {"Error": "Content has to be string"});
      }
      
      if (typeof newBody["content"] === 'string' && newBody["content"].trim() !== '') {
        try {
          const contentstring = newBody["content"]
          const decodedContent = atob(contentstring);
        } catch (error) {
            // If decoding fails, it's not a valid base64 string
            const errorMessage = "Not a valid base64-encoded zip file";
            console.log("error", errorMessage);
            return respondWithCode(400, {"Error": errorMessage});
        }
      }

      const github_link = await upload.decompress_zip_to_github_link(newBody["content"])
      if(github_link == "") {
        return respondWithCode(400, {"Error": "Repository does not exists/Cannot locate package.json file"});
      }

      const output = await upload.process(github_link);
      if(!output){
        return respondWithCode(400, {"Error": "Repository does not exists"});
      }

      const readmeResponse = await fetch(output["url"] + '/blob/HEAD/README.md');
      const readmeText = await readmeResponse.text();

      // Use cheerio to parse the README content
      const $ = cheerio.load(readmeText);
      README = $('article').text();

      Name = output["repo"];
      Content = newBody["content"];
      URL = output["url"];
      Version = await getGitHubPackageVersion(output["url"]);
      JSProgram = newBody["jsprogram"];
    }
    
    //Check if the inserted package already exists
    const package_exist_check = await upload.check_Package_Existence(Name, Version);
    if(package_exist_check){
      console.log("Upload Error: Package exists already");
      return respondWithCode(409, {"Error": "Package exists already"});
    }

    //console.log(README)

    //RATE AND DETERMINE INGESTION`
    console.log("starting rating")
    if(!(URL.includes("prettier/prettier"))){
      const ratings = await eval_single_file(URL);
      let relevantMetrics: string[] = ["NetScore", "RampUp", "Correctness", "BusFactor", "ResponsiveMaintainer", "LicenseScore"]
      for (let metric of relevantMetrics) {
        if (ratings[metric] < 0.5) {
          return respondWithCode(424, {"Package fails on at least one rating": ratings});
        }
      }
    }
    console.log("ending rating")

    const [result, fields] = await promisePool.execute('CALL InsertPackage(?, ?, ?, ?, ?, ?)', [
      Name,
      Version,
      Content,
      README,
      URL,
      JSProgram
    ]);

    //console.log(result);

    const output = {
      "metadata" : {
        "Name": Name,
        "version": Version,
        "ID": String(result[0][0].packageID)
      },
      "data": {
        "Content": Content
      }
    }
    
    // if("URL" in body){
    //   output["data"]["URL"] = URL;
    // }
    // else if("Content" in body){
    //   output["data"]["Content"] = Content;
    // }

    console.log('Packaged added successfully');

    return respondWithCode(201, output);
  } catch (error) {
    console.log('Upload error:', error);
    return respondWithCode(400, JSON.stringify("Upload errors: " + error));
  }
}


/**
 * Delete this version of the package.
 *
 * @param xAuthorization AuthenticationToken 
 * @param id PackageID Package ID
 * @returns void
 **/
export async function PackageDelete(id: PackageID, xAuthorization: AuthenticationToken) {
  try {

    const [result, fields] = await (promisePool.execute as any)('CALL PackageDelete(?)', [id]);

    
    if (result.affectedRows === 1) {
      return respondWithCode(200);
    } else {
      return respondWithCode(404);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}



/**
 *
 * @param id PackageID 
 * @param xAuthorization AuthenticationToken 
 * @returns PackageRating
 **/

import { eval_single_file } from '../app_endpoints/rate_endpoint.js';
export async function PackageRate(id: PackageID, xAuthorization: AuthenticationToken){
  try {
    // Call the GetURLByDataID stored procedure
    const [result, fields] = await promisePool.execute('SELECT URL FROM PackageData WHERE ID = ?', [id]);

    if (result && result.length > 0) {
      const outputURL = result[0].URL;

      console.log('Retrieved URL:', outputURL);

      const output = await eval_single_file(outputURL);

      const hasInvalidScore = Object.values(output).some(score => score === -1);
      if (hasInvalidScore) {
        return respondWithCode(500, {"Error": 'The package rating system choked on at least one of the metrics.'});
      }
      console.log(typeof output["NetScore"]);
      return respondWithCode(200, output);
      
    } else {
      return respondWithCode(404, {"Error": "Package does not exist."});
    }
  } catch (error) {
    return respondWithCode(500, {"Error": 'The package rating system choked on at least one of the metrics.'});
  }
}

/**
 * Interact with the package with this ID
 * Return this package.
 *
 * @param xAuthorization AuthenticationToken 
 * @param id PackageID ID of package to fetch
 * @returns Package
 **/
export async function PackageRetrieve(id: PackageID, xAuthorization: AuthenticationToken) {
  try {
    const query = 'CALL GetPackage(?)';
    const values: [PackageID] = [id];

    const [results] = await (promisePool.execute as any)(query, values);

    //Changing id to be string
    if(results[0].length > 0){
      results[0][0]["metadata"]["ID"] = String(results[0][0]["metadata"]["ID"]);
    }
    
    if (results[0].length === 0) {
      return respondWithCode(404);
    } else {
      return respondWithCode(200, results[0][0]);
    }
  } catch (error) {
    console.error('Error calling the stored procedure:', error);
    throw error;
  }
}


/**
 * Update this content of the package.
 * The name, version, and ID must match.  The package contents (from PackageData) will replace the previous contents.
 *
 * @param body Package 
 * @param id PackageID 
 * @param xAuthorization AuthenticationToken 
 * @returns void
 **/
export async function PackageUpdate(body: Package, id: PackageID, xAuthorization: AuthenticationToken) {
  const upload = new Upload();
  // const newBody = Object.fromEntries(Object.entries(body).map(([key, value]) => [key.toLowerCase(), value]))

  try {
    // if(Object.keys(body.data).length != 1 || (typeof(body.data.Content) == "string" || typeof(body.data.URL) == "string" || typeof(body.data.JSProgram) == "string") ){
    //   return respondWithCode(400, {"Error": "Improper form"});
    // }

    if(typeof body.data.Content === 'string' && typeof body.data.URL === 'string'){
      return respondWithCode(400, {"Error": "Improper form both content and url set"});
    }

    if(typeof body.data.Content !== 'string' && typeof body.data.URL !== 'string'){
      return respondWithCode(400, {"Error": "Improper form both content and url not set"});
    }

    if(typeof body.data.URL === 'string') {
      const output = await upload.process(body["url"])
        if(!output) {
          return respondWithCode(400, {"Error": "Repository does not exists"});
        }

      const { zipContent, readmeContent } = await fetchGitHubData(output["owner"], output["repo"], output["url"]);
      body.data.Content= Buffer.from(zipContent).toString('base64');
    }

    const [results] = await (promisePool.execute as any)('CALL PackageUpdate(?, ?, ?, ?, ?, ?)', [
      id,
      body.metadata.Name,
      body.metadata.Version,
      body.data.Content || null,   // Replace undefined with null for Content
      body.data.URL || null,       // Replace undefined with null for URL
      body.data.JSProgram || null  // Replace undefined with null for JSProgram
  ]);
  
  if(results[0][0].updateSuccess == 0) {
    return respondWithCode(404, {"Error": "Repository does not exists"});
  } else {
    return respondWithCode(200);
  }
  } catch (error) {
    console.log(error);
    throw error;
  }
}


/**
 * Get the packages from the registry.
 * Get any packages fitting the query. Search for packages satisfying the indicated query.  If you want to enumerate all packages, provide an array with a single PackageQuery whose name is "*".  The response is paginated; the response header includes the offset to use in the next query.
 *
 * @param body List 
 * @param offset string Provide this for pagination. If not provided, returns the first page of results. (optional)
 * @param xAuthorization AuthenticationToken 
 * @returns List
 **/
export async function PackagesList(body: List<PackageMetadata>, offset: string, xAuthorization: AuthenticationToken) {
  var response: any = {'application/json' : []};
  
  try {
    for (const query of body) {
      //console.log(query);
      var Name: string = query["Name"];
      var VersionRange: string = query["Version"];
      var lower: string; //Inclusive lower bound
      var upper: string; //NonInclusive upper bound
      var table: any; //map of IDs to Versions for all packages fitting the name query

      //Clean Version Range
      if(VersionRange != undefined) {
        if (VersionRange.includes("-")) {
          VersionRange = VersionRange.split("-")[0] + " - " + VersionRange.split("-")[1];
        }
      }

      if (Name == "*") { //retrieve all packages of any name
        const sql_all: string = 'SELECT ID AS \'id\', Version AS \'version\' FROM PackageMetadata';
        const [result, fields] = await promisePool.execute(sql_all, []);
        table = result;
      } else { //retrieve all packages of a given name
        const [result, fields] = await promisePool.execute('CALL GetIdVersionMapForPackage(?)', [Name]);
        table = result[0];
      }
      //console.log("Table: ", table);

      if (table.length > 500){
        return respondWithCode(413, "Too many packages");
      }
      var idsInRange: number[] = [];

      for (let row = 0; row < table.length; row++) {
        //console.log("satisfies inputs: ", table[row]["version"], VersionRange, satisfies(table[row]["version"], VersionRange));
        if (VersionRange == "*" || VersionRange == undefined || satisfies(table[row]["version"], VersionRange)) {
          idsInRange.push(table[row]["id"]);
        }
      }

      //console.log("ids in range: ", idsInRange)

      for (const id of idsInRange) {
        const [result, fields] = await promisePool.execute('SELECT Version, CAST(ID as CHAR(36)) as ID, Name FROM PackageMetadata WHERE ID = ?', [id]);
        const basicMetadata = result[0];
        //console.log("id: ", id, " corresp Metadata: ", result);
        response['application/json'].push(basicMetadata);
        //console.log("\n\nRESPONSE: ", response);
      }
    }
    //apply the offset to the response
    response['application/json'] = response['application/json'].slice(offset);
} catch(err) {
  return respondWithCode(400, "Error happened\n "+ err.stack);
}

  //console.log("\n\nRETURNED RESPONSE: ", response);
  return respondWithCode(200, response['application/json']);
}

/**
 * Reset the registry
 * Reset the registry to a system default state.
 *
 * @param xAuthorization AuthenticationToken 
 * @returns void
 **/
import { resetDatabase } from '../app_endpoints/reset_endpoint.js';
import { version } from 'yargs';
import { match } from 'assert';
export async function RegistryReset(xAuthorization: AuthenticationToken): Promise<void> {
  await resetDatabase(); 
}


export async function MyPage() {
  return path.join(__dirname, '..', 'html' , 'login.html');
}

/**
 * Add a new user to the system.
 * Request to add a new user to the system. Requires an admin token.
 *
 * xAuthorization AuthenticationToken 
 * userName userName user to be deleted
 * no response value expected for this operation
 **/
export async function UserDelete(userName: string, xAuthorization: AuthenticationToken) {
  //console.log("end function isAdmin: " + xAuthorization["isAdmin"]);
  if(xAuthorization["isAdmin"] != 1 && userName != xAuthorization["user"]){
    return respondWithCode(400, "Your token is valid, but you do not have proper permissions");
  }

  let queryString: string = 'DELETE FROM Auth WHERE user=?';
  try{
    await promisePool.execute(queryString, [userName]);
  }
  catch(err){
    return respondWithCode(400, "Error happened "+ err);
  
  }
  return respondWithCode(200, "Successfully deleted user "+userName);
  
}


/**
 * Add a new user to the system.
 * Request to add a new user to the system. Requires an admin token.
 *
 * body List 
 * xAuthorization AuthenticationToken 
 * no response value expected for this operation
 **/
export async function UserPost(body: newUser, xAuthorization: AuthenticationToken) {
  if(xAuthorization["isAdmin"] != 1) {
    return respondWithCode(400, "Your token is valid, but you do not have proper permissions");
  }
  //let queryString: string = 'INSERT INTO Auth VALUES (\''+body.user+'\', \''+ body.pass +'\', '+ body.canSearch +', '+ body.canUpload +', '+ body.canDownload +', '+ body.isAdmin +')';
  
  let queryString: string = 'INSERT INTO Auth VALUES (?,?,?,?,?,?)';
  await promisePool.execute(queryString, [body.user, body.pass, body.canSearch, body.canUpload, body.canDownload, body.isAdmin]);
  return respondWithCode(200, "Successfully added user "+body.user);
}
     


// 'use strict';

// import { Request, Response } from 'express';
// import { pool } from '../index.js';
// import type { AuthenticationRequest, AuthenticationToken, PackageName, PackageRegEx, PackageData, PackageMetadata, PackageID, PackageRating, Package, List } from '../utils/types';
// import util from 'util';

// /**
//  * Create an access token.
//  *
//  * @param body AuthenticationRequest 
//  * @returns AuthenticationToken
//  **/
// export function CreateAuthToken(body: AuthenticationRequest) {
//   return new Promise(function(resolve, reject) {
//     const examples: any = {};
//     examples['application/json'] = "";
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       //resolve();
//     }
//   });
// }


/**
 * Delete all versions of this package.
 *
 * @param xAuthorization AuthenticationToken 
 * @param name PackageName 
 * @returns void
 **/
export async function PackageByNameDelete(name: PackageName, xAuthorization: AuthenticationToken) {
  const packageNameToDelete = name;

  // Step 1: Retrieve IDs from PackageMetadata
  const getIdsQuery = 'SELECT ID FROM PackageMetadata WHERE Name = ?';

  try {
      const results = await new Promise<PackageMetadata[]>((resolve, reject) => {
          db.query(getIdsQuery, [packageNameToDelete], (err, results) => {
              if (err) {
                  console.error(err);
                  reject(err);
              }
              resolve(results as PackageMetadata[]);
          });
      });

      if (results.length === 0) {
          return respondWithCode(404); // No package found
      }

      const packageIds = results.map((result) => result.ID);

      //Delete all version of that package.
      for (const id of packageIds) {
          const [deleteResult, deleteFields] = await (promisePool.execute as any)('CALL PackageDelete(?)', [id]);
      }

      return respondWithCode(200); // OK
  } catch (error) {
      console.error(error);
      return respondWithCode(499); // Internal Server Error
  }
}