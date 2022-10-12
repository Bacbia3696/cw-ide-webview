export interface ContractType {
  contract?: String;
  handleFile?: String;
  queryFile?: String;
  migrateFile?: String;
  action?: String;
  chainName?: String;

  mnemonic?: String;
  payload?: String;
  schemaFile?: String;
  migrateSchemaFile?: String;
}
