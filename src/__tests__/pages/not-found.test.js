import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import NotFound from "../../pages/not-found";
import { getUserByUserId } from "../../services/firebase";
import userFixture from '../../fixtures/logged-in-user'
jest.mock("../../services/firebase");
describe("<NotFound/>", () => {
  it("render that not found page with a logged in user", () => {
    getUserByUserId.mockImplementation(() =>
      [userFixture]
    );
    const { getByText, debug } = render(
      <Router>
        <FirebaseContext.Provider value={{}}>
          <UserContext.Provider value={{ user: { uid: 1 } }}>
            <NotFound />
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );

    expect(getByText("Log In"));
    debug();
  });
});
