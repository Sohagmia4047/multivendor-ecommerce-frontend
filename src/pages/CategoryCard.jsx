import React from "react";

const CategoryCard = ({
  categories = [],
  categoryLoading = false,
  selectedCategories = [],
  setSelectedCategories,
  navigate,
  variant = "vertical",
}) => {
  const toggleCategory = (categoryId) => {
    const normalizedId = String(categoryId);

    setSelectedCategories((current) => {
      const normalizedCurrent = current.map(String);

      return normalizedCurrent.includes(normalizedId)
        ? normalizedCurrent.filter((id) => id !== normalizedId)
        : [...normalizedCurrent, normalizedId];
    });
  };

  if (variant === "horizontal") {
    return (
      <section className="rounded-lg border border-gray-100 bg-white px-3 py-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Categories</h2>

          {selectedCategories.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedCategories([])}
              className="text-xs font-medium text-green-600"
            >
              Clear
            </button>
          )}
        </div>

        {categoryLoading ? (
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-16 min-w-[110px] animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => {
              const categoryId = String(item.cid);
              const active = selectedCategories
                .map(String)
                .includes(categoryId);

              return (
                <button
                  key={categoryId}
                  type="button"
                  onClick={() => toggleCategory(categoryId)}
                  className={`flex min-w-[118px] items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${
                    active
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-9 w-9 shrink-0 rounded-md object-cover"
                  />

                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-gray-400">
                      {item.products ?? 0} items
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    );
  }

  return (
    <aside className="h-fit w-full overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Categories</h2>

        {selectedCategories.length > 0 && (
          <button
            type="button"
            onClick={() => setSelectedCategories([])}
            className="text-xs font-medium text-green-600 hover:text-green-700"
          >
            Clear
          </button>
        )}
      </div>

      <div className="max-h-[390px] overflow-y-auto p-2">
        {categoryLoading ? (
          <div className="space-y-2 p-1">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="h-11 animate-pulse rounded-md bg-gray-200"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-gray-500">
            No category found
          </p>
        ) : (
          <div className="space-y-1">
            {categories.map((item) => {
              const categoryId = String(item.cid);
              const checked = selectedCategories
                .map(String)
                .includes(categoryId);

              return (
                <div
                  key={categoryId}
                  className={`group flex items-center gap-2 rounded-md border px-2.5 py-2 transition ${
                    checked
                      ? "border-green-500 bg-green-50"
                      : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(categoryId)}
                    aria-label={`Filter by ${item.title}`}
                    className="h-4 w-4 shrink-0 cursor-pointer accent-green-500"
                  />

                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-8 w-8 shrink-0 rounded-md object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => navigate(`/category/${categoryId}`)}
                    className="min-w-0 flex-1 truncate text-left text-sm text-gray-700 transition group-hover:text-green-600"
                  >
                    {item.title}
                  </button>

                  <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 transition group-hover:bg-green-500 group-hover:text-white">
                    {item.products ?? 0}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default CategoryCard;
