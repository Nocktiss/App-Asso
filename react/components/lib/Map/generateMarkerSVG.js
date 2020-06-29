export default function generateMarkerSVG(imageUrl, color = "#1F8B8F") {
  imageUrl = imageUrl || "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 70" enable-background="new 0 0 50 70" xml:space="preserve" preserveAspectRatio="xMidYMid meet">
            <symbol id="default_veterinary" width="1280.000000pt" height="1280.000000pt" viewBox="0 0 1280.000000 1280.000000"
            preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
            fill="${color}" stroke="none">
            <path d="M4969 10256 c-646 -572 -1825 -1616 -2620 -2320 -794 -703 -1445
            -1282 -1447 -1286 -3 -8 537 -620 548 -620 4 0 407 354 896 788 489 433 1515
            1341 2278 2017 764 677 1426 1263 1472 1302 l82 73 2358 -2090 c1298 -1149
            2364 -2089 2369 -2089 6 0 131 138 279 306 196 223 267 309 260 319 -5 7
            -1185 1054 -2621 2327 -2305 2040 -2617 2313 -2645 2314 -30 1 -146 -100
            -1209 -1041z"/>
            <path d="M2470 9648 l0 -992 33 30 c31 30 1280 1156 1284 1158 0 1 5 180 9
            399 l7 397 -667 0 -666 0 0 -992z"/>
            <path d="M5744 9127 c-236 -210 -1070 -949 -1852 -1641 l-1422 -1259 0 -2371
            c0 -2275 1 -2373 19 -2411 23 -51 74 -101 120 -117 28 -10 286 -13 1216 -13
            l1180 0 5 1065 c5 985 6 1067 22 1097 23 42 80 88 127 102 28 8 315 11 1027
            11 939 0 991 -1 1030 -19 57 -26 110 -92 123 -153 7 -33 11 -392 11 -1078 l0
            -1030 1163 0 c1261 0 1218 -2 1291 54 19 14 43 45 55 69 l21 43 1 2375 1 2374
            -314 280 c-289 258 -3344 2963 -3378 2991 -13 10 -83 -48 -446 -369z"/>
            </g>
            </symbol>
            <clipPath id="myClip">
              <circle cx="25" cy="25" r="22" />
            </clipPath>
            <circle cx="25" cy="25" r="25" fill="${color}" />
            <path d="M15 55, L25 70, L35 55, L15 55" fill="${color}" />
            <circle cx="25" cy="25" r="22" fill="white" />` +
    (imageUrl
      ? `<image clip-path="url(#myClip)" preserveAspectRatio="xMidYMid meet" width="44" height="44" x="3" y="3" xlink:href="${imageUrl}" />`
      : '<use href="#default_veterinary" width="35" height="35" x="8" y="6" />') +
    `</svg>`
  );
}
