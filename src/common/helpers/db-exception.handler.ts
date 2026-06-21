import { BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';

export function handleDBExceptions(error: any, logger: Logger, message?: 'El email o número de teléfono ya está registrado en el sistema.'): never {

    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new BadRequestException(message);
    }

    logger.error(error);
    throw new InternalServerErrorException('No se pudo procesar la solicitud - Revisa los logs del servidor.');
}