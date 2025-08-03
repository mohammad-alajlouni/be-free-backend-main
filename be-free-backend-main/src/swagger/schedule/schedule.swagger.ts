export const apiCreatedScheduleResponse = {
  status: 201,
  description: 'Create new schedule.',
  schema: {
    example: {
      success: true,
      statusCode: 201,
      message: 'Schedule created successfully.',
    },
  },
};

export const apiDoctorIdParam = {
  name: 'doctorId',
  type: String,
  description: 'Should provide doctor id to fetch schedule details',
  example: '64d97510859dc4f83d9dc0c8',
  required: true,
};

export const apiUpdateScheduleParam = {
  name: 'scheduleId',
  description: 'Should provide schedule id to update single chapter',
  example: '5f2b4a7c4c5c4d5e6f7g8h9i',
  required: true,
};

export const apiGetSchedulePageQuery = {
  name: 'page',
  type: Number,
  description: 'Page number',
  example: 1,
  required: true,
};

export const apiGetScheduleLimitQuery = {
  name: 'limit',
  type: Number,
  description: 'Page limit',
  example: 4,
  required: true,
};

export const apiGetScheduleParam = {
  name: 'scheduleId',
  description: 'Should provide schedule id to fetch schedule details',
  example: '64d97510859dc4f83d9dc0c8',
  required: true,
};

export const apiGetScheduleResponse = {
  status: 200,
  description: 'Fetch schedule details',
  schema: {
    example: {
      success: true,
      statusCode: 200,
      message: 'Schedule fetched successfully.',

      doctorSchedules: [
        {
          _id: '66de1f45d6c3e787694c37c9',
          doctorId: '66dc1b219294b6a18a31413a',
          days: [
            {
              day: 'Wednesday',
              timeRanges: null,
            },
            {
              day: 'Sunday',
              timeRanges: null,
            },
            {
              day: 'Monday',
              timeRanges: [
                {
                  from: '2023-09-08T11:10:23.456Z',
                  to: '2506-11-11T15:49:26.456Z',
                },
              ],
            },
            {
              day: 'Tuesday',
              timeRanges: [
                {
                  from: '2023-09-08T11:10:23.456Z',
                  to: '2506-11-11T15:49:26.456Z',
                },
              ],
            },
            {
              day: 'Thursday',
              timeRanges: [
                {
                  from: '2023-09-08T11:10:23.456Z',
                  to: '2506-11-11T15:49:26.456Z',
                },
              ],
            },
            {
              day: 'Friday',
              timeRanges: [
                {
                  from: '2023-09-08T11:10:23.456Z',
                  to: '2506-11-11T15:49:26.456Z',
                },
              ],
            },
            {
              day: 'Saturday',
              timeRanges: [
                {
                  from: '2023-09-08T11:10:23.456Z',
                  to: '2506-11-11T15:49:26.456Z',
                  isAvailable: true,
                },
              ],
            },
          ],
          createdAt: '2024-09-08T22:03:49.409Z',
          updatedAt: '2024-09-08T22:03:49.409Z',
          __v: 0,
        },
      ],
    },
  },
};

export const apiGetAvailableTimes = {
  status: 200,
  description: 'Fetch schedule details',
  schema: {
    example: {
      success: true,
      statusCode: 200,
      message: 'Schedule fetched successfully.',

      doctorSchedules: [
        {
          _id: '66de1f45d6c3e787694c37c9',
          doctorId: '66dc1b219294b6a18a31413a',
          days: [
            {
              _id: '6717b695fba98818ba0c8569',
              day: 'Wednesday',
              timeRanges: [
                {
                  from: '2023-09-08T11:10:23.456Z',
                  to: '2506-11-11T15:49:26.456Z',
                  _id: '6717b695fba98818ba0c8569',
                  isAvailable: true,
                },
              ],
            },
            {
              _id: '6717b695fba98818ba0c8569',
              day: 'Monday',
              timeRanges: [
                {
                  from: '2023-09-08T11:10:23.456Z',
                  to: '2506-11-11T15:49:26.456Z',
                  _id: '6717b695fba98818ba0c8569',
                  isAvailable: true,
                },
              ],
            },
            {
              _id: '6717b695fba98818ba0c8569',
              day: 'Saturday',
              timeRanges: [
                {
                  from: '2023-09-08T11:10:23.456Z',
                  to: '2506-11-11T15:49:26.456Z',
                  _id: '6717b695fba98818ba0c8569',
                  isAvailable: true,
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
