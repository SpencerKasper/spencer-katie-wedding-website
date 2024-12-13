const getAPIUrl = (path) => `${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api${path}`
export const getGuestListEndpointUrl = () => getAPIUrl('/guestlist');
export const getTablesEndpointUrl = () => getAPIUrl('/tables');
export const getGuestListBffEndpointUrl = () => getAPIUrl('/bff/guestlist/add-edit-guest');