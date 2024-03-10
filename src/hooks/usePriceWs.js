import {useEffect, useState} from "react";
import {WS_API_URL} from "@/utils/constants.js";

const usePriceWs = () => {
    const [priceWs, setPriceWs] = useState()

    useEffect(() => {
        const pricesWs = new WebSocket(WS_API_URL)
        pricesWs.onmessage = function (msg) {
            setPriceWs(JSON.parse(msg.data));
        }
        return () => {
            pricesWs.close()
        }
    }, []);

    return priceWs;
};

export default usePriceWs;
