import React from "react";
import ApexCharts from "react-apexcharts";
import "./ProductDetailsPage.css"

const ProductDetailsPage = ({ product, onClose }) => {
  const {
    name,
    url: productUrl,
    img,
    source,
    created_at: createdAt,
    priceHistory,
  } = product;

  function formatDate(date) {
    var aaaa = date.getFullYear();
    var gg = date.getDate();
    var mm = date.getMonth() + 1;

    if (gg < 10) gg = "0" + gg;

    if (mm < 10) mm = "0" + mm;

    var cur_day = aaaa + "-" + mm + "-" + gg;

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    if (hours < 10) hours = "0" + hours;

    if (minutes < 10) minutes = "0" + minutes;

    if (seconds < 10) seconds = "0" + seconds;

    return cur_day + " " + hours + ":" + minutes + ":" + seconds;
  }

  const dates = priceHistory
    .map((history) => formatDate(new Date(history.date)))
    .reverse();
  const prices = priceHistory.map((history) => history.price).reverse();

  const chartData = {
    options: {
      chart: {
        id: "price-chart",
      },
      xaxis: {
        categories: dates, // Example categories (dates)
      },
    },
    series: [
      {
        name: "Price",
        data: prices, // Example data
      },
    ],
  };

  return (
    <div className="product-details">
      <button className="close-button" onClick={onClose}>
        <span className="material-symbols-outlined">
           close
        </span>
      </button>
      <h2>{name}</h2>
      <img src={img} alt="Product" />
      <p>
        URL: <a href={`${source}${productUrl}`} target="_blank" rel="noopener noreferrer" className="product-link">
          View product.
        </a>
      </p>
      <p className="current-price">Newest Price At: {createdAt}</p>
      <h2>Price History</h2>
      <h3 className="current-price">
        Current Price: Rs.{prices.length > 0 ? prices[prices.length - 1] : "N/A"}
      </h3>
      <div className="price-history-chart">
        <ApexCharts
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={300}
        />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
