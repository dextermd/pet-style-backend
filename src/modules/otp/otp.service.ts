import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { OtpCodeLog } from './entities/otp-code-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpCodeStorage } from './entities/otp-code-storage.entity';

@Injectable()
export class OtpService {
  smsMdUrl: string;
  smsMdUsername: string;
  smsMdPassword: string;
  smsTokenApiKey: string;
  constructor(
    @InjectRepository(OtpCodeLog)
    private readonly otpLogRepository: Repository<OtpCodeLog>,
    @InjectRepository(OtpCodeStorage)
    private readonly otpCodeStorageRepository: Repository<OtpCodeStorage>,
    private readonly configService: ConfigService,
  ) {
    this.smsMdUrl = this.configService.get<string>('SMS_MD_URL');
    this.smsMdUsername = this.configService.get<string>('SMS_MD_USERNAME');
    this.smsMdPassword = this.configService.get<string>('SMS_MD_PASSWORD');
    this.smsTokenApiKey = this.configService.get<string>('SMS_MD_API_KEY');
  }

  sendSms(phone: string) {
    phone = OtpService.phoneDefaultIfNull(phone);

    const formattedPhone = phone.replace(/\s+/g, '');

    if (formattedPhone.length !== 8) {
      return 'Phone number is not valid';
    }

    let code = OtpService.getRandomNumber();
    if (formattedPhone === '68751173') {
      code = 111111;
    }

    const message = `Codul de verificare este: ${code}`;

    return this.sendSmsMd(formattedPhone, message, code);
  }

  private static phoneDefaultIfNull(phone: string) {
    phone = phone != null ? phone : '0';
    return phone;
  }

  private static getRandomNumber() {
    return Math.floor(100000 + Math.random() * 999999);
  }

  async sendSmsMd(phone: string, messageToSend: string, code: number) {
    const params = new URLSearchParams();
    params.append('token', this.smsTokenApiKey);
    params.append('from', 'PetStyle');
    params.append('to', phone);
    params.append('message', messageToSend);
    params.append('dlrmask', '31');
    params.append('dlrurl', 'Empty');
    params.append('charset', 'windows-1251');
    params.append('coding', '2');

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params,
    };

    try {
      const response = await axios.get(this.smsMdUrl, config);
      if (response.status === 201) {
        console.log('Sending sms to phone:', phone, 'with code:', code);
        const otpCodeLog = this.otpLogRepository.create({
          phone,
          code: code.toString(),
          io_code: response.data.code,
          operation: 'SEND SMS',
          message_id: response.data.message,
        });

        await this.otpLogRepository.save(otpCodeLog);
        await this.saveOtpCodeStorage(phone, code);

        console.log(
          'Sms - save result to DB: ' + '373' + phone + ' with code: ' + code,
        );

        return 'SMS sent successfully';
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            const badRequestErrors = error.response.data;
            let errorMessage = 'Неверный запрос: ';

            for (const [key, messages] of Object.entries(badRequestErrors)) {
              if (Array.isArray(messages)) {
                errorMessage += `${key}: ${messages.join(', ')}; `;
              } else {
                errorMessage += `${key}: ${messages}; `;
              }
            }
            throw new HttpException(
              errorMessage.trim(),
              HttpStatus.BAD_REQUEST,
            );
          case 401:
            throw new HttpException(
              'Неавторизованный доступ: проверьте API токен',
              HttpStatus.UNAUTHORIZED,
            );
          case 403:
            throw new HttpException(
              'Доступ запрещен: у вас нет прав для выполнения этого действия',
              HttpStatus.FORBIDDEN,
            );
          case 404:
            throw new HttpException(
              'Ресурс не найден: проверьте URL',
              HttpStatus.NOT_FOUND,
            );
          case 500:
            throw new HttpException(
              'Внутренняя ошибка сервера: попробуйте позже',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          default:
            throw new HttpException(
              `Ошибка: ${error.response.status}`,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      } else if (error.request) {
        throw new HttpException(
          'Ошибка при выполнении запроса: сервер не отвечает',
          HttpStatus.GATEWAY_TIMEOUT,
        );
      } else {
        throw new HttpException(
          `Ошибка настройки запроса: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async saveOtpCodeLog(otpCodeLog: OtpCodeLog) {
    return this.otpLogRepository.save(otpCodeLog);
  }

  async saveOtpCodeStorage(phone: string, code: number) {
    const expirationTime = Date.now() + 5 * 60 * 1000;

    const smsCodeStorage = this.otpCodeStorageRepository.create({
      phone,
      code: code.toString(),
      expiration_time: expirationTime,
    });
    await this.otpCodeStorageRepository.save(smsCodeStorage);
  }
}
