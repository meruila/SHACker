const studentRecords = [
  {
    id: '2019-00000',
    firstName: 'Maria',
    lastName: 'Makiling',
    degreeProgram: 'BACA',
    terms: [
      {
        term: 'I/19/20',
        units: 15,
        grades: [
          {
            courseNo: 'CMSC 12',
            grade: 1,
            units: 3,
            weight: 3,
            cumulative: 3,
          },
          {
            courseNo: 'CMSC 56',
            grade: 1,
            units: 3,
            weight: 3,
            cumulative: 6,
          },
          {
            courseNo: 'ETHICS 1',
            grade: 1,
            units: 3,
            weight: 6,
            cumulative: 9,
          },
          {
            courseNo: 'HK 11',
            grade: 1,
            units: 2,
            weight: 0,
            cumulative: 9,
          },
          {
            courseNo: 'MATH 27',
            grade: 1,
            units: 3,
            weight: 3,
            cumulative: 12,
          },
          {
            courseNo: 'STS 1',
            grade: 1,
            units: 3,
            weight: 3,
            cumulative: 15,
          },
        ]
      },
      {
        term: 'I/21/22',
        units: null,
        grades: null
      },
    ]
  },
];

export default studentRecords;