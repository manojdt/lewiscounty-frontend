const SubDetailCardWrapper = ({ title, children, onViewAll }) => {
  return (
    <div className="p-6 bg-gray-100 rounded">
      <div className="flex justify-between border-b border-blue-100 items-center pb-3 mb-6">
        <h2 className="text-md font-semibold">{title}</h2>
        <button
          onClick={onViewAll}
          className="text-background-primary-main bg-blue-100 font-medium p-2 rounded text-xs"
        >
          View All
        </button>
      </div>

      <div>{children}</div>
    </div>
  );
};

export default SubDetailCardWrapper;
