export const query = `
query{
    user{
        createdAt
        login
        campus
        firstName
        lastName
        totalUp
        totalDown
        auditRatio
    }
    transaction( 
        where: {
            type:{ _eq: "xp"},
            eventId: {_eq: "85"}},
        order_by:{ createdAt: asc },
        )
        {
        type
        amount
        eventId
        object{
            name
        }
        createdAt
    }
}
`
export function formattedDate(input) {
    const inputDate = new Date(input);
    const day = inputDate.getUTCDate();
    const month = inputDate.getUTCMonth() + 1; // Months are zero-based
    const year = inputDate.getUTCFullYear();
    const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    // console.log('date', formattedDate);
    return formattedDate;
}

export function formatBytes(bytes) {
    if (bytes < 1000) {
        return bytes + " B";
    } else if (bytes < 1000 * 1000) {
        return (bytes / 1000).toFixed(3) + " KB";
    } else if (bytes < 1000 * 1000 * 1000) {
        return (bytes / (1000 * 1000)).toFixed(3) + " MB";
    } else {
        return (bytes / (1000 * 1000 * 1000)).toFixed(3) + " GB";
    }
}

// outputs less xp then Intra )))
// export function formatBytes(bytes) {
//     if (bytes < 1024) {
//         return bytes + " B";
//     } else if (bytes < 1024 * 1024) {
//         return (bytes / 1024).toFixed(3) + " KB";
//     } else if (bytes < 1024 * 1024 * 1024) {
//         return (bytes / (1024 * 1024)).toFixed(3) + " MB";
//     } else {
//         return (bytes / (1024 * 1024 * 1024)).toFixed(3) + " GB";
//     }
// }



