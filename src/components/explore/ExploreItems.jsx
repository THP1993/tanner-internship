import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("likes_high_to_low");
  const [visibleCount, setVisibleCount] = useState(8);

  const [now, setNow] = useState(() => Date.now());
  const cancelIdRef = useRef(null);

  useEffect(() => {
    let lastTick = 0;

    const updateNow = (t) => {
      if (!lastTick || t - lastTick >= 1000) {
        lastTick = t;
        setNow(Date.now());
      }
      cancelIdRef.current = requestAnimationFrame(updateNow);
    };

    cancelIdRef.current = requestAnimationFrame(updateNow);

    return () => {
      if (cancelIdRef.current) {
        cancelAnimationFrame(cancelIdRef.current);
        cancelIdRef.current = null;
      }
    };
  }, []);

  const toExpiryMs = (expiryDate) => {
    if (!expiryDate) return null;

    if (typeof expiryDate === "number") {
      return expiryDate < 1e12 ? expiryDate * 1000 : expiryDate;
    }

    const parsed = Date.parse(expiryDate);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const expiryTimer = (msLeft) => {
    if (msLeft == null) return "";
    if (msLeft <= 0) return "Expired";

    const totalSec = Math.floor(msLeft / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    const pad2 = (v) => String(v).padStart(2, "0");
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
  };

  useEffect(() => {
    const fetchExploreItems = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get(`${API_BASE}?filter=${filter}`);
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching explore items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    setVisibleCount(8);
    fetchExploreItems();
  }, [filter]);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  const canLoadMore = visibleCount < items.length;

  return (
    <>
      <div>
        <select
          id="filter-items"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price: Low to High</option>
          <option value="price_high_to_low">Price: High to Low</option>
          <option value="likes_high_to_low">Most Liked</option>
        </select>
      </div>

      {loading ? (
        <>
          {new Array(8).fill(0).map((_, index) => (
            <div
              key={index}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <div className="nft__item" style={{ position: "relative" }}>
                <div className="author_list_pp">
                  <span
                    className="skeleton-box"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      display: "block",
                    }}
                  />
                </div>

                <div className="de_countdown">&nbsp;</div>

                <div className="nft__item_wrap">
                  <span
                    className="skeleton-box"
                    style={{
                      width: "100%",
                      height: 240,
                      borderRadius: 12,
                      display: "block",
                    }}
                  />
                </div>

                <div className="nft__item_info">
                  <span
                    className="skeleton-box"
                    style={{
                      width: "70%",
                      height: 16,
                      borderRadius: 6,
                      display: "block",
                    }}
                  />
                  <span
                    className="skeleton-box"
                    style={{
                      width: "40%",
                      height: 14,
                      borderRadius: 6,
                      display: "block",
                      marginTop: 10,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          {visibleItems.map((item) => {
            const nftId = item.nftId ?? item.id;
            const authorId = item.authorId;

            const authorTo = authorId ? `/author/${authorId}` : "/author";
            const itemTo = nftId ? `/item-details/${nftId}` : "/item-details";

            const expiryMs = toExpiryMs(item.expiryDate);
            const label = expiryTimer(expiryMs ? expiryMs - now : null);

            return (
              <div
                key={nftId}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                style={{ display: "block", backgroundSize: "cover" }}
              >
                <div className="nft__item" style={{ position: "relative" }}>
                  <div className="author_list_pp">
                    <Link
                      to={authorTo}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={item.authorName}
                    >
                      <img
                        className="lazy"
                        src={item.authorImage}
                        alt={item.authorName}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>

                  {label ? <div className="de_countdown">{label}</div> : null}

                  <div className="nft__item_wrap">
                    <Link to={itemTo}>
                      <img
                        className="lazy nft__item_preview"
                        src={item.nftImage}
                        alt={item.title}
                      />
                    </Link>
                  </div>

                  <div className="nft__item_info">
                    <Link to={itemTo}>
                      <h4>{item.title}</h4>
                    </Link>

                    <div className="nft__item_price">{item.price} ETH</div>

                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="col-md-12 text-center">
            {canLoadMore ? (
              <button
                type="button"
                id="loadmore"
                className="btn-main lead"
                onClick={() => setVisibleCount((count) => count + 4)}
              >
                Load More
              </button>
            ) : null}
          </div>
        </>
      )}
    </>
  );
};

export default ExploreItems;
