import { useEffect, useState, useCallback } from 'react'

export function friendlyData(datsStr){
    const dateObj=typeof datsStr==='object' ? datsStr : new Date(datsStr)
    const time=dateObj.getTime()
    const now=Date.now()
    const space=now-time
    let str=''

    switch (true){
        case space<1000*60:
            str='刚刚'
            break
        case space<1000*3600:
            str=Math.floor(space/(1000*60))+'分钟前'
            break
        case space<1000*3600*24:
            str=Math.floor(space/(1000*3600))+'小时前'
            break
        default:
            str=Math.floor(space/(1000*3600*24))+'天前'
    }
    return str
}

export const useSyncCallback = callback => {
    const [proxyState, setProxyState] = useState({ current: false })

    const Func = useCallback(() => {
        setProxyState({ current: true })
    }, [proxyState])

    useEffect(() => {
        if (proxyState.current) setProxyState({ current: false })
    }, [proxyState])

    useEffect(() => {
        proxyState.current && callback()
    })
    return Func
}


