import { useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "_hooks/use-auth";
import useWindowSize from "_hooks/use-window-size";

import Home from "_templates/Home";

const HomePage = () => {
  const location = useLocation();

  const { userDpc, updateUserDpc, loadUserData, animated } = useAuth();

  const [showDpcModal, setShowDpcModal] = useState(
    !userDpc || (!userDpc && location.state?.type === "dpc")
  );

  const handleError = () => {
    setShowDpcModal(false);
  };

  async function submitDpcData(payload) {
    try {
      setShowDpcModal(false);
      await updateUserDpc(payload);
      await loadUserData();
    } catch (e) {
      console.log(e);
    }
  }

  const { width } = useWindowSize();

  const srcByWidth = (img1, img2) => {
    if (width > 992 && width < 1401) {
      return img1;
    } else {
      return img2;
    }
  };

  const sfsSrc = srcByWidth(
    "/static/img/frontend/home/sfs2.jpeg",
    "/static/img/frontend/home/sfs1.jpeg"
  );

  const congressSrc = srcByWidth(
    "/static/img/frontend/home/congress2.jpeg",
    "/static/img/frontend/home/congress1.jpeg"
  );

  const summerschoolSrc = srcByWidth(
    "/static/img/frontend/home/summerschool2.jpeg",
    "/static/img/frontend/home/summerschool1.jpeg"
  );

  const erasmusSrc = srcByWidth(
    "/static/img/frontend/home/erasmus2.jpeg",
    "/static/img/frontend/home/erasmus1.jpeg"
  );
  const internshipSrc = srcByWidth(
    "/static/img/frontend/home/internship2.jpeg",
    "/static/img/frontend/home/internship1.jpeg"
  );

  document.title = "Med. Sant'Anna Esperienze & Tirocini";

  return (
    <Home
      animated={animated}
      src={{
        sfs: sfsSrc,
        congress: congressSrc,
        summerschool: summerschoolSrc,
        erasmus: erasmusSrc,
        internship: internshipSrc,
      }}
      submitDpcData={submitDpcData}
      showDpcModal={showDpcModal}
      handleError={handleError}
    />
  );
};
export default HomePage;
