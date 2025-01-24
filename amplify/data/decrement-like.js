import { util } from '@aws-appsync/utils';

export function request(ctx) {
  return {
    operation: 'UpdateItem',
    key: util.dynamodb.toMapValues({ id: ctx.args.postId}),
    update: {
      expression: 'ADD likes :minusOne',
      expressionValues: { ':minusOne': { N: -1 } },
    }
  }
}

export function response(ctx) {
  return ctx.result
}