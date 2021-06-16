import React from "react";
import axios from "axios";
import {
  render,
  cleanup,
  waitForElement,
  prettyDOM,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  waitForElementToBeRemoved,
  queryByText,
  getByTestId,
  queryByAltText,
  act,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  })




  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    waitForElementToBeRemoved(() => getByText(appointment, "Saving"))
      .then(() => {
        expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();
      })
      .then(() => {
        const day = getAllByTestId(container, "day").find(day =>
          queryByText(day, "Monday")
        );
        expect(getByText(day, "no spots remaining")).toBeInTheDocument();
      });

  });




  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the interview with Archie Cohen.

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, 'Are you sure you would like to delete?')
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.

    // await waitForElement(() => getByAltText(appointment, 'Add'));
    waitForElementToBeRemoved(() => getByText(appointment, "Deleting"))
      .then(() => {
        expect(getByAltText(appointment, 'Add')).toBeInTheDocument();
      })
      // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
      .then(() => {
        const day = getAllByTestId(container, 'day').find((day) =>
          queryByText(day, 'Monday')
        );
        expect(getByText(day, '2 spots remaining')).toBeInTheDocument();
      })
  });




  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    //3.Click edit icon
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Edit"));
    //4. Input another name,select another interviewer
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Alice" }
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    //5. click save
    fireEvent.click(getByText(appointment, "Save"));
    //6.check spots not being changed
    waitForElementToBeRemoved(() => getByText(appointment, "Saving"))

      .then(() => {
        const day = getAllByTestId(container, "day").find(day =>
          queryByText(day, "Monday")
        );
        expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
      });
  })




  it("shows the save error when failing to save an appointment", async () => {
    //1. mock error message from axios.put
    axios.put.mockRejectedValueOnce();
    //2. Render the Application.
    const { container, debug } = render(<Application />);
    //3.find the first 
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];
    //4.Click add button
    fireEvent.click(getByAltText(appointment, 'Add'));
    //5.Input another name, select another interviwer
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    //6.Click save
    fireEvent.click(getByText(appointment, 'Save'));
    //7.Wait for Error mode display
    await waitForElement(() => getByText(appointment, 'Error'));
    //8.check Error is displayed
    expect(getByText(appointment, 'Error')).toBeInTheDocument();
    //10.click close
    fireEvent.click(queryByAltText(appointment, 'Close'));
    //11.check go back to create mode
    expect(getByText(appointment, 'Save')).toBeInTheDocument();
    expect(getByText(container, 'Archie Cohen')).toBeInTheDocument();
    //12.check spots remaining is not changed
    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });



  
  it("shows the delete error when failing to delete an existing appointment", async () => {
    //1. mock error message from axios.put
    axios.put.mockRejectedValueOnce();
    //2. Render the Application.   
    const { container, debug } = render(<Application />);

    // 3. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 4. Click the "Delete" button on the interview with Archie Cohen.

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 5. Check that the confirmation message is shown.
    expect(
      getByText(appointment, 'Are you sure you would like to delete?')
    ).toBeInTheDocument();

    // 6. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 7. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();
    //8.check Error is displayed
    await waitForElement(() => getByText(appointment, 'Error'));
    expect(getByText(appointment, 'Error')).toBeInTheDocument();
    //9.click close
    fireEvent.click(queryByAltText(appointment, 'Close'));
    //10.check spots remaining is not changed
    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  })
})

