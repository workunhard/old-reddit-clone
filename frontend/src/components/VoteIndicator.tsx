import { useState } from "react";
import "../styles/PostPage.css";
import arrowUp from "../assets/arrow-up.svg";
import arrowDown from "../assets/arrow-down.svg";
import arrowUpHovered from "../assets/arrow-up-hovered.svg";
import arrowDownHovered from "../assets/arrow-down-hovered.svg";

function VoteIndicator({
  upvotes,
  downvotes,
  submitVote,
}: {
  upvotes: number;
  downvotes: number;
  submitVote: (vote: string) => void;
}) {
  const [upvoteHovered, setUpvoteHovered] = useState(false);
  const [downvoteHovered, setDownvoteHovered] = useState(false);

  return (
    <div className="voting-controls">
      <img
        src={upvoteHovered ? arrowUpHovered : arrowUp}
        alt="upvote"
        className={'upvote'}
        onClick={() => submitVote("up")}
        onMouseEnter={() => setUpvoteHovered(true)}
        onMouseLeave={() => setUpvoteHovered(false)}
      />
      <span className={`voteBalance ${upvotes - downvotes} > 0 ? 'positive' : 'negative'}`}>
  {upvotes - downvotes}
</span>
      <img
        src={downvoteHovered ? arrowDownHovered : arrowDown}
        alt="downvote"
        className={"downvote"}
        onClick={() => submitVote("down")}
        onMouseEnter={() => setDownvoteHovered(true)}
        onMouseLeave={() => setDownvoteHovered(false)}
      />
    </div>
  );
}

export default VoteIndicator;
