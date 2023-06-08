// used as request body send texts endpoint
export interface guestRM {
    recipient: string,
    phoneNumber: string,
    phoneNumberHash: string,
}

export interface guestEM {
    recipient: string,
    phoneNumber: string,
    phoneNumberHash: string,
    status: number,
    attendingCount: number,
    side: string,
    _group: string,
    messagesReceived: number
}

export interface guestsWrapper {
    guests: guestEM[],
    rsvpLink: string
}

// used as response from get all guests
export interface guestsResponse {
    data: guestsWrapper;
}