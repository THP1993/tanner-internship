import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [now, setNow] = useState(() => Date.now());

  const cancelIdRef = useRef(null);
  const startTimeRef = useRef(null);

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

  const settings = useMemo(
    () => ({
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
          },
        },
        {
          breakpoint: 600,
          settings: { slidesToShow: 2, slidesToScroll: 1, initialSlide: 2 },
        },
        {
          breakpoint: 480,
          settings: { slidesToShow: 1, slidesToScroll: 1 },
        },
      ],
    }),
    []
  );

  useEffect(() => {
    const fetchNewItems = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );

        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching new items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewItems();
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

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
        </div>

        <Slider {...settings} className="new-items-slider">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-2">
                  <div className="nft__item" style={{ position: "relative" }}>
                    <div className="author_list_pp">
                      <div
                        className="skeleton-box"
                        style={{ width: 50, height: 50, borderRadius: "50%" }}
                      />
                    </div>

                    <div className="de_countdown">&nbsp;</div>

                    <div className="nft__item_wrap">
                      <div
                        className="skeleton-box"
                        style={{
                          width: "100%",
                          paddingBottom: "100%",
                          borderRadius: "10px",
                          display: "block",
                        }}
                      />
                    </div>

                    <div className="nft__item_info">
                      <div
                        className="skeleton-box"
                        style={{ width: "70%", height: 16, marginBottom: 10 }}
                      />
                      <div
                        className="skeleton-box"
                        style={{ width: "40%", height: 14, marginBottom: 10 }}
                      />
                      <div
                        className="skeleton-box"
                        style={{ width: "30%", height: 14 }}
                      />
                    </div>
                  </div>
                </div>
              ))
            : items.map((item, i) => {
                const expiryMs = toExpiryMs(item.expiryDate);
                const label = expiryTimer(expiryMs ? expiryMs - now : null);

                const priceText =
                  item.price === "" ||
                  item.price === null ||
                  item.price === undefined
                    ? "—"
                    : typeof item.price === "string" &&
                      item.price.toUpperCase().includes("ETH")
                    ? item.price
                    : `${item.price} ETH`;

                return (
                  <div key={item.nftId || i} className="px-2">
                    <div className="nft__item" style={{ position: "relative" }}>
                      <div className="author_list_pp">
                        <Link
                          to={`/author/${item.authorId}`}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Author"
                        >
                          <img
                            className="lazy"
                            src={item.authorImage}
                            alt="Author"
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>

                      {label ? (
                        <div className="de_countdown">{label}</div>
                      ) : null}

                      <div className="nft__item_wrap">
                        <Link to={`/item-details/${item.nftId}`}>
                          <img
                            src={item.nftImage}
                            className="lazy nft__item_preview"
                            alt={item.title}
                          />
                        </Link>
                      </div>

                      <div className="nft__item_info">
                        <Link to={`/item-details/${item.nftId}`}>
                          <h4>{item.title}</h4>
                        </Link>

                        <div className="nft__item_price">{priceText}</div>

                        <div className="nft__item_like">
                          <i className="fa fa-heart"></i>
                          <span>{item.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </Slider>
      </div>
    </section>
  );
};

export default NewItems;
