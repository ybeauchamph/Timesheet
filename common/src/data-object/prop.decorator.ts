import { DataObject } from './data-object';

export function Prop(type?: { new(): DataObject | Date; }) {
    return (target: DataObject, propertyKey: string | symbol) => {
        const properties = DataObject.getProperties(target);
        const prop = properties.find(p => p.field === propertyKey);
        if (prop) {
            prop.type = type;
        } else {
            properties.push({
                field: propertyKey,
                type: type
            });
        }
        DataObject.setProperties(target, properties);
    }
}
