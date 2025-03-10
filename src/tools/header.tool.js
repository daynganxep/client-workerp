import { getLS } from "@tools/localStorage.tool";
import _ from "lodash";

export function getHeaders(headerField = ["accessToken"], options = {}) {
    return { ..._.pick(getLS("tokens"), headerField), ...options };
}
