import { Link } from "react-router-dom";

const itemClass =
  "block w-full rounded-lg bg-white/60 py-2 text-center transition sm:bg-transparent";
const clickableClass = "cursor-pointer hover:bg-white hover:shadow-sm";

export default function ProfileStats({ items, className = "" }) {
  return (
    <div
      className={`mt-6 grid gap-3 rounded-xl bg-gray-100 p-3 text-center sm:gap-4 sm:p-4 ${className}`}
    >
      {items.map(({ label, value, onClick, to }) => {
        const content = (
          <>
            <p className="text-lg font-bold">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </>
        );

        if (to) {
          return (
            <Link key={label} to={to} className={`${itemClass} ${clickableClass}`}>
              {content}
            </Link>
          );
        }
        if (onClick) {
          return (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className={`${itemClass} ${clickableClass}`}
            >
              {content}
            </button>
          );
        }
        return (
          <div key={label} className={itemClass}>
            {content}
          </div>
        );
      })}
    </div>
  );
}