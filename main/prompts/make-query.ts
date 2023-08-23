export default function (schema: string, query: string) {
  return `
      make an query for postgres for: "${query}";
      
      use double quotes in table name;

      my database schema is: ${schema}
  `;
}
