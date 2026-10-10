import { analyse } from "./emailBotLogic";
import "./styles/EmailBot.css";

interface Props {
  value: string;
  onFix: (email: string) => void;
}

const EmailBot = ({ value, onFix }: Props) => {
  const { mood, msg, fix } = analyse(value);
  const left = value ? 0 : 1;
  const scared = mood === "confused" || mood === "typo";
  return (
    <>
      <svg className="email-bot-icon" data-mood={mood} viewBox="0 0 24 22" shapeRendering="crispEdges" aria-hidden="true">
        {mood === "happy" ? (
          <g className="px-pac">
            <rect className="px-body" x="8" y="3" width="8" height="1" />
            <rect className="px-body" x="6" y="4" width="12" height="1" />
            <rect className="px-body" x="5" y="5" width="14" height="1" />
            <rect className="px-body" x="4" y="6" width="16" height="10" />
            <rect className="px-body" x="5" y="16" width="14" height="1" />
            <rect className="px-body" x="6" y="17" width="12" height="1" />
            <rect className="px-body" x="8" y="18" width="8" height="1" />
            <rect className="px-mouth" x="12" y="8" width="9" height="6" />
            <rect className="px-pupil" x="11" y="6" width="2" height="2" />
            <rect className="px-body px-pellet" x="21" y="10" width="2" height="2" />
          </g>
        ) : (
          <g className="px-ghost">
            <rect className="px-body" x="8" y="2" width="8" height="1" />
            <rect className="px-body" x="6" y="3" width="12" height="1" />
            <rect className="px-body" x="5" y="4" width="14" height="1" />
            <rect className="px-body" x="4" y="5" width="16" height="12" />
            <rect className="px-body" x="4" y="17" width="4" height="3" />
            <rect className="px-body" x="10" y="17" width="4" height="3" />
            <rect className="px-body" x="16" y="17" width="4" height="3" />
            {scared ? (
              <>
                <rect className="px-white" x="8" y="9" width="2" height="2" />
                <rect className="px-white" x="14" y="9" width="2" height="2" />
                {mood === "confused" ? (
                  <g className="px-ink">
                    <rect x="6" y="14" width="2" height="1" />
                    <rect x="8" y="13" width="2" height="1" />
                    <rect x="10" y="14" width="2" height="1" />
                    <rect x="12" y="13" width="2" height="1" />
                    <rect x="14" y="14" width="2" height="1" />
                    <rect x="16" y="13" width="2" height="1" />
                  </g>
                ) : (
                  <rect className="px-ink" x="11" y="13" width="2" height="2" />
                )}
              </>
            ) : (
              <>
                <rect className="px-white" x="7" y="8" width="4" height="5" />
                <rect className="px-white" x="13" y="8" width="4" height="5" />
                <rect className="px-pupil" x={7 + left} y={mood === "close" ? 8 : 10} width="2" height="3" />
                <rect className="px-pupil" x={13 + left} y={mood === "close" ? 8 : 10} width="2" height="3" />
              </>
            )}
          </g>
        )}
      </svg>
      <p className="email-bot-msg" data-mood={mood} aria-live="polite">
        {msg}
        {fix && (
          <button type="button" className="email-bot-fix" onClick={() => onFix(fix)} data-cursor="disable">
            FIX IT
          </button>
        )}
      </p>
    </>
  );
};

export default EmailBot;
