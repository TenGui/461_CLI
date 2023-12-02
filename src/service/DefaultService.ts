'use strict';

import { Request, Response } from 'express';
import { respondWithCode } from '../utils/writer'; // Import the response function
import type { AuthenticationRequest, AuthenticationToken, PackageName, PackageRegEx, PackageData, PackageMetadata, PackageID, PackageRating, Package, List } from '../utils/types';
import * as path from 'path';
import {
  ConnectionOptions,
  ResultSetHeader,
  RowDataPacket,
  ProcedureCallPacket
} from 'mysql2/promise';

const { db, promisePool } = require("../database_files/database_connect");

// const queryAsync = util.promisify(pool.query);

/**
 * Create an access token.
 *
 * @param body AuthenticationRequest 
 * @returns AuthenticationToken
 **/
export async function CreateAuthToken(body: AuthenticationRequest) {
  return ''; // You can return the actual value here
}

/**
 * Delete all versions of this package.
 *
 * @param xAuthorization AuthenticationToken 
 * @param name PackageName 
 * @returns void
 **/
export async function PackageByNameDelete(name: PackageName, xAuthorization: AuthenticationToken, ) {
  // Your code here
}

/**
 * Return the history of this package (all versions).
 *
 * @param name PackageName 
 * @param xAuthorization AuthenticationToken 
 * @returns List
 **/
export async function PackageByNameGet(name: PackageName, xAuthorization: AuthenticationToken) {
  const examples: any = {};
  examples['application/json'] = [
    {
      "Action": "CREATE",
      "User": {
        "name": "Alfalfa",
        "isAdmin": true
      },
      "PackageMetadata": {
        "Version": "1.2.3",
        "ID": "ID",
        "Name": "Name"
      },
      "Date": "2023-03-23T23:11:15Z"
    },
    {
      "Action": "CREATE",
      "User": {
        "name": "Alfalfa",
        "isAdmin": true
      },
      "PackageMetadata": {
        "Version": "1.2.3",
        "ID": "ID",
        "Name": "Name"
      },
      "Date": "2023-03-23T23:11:15Z"
    },
  ];

  return examples['application/json'];
}

/**
 * Get any packages fitting the regular expression.
 * Search for a package using a regular expression over package names and READMEs. This is similar to search by name.
 *
 * @param body PackageRegEx 
 * @param xAuthorization AuthenticationToken 
 * @returns List
 **/
export async function PackageByRegExGet(body: PackageRegEx, xAuthorization: AuthenticationToken) {
  const examples: any = {};
  examples['application/json'] = [
    {
      "Version": "1.2.3",
      "ID": "ID",
      "Name": "Name"
    },
    {
      "Version": "1.2.3",
      "ID": "ID",
      "Name": "Name"
    },
  ];

  return examples['application/json'];
}

/**
 *
 * @param body PackageData 
 * @param xAuthorization AuthenticationToken 
 * @returns Package
 **/
export async function PackageCreate(body: PackageData, xAuthorization: AuthenticationToken) {
  try {
    const Name: string = "Package_Name11";
    const Version: string = "1.0.0.8.2";
    const Content: string = 'LONG_TEXT10';
    const URL: string = 'LONG_TEXT1234';
    const JSProgram: string = 'JSPROGRAM325';
    const DataDescription: string = 'DATA226';

    // const result = await connection.execute('CALL InsertPackage(?, ?, ?, ?, ?)', [
    const [result, fields] = await promisePool.execute('CALL InsertPackage(?, ?, ?, ?, ?, ?)', [
      Name,
      Version,
      Content,
      URL,
      JSProgram,
    ]);

    //connection.release();

    console.log(result);
    console.log(typeof(result));
    console.log('Stored procedure executed successfully.');
    return respondWithCode(201, "testing");
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
    const [result, fields] = await promisePool.execute<ProcedureCallPacket<ResultSetHeader>>('CALL PackageDelete(?)', [
      id
    ]);
    
    if(result.affectedRows == 1) {
      return respondWithCode(200)
    }
    else {
      return respondWithCode(404);
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

/**
 *
 * @param id PackageID 
 * @param xAuthorization AuthenticationToken 
 * @returns PackageRating
 **/

import { eval_single_file } from '../utils/eval_single_url.js';
export async function PackageRate(id: PackageID, xAuthorization: AuthenticationToken): Promise<PackageRating> {
  //Modify this section when database is setup
  let URLs = ["https://github.com/knex/knex"];
  const url_file = URLs[id]; // Get the "id" parameter from the URL

  const output = await eval_single_file(url_file);
  console.log(output);
  return output;
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
  try{

    // interface test extends RowDataPacket {
    //   ID: JSON;
    // }

    const [results] = await promisePool.execute<ProcedureCallPacket<RowDataPacket[]>>('CALL GetPackage(?)', [
      id,
    ]);

    console.log(results)

    if(results[0].length == 0) {
      return respondWithCode(404);
    }
    else {
      return respondWithCode(200, results[0][0]);
    }
  } catch (error) {
    console.error('Error calling the stored procedure:', error);
    throw error; // Re-throw the error for the caller to handle
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
  // Your code here
  try {
    const [results] = await promisePool.execute<ProcedureCallPacket<RowDataPacket[]>>('CALL PackageUpdate(?, ?, ?, ?, ?, ?)', [
      id,
      body.metadata.Name,
      body.metadata.Version,
      body.data.Content,
      body.data.URL,
      body.data.JSProgram
    ]); 
  
    if(results[0][0].updateSuccess == 0) {
      return respondWithCode(404);
    } else {
      return respondWithCode(200);
    }
   
  } catch (error) {
    console.log(error)
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
  const examples: any = {};
  examples['application/json'] = [
    {
      "Version": "1.2.3",
      "ID": "ID",
      "Name": "Name",
    },
    {
      "Version": "1.2.3",
      "ID": "ID",
      "Name": "Name",
    },
  ];

  return examples['application/json'];
}

/**
 * Reset the registry
 * Reset the registry to a system default state.
 *
 * @param xAuthorization AuthenticationToken 
 * @returns void
 **/
export async function RegistryReset(xAuthorization: AuthenticationToken) {
  // Your code here
}

export async function MyPage() {
  return path.join(__dirname, '..', 'html' , 'login.html');
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


// /**
//  * Delete all versions of this package.
//  *
//  * @param xAuthorization AuthenticationToken 
//  * @param name PackageName 
//  * @returns void
//  **/
// export function PackageByNameDelete(xAuthorization: AuthenticationToken, name: PackageName) {
//   return new Promise(function(resolve, reject) {
//     // resolve();
//   });
// }

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