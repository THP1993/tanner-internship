import React, { useEffect, useMemo, useState } from "react";
import AuthorItems from "../components/author/AuthorItems";
import { useParams } from "react-router-dom";
import axios from "axios";

const Author = () => {
  const { authorId } = useParams();
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewItems = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );
        setAllItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setAllItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewItems();
  }, []);

  const authorItems = useMemo(
    () => allItems.filter((it) => String(it.authorId) === String(authorId)),
    [allItems, authorId]
  );

  const authorProfile = authorItems[0] || null;

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <section id="profile_banner" className="text-light" />

        <section>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      {loading ? (
                        <div
                          className="skeleton-box"
                          style={{
                            width: 150,
                            height: 150,
                            borderRadius: "50%",
                          }}
                        />
                      ) : authorProfile ? (
                        <img
                          src={authorProfile.authorImage}
                          alt={`Author ${authorId}`}
                        />
                      ) : null}

                      <i className="fa fa-check"></i>

                      <div className="profile_name">
                        <h4>Author #{authorId}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <AuthorItems items={authorItems} loading={loading} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
