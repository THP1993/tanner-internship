import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TopSellers = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSellers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
        );

        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching top sellers:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTopSellers();
  }, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-md-12">
            {loading ? (
              <ol className="author_list">
                {new Array(12).fill(0).map((_, index) => (
                  <li key={index}>
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

                    <div className="author_list_info">
                      <span
                        className="skeleton-box"
                        style={{ width: 120, height: 14, display: "block" }}
                      />
                      <span
                        className="skeleton-box"
                        style={{
                          width: 60,
                          height: 12,
                          display: "block",
                          marginTop: 8,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <ol className="author_list">
                {items.map((item) => (
                  <li key={item.id ?? item.authorId}>
                    <div className="author_list_pp">
                      <Link to={`/author/${item.authorId}`}>
                        <img
                          className="lazy pp-author"
                          src={item.authorImage}
                          alt={item.authorName}
                        />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>

                    <div className="author_list_info">
                      <Link to={`/author/${item.authorId}`}>
                        {item.authorName}
                      </Link>
                      <span>{item.price} ETH</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default TopSellers;
