import React from "react";
import { Link } from "react-router-dom";

const AuthorItems = ({ items = [], loading = false }) => {
  const priceText = (price) => `${price} ETH`;

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {loading ? (
            new Array(8).fill(0).map((_, index) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                <div className="nft__item">
                  <div className="author_list_pp">
                    <div
                      className="skeleton-box"
                      style={{ width: 50, height: 50, borderRadius: "50%" }}
                    />
                  </div>
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
                </div>
              </div>
            ))
          ) : items.length === 0 ? (
            <div className="col-12">
              <p>No items found for this author.</p>
            </div>
          ) : (
            items.map((item, index) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={item.nftId || index}>
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link to={`/author/${item.authorId}`} title="Author">
                      <img className="lazy" src={item.authorImage} alt="Author" />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>

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

                    <div className="nft__item_price">{priceText(item.price)}</div>

                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;