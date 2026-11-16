const Header = ({ name }) => <h2>{name}</h2>;

const Content = ({ parts }) => (
  <div>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </div>
);

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Total = ({ total }) => (
  <p>
    <strong>total of {total} exercises</strong>
  </p>
);

const Course = ({ course }) => {
  const total = course.parts.reduce(
    (accumulator, currentValue) => accumulator + currentValue.exercises,
    0,
  );
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total total={total} />
    </div>
  );
};

export default Course;
