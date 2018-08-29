import { TypeHandler } from '../type-handler';
import { isString } from 'lodash';

export class DateTypeHandler implements TypeHandler<Date> {
    clone(date: Date | undefined): Date | undefined {
        if (!date) {
            return undefined;
        } else {
            return new Date(+date);
        }
    }

    set(date: Date | undefined, dto: Object | any): void {
        if (date) {
            if (dto instanceof Date || !isNaN(+dto)) {
                date.setTime(+dto);
            } else if (isString(dto)) {
                date.setTime(+(new Date(dto as string)));
            } else {
                throw new Error('DateTypeHandler: Cannot be assigned to Date: ' + JSON.stringify(dto));
            }
        }
    }

    equals(date1: Date, date2: Date): boolean {
        return (!date1 && !date2) || +date1 === +date2;
    }
}
