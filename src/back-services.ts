const URL_BACK = "http://127.0.0.1:5000";
const HEADERS = {'Accept':'application/json',
    'Content-Type':'application/json'}
export const postNoNftLottery = async (signature: string): Promise<any> => {
    return await fetch(`${URL_BACK}/noNftLottery`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
            signature: signature
        })
    })
    .then(res => res.json())
    .catch(err => {
        throw err;
    })
}

export const postOneNftLottery = async (signature: string): Promise<any> => {
    return await fetch(`${URL_BACK}/oneNftLottery`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
            signature: signature
        })
    })
    .then(res => res.json())
    .catch(err => {
        throw err;
    })
}

export const getTotalNfts = async (): Promise<Number> => {
    return await fetch(`${URL_BACK}/totalNfts`, {
        method: 'GET',
        headers: HEADERS,
    })
    .then(res => res.json())
    .then(res => res.totalNfts)
    .catch(err => {
        throw err;
    })
}

export const getTotalMinted = async (address: string): Promise<Number> => {
    return await fetch(`${URL_BACK}/totalMinted?address=${address}`, {
        method: 'GET',
        headers: HEADERS,
    })
    .then(res => res.json())
    .then(res => res.totalMinted)
    .catch(err => {
        throw err;
    })
}

export const postMint = async (signature: string): Promise<any> => {
    return await fetch(`${URL_BACK}/mint`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
            signature: signature
        })
    })
    .then(res => res.json())
    .catch(err => {
        throw err;
    })
}