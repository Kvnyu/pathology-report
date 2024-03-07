export const uploadPathologyReport = async (file: File) => {
  if (!file) {
    throw new Error('No file provided');
  }
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/pathology/upload', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();

  if (data.errors) {
    console.error(data.errors);
    throw new Error('Failed to fetch results');
  }

  return data;
};
