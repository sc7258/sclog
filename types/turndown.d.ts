declare module "turndown" {
  class TurndownService {
    constructor(options?: any);
    use(plugin: any): TurndownService;
    addRule(key: string, rule: any): TurndownService;
    remove(key: string): TurndownService;
    keep(filter: any): TurndownService;
    turndown(input: string | Node): string;
  }

  export = TurndownService;
}
