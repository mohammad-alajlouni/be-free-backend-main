export const apiDoctorIdParam = {
  name: 'doctorId',
  type: String,
  description: 'Should provide doctor id to fetch schedule details',
  example: '64d97510859dc4f83d9dc0c8',
  required: true,
};

export const apiSessionIdParam = {
  name: 'sessionId',
  type: String,
  description: 'Should provide session id to update session status',
  example: '64d97510859dc4f83d9dc0c8',
  required: true,
};

export const apiSessionsPage = {
  name: 'page',
  type: Number,
  description: 'Should provide the page number',
  example: 1,
  required: true,
};

export const apiSessionsLimit = {
  name: 'limit',
  type: Number,
  description: 'Should provide limit or page size',
  example: 4,
  required: true,
};

export const apiStatusQuery = {
  name: 'status',
  type: String,
  description: 'Should provide search query to filter sessions by status',
  example: 'Current',
  required: false,
};

export const apiSessionSearchQuery = {
  name: 'status',
  type: String,
  description: 'Should provide search query to filter sessions by status',
  example: 'Current',
  required: false,
};

export const apiAcceptSessionResponse = {
  status: 200,
  description: 'Accept Session.',
  schema: {
    example: {
      success: true,
      statusCode: 200,
      message: 'Session accepted successfully.',
    },
  },
};

export const apiCompletedSessionResponse = {
  status: 200,
  description: 'Complete Session.',
  schema: {
    example: {
      success: true,
      statusCode: 200,
      message: 'Session completed successfully.',
    },
  },
};

export const apiRejectedSessionResponse = {
  status: 200,
  description: 'Reject Session.',
  schema: {
    example: {
      success: true,
      statusCode: 200,
      message: 'Session rejected successfully.',
    },
  },
};

export const apiCancelledSessionResponse = {
  status: 200,
  description: 'Cancel Session.',
  schema: {
    example: {
      success: true,
      statusCode: 200,
      message: 'Session cancel successfully.',
    },
  },
};

export const apiCreatedSession = {
  status: 201,
  description: 'Create new session.',
  schema: {
    example: {
      success: true,
      statusCode: 201,
      message: 'Session created successfully.',
    },
  },
};

export const apiSingleSession = {
  status: 200,
  description: 'Fetch schedule details',
  schema: {
    example: {
      success: true,
      statusCode: 200,
      message: 'Session fetched successfully',
      data: {
        _id: '66e2d14874b75104f9a47c61',
        doctorData: {
          _id: '66dc1b219294b6a18a31413a',
          fullName: 'Mahmoud Serag',
          email: 'sragmahmoud4@gmail.com',
          mobile: '+201064560413',
          languages: ['english,arabic'],
          country: 'Egypt',
          city: 'Shoubra',
          degree: 'string',
          university: 'string',
        },
        patientId: '66dc1b219294b6a18a31413a',
        scheduleData: {
          _id: '66e19c84ba33516cb4bd31c0',
          day: 'Sunday',
          timeRanges: [
            {
              from: '2024-09-09T00:00:00.000Z',
              to: '2024-09-09T01:00:00.000Z',
              isAvailable: true,
              _id: '66e19c84ba33516cb4bd31c1',
            },
          ],
        },
        numberOfSessions: 8,
        duration: -3600000,
        sessionType: 'Geriatric Psychiatry',
        notes: 'This is notes',
        isPending: false,
        isRejected: true,
        status: null,
      },
    },
  },
};

export const apiSessionsListResponse = {
  status: 200,
  description: 'Fetch schedule details',
  schema: {
    example: {
      success: true,
      statusCode: 200,
      message: 'Session fetched successfully',
      data: [
        {
          _id: '66e2d14874b75104f9a47c61',
          doctorData: {
            _id: '66dc1b219294b6a18a31413a',
            fullName: 'Mahmoud Serag',
            email: 'sragmahmoud4@gmail.com',
            mobile: '+201064560413',
            languages: ['english,arabic'],
            country: 'Egypt',
            city: 'Shoubra',
            degree: 'string',
            university: 'string',
          },
          patientId: '66dc1b219294b6a18a31413a',
          scheduleData: {
            _id: '66e19c84ba33516cb4bd31c0',
            day: 'Sunday',
            timeRanges: [
              {
                from: '2024-09-09T00:00:00.000Z',
                to: '2024-09-09T01:00:00.000Z',
                isAvailable: true,
                _id: '66e19c84ba33516cb4bd31c1',
              },
            ],
          },
          numberOfSessions: 8,
          duration: -3600000,
          sessionType: 'Geriatric Psychiatry',
          notes: 'This is notes',
          isPending: false,
          isRejected: true,
          status: null,
        },
        '{...................}',
      ],
    },
  },
};
