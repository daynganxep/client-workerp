import stc from "string-to-color";
import Color from "color";

export function stringToColor(str, opacity = 1) {
    return Color(stc(str)).alpha(opacity).string();
}
export const currencyFormat = (string) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(string);
};
