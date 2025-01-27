export async function getDesignations() {
  try {
    const response = await fetch('/api/designations', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error fetching designations: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('getDesignations error:', error);
    throw error;
  }
}
