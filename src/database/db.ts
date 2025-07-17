import initSqlJs from 'sql.js';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  user_id: string;
  created_at: string;
  updated_at: string;
}

class TaskDatabase {
  private db: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    const SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });

    // Try to load existing database from localStorage
    const savedDb = localStorage.getItem('taskDatabase');
    if (savedDb) {
      const uint8Array = new Uint8Array(JSON.parse(savedDb));
      this.db = new SQL.Database(uint8Array);
    } else {
      this.db = new SQL.Database();
    }

    this.initializeDatabase();
    this.initialized = true;
  }

  private initializeDatabase() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        priority TEXT NOT NULL DEFAULT 'medium',
        user_id TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    this.db.run(createTableQuery);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    const data = this.db.export();
    const buffer = Array.from(data);
    localStorage.setItem('taskDatabase', JSON.stringify(buffer));
  }

  async createTask(title: string, description: string, priority: Task['priority'] = 'medium', userId: string): Promise<Task> {
    await this.initialize();
    
    const stmt = this.db.prepare(`
      INSERT INTO tasks (title, description, priority, user_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    
    stmt.run([title, description, priority, userId]);
    const lastId = this.db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
    
    this.saveToLocalStorage();
    return this.getTaskById(lastId as number)!;
  }

  async getAllTasks(userId: string): Promise<Task[]> {
    await this.initialize();
    
    const result = this.db.exec('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    if (result.length === 0) return [];
    
    const columns = result[0].columns;
    const values = result[0].values;
    
    return values.map(row => {
      const task: any = {};
      columns.forEach((col, index) => {
        task[col] = row[index];
      });
      return task as Task;
    });
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    await this.initialize();
    
    const result = this.db.exec('SELECT * FROM tasks WHERE id = ?', [id]);
    if (result.length === 0) return undefined;
    
    const columns = result[0].columns;
    const values = result[0].values;
    
    if (values.length === 0) return undefined;
    
    const task: any = {};
    columns.forEach((col, index) => {
      task[col] = values[0][index];
    });
    
    return task as Task;
  }

  async updateTask(id: number, updates: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>>): Promise<Task | undefined> {
    await this.initialize();
    
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) return this.getTaskById(id);
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const stmt = this.db.prepare(`
      UPDATE tasks 
      SET ${setClause}, updated_at = datetime('now')
      WHERE id = ?
    `);
    
    stmt.run([...values, id]);
    this.saveToLocalStorage();
    
    return this.getTaskById(id);
  }

  async deleteTask(id: number): Promise<boolean> {
    await this.initialize();
    
    const stmt = this.db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run([id]);
    
    this.saveToLocalStorage();
    return true;
  }

  async getTasksByStatus(status: Task['status'], userId: string): Promise<Task[]> {
    await this.initialize();
    
    const result = this.db.exec('SELECT * FROM tasks WHERE status = ? AND user_id = ? ORDER BY created_at DESC', [status, userId]);
    if (result.length === 0) return [];
    
    const columns = result[0].columns;
    const values = result[0].values;
    
    return values.map(row => {
      const task: any = {};
      columns.forEach((col, index) => {
        task[col] = row[index];
      });
      return task as Task;
    });
  }

  async getTasksByPriority(priority: Task['priority'], userId: string): Promise<Task[]> {
    await this.initialize();
    
    const result = this.db.exec('SELECT * FROM tasks WHERE priority = ? AND user_id = ? ORDER BY created_at DESC', [priority, userId]);
    if (result.length === 0) return [];
    
    const columns = result[0].columns;
    const values = result[0].values;
    
    return values.map(row => {
      const task: any = {};
      columns.forEach((col, index) => {
        task[col] = row[index];
      });
      return task as Task;
    });
  }
}

export const taskDb = new TaskDatabase();