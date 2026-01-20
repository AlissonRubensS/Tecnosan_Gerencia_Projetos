import PropTypes from "prop-types";

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.element.isRequired,
};

function InfoCard({ title, value, icon }) {
  return (
    <>
      <div className=" grid grid-cols-2 py-1 px-2 gap-1 shadow-md ml-4 mr-4 rounded w-full bg-[#5EED9A] justify-items-center">
        <div className="col-span-2 self-center">
          <p>{title}</p>
        </div>
        <div>{icon}</div>
        <div>
          <p>{value}</p>
        </div>
      </div>
    </>
  );
}

export default InfoCard;
