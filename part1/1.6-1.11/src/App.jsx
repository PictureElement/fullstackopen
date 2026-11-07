import { useState } from "react";

const Button = ({ onClick, label }) => (
  <button onClick={onClick} type="button">
    {label}
  </button>
);

const StatisticLine = ({ label, value, suffix }) => (
  <tr>
    <th style={{ textAlign: "start" }} scope="row">
      {label}
    </th>
    <td>
      {value} {suffix}
    </td>
  </tr>
);

const Statistics = ({
  good,
  neutral,
  bad,
  total,
  average,
  positivePercentage,
}) => {
  if (total === 0) {
    return <p>No feedback given</p>;
  }
  return (
    <table>
      <tbody>
        <StatisticLine label="good" value={good} />
        <StatisticLine label="neutral" value={neutral} />
        <StatisticLine label="bad" value={bad} />
        <StatisticLine label="all" value={total} />
        <StatisticLine label="average" value={average} />
        <StatisticLine label="positive" value={positivePercentage} suffix="%" />
      </tbody>
    </table>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const total = good + neutral + bad;
  const average = (good * 1 + neutral * 0 + bad * -1) / total;
  const positivePercentage = (good / total) * 100;

  const handleGoodClick = () => {
    setGood(good + 1);
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };

  const handleBadClick = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={handleGoodClick} label="good" />
      <Button onClick={handleNeutralClick} label="neutral" />
      <Button onClick={handleBadClick} label="bad" />
      <h2>statistics</h2>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positivePercentage={positivePercentage}
      />
    </div>
  );
};

export default App;
