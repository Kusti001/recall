export function ForgettingCurve() {
  return (
    <svg className="curve-svg" viewBox="0 0 460 260" fill="none">

              <g stroke="#2c3137" stroke-width="1">
                <line x1="0" y1="40" x2="460" y2="40"></line>
                <line x1="0" y1="100" x2="460" y2="100"></line>
                <line x1="0" y1="160" x2="460" y2="160"></line>
                <line x1="0" y1="220" x2="460" y2="220"></line>
              </g>

              <path d="M0,60 C 30,110 55,150 70,165" stroke="#e2606c" stroke-width="2" fill="none"></path>
              <path d="M70,165 C 90,90 100,60 108,52" stroke="#5d6369" stroke-width="1.5" stroke-dasharray="2 4" fill="none"></path>
              <path d="M108,52 C 150,95 180,140 200,158" stroke="#e0a24a" stroke-width="2" fill="none"></path>
              <path d="M200,158 C 215,80 225,45 232,38" stroke="#5d6369" stroke-width="1.5" stroke-dasharray="2 4" fill="none"></path>
              <path d="M232,38 C 285,75 320,110 345,128" stroke="#6c93e8" stroke-width="2" fill="none"></path>
              <path d="M345,128 C 355,60 362,32 368,26" stroke="#5d6369" stroke-width="1.5" stroke-dasharray="2 4" fill="none"></path>
              <path d="M368,26 C 410,42 435,58 460,70" stroke="#5cb787" stroke-width="2.5" fill="none"></path>


              <circle cx="70" cy="165" r="4.5" fill="#e2606c"></circle>
              <circle cx="200" cy="158" r="4.5" fill="#e0a24a"></circle>
              <circle cx="345" cy="128" r="4.5" fill="#6c93e8"></circle>
              <circle cx="460" cy="70" r="4.5" fill="#5cb787"></circle>

              <g font-family="IBM Plex Mono" font-size="10" fill="#5d6369">
                <text x="60" y="245">день 1</text>
                <text x="185" y="245">день 3</text>
                <text x="325" y="245">неделя 2</text>
                <text x="425" y="245">месяц 1</text>
              </g>
            </svg>
  );
}
