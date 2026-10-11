import { useState } from "react";
import FlipGame from "./FlipGame";
import StackGame from "./StackGame";
import "./styles/GameArcade.css";

const GAMES = [
  { id: "flip", label: "FLIP.EXE", isNew: true },
  { id: "stack", label: "STACK.EXE", isNew: true },
] as const;

type GameId = (typeof GAMES)[number]["id"];

const GameArcade = () => {
  const [game, setGame] = useState<GameId>("flip");

  return (
    <div className="arcade">
      <div className="arcade-tabs" role="tablist" aria-label="Pick a game" data-cursor="disable">
        {GAMES.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={game === g.id}
            className={`arcade-tab ${game === g.id ? "is-on" : ""}`}
            onClick={() => setGame(g.id)}
          >
            {g.label}
            {g.isNew && game !== g.id && <i className="arcade-new">NEW</i>}
          </button>
        ))}
      </div>
      {game === "flip" ? <FlipGame key="flip" /> : <StackGame key="stack" />}
    </div>
  );
};

export default GameArcade;
