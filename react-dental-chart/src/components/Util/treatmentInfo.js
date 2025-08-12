export const getTreatmentInfoByToothId = async (toothId) => {
    // future can use  fetch or axios read the data from DB API
    // now just using mock data：
    const mockData = {
        33: {
            toothId: 33,
            toothName: 'Lower Left Canine',
            treatments: ['filling', 'root canal'],
            date: '2025-05-01',
            notes: 'Patient reported sensitivity to cold.'
        },
        34: {
            toothId: 34,
            toothName: 'Lower Left First Premolar',
            treatments: ['crown'],
            date: '2024-11-15',
            notes: 'Crown installed.'
        }
        // ... rest
    };

    return mockData[toothId] || null;
};
