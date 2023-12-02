'use strict';

import { Request, Response, NextFunction } from 'express';
import * as Default from '../service/DefaultService';
import { writeJson } from '../utils/writer';
import { db } from '../database_files/database_connect';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import {validateToken} from '../authentication/authenticationHelper';
import { respondWithCode } from '../utils/writer';

async function handleRequestAsync(fn: Function, req: Request, res: Response, next: NextFunction, ...args: any[]) {
  
  //Check if the token is valid. If the token is invalid, send error response. If not, pass json body to the service
  //console.log("request path: " + req.path);
  if(req.path != "/authenticate") {
    //console.log("First arg:" + req.header('X-Authorization'));
    let tokenOut = validateToken(req.header('X-Authorization'));

    if(tokenOut["success"] != 1) {
        return res.status(400).send("Bad Token");
    }
    //if the token is valid, replace the token string in the args with it's json body
    args.pop();
    args.push(tokenOut["token"]);

    // console.log("popped arg: " + args.pop())
    // console.log(JSON.stringify(tokenOut["token"]));
    // console.log("length before push: " + args.length)
    // console.log("length after push: " + args.push(tokenOut["token"]));
    // console.log("")
  }

  try {
    const response = await fn(...args);
    writeJson(res, response);
  } catch (error) {
    writeJson(res, error);
  }
}

export async function CreateAuthToken(req: Request, res: Response, next: NextFunction, body: any) {
  await Default.CreateAuthToken;
  await handleRequestAsync(Default.CreateAuthToken, req, res, next, body);
}

export async function PackageByNameDelete(req: Request, res: Response, next: NextFunction, name: string, xAuthorization: string) {
  console.log("createAuthToken: default.ts");
  await handleRequestAsync(Default.PackageByNameDelete, req, res, next, name, xAuthorization);
}

export async function UserDelete (req: Request, res: Response, next: NextFunction, userName: string, xAuthorization: string) {
  await handleRequestAsync(Default.UserDelete, req, res, next, userName, req.header('X-Authorization'));
}

export async function UserPost (req: Request, res: Response, next: NextFunction, body:any, xAuthorization: string) {
  await handleRequestAsync(Default.UserPost, req, res, next, body, req.header('X-Authorization'));
}

export async function PackageByNameGet(req: Request, res: Response, next: NextFunction, name: string, xAuthorization: string) {
  await handleRequestAsync(Default.PackageByNameGet, req, res, next, name, req.header('X-Authorization'));
}

export async function PackageByRegExGet(req: Request, res: Response, next: NextFunction, body: any, xAuthorization: string) {
  await handleRequestAsync(Default.PackageByRegExGet, req, res, next, body, req.header('X-Authorization'));
}

export async function PackageCreate(req: Request, res: Response, next: NextFunction, body: any, xAuthorization: string) {
  await handleRequestAsync(Default.PackageCreate, req, res, next, body, req.header('X-Authorization'));
}

export async function PackageDelete(req: Request, res: Response, next: NextFunction, id: string, xAuthorization: string,) {
  await handleRequestAsync(Default.PackageDelete, req, res, next, id, req.header('X-Authorization'));
}

export async function PackageRate(req: Request, res: Response, next: NextFunction, id: string, xAuthorization: string) {
  await handleRequestAsync(Default.PackageRate, req, res, next, id, req.header('X-Authorization'));
}

export async function PackageRetrieve(req: Request, res: Response, next: NextFunction, id: string, xAuthorization: string) {
  await handleRequestAsync(Default.PackageRetrieve, req, res, next, id, req.header('X-Authorization'));
}

export async function PackageUpdate(req: Request, res: Response, next: NextFunction, body: any, id: string, xAuthorization: string) {
  console.log(body);
  console.log(id);
  console.log(xAuthorization);
  console.log(req);
  await handleRequestAsync(Default.PackageUpdate, req, res, next, body, id, req.header('X-Authorization'));
}

export async function PackagesList(req: Request, res: Response, next: NextFunction, body: any, offset: string, xAuthorization: string) {
  await handleRequestAsync(Default.PackagesList, req, res, next, body, offset, req.header('X-Authorization'));
}

import { resetDatabase } from '../app_endpoints/reset_endpoint.js';
export async function RegistryReset(req: Request, res: Response, next: NextFunction, xAuthorization: string) {
  // const xAuthorization = req.headers['x-authorization'];
  await resetDatabase(res);  
  await handleRequestAsync(Default.RegistryReset, req, res, next, req.header('X-Authorization'));
}

