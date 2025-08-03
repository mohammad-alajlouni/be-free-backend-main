import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PatientsService } from 'src/modules/patients/patients.service';

@Injectable()
export class ProfileCompleteGuard implements CanActivate {
  constructor(private readonly reflector: Reflector , 
    private readonly patientsService: PatientsService

  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

  
    const user = await this.patientsService.getPatientProfile(request.user);
    

    // Check if the user.data has all required fields
    if (!user.data.fullName || !user.data.email ||  !user.data.awarenessLevel || !user.data.gender || !user.data.maritalStatus || !user.data.birthdate || !user.data.currentJobStatus || !user.data.howCanWeHelpYou || !user.data.whereDidYouHearAboutUs ) {
      throw new HttpException(
        'Please complete your profile before proceeding.',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
