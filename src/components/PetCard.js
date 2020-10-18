import React from "react";

const PetCard = props => {
  return (
    <div className="dog-card " key={props.id}>
      <img className="dog-image" alt="random dog" src={props.imgUrl} />
      <h2>{props.breed}</h2>
    </div>
  );
};
export default PetCard;
