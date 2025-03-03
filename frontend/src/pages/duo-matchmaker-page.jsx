import React, { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import "./duo-matchmaker-page.css";

const MatchProfileCard = ({
  imgSrc,
  username,
  topGames,
  playerType,
  description,
  isActive,
}) => {
  // to move the card as the user drags it
  const motionValue = useMotionValue(0);

  // to rotate the card as the card moves on drag
  const rotateValue = useTransform(motionValue, [-200, 200], [-50, 50]);

  // To decrease opacity of the card when swiped
  // on dragging card to left(-200) or right(200)
  // opacity gradually changes to 0
  // and when the card is in center opacity = 1
  const opacityValue = useTransform(
    motionValue,
    [-200, -150, 0, 150, 200],
    [0, 1, 1, 1, 0]
  );

  // framer animation hook
  const animControls = useAnimation();

  return (
    <motion.div
      className={`match-profile ${isActive ? "active" : ""}`}
      drag="x"
      style={{ x: motionValue, rotate: rotateValue, opacity: opacityValue }}
      dragConstraints={{ left: -1000, right: 1000 }}
      onDragEnd={(event, info) => {
        // If the card is dragged only up to 150 on x-axis
        // bring it back to initial position
        if (Math.abs(info.point.x) <= 150) {
          animControls.start({ x: 0 });
        } else {
          // If card is dragged beyond 150
          // make it disappear

          // Making use of ternary operator
          animControls.start({ x: info.point.x < 0 ? -200 : 200 });
        }
      }}
    >
      <div className="profile-picture">
        <img src={imgSrc} alt="profile picture" />
      </div>
      <h1 className="username">{username}</h1>

      {/** second part of the card: top games and type of player */}
      <div className="profile-information">
        {/** top games */}
        <div className="top-games">
          <h2>Top Games</h2>
          {topGames.map((game, index) => (
            <p key={index}>{game}</p>
          ))}
        </div>

        {/** type of player */}
        <div className="Player-Type">
          <h2>Player Type</h2>
          {playerType.map((type, index) => (
            <p key={index}>{type}</p>
          ))}
        </div>
      </div>

      {/** third part the match card information: description */}
      <div className="description-container">
        <h2>Description</h2>
        <p>{description}</p>
      </div>
    </motion.div>
  );
};

const DuoMatchmakerPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const profilesData = [
    {
      imgSrc:
        "https://upload.wikimedia.org/wikipedia/commons/c/c3/The_Rock_2023.jpg",
      username: "The Rock",
      topGames: ["League of Legends", "Valorant", "Overwatch"],
      playerType: ["Competitive", "Casual", "Chill"],
      description:
        "I am a competitive player who is looking for a duo partner to climb the ranks with. I am currently in gold and looking to reach plat by the end of the season.",
    },
    {
      imgSrc:
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Scarlett_Johansson_by_Gage_Skidmore_2.jpg",
      username: "Scarlett",
      topGames: ["Fortnite", "Apex Legends", "PUBG"],
      playerType: ["Casual", "Strategic", "Team Player"],
      description:
        "I enjoy playing battle royale games and am looking for a team player to strategize and win matches together.",
    },
    {
      imgSrc:
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/Chris_Hemsworth_by_Gage_Skidmore.jpg",
      username: "Thor",
      topGames: ["God of War", "Assassin's Creed", "The Witcher 3"],
      playerType: ["Story-driven", "Explorer", "Adventurer"],
      description:
        "I love story-driven games and exploring vast open worlds. Looking for someone who shares the same passion for epic adventures.",
    },
  ];

  return (
    <div className="page-layout">
      <div className="No-match">
        <h1>X</h1>
        <h1>NO</h1>
      </div>
      <div className="match-profiles-container">
        {profilesData.map((profile, index) => (
          <MatchProfileCard
            key={index}
            imgSrc={profile.imgSrc}
            username={profile.username}
            topGames={profile.topGames}
            playerType={profile.playerType}
            description={profile.description}
            isActive={index === activeIndex}
          />
        ))}
      </div>
      <div className="Yes-match">
        <h1>✓</h1>
        <h1>YES</h1>
      </div>
    </div>
  );
};

export default DuoMatchmakerPage;

// In the above code, we have created a  MatchProfileCard  component that represents each card in the matchmaker page. We have used the  motion  component from  framer-motion  to create the draggable card. We have used the  useMotionValue  hook to move the card as the user drags it. We have used the  useTransform  hook to rotate the card as the card moves on drag. We have used the  useAnimation  hook to animate the card when the user drags it.
// We have also used the  opacityValue  to decrease the opacity of the card when swiped. We have used the  dragConstraints  to restrict the drag of the card. We have used the  onDragEnd  event handler to bring the card back to the initial position if the card is dragged only up to 150 on the x-axis. If the card is dragged beyond 150, we make it disappear.
// We have also created the  DuoMatchmakerPage  component that renders the matchmaker page. We have used the  profilesData  array to store the profile data. We have used the  map  function to render the  MatchProfileCard  component for each profile. We have used the  isActive  prop to determine if the card is active.
// Step 5: Create a CSS file for the Duo Matchmaker Page
// Now, let’s create a CSS file for the Duo Matchmaker page.
