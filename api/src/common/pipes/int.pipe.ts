import { BadRequestException } from '@nestjs/common';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class IntPipe implements PipeTransform<string, number> {
    transform(value: string, metadata: ArgumentMetadata): number {
        const val = parseInt(value, 10);
        if (isNaN(val)) {
            throw new BadRequestException(`Value '${value}' is invalid for type 'int'`);
        }
        return val;
    }
}