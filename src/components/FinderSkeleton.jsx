import "./FinderSkeleton.css"

function FinderSkeleton({ rows = 8 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr className="skeleton-row" key={index}>
          <td>
            <div className="skeleton-name">
              <div className="skeleton-icon" />
              <div
                className="skeleton-line"
                style={{ width: `${100 + (index % 4) * 25}px` }}
              />
            </div>
          </td>

          <td>
            <div className="skeleton-line" style={{ width: "85px" }} />
          </td>

          <td>
            <div className="skeleton-line" style={{ width: "45px" }} />
          </td>

          <td>
            <div className="skeleton-line" style={{ width: "65px" }} />
          </td>
        </tr>
      ))}
    </>
  );
}

export default FinderSkeleton;
