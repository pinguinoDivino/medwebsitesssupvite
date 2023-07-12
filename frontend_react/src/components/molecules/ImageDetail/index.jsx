import { baseUrl } from "_/common/utils";
import useAuth from "_hooks/use-auth";
import Image from "_atoms/Image";

const ImageDetail = ({ className, image = null }) => {
  const { theme } = useAuth();

  let url =
    theme === "dark"
      ? baseUrl + "static/img/frontend/experiences/expsList4.jpg"
      : baseUrl + "static/img/frontend/experiences/expsList1.jpg";

  if (image) {
    url = image;
  }

  return (
    <div className={`col-lg-7 ${className}`}>
      <Image url={url} text="Immagine esperienza" />
    </div>
  );
};

export default ImageDetail;
