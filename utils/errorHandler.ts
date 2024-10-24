import { Exception } from '@adonisjs/core/exceptions'
import { OPERATION_NOT_SUPPORT, ROW_NOT_FOUND, VALIDATION_FAILED } from '../constants/errors.js'

export class ErrorHandler {
  private _statusCode: number | undefined
  private _message: string | undefined = undefined
  private _meta: Record<string, any> | undefined = undefined

  constructor(error: Error | Exception | any) {
    if (error instanceof Exception) {
      this._handleException(error)
    } else if (error instanceof Error) {
      this._handleError(error)
    } else {
      this._statusCode = 400
      throw new Error('Not Implemented')
    }
  }

  private _handleError(error: Error) {
    switch (error.message) {
      case OPERATION_NOT_SUPPORT:
        this._statusCode = 400
        break
      case VALIDATION_FAILED:
        this._statusCode = 400
        this._message = 'Invalid payload'
        this._meta = {
          errors: (error as any)?.messages || [],
        }
        break
      default:
        this._statusCode = 500
        this._message = error.message
        break
    }
  }

  private _handleException(error: Exception) {
    console.log(error.code)
    switch (error.code) {
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
        message: 'Server error',
      }
    }
    return {
      status: this._statusCode,
      message: this._message,
      meta: this._meta,
    }
  }
}
