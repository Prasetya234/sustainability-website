import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";

const CompDateRangeWeek = ({ state, handleCallback }) => {
  // const [state, setState] = useState({
  //   start: moment().subtract(29, "days"),
  //   end: moment(),
  // });
  const { start, end } = state;
  // const handleCallback = (start, end) => {
  //   setState({ start, end });
  // };
  const label =
    start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY");
  return (
    <DateRangePicker
      initialSettings={{
        startDate: start.toDate(),
        endDate: end.toDate(),
        ranges: {
          Today: [moment().toDate(), moment().toDate()],
          Yesterday: [
            moment().subtract(1, "days").toDate(),
            moment().subtract(1, "days").toDate(),
          ],
          "Last 7 Days": [
            moment().subtract(6, "days").toDate(),
            moment().toDate(),
          ],
          "Last 30 Days": [
            moment().subtract(29, "days").toDate(),
            moment().toDate(),
          ],
          "This Month": [
            moment().startOf("month").toDate(),
            moment().endOf("month").toDate(),
          ],
          "Last Month": [
            moment().subtract(1, "month").startOf("month").toDate(),
            moment().subtract(1, "month").endOf("month").toDate(),
          ],
        },
      }}
      onCallback={handleCallback}
    >
      <div
        id="datePickerWeek"
        className="col-4 rounded"
        style={{
          background: "#fff",
          cursor: "pointer",
          fontSize: "14px",
          padding: "3px 10px",
          border: "1px solid #ccc",
          width: "100%",
        }}
      >
        <i className="fa fa-calendar"></i>&nbsp;
        <span>{label}</span> <i className="fa fa-caret-down"></i>
      </div>
    </DateRangePicker>
  );
};

export default CompDateRangeWeek;
