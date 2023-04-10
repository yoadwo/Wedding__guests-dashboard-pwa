// used as request body send texts endpoint
export interface guestRM {
    firstName: string,
    phoneNumber: string,
    phoneNumberHash: string,
}

export interface guestEM {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    phoneNumberHash: string,
    status: number
}

// used as response from get all guests
export interface guestsResponse {
    data: guestEM[];
}