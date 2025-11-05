import React from "react";

const ComplaintSidebar = ({ children }) => (
  <aside style={styles.container}>{children}</aside>
);

const styles = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
};

export default ComplaintSidebar;