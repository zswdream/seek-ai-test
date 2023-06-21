import snowflake from 'snowflake-sdk';

function testConnection(connection: any) {
  return new Promise((resolve, reject) => {
    connection.connect((err: any, conn: any) => {
      if (err) {
        return resolve({
          isError: true,
          error: err.message,
        });
      }
      return resolve({
        isError: false,
      });
    });
  });
}

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const params: any = req.body;

    const connection = snowflake.createConnection(params);

    const data = await testConnection(connection);

    return res.status(200).json(data);
  }
}
