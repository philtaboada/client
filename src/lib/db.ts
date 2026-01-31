import { Pool, QueryResult, QueryResultRow } from 'pg';

/**
 * Database connection pool for PostgreSQL
 * Using pg.Pool is recommended for web applications
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Add some sensible defaults for the pool
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * Helper function for running SQL queries
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Executed query', { text, duration, rows: res.rowCount });
  }
  
  return res;
}

/**
 * Helper to get a client from the pool for transactions
 */
export const getClient = () => pool.connect();

export default pool;
