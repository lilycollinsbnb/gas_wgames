export const truncateDescription = (description: string, maxLength: number): string => {
  if(!description){
    return '';
  }
  if (description.length <= maxLength) {
      return description;
    }
    return description.slice(0, maxLength) + '...';
  };