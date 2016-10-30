declare module "check-options" {
  function checkOptions(options: {}, requiredFields: string[], defaults: Object, context?: string);
  function checkOptions(options: {}, defaults: Object, context?: string);
  function checkOptions(options: {}, requiredFields: string[], context?: string)
  function checkOptions(options: {}, context?: string);

  export = checkOptions;
}
