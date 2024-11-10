import { Sequelize, DataTypes, Model, Optional } from "sequelize";

// 从环境变量中读取数据库配置
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = "" } = process.env;

const [host, port] = MYSQL_ADDRESS.split(":");

if (!MYSQL_USERNAME)
  throw new Error("Please provide MYSQL_USERNAME in environment variable");

const sequelize = new Sequelize("nodejs_demo", MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port: Number(port),
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});

// 定义数据模型
interface CounterAttributes {
  id?: number;
  count: number;
}

interface CounterCreationAttributes extends Optional<CounterAttributes, "id"> {}

class Counter extends Model<CounterAttributes, CounterCreationAttributes> implements CounterAttributes {
  public id!: number;
  public count!: number;
}

Counter.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "Counters",
  }
);

// 数据库初始化方法
async function init() {
  await Counter.sync({ alter: true });
}

// 导出初始化方法和模型
export { init, Counter };