
const ReadableDate = ({ timestamp }) => {
  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  return <span>{formatTimestamp(timestamp)}</span>;
};

export default ReadableDate;
