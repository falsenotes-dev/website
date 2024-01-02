export function dateFormat(dateString: string | number | Date) {
  const date = new Date(dateString);
  const currentDate = new Date();

  const differenceInTime = currentDate.getTime() - date.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  if (differenceInDays < 1) {
    const differenceInHours = differenceInTime / (1000 * 3600);
    if (differenceInHours < 1) {
      const differenceInMinutes = differenceInTime / (1000 * 60);
      if (differenceInMinutes < 1) {
        const differenceInSeconds = differenceInTime / 1000;
        return differenceInSeconds < 30
          ? "Just now"
          : `${Math.floor(differenceInSeconds)} seconds ago`;
      }
      return `${Math.floor(differenceInMinutes)} minutes ago`;
    }
    return `${Math.floor(differenceInHours)} hours ago`;
  }

  if (differenceInDays > 15) {
    // return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    //if this year return month and day only else return year, month and day
    return date.getFullYear() === currentDate.getFullYear()
      ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  } else {
    return `${Math.floor(differenceInDays)} days ago`;
  }
}
