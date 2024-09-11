import Server from './server';
import config from './config.json';
import { Sequelize, Dialect } from 'sequelize';

interface Config {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
}

const sequelizeConfig: Config = {
    ...config,
    dialect: config.dialect as Dialect
};

const sequelize = new Sequelize(sequelizeConfig);

(async () => {
    try {
        await sequelize.authenticate();
        const Action = (await import('./models/actionModel')).default(sequelize);
        await sequelize.sync();
        console.log('Подключение установлено!');
        console.log('Все таблицы синхронизированы');
        Server(__dirname, sequelize);
    } catch (error) {
        console.error('Ошибка подключения к БД: ', error);
    }
})();

// npx ts-node index.ts