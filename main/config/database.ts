import knex, { Knex } from "knex";

type InstanceData = {
  host: string;
  data: string;
  user: string;
  password: string;
  database: string;
  port: number;
  client: string;
};

export class Database {
  static database: Knex;

  static async instance(data: InstanceData): Promise<Knex> {
    if (!this.database) {
      try {
        this.database = knex({
          client: data.client,
          connection: {
            host: data.host,
            user: data.user,
            password: data.password,
            database: data.database,
            port: data.port,
            charset: "utf8",
          },
        });
      } catch (error) {
        throw new Error();
      }
    }

    return this.database;
  }

  public static getDatabase(): Knex {
    return this.database;
  }
}
