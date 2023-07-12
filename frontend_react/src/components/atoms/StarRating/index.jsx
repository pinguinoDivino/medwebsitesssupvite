import React from "react";
import { Rating } from "react-simple-star-rating";

const StarRating = ({ value, options }) => {
  return (
    <Rating
      initialValue={value}
      readonly={true}
      iconsCount={10}
      fillClassName="bold"
      size={25}
      {...options}
    />
  );
};

export default React.memo(StarRating);
