import React from 'react';

const String_ = ({
  options,
  handleChange,
  repeatableValue,
}) => {
  return (
    <input
      key={`${options.name}`}
      onChange={handleChange}
      className="p-2 rounded"
      value={repeatableValue ?? options.value}
			placeholder={options.placeholder ?? 'hehehehe'}
    />
  );
};

export default String_;