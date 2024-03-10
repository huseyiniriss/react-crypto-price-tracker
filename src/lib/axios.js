import axios from "axios";
import {API_URL} from "@/utils/constants.js";
export const service = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
        }
    }
);
