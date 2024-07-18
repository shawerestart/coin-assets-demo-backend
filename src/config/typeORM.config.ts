import { DataSource, DataSourceOptions } from 'typeorm';
require('dotenv').config();
const baseConfig: DataSourceOptions = {
  type: 'mysql',
  timezone: '+08:00',
  host: process.env.NEST_MYSQL_HOST,
  port: parseInt(process.env.NEST_MYSQL_PORT) ?? 3306,
  username: process.env.NEST_MYSQL_USER,
  password: process.env.NEST_MYSQL_PASSWORD,
  database: process.env.NEST_MYSQL_DATABASE,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  charset: 'utf8mb4_unicode_ci',
};

// 该对象用于 nestjs typeorm 初始化
const ormConfig: DataSourceOptions = {
  ...baseConfig,
  entities: ['dist/**/entities/*.entity{.js,.ts}'],
};

// 该对象 typeorm cli 迁移时使用
const ormConfigForCli: DataSourceOptions = {
  ...baseConfig,
  entities: ['src/**/entities/*.entity{.js,.ts}'],
  migrations: ['migrations/*{.js,.ts}'], // migration:run时查找的文件夹subscribers: ['subscribers/*{.js,.ts}'],logger: 'file',logging: true,
};
// 实例化dataSource，用以之后cli使用
const dataSource = new DataSource(ormConfigForCli);

// 此处的dataSource需要 export default才可以使用
export { baseConfig, ormConfigForCli, ormConfig };
export default dataSource;
