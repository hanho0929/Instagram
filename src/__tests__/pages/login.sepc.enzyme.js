import React, { useContext } from "react";
import Enzyme, { shallow, render, mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { act } from "react-dom/test-utils";
import { useHistory } from "react-router";
import Login from "../../pages/login";
import FirebaseContext from "../../context/firebase";
import * as ROUTES from "../../constants/routes";
import { MemoryRouter } from "react-router";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { waitFor } from "@testing-library/dom";
import { format } from "prettier";
Enzyme.configure({ adapter: new Adapter() });

const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
let wrapper;
let useEffect
describe("<Login/>", () => {
  beforeEach(() => {
    useEffect = jest.spyOn(React, "useEffect").mockImplementation(f => f());
    jest.clearAllMocks();
  });

  it("renders the login page with a form submission", async () => {
    const succedToLogin = jest.fn(() => Promise.resolve("I am sign in !"));
    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: succedToLogin,
      })),
    };

    const contextValues = { firebase: firebase };
    jest.spyOn(React, "useContext").mockImplementation(() => contextValues);
    const wrapper = shallow(<Login />);

    // it should have an email field
    expect(wrapper.find('input[type="email"]').length).toEqual(1);

    // it should have an password field
    expect(wrapper.find('input[type="password"]').length).toEqual(1);

    const passwordObj = { target: { value: "test-password" } };
    expect(wrapper.find('input[type="password"]').props().value).toBe("");
    // simulate change
    wrapper.find('input[type="password"]').simulate("change", passwordObj);
    expect(wrapper.find('input[type="password"]').props().value).toBe(
      "test-password"
    );

    const emailObj = { target: { value: "test-email" } };
    expect(wrapper.find('input[type="email"]').props().value).toBe("");
    wrapper.find('input[type="email"]').simulate("change", emailObj);
    expect(wrapper.find('input[type="email"]').props().value).toBe(
      "test-email"
    );

    await act(async () => {
      // spyon useEffect in beforeEach
      expect(document.title).toEqual("Login - Instagram");
      const fakeEvent = { preventDefault: () => {} };
      const form = wrapper.find('form').first();
      form.simulate('submit', fakeEvent);
      expect(succedToLogin).toHaveBeenCalled();
      expect(succedToLogin).toHaveBeenCalledWith(
        "test-email",
        "test-password"
      );
      await waitFor(() => {
        expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.DASHBOARD);
      })
    });



  });
  it("renders the login page with a form submission and fails", async () => {
    const failToLogin = jest.fn(() => Promise.reject( new Error("Cannot sign in !")));
    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: failToLogin,
      })),
    };

    const contextValues = { firebase: firebase };
    jest.spyOn(React, "useContext").mockImplementation(() => contextValues);
    const wrapper = shallow(<Login />);

    // it should have an email field
    expect(wrapper.find('input[type="email"]').length).toEqual(1);

    // it should have an password field
    expect(wrapper.find('input[type="password"]').length).toEqual(1);


    const passwordObj = { target: { value: "test-password" } };
    expect(wrapper.find('input[type="password"]').props().value).toBe("");
    // simulate password change
    wrapper.find('input[type="password"]').simulate("change", passwordObj);
    expect(wrapper.find('input[type="password"]').props().value).toBe(
      "test-password"
    );

    const emailObj = { target: { value: "test-email" } };
    expect(wrapper.find('input[type="email"]').props().value).toBe("");
    wrapper.find('input[type="email"]').simulate("change", emailObj);
    expect(wrapper.find('input[type="email"]').props().value).toBe(
      "test-email"
    );

    await act(async () => {
      // spyon useEffect in beforeEach
      expect(document.title).toEqual("Login - Instagram");
      const fakeEvent = { preventDefault: () => {} };
      const form = wrapper.find('form').first();
      form.simulate('submit', fakeEvent);
      expect(failToLogin).toHaveBeenCalled();
      expect(failToLogin).toHaveBeenCalledWith(
        "test-email",
        "test-password"
      );
      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
      })
    });


    
  });
});
