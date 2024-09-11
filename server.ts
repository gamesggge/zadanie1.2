import fs from 'fs';
import express, { Request, Response, NextFunction } from 'express';
import https from 'https';
import { Sequelize } from 'sequelize';

interface Data {
  req: Request;
  res: Response;
  path: string;
  sequelize: Sequelize;
}

export default (path: string, sequelize: any): void => {
  const app = express();
  app.use(express.json());

  const port = 1445;
  let saits = new Map<string, string>();

  const server = https
    .createServer(
      {
        key: fs.readFileSync(`${path}/src/key.pem`),
        cert: fs.readFileSync(`${path}/src/cert.pem`),
        ca: [fs.readFileSync(`${path}/src/ca1.pem`), fs.readFileSync(`${path}/src/ca2.pem`)]
      },
      app
    )
    .listen(port, () => {
      console.log(`Server listens https://gamesggge.ru port: ${port}`);
    });

  app.use(
    '/img',
    (req: Request, res: Response, next: NextFunction) => {
      console.log(`============================ >>`);
      console.log(req.method + ' ' + req.url);
      console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
      console.log(`============================ >>`);
      res.setHeader('Cache-Control', 'max-age=2592000');
      next();
    },
    express.static(`${__dirname}/server/img`)
  );

  app.use('/js', express.static(`${__dirname}/server/js`));
  app.use('/css', express.static(`${__dirname}/server/css`));

  app.all(`*`, async (req: Request, res: Response) => {
    try {
      console.log(`============================ >>`);
      console.log(req.method + ` ` + req.url);
      console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress);

      function scanDirectory(directoryPath: string) {
        fs.readdir(directoryPath, async (err, files) => {
          if (err) {
            console.error('Ошибка чтения директории:', err);
            return;
          }

          files.forEach(async (file) => {
            const filePath = `${directoryPath}/${file}`;
            if (fs.statSync(filePath).isDirectory()) {
              scanDirectory(filePath);
            } else {
              const relativePath = filePath.replace(`${path}/server/`, '');
              saits.set("/" + relativePath, "/" + relativePath);
            }
          });
        });
      }

      scanDirectory(`${path}/server`);

      let pathname = req.url.replace(/[0-9/]*$/, "");
      let sait = saits.get(pathname.toLowerCase() + `.ts`);

      if (!pathname.toLowerCase()) sait = `main.ts`;
      if (!sait) {
        return res.status(404).send('Ошибка 404');
      } else {
        const data: Data = {
          req,
          res,
          path,
          sequelize
        };

        delete require.cache[require.resolve(__dirname + `/server/` + sait)];
        const module = await import(__dirname + `/server/` + sait);
        const handler = module.default || module;

        await handler[req.method.toLowerCase()](data).catch((err: Error) => {
          console.log(err);
          return res.status(500).send('Ошибка 500');
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send('Ошибка 500');
    } finally {
      console.log(`============================ <<`);
    }
  });
};
