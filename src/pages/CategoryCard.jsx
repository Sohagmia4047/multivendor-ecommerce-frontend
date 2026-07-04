import React from "react";

const CategoryCard = ({
  categories,
  categoryLoading,
  selectedCategories,
  setSelectedCategories,
  navigate,
}) => {
  return (
    <div className="border bg-white rounded-xl p-2 md:p-4 h-fit w-full relative z-10">
      <h2 className="text-lg md:text-[16px] font-bold mb-1">Category</h2>

      {categoryLoading && (
        <p className="text-sm text-gray-500">Loading Categories...</p>
      )}

      <div className="space-y-2">
        {!categoryLoading &&
          categories.map((item) => (
            <div
              key={item.cid}
              className="flex items-center justify-between gap-2 px-3 py-1 rounded-lg border hover:border-green-500 hover:bg-green-50 hover:text-green-600 transition group"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(item.cid)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, item.cid]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((id) => id !== item.cid),
                      );
                    }
                  }}
                />

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-7 h-7 rounded-full object-cover"
                />

                <span
                  onClick={() => navigate(`/category/${item.cid}`)}
                  className="text-sm md:text-[14px] cursor-pointer"
                >
                  {item.title}
                </span>
              </div>

              <span className="text-[14px] bg-gray-100 group-hover:bg-green-500 group-hover:text-white px-2 py-0.5 rounded-full transition">
                {item.products}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoryCard;
