import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE =  "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("likes_high_to_low")

  const [visibleCount, setVisibleCount] = useState(8);

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
    }

    setVisibleCount(8);
    fetchExploreItems();
  } [filter]);

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
    {loading
    ? new Array(8).fill(0).map((_, index) => (
      <div
        key={index}
        className="d-item col-lg-3 cold-md-6 col-sm-6 col-xs-12"
        style={{ display: "block", backgroundSize: "cover" }}
        >
          <div className="nft__item">
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
              <div className="nft__item-info">
                <span
                  className="skeleton-box"
                  style={{
                    width: 80,
                    height: 14,
                    borderRadius: 6,
                    display: "block",
                    marginTop: 10,
                  }}
                  />
              </div>
            </div>
              </div>
              ))
    : visibleItems.map((item) => (
      <div 
        key={item.id ?? item.nftId}
        className="d-item col-lg-3 cold-md-6 col-sm-6 col-xs-12"
        style={{ display: "block", backgroundSize: "cover" }}
        >
          <div className="nft__item">
            <div className="author_list_pp">
              <Link to={`/author/${item.authorId}`}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={item.authorName}>
                <img className="lazy" src={item.authorImage} alt="{item.authorName}" />
                <i className="fa fa-check"></i>
              </Link>
            </div>
            <div className="nft__item_wrap">
              <Link to={`/item-details/${item.nftId ?? item.id}`}>
              <img 
              src={item.nftImage}
              className="lazy nft__item-preview"
              alt={item.title}
              />
              </Link>
          </div>
          
    </div>
    </>