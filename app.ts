import * as express from 'express';
import * as cors from 'cors';
import { createConnection, Connection, ConnectionOptions} from 'mysql';

interface AppConfig {
    port: number;
    corsOptions: cors.CorsOptions;
}

interface DBConfig extends ConnectionOptions {
    host: string;
    user: string;
    password: string;
    database: string;
}

class App {
    public express: express.Application;
    public config: AppConfig;
    public db: Connection;

    constructor(config: AppConfig) {
        this.express = express();
        this.config = config;

        this.express.use(express.json());
        this.express.use(cors(config.corsOptions));
        this.dbConnect();
        this.routes();
    }

    private dbConnect(): void {
        const dbConfig: DBConfig = {
            host: '127.0.0.1',
            user: 'devuser',
            password: 'Thisisit132',
            database: 'classicmodels',
        };
        this.db = createConnection(dbConfig);
    }

    private routes(): void {
        this.express.get('/', (req: express.Request, res: express.Response) => {
            this.db.query("SELECT * FROM customers", (err, row) => {
                if (err) {
                    console.log(err);
                    res.status(500).send();
                } else {
                    let customers = JSON.parse(JSON.stringify(row))
                    res.json(customers);
                }
            });
        });

        this.express.delete('/customers/:customerNumber', (req: express.Request, res: express.Response) => {
            const customerNumber = req.params.customerNumber;
            console.log(customerNumber)
            this.db.query(`DELETE FROM customers WHERE customerNumber = ${customerNumber}`, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: 'Error deleting customer' });
                } else {
                    console.log(`Deleted customer with customerNumber = ${customerNumber}`);
                    res.status(200).json({message: `Deleted customer with customerNumber = ${customerNumber}`});
                }
            });
        });

    }

    public listen(): void {
        this.express.listen(this.config.port, () => {
            console.log(`Server started on port ${this.config.port}`);
        });
    }
}

const config: AppConfig = {
    port: 3000,
    corsOptions: {
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
    }
};

const app = new App(config);
app.listen();
