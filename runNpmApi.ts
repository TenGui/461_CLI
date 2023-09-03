/*
npm install axios
*/ 

import axios from "axios";

const url = "https://api.github.com/users/bard";

axios.get(url).then((response) => {
  const user = response.data;
  console.log(user);
});

