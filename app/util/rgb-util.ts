export const getBrightness = (colorAsHex: string) => {
    const colorWithoutPound = colorAsHex.startsWith('#') ? colorAsHex.substring(1) : colorAsHex;
    const rgb = parseInt(colorWithoutPound, 16);   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >>  8) & 0xff;  // extract green
    const b = (rgb >>  0) & 0xff;  // extract blue

    // https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
    // https://en.wikipedia.org/wiki/Rec._709#Luma_coefficients
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}