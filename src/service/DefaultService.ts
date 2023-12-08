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




  

  
  // Your code here


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
  if(!body.RegEx){
    return respondWithCode(404, {"Error" : "There is missing field(s) in the PackageRegEx"});
  }
  const packageName = body.RegEx;

  const query = 'SELECT Name, version FROM PackageMetadata WHERE Name REGEXP ?';

  try {
    const [rows, fields] = await db.promise().execute(query, [packageName]);

    console.log('Results:', rows);

    if (rows.length > 0) {
      const matchedPackages = rows.map((pkg: RowDataPacket) => ({
        name: pkg.Name,
        version: pkg.version,
      }));
      
      return respondWithCode(200, matchedPackages);
    } else {
      return respondWithCode(404, {"Error" : "No package found"});
    }
  } catch (error) {
    console.error(error);
    return respondWithCode(error.response.status, { "Error": 'Error in RegexGet' });
  }
}

/**
 *
 * @param body PackageData 
 * @param xAuthorization AuthenticationToken 
 * @returns Package
 **/
import { Upload } from '../app_endpoints/upload_endpoint.js';
export async function PackageCreate(body: PackageData, xAuthorization: AuthenticationToken) {
  try {
    var Name: string = "";
    var Content = "";
    var URL: string = "";
    var Version:string = "";
    var JSProgram:any = "";
    const upload = new Upload()

    //Check if package is given
    if("URL" in body && "Content" in body){
      console.log("Improper form, URL and Content are both set")
      return respondWithCode(400, {"Error": "Improper form, URL and Content are both set"});
    }
    if(!("URL" in body) && !("Content" in body)){
      console.log("Improper form, URL and Content are both not set")
      return respondWithCode(400, {"Error": "Improper form, URL and Content are both not set"});
    }

    if("URL" in body){
      const output = await upload.process(body["URL"])
      if(!output) {
        return respondWithCode(400, {"Error": "Repository does not exists"});
      }

      Name = output["repo"];
      Content = 'N/A';
      URL = output["url"];
      Version = "1.0.5";
      //JSProgram = body["JSProgram"];
    }
    else if("Content" in body){
      const github_link = await upload.decompress_zip_to_github_link(body["Content"])
      console.log("Inside DefaultService: ", github_link);
      if(github_link == "") {
        return respondWithCode(400, {"Error": "Repository does not exists/Cannot locate package.json file"});
      }

      const output = await upload.process(github_link);
      if(!output){
        return respondWithCode(400, {"Error": "Repository does not exists"});
      }
      Name = output["repo"];
      Content = "Content";
      URL = 'N/A';
      Version = "1.0.0";
    }
    
    //Check if the inserted package already exists
    const package_exist_check = await upload.check_Package_Existence(Name, Version);
    if(package_exist_check){
      console.log("Upload Error: Package exists already");
      return respondWithCode(409, {"Error": "Package exists already"});
    }

    const [result, fields] = await promisePool.execute('CALL InsertPackage(?, ?, ?, ?, ?)', [
      Name,
      Version,
      Content,
      URL,
      JSProgram,
    ]);

    const output = {
      "metadata" : {
        "Name": Name,
        "version": Version,
        "ID": "1"
      },
      "data": {
        "JSProgram": JSProgram
      }
    }
    
    if("URL" in body){
      output["data"]["URL"] = URL;
    }
    else if("Content" in body){
      output["data"]["Content"] = Content;
    }

    console.log('Packaged added successfully');

    return respondWithCode(201, output);
  } catch (error) {
    console.error('Error calling the stored procedure:', error);
    throw error; // Re-throw the error for the caller to handle
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


    console.log(results);

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
  try {
    // if ("URL" in body && "Content" in body) {
    //   console.log("Improper form, URL and Content are both set");
    //   return respondWithCode(400, {"Error": "Improper form, URL and Content are both set"});
    // }
    if (!("URL" in body.data) && !("Content" in body.data)) {
      console.log("Improper form, URL and Content are both not set");
      return respondWithCode(400, {"Error": "Improper form, URL and Content are both not set"});
    }


    const [results] = await (promisePool.execute as any)('CALL PackageUpdate(?, ?, ?, ?, ?, ?)', [

      id,
      body.metadata.Name,
      body.metadata.Version,
      body.data.Content,
      body.data.URL,
      body.data.JSProgram
    ]);

    if (results[0][0].updateSuccess == 0) {
      return respondWithCode(404);
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
      if (VersionRange.includes("-")) {
        VersionRange = VersionRange.split("-")[0] + " - " + VersionRange.split("-")[1];
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
        if (VersionRange == "*" || satisfies(table[row]["version"], VersionRange)) {
          idsInRange.push(table[row]["id"]);
        }
      }

      //console.log("ids in range: ", idsInRange)

      for (const id of idsInRange) {
        const [result, fields] = await promisePool.execute('CALL GetBasicMetadata(?)', [id]);
        const basicMetadata = result[0][0];
        //console.log("id: ", id, " corresp Metadata: ", basicMetadata);
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
  if(xAuthorization["isAdmin"] != 1){
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

// /**
//  * Return the history of this package (all versions).
//  *
//  * @param name PackageName 
//  * @param xAuthorization AuthenticationToken 
//  * @returns List
//  **/
// export function PackageByNameGet(name: PackageName, xAuthorization: AuthenticationToken) {
//   return new Promise(function(resolve, reject) {
//     const examples: any = {};
//     examples['application/json'] = [ {
//   "Action" : "CREATE",
//   "User" : {
//     "name" : "Alfalfa",
//     "isAdmin" : true
//   },
//   "PackageMetadata" : {
//     "Version" : "1.2.3",
//     "ID" : "ID",
//     "Name" : "Name"
//   },
//   "Date" : "2023-03-23T23:11:15Z"
// }, {
//   "Action" : "CREATE",
//   "User" : {
//     "name" : "Alfalfa",
//     "isAdmin" : true
//   },
//   "PackageMetadata" : {
//     "Version" : "1.2.3",
//     "ID" : "ID",
//     "Name" : "Name"
//   },
//   "Date" : "2023-03-23T23:11:15Z"
// } ];
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       // resolve();
//     }
//   });
// }


// /**
//  * Get any packages fitting the regular expression.
//  * Search for a package using regular expression over package names and READMEs. This is similar to search by name.
//  *
//  * @param body PackageRegEx 
//  * @param xAuthorization AuthenticationToken 
//  * @returns List
//  **/
// export function PackageByRegExGet(body: PackageRegEx, xAuthorization: AuthenticationToken) {
//   return new Promise(function(resolve, reject) {
//     const examples: any = {};
//     examples['application/json'] = [ {
//   "Version" : "1.2.3",
//   "ID" : "ID",
//   "Name" : "Name"
// }, {
//   "Version" : "1.2.3",
//   "ID" : "ID",
//   "Name" : "Name"
// } ];
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       // resolve();
//     }
//   });
// }


// /**
//  *
//  * @param body PackageData 
//  * @param xAuthorization AuthenticationToken 
//  * @returns Package
//  **/
// export function PackageCreate(body: PackageData, xAuthorization: AuthenticationToken) {
//   return new Promise(async (resolve, reject) => {
//     // Get a connection from the pool
//     pool.getConnection((err, connection) => {
//       if (err) {
//         console.error('Error getting a connection from the pool:', err);
//         reject(err);
//         return;
//       }

//       const Name: string = "Package_Name4";
//       const Version: string = "1.0.0.4";
//       const Description: string = 'Description4';
//       const Content: string = 'LONG_TEXT4';
//       const JSProgram: string = 'JSPROGRAM4';
//       const DataDescription: string = 'DATA4';

//       // Call the stored procedure with the required parameters using the acquired connection
//       connection.query('CALL InsertPackage(?, ?, ?, ?, ?, ?)', [
//         Name,
//         Version,
//         Description,
//         Content,
//         JSProgram,
//         DataDescription
//       ], (error, results) => {
//         // Release the connection back to the pool
//         connection.release();

//         if (error) {
//           console.error('Error calling the stored procedure:', error);
//           reject(error); // Reject the promise with the error
//         } else {
//           console.log('Stored procedure executed successfully.');
//           resolve(results);
//         }
//       });
//     });
//   });
// }

// /**
//  * Delete this version of the package.
//  *
//  * @param xAuthorization AuthenticationToken 
//  * @param id PackageID Package ID
//  * @returns void
//  **/
// export function PackageDelete(xAuthorization: AuthenticationToken, id: PackageID) {
//   return new Promise(function(resolve, reject) {
//     // resolve();
//   });
// }


// /**
//  *
//  * @param id PackageID 
//  * @param xAuthorization AuthenticationToken 
//  * @returns PackageRating
//  **/
// export function PackageRate(id: PackageID, xAuthorization: AuthenticationToken) {
//   return new Promise(function(resolve, reject) {
//     const examples: any = {};
//     examples['application/json'] = {
//   "GoodPinningPractice" : 2.3021358869347655,
//   "NetScore" : 9.301444243932576,
//   "PullRequest" : 7.061401241503109,
//   "ResponsiveMaintainer" : 5.962133916683182,
//   "LicenseScore" : 5.637376656633329,
//   "RampUp" : 1.4658129805029452,
//   "BusFactor" : 0.8008281904610115,
//   "Correctness" : 6.027456183070403
// };
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       // resolve();
//     }
//   });
// }


// /**
//  * Interact with the package with this ID
//  * Return this package.
//  *
//  * @param xAuthorization AuthenticationToken 
//  * @param id PackageID ID of package to fetch
//  * @returns Package
//  **/
// export function PackageRetrieve(xAuthorization: AuthenticationToken, id: PackageID) {
//   return new Promise(function(resolve, reject) {
//     const examples: any = {};
//     examples['application/json'] = {
//   "metadata" : {
//     "Version" : "1.2.3",
//     "ID" : "ID",
//     "Name" : "Name"
//   },
//   "data" : {
//     "Content" : "Content",
//     "JSProgram" : "JSProgram",
//     "URL" : "URL"
//   }
// };
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       // resolve();
//     }
//   });
// }


// /**
//  * Update this content of the package.
//  * The name, version, and ID must match.  The package contents (from PackageData) will replace the previous contents.
//  *
//  * @param body Package 
//  * @param id PackageID 
//  * @param xAuthorization AuthenticationToken 
//  * @returns void
//  **/
// export function PackageUpdate(body: Package, id: PackageID, xAuthorization: AuthenticationToken) {
//   return new Promise(function(resolve, reject) {
//     // resolve();
//   });
// }


// /**
//  * Get the packages from the registry.
//  * Get any packages fitting the query. Search for packages satisfying the indicated query.  If you want to enumerate all packages, provide an array with a single PackageQuery whose name is \"*\".  The response is paginated; the response header includes the offset to use in the next query.
//  *
//  * @param body List 
//  * @param offset string Provide this for pagination. If not provided, returns the first page of results. (optional)
//  * @param xAuthorization AuthenticationToken 
//  * @returns List
//  **/
// export function PackagesList(body: List<PackageMetadata>, offset: string, xAuthorization: AuthenticationToken) {
//   return new Promise(function(resolve, reject) {
//     const examples: any = {};
//     examples['application/json'] = [ {
//   "Version" : "1.2.3",
//   "ID" : "ID",
//   "Name" : "Name"
// }, {
//   "Version" : "1.2.3",
//   "ID" : "ID",
//   "Name" : "Name"
// } ];
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       // resolve();
//     }
//   });
// }


// /**
//  * Reset the registry
//  * Reset the registry to a system default state.
//  *
//  * @param xAuthorization AuthenticationToken 
//  * @returns void
//  **/
// export function RegistryReset(xAuthorization: AuthenticationToken) {
//   return new Promise(function(resolve, reject) {
//     // resolve();
//   });
// }