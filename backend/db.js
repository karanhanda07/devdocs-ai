import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    user: "karanhanda",
    host: 'localhost',
    database: 'devdocs_ai',
    port: 5432,

});

export default pool;