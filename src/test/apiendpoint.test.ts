import * as request from 'supertest';

const baseUrl = 'http://18.225.95.73:3000/';

let token;

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

  return response.body;
}

async function reset() {
  const response = await request(baseUrl)
    .delete('reset')
    .set('X-Authorization', token);

}

describe('/package endpoint', () => {
  beforeAll(async () => {
    // Run authenticate before all test cases in this describe block
    token = await authenticate();
  });

  beforeEach(async () => {
    await reset();
  })

  it('should add a new package', async () => {
    const response = await request(baseUrl)
      .post('package')
      .set('X-Authorization', token)
      .send({
        "JSProgram": "if (process.argv.length === 7) {\nconsole.log('Success')\nprocess.exit(0)\n} else {\nconsole.log('Failed')\nprocess.exit(1)\n}\n",
        "URL": "https://github.com/jashkenas/underscore"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject();
  });

  it('should be new', async () => {
    // Your test logic here
  });
});
