import React from "react";
import * as DateFns from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

export function App() {
  const now = new Date();
  const todayString = now.toISOString();
  return (
    <main className="lg:prose-l container prose m-auto break-words p-2">
      <h1>Date of birth inputs demo</h1>
      <section>
        <h2>Native HTML5 date-picker</h2>
        <DatePicker todayString={todayString} />
      </section>
      <hr />
      <section>
        <h2>Separate inputs</h2>
        <SeparateFields todayString={todayString} />
        <h3>"Memorable dates" pattern</h3>
        <ul>
          {[
            "https://design-system.service.gov.uk/patterns/dates/#asking-for-memorable-dates",
            "https://designsystem.digital.gov/components/memorable-date/",
          ].map((href) => (
            <li key={href}>
              <a href={href}>{href}</a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function DatePicker(props: { todayString: string }) {
  const inputId = React.useId();
  const errorId = React.useId();

  const [value, setValue] = React.useState<string>("");
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [successfullySubmitted, setSuccessfullySubmitted] = React.useState<
    string | null
  >(null);
  const errorMessage = errorMessageFor({
    value,
    todayString: props.todayString,
  });
  const isEmpty = value === "";

  const showError = errorMessage != null && hasSubmitted;
  return (
    <form
      noValidate
      className="m-auto flex max-w-md flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setHasSubmitted(true);
        if (errorMessage == null) {
          setSuccessfullySubmitted(value);
        } else {
          setSuccessfullySubmitted(null);
        }
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className={showError ? "text-red-500" : ""}>
          Date of birth
        </label>
        <input
          className="rounded-md focus:shadow-md focus:ring-2 focus:ring-blue-500/50 aria-[invalid=true]:border-red-500 
           aria-[invalid=true]:ring-red-500/50
           aria-[invalid=true]:focus:border-red-700"
          id={inputId}
          aria-required
          aria-describedby={showError ? errorId : undefined}
          aria-invalid={showError}
          max={props.todayString.split("T")[0]}
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Hint
          showError={showError}
          errorId={errorId}
          errorMessage={errorMessage}
          hintId=""
          hintMessage=""
        />
      </div>
      <div className="flex flex-row gap-2">
        <Button>
          <span className="flex flex-row items-center gap-2">Submit</span>
        </Button>
        <AnimatePresence>
          {!isEmpty && (
            <motion.div
              initial={{ width: "auto", overflow: "visible" }}
              animate={{ width: "auto", overflow: "visible" }}
              exit={{ width: 0, overflow: "hidden" }}
            >
              <Button
                onClick={() => {
                  setValue("");
                  setHasSubmitted(false);
                  setSuccessfullySubmitted(null);
                }}
                variant="secondary"
              >
                <span className="flex flex-row items-center gap-2">
                  Reset
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <SubmittedConfirmation dateString={successfullySubmitted} />
    </form>
  );
}

function SeparateFields(props: { todayString: string }) {
  const monthInputId = React.useId();
  const dayInputId = React.useId();
  const yearInputId = React.useId();
  const errorId = React.useId();
  const hintId = React.useId();

  const [monthValue, setMonthValue] = React.useState<string>("");
  const [dayValue, setDayValue] = React.useState<string>("");
  const [yearValue, setYearValue] = React.useState<string>("");
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [successfullySubmitted, setSuccessfullySubmitted] = React.useState<
    string | null
  >(null);

  const isEmpty = [monthValue, dayValue, yearValue].every((v) => v === "");
  const value =
    monthValue !== "" && dayValue !== "" && yearValue !== ""
      ? `${yearValue.padStart(4, "0")}-${monthValue}-${dayValue.padStart(
          2,
          "0",
        )}`
      : "";
  const errorMessage = errorMessageFor({
    value,
    todayString: props.todayString,
  });

  // TODO: Add aria-attributes
  const showError = errorMessage != null && hasSubmitted;
  return (
    <form
      noValidate
      className="m-auto flex max-w-md flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setHasSubmitted(true);
        if (errorMessage == null) {
          setSuccessfullySubmitted(value);
        } else {
          setSuccessfullySubmitted(null);
        }
      }}
    >
      <div className="flex flex-col gap-2">
        <span className={showError ? "text-red-500" : ""}>Date of birth</span>
        <div
          className={`[&:has(:focus)]ring-blue-500/50 flex flex-row rounded-md border border-gray-500 [&:has(:focus)]:border-blue-700 [&:has(:focus)]:shadow-md [&:has(:focus)]:ring-2 ${
            showError &&
            "border-red-500 ring-red-500/50 [&:has(:focus)]:border-red-700"
          }`}
        >
          <label hidden aria-hidden="false" htmlFor={monthInputId}>
            Month
          </label>
          <select
            className={`rounded-md border-none bg-transparent focus:outline-none focus:ring-transparent data-[blank=true]:italic data-[blank=true]:text-gray-400
             ${showError ? "focus:bg-red-50" : "focus:bg-blue-100"}
            `}
            id={monthInputId}
            data-blank={monthValue === ""}
            placeholder="Month"
            value={monthValue}
            onChange={(e) => setMonthValue(e.target.value)}
          >
            <option value="" disabled hidden>
              Month
            </option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <label hidden aria-hidden="false" htmlFor={dayInputId}>
            Day
          </label>
          <input
            id={dayInputId}
            value={dayValue}
            type="number"
            onChange={(e) => setDayValue(e.target.value)}
            inputMode="numeric"
            min={1}
            max={31}
            maxLength={2}
            placeholder="Day"
            className={`w-[6ch] rounded-md border-none text-right outline-none ring-transparent focus:ring-transparent [&::placeholder]:overflow-visible [&::placeholder]:italic [&::placeholder]:text-gray-400 ${
              showError ? "focus:bg-red-50" : "focus:bg-blue-100"
            }`}
          />
          <div className="flex items-center">
            <span>,</span>
          </div>
          <label hidden aria-hidden="false" htmlFor={yearInputId}>
            Year
          </label>
          <input
            id={dayInputId}
            value={yearValue}
            type="number"
            max={props.todayString.slice(4)}
            maxLength={4}
            min={1900}
            onChange={(e) => setYearValue(e.target.value)}
            inputMode="numeric"
            placeholder="Year"
            className={`w-[8ch] rounded-md border-none text-right outline-none ring-transparent focus:ring-transparent [&::placeholder]:overflow-visible  [&::placeholder]:italic [&::placeholder]:text-gray-400  ${
              showError ? "focus:bg-red-50" : "focus:bg-blue-100"
            }`}
          />
        </div>
        <Hint
          errorId={errorId}
          showError={showError}
          errorMessage={errorMessage}
          hintId={hintId}
          hintMessage="For example: January 1, 1990"
        />
      </div>
      <div className="flex flex-row gap-2">
        <Button>
          <span className="flex flex-row items-center gap-2">Submit</span>
        </Button>
        <AnimatePresence>
          {!isEmpty && (
            <motion.div
              initial={{ width: "auto", overflow: "visible" }}
              animate={{ width: "auto", overflow: "visible" }}
              exit={{ width: 0, overflow: "hidden" }}
            >
              <Button
                onClick={() => {
                  setMonthValue("");
                  setDayValue("");
                  setYearValue("");
                  setHasSubmitted(false);
                  setSuccessfullySubmitted(null);
                }}
                variant="secondary"
              >
                <span className="flex flex-row items-center gap-2">
                  Reset
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <SubmittedConfirmation dateString={successfullySubmitted} />
    </form>
  );
}

function Hint(props: {
  errorId: string;
  hintId: string;
  showError: boolean;
  errorMessage: string | null;
  hintMessage: string;
}) {
  return (
    <div
      className={`flex flex-row items-center gap-1 text-sm ${
        props.showError ? "text-red-500" : "text-gray-500"
      }`}
    >
      {props.showError ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>

          <span id={props.errorId}>{props.errorMessage}</span>
        </>
      ) : (
        <span>{props.hintMessage == "" ? "\u200B" : props.hintMessage}</span>
      )}
    </div>
  );
}

function errorMessageFor(params: {
  value: string;
  todayString: string;
}): string | null {
  const date = new Date(params.value);
  if (params.value === "" || !DateFns.isValid(date)) {
    return "This field is required.";
  }
  const dateYear = date.getFullYear();
  date.setFullYear(dateYear + 18);
  const datePlus18YearsString = date.toISOString();
  if (params.value >= params.todayString) {
    return "Hello, time traveller! Please enter a date that’s in the past.";
  } else if (datePlus18YearsString >= params.todayString) {
    return "You must be 18 or older to join. Did you enter the right date?";
  } else return null;
}

function Button(props: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}) {
  const variant = props.variant ?? "primary";
  return (
    <button
      className={`rounded-md px-6 py-2 font-medium transition-all focus:outline-none ${
        variant === "secondary"
          ? "bg-transparent text-red-500 hover:bg-red-100 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          : "bg-blue-600 text-white hover:bg-blue-900 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 "
      }`}
      type={variant === "secondary" ? "button" : "submit"}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

function SubmittedConfirmation(props: { dateString: string | null }) {
  return (
    <AnimatePresence>
      {props.dateString && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          style={{ overflow: "hidden" }}
        >
          <div className="rounded-md bg-blue-100 p-4 text-blue-800">
            <div className="flex flex-row items-center gap-1 font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              <span>Successfully submitted date of birth</span>
            </div>
            <div className="font-normal">
              {new Date(props.dateString).toLocaleDateString(undefined, {
                timeZone: "utc",
                dateStyle: "long",
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
