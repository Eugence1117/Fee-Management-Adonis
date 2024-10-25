import { Exception } from '@adonisjs/core/exceptions'
import {
  FORBIDDEN,
  INVALID_CREDENTIAL,
  OPERATION_NOT_SUPPORT,
  ROW_NOT_FOUND,
  VALIDATION_FAILED,
} from '../constants/errors.js'

// https://docs.adonisjs.com/guides/references/exceptions#exceptions-reference
export class ErrorHandler {
  private _statusCode: number | undefined
  private _message: string | undefined = undefined
  private _meta: Record<string, any> | undefined = undefined

  constructor(error: Error | Exception | any) {
    const errorCode =
      error instanceof Exception ? error?.code : error instanceof Error ? error.message : null
    switch (errorCode) {
      case OPERATION_NOT_SUPPORT:
        this._statusCode = 400
        break
      case VALIDATION_FAILED:
        this._statusCode = 400
        this._message = 'Invalid payload.'
        this._meta = {
          errors: (error as any)?.messages || [],
        }
        break
      case INVALID_CREDENTIAL:
        this._statusCode = (error as Exception).status
        this._message = 'Invalid user credential.'

        break
      case FORBIDDEN:
        this._statusCode = 403
        this._message = 'Action not allowed.'
        break
      case ROW_NOT_FOUND:
        this._statusCode = 404
        this._message = 'Target resource not found.'
        break
      default:
        this._statusCode = 500
        this._message = error.message
        break
    }
  }

  toResponseBody() {
    if (!this._statusCode) {
      return {
        status: 500,
        message: 'Server error.',
      }
    }
    return {
      status: this._statusCode,
      message: this._message,
      meta: this._meta,
    }
  }
}
