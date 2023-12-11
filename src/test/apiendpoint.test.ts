import * as request from 'supertest';
import type { AuthenticationRequest, AuthenticationToken, PackageName, PackageRegEx, PackageData, PackageMetadata, PackageID, PackageRating, Package, List, newUser } from '../utils/types';

const baseUrl = 'http://18.225.95.73:3000/';
let token: string;

describe('/package endpoint', () => {
  beforeAll(async () => {
    // Run authenticate before all test cases in this describe block
    token = await authenticate();
  });

  beforeEach(async () => {
    await reset();
  })

  it('reset', async () => {
    const response = await reset()

    expect(response.statusCode).toBe(200);
  });

  it('should add a new package', async () => {

    const response = await postDefault();

    expect(response.statusCode).toBe(201);
  });

  it('should not add new package', async () => {
    await postDefault();

    const response = await postDefault();

    expect(response.statusCode).toBe(409);
  });

  it('get package', async () => {
    const response1 = await postDefault();
    const response2 = await request(baseUrl)
      .get('package/'+response1.body.metadata.ID)
      .set('X-Authorization', token)

    expect(response2.statusCode).toBe(200)
  });

  it('rate endpoint', async () => {

    const response1 = await postDefault();
    
    const expectedProperties = {
      "BusFactor": 0,
      "Correctness": 0,
      "RampUp": 0,
      "ResponsiveMaintainer": 0,
      "LicenseScore": 0,
      "GoodPinningPractice": 0,
      "PullRequest": 0,
      "NetScore": 0
    };

    const response2 = await request(baseUrl)
      .get(`package/${response1.body.metadata.ID}/rate`)  
      .set('X-Authorization', token)
  
    Object.entries(expectedProperties).forEach(([property, expectedValue]) => {
      expect(response2.body).toHaveProperty(property);
      // expect(response2.body[property]).toBeCloseTo(expectedValue); // Use toBeCloseTo for comparing floating-point numbers
    });
  }, 15000);

  it('authenticate wrong user, password', async () => {
    const response = await request(baseUrl)
      .put('authenticate')
      .send({
        User: {
          name: "ece3086",
          isAdmin: true
        },
        Secret: {
          password: "correcthorsebatterystaple123(!"
        }
      });

    expect(response.statusCode).toBe(401)
  });

  it('regex', async () => {
    await postDefault();

    const response1 = await request(baseUrl)
      .post('package/byRegEx')
      .set('X-Authorization', token)
      .send({
        "RegEx": ".*?Underscore.*"
      })

    expect(response1.statusCode).toBe(200);
  
  });

});

async function authenticate() {
  const response = await request(baseUrl)
    .put('authenticate')
    .send({
      User: {
        name: "ece30861defaultadminuser",
        isAdmin: true
      },
      Secret: {
        password: "correcthorsebatterystaple123(!__+@**(A'\"`;DROP TABLE packages;"
      }
    });

  return JSON.stringify(response.body);
}

async function reset() {
  const response = await request(baseUrl)
    .delete('reset')
    .set('X-Authorization', token);

  return response;
}

async function postDefault () {
  const response = await request(baseUrl)
      .post('package')
      .set('X-Authorization', token)
      .send({
        "JSProgram": "if (process.argv.length === 7) {\nconsole.log('Success')\nprocess.exit(0)\n} else {\nconsole.log('Failed')\nprocess.exit(1)\n}\n",
        "URL": "https://github.com/jashkenas/underscore"
      });
  
  return response;
}
