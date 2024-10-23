export type Filter = Array<Condition>

export type Condition = {
  field: string
  value: any
  operator: Operator
  $and?: Condition
}

type Operator = `${'' | 'not.'}${OperatorSyntax}`
export type OperatorSyntax = 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'like' | 'in'
