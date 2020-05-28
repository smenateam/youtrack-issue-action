export interface Issue {
  fields?: IssueField[];
  $type?: string;
}
export interface IssueField<Value = { [key: string]: any }> {
  value: Value | null;
  name: string;
  id: string;
  $type: string;
}

export type PrField = IssueField<{ text: string }>;
