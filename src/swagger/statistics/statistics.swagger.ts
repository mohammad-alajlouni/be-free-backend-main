import { ApiProperty } from '@nestjs/swagger';

class DoctorAppointmentsDto {
  @ApiProperty({ example: 0 })
  currentSessions: number;

  @ApiProperty({ example: 1 })
  completedSessions: number;

  @ApiProperty({ example: 14 })
  canceledSessions: number;

  @ApiProperty({ example: 11 })
  acceptedSessions: number;

  @ApiProperty({ example: 0 })
  rejectedSessions: number;
}

class RevenueDto {
  @ApiProperty({ example: 'Saturday' })
  day: string;

  @ApiProperty({ example: 2000 })
  revenue: number;
}

class SessionsDto {
  @ApiProperty({ example: 3 })
  sessionsCount: number;

  @ApiProperty({ example: 'Wednesday' })
  day: string;

  @ApiProperty({ example: '2024-09-18' })
  date: string;
}

class VisitorsDto {
  @ApiProperty({ example: 3 })
  visitorsCount: number;

  @ApiProperty({ example: 'Wednesday' })
  day: string;

  @ApiProperty({ example: '2024-09-18' })
  date: string;
}

export class ApiDoctorStatisticsData {
  @ApiProperty({ type: DoctorAppointmentsDto })
  appointments: DoctorAppointmentsDto;

  @ApiProperty({ type: [RevenueDto] })
  revenue: RevenueDto[];

  @ApiProperty({ type: [SessionsDto] })
  weeklySessions: SessionsDto[];

  @ApiProperty({ type: [VisitorsDto] })
  weeklyVisitors: VisitorsDto[];
}

export class ApiDoctorStatisticsResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({
    example: 'Consolidated doctor statistics fetched successfully',
  })
  message: string;

  @ApiProperty({ type: ApiDoctorStatisticsData })
  data: ApiDoctorStatisticsData;
}