export async function addUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err) => {
      if (err) throw err;
  
      res.send('User added successfully');
    });
  } catch (error) {
    // Handle any errors
    next(error);
  }
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { loginUsername, loginPassword } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [loginUsername, loginPassword], (err, results) => {
    console.log(results[0]);
    if (err) throw err;

    if (results[0] == undefined) {
      res.send('Login Failed');
    } else {
      res.send('Login Successful');
    }
  });
  } catch (error) {
    // Handle any errors
    next(error);
  }
}

export async function MyPage(req: Request, res: Response, next: NextFunction) {
  try {
    const filePath = await Default.MyPage();
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending the HTML file:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  } catch (error) {
    // Handle any errors
    next(error);
  }
}



// 'use strict';

// import { Request, Response, NextFunction } from 'express';
// import * as Default from '../service/DefaultService';
// import { writeJson } from '../utils/writer';

// export function CreateAuthToken(req: Request, res: Response, next: NextFunction, body: any): void {
//   Default.CreateAuthToken(body)
//     .then(function (response: any) {
//       writeJson(res, response);
//     })
//     .catch(function (response: any) {
//       writeJson(res, response);
//     });
// }

// export function PackageByNameDelete(req: Request, res: Response, next: NextFunction, xAuthorization: string, name: string): void {
//   Default.PackageByNameDelete(xAuthorization, name)
//     .then(function (response: any) {
//       writeJson(res, response);
//     })
//     .catch(function (response: any) {
//       writeJson(res, response);
//     });
// }

// export function PackageByNameGet(req: Request, res: Response, next: NextFunction, name: string, xAuthorization: string): void {
//   Default.PackageByNameGet(name, xAuthorization)
//     .then(function (response: any) {
//       writeJson(res, response);
//     })
//     .catch(function (response: any) {
//       writeJson(res, response);
//     });
// }

// export function PackageByRegExGet(req: Request, res: Response, next: NextFunction, body: any, xAuthorization: string): void {
//   Default.PackageByRegExGet(body, xAuthorization)
//     .then(function (response: any) {
//       writeJson(res, response);
//     })
//     .catch(function (response: any) {
//       writeJson(res, response);
//     });
// }

// export function PackageCreate(req: Request, res: Response, next: NextFunction, body: any, xAuthorization: string): void {
//  Default.PackageCreate(body, xAuthorization)
//     .then(function (response: any) {
//       writeJson(res, response);
//     })
//     .catch(function (response: any) {
//       writeJson(res, response);
//     });
// }

// export function PackageDelete(req: Request, res: Response, next: NextFunction, xAuthorization: string, id: string): void {
//   Default.PackageDelete(xAuthorization, id)
//     .then(function (response: any) {
//       writeJson(res, response);
//     })
//     .catch(function (response: any) {
//       writeJson(res, response);
//     });
// }

// export function PackageRate(req: Request, res: Response, next: NextFunction, id: string, xAuthorization: string): void {
//   Default.PackageRate(id, xAuthorization)
//     .then(function (response: any) {
//       writeJson(res, response);
//     })
//     .catch(function (response: any) {
//       writeJson(res, response);
//     });
// }

// export function PackageRetrieve(req: Request, res: Response, next: NextFunction, xAuthorization: string, id: string): void {
//   Default.PackageRetrieve(xAuthorization, id)
//     .then(function (response: any) {
//       writeJson(res, response);
//     })
//     .catch(function (response: any) {
//       writeJson(res, response);
//     });
// }

// export function PackageUpdate(req: Request, res: Response, next: NextFunction, body: any, id: string, xAuthorization: string): void {
//   Default.PackageUpdate(body, id, xAuthorization)
//     .then(function (response: any) {
//       writeJson(res, response);
//     })
//     .catch(function (response: any) {
//       writeJson(res, response);
//     });
// }

// export function PackagesList(req: Request, res: Response, next: NextFunction, body: any, offset: string, xAuthorization: string): void {
//   Default.PackagesList(body, offset, xAuthorization)
//     .then(function (response: any) {
//       writeJson(res, response);
//     })
//     .catch(function (response: any) {
//       writeJson(res, response);
//     });
// }

// export function RegistryReset(req: Request, res: Response, next: NextFunction, xAuthorization: string): void {
//   Default.RegistryReset(xAuthorization)
//     .then(function (response: any) {
//       writeJson(res, response);
//     })
//     .catch(function (response: any) {
//       writeJson(res, response);
//     });
// }