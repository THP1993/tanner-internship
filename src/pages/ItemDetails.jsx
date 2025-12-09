import React, { useEffect, useState } from "react";
import EthImage from "../images/ethereum.svg";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { use } from "react";

const ItemDetails = () => {
  const { nftId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
        );
        setItem(data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (nftId) {
      fetchItem();
    }
  }, [nftId]);

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <p>Loading...</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <p>Item not found.</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={item.nftImage}
                  className="img-fluid img-rounded mb-sm-30"
                  alt={item.title}
                />
              </div>

              <div className="col-md-6">
                <div className="item_info">
                  <h2>{item.title}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye" /> {item.views}
                    </div>
                    <div className="item_info_likes">
                      <i className="fa fa-heart" /> {item.likes}
                    </div>
                  </div>

                  <p>{item.description}</p>

                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${item.ownerId}`}>
                            {item.ownerImage && (
                              <img
                                className="lazy"
                                src={item.ownerImage}
                                alt={item.ownerName}
                              />
                            )}
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          {item.ownerName ? (
                            <Link to={`/author/${item.ownerId || ""}`}>
                              {item.ownerName}
                            </Link>
                          ) : (
                            <span>Unknown Owner</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>

                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${item.creatorId || ""}`}>
                            {item.creatorImage && (
                              <img
                                className="lazy"
                                src={item.creatorImage}
                                alt={item.creatorName}
                              />
                            )}
                            <i className="fa fa-check" />
                          </Link>
                        </div>
                        <div className="author_list_info">
                          {item.creatorName ? (
                            <Link to={`/author/${item.creatorId || ""}`}>
                              {item.creatorName}
                            </Link>
                          ) : (
                            <span>Unknown Creator</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="spacer-40" />

                    <h6>Current Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="eth" />
                      <span>{item.price} ETH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
