interface EnvMap {
  [key: string]: string | undefined;
}

interface AppConfig {
  nodeEnv: string;
  port: number;
  baseUrl?: string;
}

class EnvConfig {
  private static _instance: EnvConfig | null = null;
  private readonly env: EnvMap;

  // grouped config objects
  private readonly _app: AppConfig;

  private constructor() {
    this.env = { ...process.env };

    // initialize grouped configs using existing getters (will throw if required variable is missing)
    this._app = {
      nodeEnv: this.get("NODE_ENV", "development"),
      port: this.getNumber("PORT", 3000),
      baseUrl: this.has("VITE_REACT_APP_API_URL") ? this.get("VITE_REACT_APP_API_URL") : undefined,
    };
  }

  public static get instance(): EnvConfig {
    if (!EnvConfig._instance) {
      EnvConfig._instance = new EnvConfig();
    }
    return EnvConfig._instance;
  }

  // Generic getter (throws if missing and no fallback provided)
  public get(key: string, fallback?: string): string {
    const v = this.env[key] ?? fallback;
    if (v === undefined) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return v;
  }

  // Typed number getter
  public getNumber(key: string, fallback?: number): number {
    const raw = this.env[key];
    if ((raw === undefined || raw === "") && fallback !== undefined)
      return fallback;
    if (raw === undefined || raw === "") {
      throw new Error(`Missing numeric environment variable: ${key}`);
    }
    const n = Number(raw);
    if (Number.isNaN(n))
      throw new Error(`Environment variable ${key} is not a number`);
    return n;
  }

  // Boolean getter (accepted 'true'|'1' => true)
  public getBoolean(key: string, fallback?: boolean): boolean {
    const raw = this.env[key];
    if ((raw === undefined || raw === "") && fallback !== undefined)
      return fallback;
    if (raw === undefined || raw === "")
      throw new Error(`Missing boolean environment variable: ${key}`);
    return raw === "true" || raw === "1";
  }

  // Safe check
  public has(key: string): boolean {
    return this.env[key] !== undefined;
  }

  // Return a copy of all env values (stringified)
  public all(): EnvMap {
    return { ...this.env };
  }

  // direct typed accessors for grouped configs
  public get app(): AppConfig {
    return this._app;
  }

  // Convenience typed properties (backwards compatibility)
  public get NODE_ENV(): string {
    return this._app.nodeEnv;
  }

  public get PORT(): number {
    return this._app.port;
  }
}

export default EnvConfig.instance;
