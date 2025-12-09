import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";

const HotCollections = () => {
const [collections, setCollections] = useState([]);

useEffect (() => {
  const fetchCollections = async () => {
    try {
      const { data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
      );
      setCollections(data);
    } catch (error) {
      console.error("Error fetching hot collections:", error);
    }
  };

  fetchCollections();
}, []);

const settings = {
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
        dots: false
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
}

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        {/* Section title */}
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
        </div>

      
        {collections.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <Slider {...settings} className="hot-collections-slider">
            {collections.map((item, index) => (
              <div key={index} className="px-2">
                {/* Each slide */}
                <div className="nft_coll">
                  <div className="nft_wrap">
                    <Link to={`/item-details/${item.nftId}`}>
                      <img
                        src={item.nftImage}
                        className="lazy img-fluid"
                        alt={item.title}
                      />
                    </Link>
                  </div>

                  <div className="nft_coll_pp">
                    <Link to={`/item-details/${item.nftId}`}>
                      <img
                        className="lazy pp-coll"
                        src={item.nftImage}
                        alt={item.author}
                      />
                    </Link>
                    <i className="fa fa-check"></i>
                  </div>

                  <div className="nft_coll_info">
                    <Link to={`/item-details/${item.nftId}`}>
                      <h4>{item.title}</h4>
                    </Link>
                    <span>{item.code}</span>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default HotCollections;