// Type definitions for Node.js
declare module 'node:process' {
  export * from 'process';
}

declare module 'process' {
  export = globalThis.process;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    [key: string]: string | undefined;
  }

  interface Process {
    env: ProcessEnv;
  }

  let process: Process;
}

declare const process: NodeJS.Process;
