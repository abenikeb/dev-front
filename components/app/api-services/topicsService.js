// Topics Section
const topics = [
  {
    id: 1,
    name: "Web Payment (H5) Integration",
    desc: "H5 integration enables businesses to integrate telebirr's payment gateway into their mobile applications using HTML5 technology.",
    icon: "/assets/icons/web-payment.svg",
    subtopics: [
      { id: 1, uniqueKey: 1, name: "ApplyFabricToken" },
      { id: 2, uniqueKey: 2, name: "CreateOrder" },
      { id: 3, uniqueKey: 3, name: "Checkout" },
      // { id: 4, uniqueKey:4, name: "QueryOrder" },
    ],
  },
  {
    id: 2,
    name: "Native (Mini App) Integration",
    desc: "Mini app integration enables businesses to integrate telebirr's payment gateway into their mini apps, which are lightweight applications that can be accessed within messaging apps.",
    icon: "/assets/icons/mini-app-payment.svg",
    subtopics: [
      { id: 1, uniqueKey: 5, name: "ApplyFabricToken" },
      { id: 2, uniqueKey: 6, name: "CreateOrder" },
      { id: 3, uniqueKey: 7, name: "Checkout" },
      // { id: 4, uniqueKey:8, name: "QueryOrder" },
    ],
  },
  {
    id: 3,
    // name: "Customer to Business WebCheckout",
    name: "C2B WebCheckout Integration",
    desc: "With C2B integration, individuals can easily make payments to businesses using telebirr's payment gateway.",
    icon: "/assets/icons/web-payment.svg",
    subtopics: [
      { id: 1, uniqueKey: 9, name: "ApplyFabricToken" },
      { id: 2, uniqueKey: 10, name: "CreateOrder" },
      { id: 3, uniqueKey: 11, name: "Checkout" },
      // { id: 4, uniqueKey:12, name: "QueryOrder" },
    ],
  },
  {
    id: 4,
    name: "B2B WebCheckout Integration",
    desc: "B2B integration enables businesses to integrate telebirr's payment gateway into their existing systems, making it easy to receive payments from customers.",
    icon: "/assets/icons/web-payment.svg",
    subtopics: [
      { id: 1, uniqueKey: 13, name: "ApplyFabricToken" },
      { id: 2, uniqueKey: 14, name: "CreateOrder" },
      { id: 3, uniqueKey: 15, name: "Checkout" },
      // { id: 4, uniqueKey:12, name: "QueryOrder" },
    ],
  },
  {
    id: 5,
    name: "Subscription Payment Integration",
    desc: "",
    icon: "/assets/icons/web-payment.svg",
    subtopics: [
      { id: 1, uniqueKey: 17, name: "ApplyFabricToken" },
      { id: 2, uniqueKey: 18, name: "CreateOrder" },
      { id: 3, uniqueKey: 19, name: "Checkout" },
      // { id: 4, uniqueKey:12, name: "QueryOrder" },
    ],
  },
];

const getTopics = () => {
  return topics;
};

export default getTopics;
