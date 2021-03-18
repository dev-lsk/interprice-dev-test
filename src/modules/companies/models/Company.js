import moment from 'moment';

export default class Company {
    constructor(id, name, dateSent, isPreferred) {
        this.id = id;
        this.name = name;
        this.dateSent = dateSent ? moment(dateSent).startOf('day') : null;
        this.isPreferred = !!isPreferred;
        this.current = {};
        this.others = [];
        this.hasCurrent = false;
        this.isOpen = false;
    }
}