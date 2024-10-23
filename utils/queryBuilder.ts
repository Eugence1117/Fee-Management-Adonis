import { BaseModel } from '@adonisjs/lucid/orm'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { Condition, Filter, OperatorSyntax } from '../types/filter.js'
import { Populate } from '../types/populate.js'

export function buildQuery<T extends typeof BaseModel>(
  query: ModelQueryBuilderContract<T>,
  populate: Populate | undefined = undefined,
  filter: Filter | undefined = undefined
) {
  if (filter) {
    constructWhereStatement(query, filter)
  }
  if (populate && typeof populate !== 'string') {
    query.select(...populate.filter((p) => p))
  }
  return query
}

function constructWhereStatement<T extends typeof BaseModel>(
  query: ModelQueryBuilderContract<T>,
  filters: Filter
) {
  filters.forEach((filter) => {
    return query.orWhere((q) => constructWhereClause(q, filter))
  })
}

function constructWhereClause<T extends typeof BaseModel>(
  query: ModelQueryBuilderContract<T, InstanceType<T>>,
  condition: Condition
) {
  if (condition.field) {
    if (condition.operator.startsWith('not.')) {
      query.whereNot(
        condition.field as string,
        translateOperator(condition.operator),
        condition.value
      )
    } else {
      query.where(condition.field as string, translateOperator(condition.operator), condition.value)
    }
  }
  if (condition.$and) {
    constructWhereClause(query, condition.$and)
  }
  return query
}

function translateOperator(operator: Condition['operator']) {
  const sanitizedOperator = operator.replace('.not', '') as OperatorSyntax
  switch (sanitizedOperator) {
    case 'eq':
      return '='
    case 'neq':
      return '!='
    case 'gt':
      return '>'
    case 'gte':
      return '>='
    case 'lt':
      return '<'
    case 'lte':
      return '<='
    case 'in':
      return 'IN'
    case 'like':
      return 'LIKE'
  }
}
