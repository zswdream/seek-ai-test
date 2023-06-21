import snowflake from 'snowflake-sdk';

function fetchData(connection: any, query: string) {
  return new Promise((resolve, reject) => {
    connection.connect((err: any, conn: any) => {
      if (err) {
        return resolve({
          isError: true,
        });
      }
      connection.execute({
        sqlText: query,
        complete: function (err: any, stmt: any, rows: any) {
          if (err) {
            return resolve({
              isError: true,
              error: err.message,
            });
          }

          return resolve({
            isError: false,
            rows,
          });
        },
      });
    });
  });
}

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const params: any = req.body;
    const query = params.query;
    delete params.query;

    const connection = snowflake.createConnection(params);

    const data = await fetchData(connection, query);

    return res.status(200).json(data);
  }
}
