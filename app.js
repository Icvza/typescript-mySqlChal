"use strict";
exports.__esModule = true;
var express = require("express");
var cors = require("cors");
var mysql_1 = require("mysql");
var App = /** @class */ (function () {
    function App(config) {
        this.express = express();
        this.config = config;
        this.express.use(express.json());
        this.express.use(cors(config.corsOptions));
        this.dbConnect();
        this.routes();
    }
    App.prototype.dbConnect = function () {
        var dbConfig = {
            host: '127.0.0.1',
            user: 'devuser',
            password: 'Thisisit132',
            database: 'classicmodels'
        };
        this.db = (0, mysql_1.createConnection)(dbConfig);
    };
    App.prototype.routes = function () {
        var _this = this;
        this.express.get('/', function (req, res) {
            _this.db.query("SELECT * FROM customers", function (err, row) {
                if (err) {
                    console.log(err);
                    res.status(500).send();
                }
                else {
                    var customers = JSON.parse(JSON.stringify(row));
                    res.json(customers);
                }
            });
        });
        this.express["delete"]('/customers/:customerNumber', function (req, res) {
            var customerNumber = req.params.customerNumber;
            console.log(customerNumber);
            _this.db.query("DELETE FROM customers WHERE customerNumber = ".concat(customerNumber), function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: 'Error deleting customer' });
                }
                else {
                    console.log("Deleted customer with customerNumber = ".concat(customerNumber));
                    res.status(200).json({ message: "Deleted customer with customerNumber = ".concat(customerNumber) });
                }
            });
        });
    };
    App.prototype.listen = function () {
        var _this = this;
        this.express.listen(this.config.port, function () {
            console.log("Server started on port ".concat(_this.config.port));
        });
    };
    return App;
}());
var config = {
    port: 3000,
    corsOptions: {
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
    }
};
var app = new App(config);
app.listen();
