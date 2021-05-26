import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { act } from 'react-dom/test-utils';
import { useHistory } from "react-router";
import Login from "../../pages/login";
import FirebaseContext from "../../context/firebase";
import * as ROUTES from "../../constants/routes";

const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe("<Login/>", () => {
  beforeEach(() => {
      jest.clearAllMocks();
  })
  it("example",() => {
      expect(1).toBe(1);
  })
  it("renders the login page with a form submission and logs the user in", async () => {
    const succedToLogin = jest.fn(() => Promise.resolve("I am sign in !"));
    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: succedToLogin,
      })),
    };

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Login />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      expect(document.title).toEqual("Login - Instagram");

      await fireEvent.change(getByPlaceholderText("Email address"), {
        target: { value: "hanhanho1994@gmail.com" },
      });

      await fireEvent.change(getByPlaceholderText("Password"), {
        target: { value: "test-password" },
      });

      fireEvent.submit(getByTestId("login"));

      expect(succedToLogin).toHaveBeenCalled();
      expect(succedToLogin).toHaveBeenCalledWith(
        "hanhanho1994@gmail.com",
        "test-password"
      );

      await waitFor(() => {
        expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Email address').value).toBe('hanhanho1994@gmail.com');
        expect(getByPlaceholderText('Password').value).toBe('test-password');
        expect(queryByTestId('error')).toBeFalsy();
      });


    });
  });

  it("renders the login page with a form submission and fails to logs the user in", async () => {
    const failToLogin = jest.fn(() => Promise.reject( new Error("Cannot sign in !")));
    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: failToLogin,
      })),
    };

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Login />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      expect(document.title).toEqual("Login - Instagram");

      await fireEvent.change(getByPlaceholderText("Email address"), {
        target: { value: "hanhanho1994.com" },
      });

      await fireEvent.change(getByPlaceholderText("Password"), {
        target: { value: "test-password" },
      });

      fireEvent.submit(getByTestId("login"));

      expect(failToLogin).toHaveBeenCalled();
      expect(failToLogin).toHaveBeenCalledWith(
        "hanhanho1994.com",
        "test-password"
      );

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Email address').value).toBe('');
        expect(getByPlaceholderText('Password').value).toBe('');
        expect(queryByTestId('error')).toBeTruthy();
      });

    });
  });
});
