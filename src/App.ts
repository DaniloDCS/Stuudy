import express from 'express';
import cors from 'cors';
import layouts from 'express-ejs-layouts';
import {
  routes
} from './routes';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({
      extended: true
    }));
    this.express.use(layouts);
    this.express.set('view engine', 'ejs');
    this.express.use('/bootstrap/', express.static('node_modules/bootstrap/dist/'));
    this.express.use('/fontawesome/', express.static('node_modules/@fortawesome/fontawesome-free/'));
    this.express.use('/chart/', express.static('node_modules/chart.js/dist/'));
  }

  private routes(): void {
    this.express.use(routes);
    this.express.use(function (req, res, next) {
      return res.status(404).redirect('/');
    });
  }
}

export default new App().express;
