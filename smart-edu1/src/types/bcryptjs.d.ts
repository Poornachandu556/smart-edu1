declare module 'bcryptjs' {
  export function hash(data: string, salt: number | string): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function genSalt(rounds?: number): Promise<string>;
  const _default: {
    hash: typeof hash;
    compare: typeof compare;
    genSalt: typeof genSalt;
  };
  export default _default;
}
