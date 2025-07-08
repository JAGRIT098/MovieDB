interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  Plot?: string;
  Director?: string;
  Actors?: string;
  Runtime?: string;
  Genre?: string;
  imdbRating?: string;
  Released?: string;
  Writer?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
}

interface UserWatchlist {
  userId: string;
  movies: Movie[];
}

class MovieDatabase {
  private dbName = 'MovieDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('username', 'username', { unique: true });
          userStore.createIndex('email', 'email', { unique: true });
        }

        // Watchlists store
        if (!db.objectStoreNames.contains('watchlists')) {
          db.createObjectStore('watchlists', { keyPath: 'userId' });
        }
      };
    });
  }

  async createUser(username: string, email: string, password: string): Promise<User> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');

      const user: User = {
        id: crypto.randomUUID(),
        username,
        email,
        password, // In production, this should be hashed
        createdAt: new Date()
      };

      const request = store.add(user);

      request.onsuccess = () => resolve(user);
      request.onerror = () => reject(new Error('Username or email already exists'));
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('username');
      const request = index.get(username);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('email');
      const request = index.get(email);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async getWatchlist(userId: string): Promise<Movie[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['watchlists'], 'readonly');
      const store = transaction.objectStore('watchlists');
      const request = store.get(userId);

      request.onsuccess = () => {
        const result = request.result as UserWatchlist;
        resolve(result ? result.movies : []);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveWatchlist(userId: string, movies: Movie[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['watchlists'], 'readwrite');
      const store = transaction.objectStore('watchlists');
      
      const watchlist: UserWatchlist = { userId, movies };
      const request = store.put(watchlist);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const movieDB = new MovieDatabase();
export type { User, Movie };