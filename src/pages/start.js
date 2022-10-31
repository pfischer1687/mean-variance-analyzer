import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import InputForm from "../components/input-form";

const StartPage = () => {
  return (
    <Layout pageTitle="Start Page">
      {/* <form action="/tmp">
        <label for="cars">Choose a car:</label>
        <select name="cars" id="cars">
          <optgroup label="Swedish Cars">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
          </optgroup>
          <optgroup label="German Cars">
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </optgroup>
        </select>
        <br />
        <br />
        <input type="submit" value="Submit" />
      </form> */}
      {/* <form action="/tmp" method="GET">
        <label for="fname">First name:</label>
        <br />
        <input type="text" id="fname" name="fname" value="John" />
        <br />
        <label for="lname">Last name:</label>
        <br />
        <input type="text" id="lname" name="lname" value="Doe" />
        <br />
        <br />
        <input type="submit" value="Submit" />
      </form> */}
      <InputForm />
    </Layout>
  );
};

export const Head = () => <Seo title="Start Page" />;

export default StartPage;
