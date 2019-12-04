import React from "react";
import { render, cleanup, fireEvent, queryByText, waitForElement, getByAltText, getByPlaceholderText, getAllByTestId, getByText, queryByAltText } from "@testing-library/react";
import Application from "../Application";
afterEach(cleanup);
import axios from 'axios';

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText("Monday"));
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
  
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
  
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
  
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(queryByAltText(appointment, "Delete"));
  
    // 4. Cancel/Confirm the delete appointment.
    expect(
      getByText(appointment, "Delete the appointment?")
    ).toBeInTheDocument();
  
    // 5. Click the "Confirm" button to delete.
    fireEvent.click(queryByText(appointment, "Confirm"));
  
    // 6. Check that the text "Deleting" is shown.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
  
    // 7. The "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
  
    // 8. Check that the "Monday" has spots remaining updated.
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it('5. loads data, edits an interview and keeps the spots remaining for Monday the same', async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Edit" button.
    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(queryByAltText(appointment, 'Edit'));

    // 4. enter student name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });

    // 5. Save appointment
    fireEvent.click(getByText(appointment, 'Save'));

    // 6. Saving
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // 7. Appointment "Lydia Miller-Jones" to display
    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));

    // 8. For Monday
    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    // 9. spots emaining remains same.
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });

  it('6. shows the save error when failing to save an appointment', async () => {
    // Faking an error with axios
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Get the first spot
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];

    // 4. Add an appointment
    fireEvent.click(getByAltText(appointment, 'Add'));

    // 5. Enters the student name.
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    // 6. Click the "Save" button.
    fireEvent.click(getByText(appointment, 'Save'));

    // 7. Check that "Saving" is displayed.
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // 8. An error should be shown.
    await waitForElement(() =>
      getByText(appointment, 'Cannot not book appointment.')
    );
  });

  it('7. shows the delete error when failing to delete an existing appointment', async () => {
    // Fake an error with axios.
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button.
    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(queryByAltText(appointment, 'Delete'));

    // 4. Check that the cancel/confirmation message is shown.
    expect(
      getByText(appointment, 'Delete the appointment?')
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    // 7. An error should be rendered.
    await waitForElement(() =>
      getByText(appointment, 'Cannot not cancel appointment.')
    );
  });
});