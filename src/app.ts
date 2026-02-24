import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { CategoriesRoutes } from './modules/categories/categories.route';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
// app.use('/api/v1', router);

// !categories routes
app.use("/categories",CategoriesRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Assalamu alaikum! Welcome to the MediStore API');
});


export default app;
