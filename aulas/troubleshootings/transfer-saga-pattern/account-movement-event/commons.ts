export type FunctionType = 'API' | 'EVENT';

export interface TransferRequest {
    accountFrom: string;
    accountTo: string;
    amount: number;
    date: string;
}

export interface TransferResponse extends TransferRequest {
    id: string;
    status: string;
}

export interface TransferDomain {
    id: string;
    accountFrom: string;
    accountTo: string;
    amount: number;
    date: string;
    timestamp: number;
    status: string;
}

export interface AccountBalanceRequest {
    account: string;
    amount: number;
}

export interface AccountBalanceResponse extends AccountBalanceRequest {
}

export interface AccountBalanceDomain {
    account: string,
    amount: number
}

export type MovementStatus = 'SUCESS' | 'FAILED';

export interface EffectiveMovementEvent {
    transferId: string,
    status: MovementStatus,
    message: string
}

export interface ResponseError {
    statusCode: number;
    message: string;
    detailMessage?: string;
    errors?: string[];
    stack?: string;
}

export class IllegalArgumentError extends Error {
    errors?: string[];
    constructor(message: string, errors?: string[]) {
        super(message);
        this.errors = errors;
    }
}

export const errorHandler = (err: any, functionType: FunctionType): any => {
    console.error(err);

    let responseDetail: ResponseError = {
        message: 'internal error',
        statusCode: 500,
    };

    if (err instanceof IllegalArgumentError) {
        responseDetail = {
            statusCode: 400,
            message: 'fields errors',
            detailMessage: err.message,
            stack: err.stack,
            errors: err.errors,
        };
    } else if (err instanceof Error) {
        responseDetail = {
            ...responseDetail,
            detailMessage: err.message,
            stack: err.stack,
        };
    }

    if (functionType === 'API') {
        return {
            statusCode: responseDetail.statusCode,
            body: JSON.stringify(responseDetail),
        };
    } else {
        throw Error(JSON.stringify(responseDetail));
    }
};
