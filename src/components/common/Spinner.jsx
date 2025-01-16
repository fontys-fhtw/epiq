import React from "react";
import { ClipLoader } from "react-spinners";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
};

const Spinner = ({ size = 50, color = "#123abc" }) => {
  return (
    <div style={styles.container}>
      <ClipLoader size={size} color={color} />
    </div>
  );
};

export default Spinner;
