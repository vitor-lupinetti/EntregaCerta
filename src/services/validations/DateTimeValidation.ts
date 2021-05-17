export class DateTimeValidation {
    public readonly REGEX_DATE: RegExp;
    public readonly REGEX_TIME: RegExp;
    public readonly REGEX_DATE_TIME: RegExp;

    public constructor() {
        this.REGEX_DATE = /(\d{4})-(\d{2})-(\d{2})/;
        this.REGEX_TIME = /(\d{2}):(\d{2})/;
        this.REGEX_DATE_TIME = new RegExp(this.REGEX_DATE.source + "T" + this.REGEX_TIME.source);
    }

    public validateDate(dateStr: string): boolean {
        let isValid = false;

        if (this.REGEX_DATE.test(dateStr)) {
            let month = Number(dateStr.replace(this.REGEX_DATE, "$2"));
            let date = Number(dateStr.replace(this.REGEX_DATE, "$3"));

            isValid = month >= 1 && month <= 12 && date >= 1 && date <= 31;
        }

        return isValid;
    }

    public validateTime(timeStr: string): boolean {
        let isValid = false;

        if (this.REGEX_DATE.test(timeStr)) {
            let hours = Number(timeStr.replace(this.REGEX_DATE, "$1"));
            let minutes = Number(timeStr.replace(this.REGEX_DATE, "$2"));

            isValid = hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
        }

        return isValid;
    }

    public validateDateTime(dateTimeStr: string): boolean {
        let isValid = false;

        if (this.REGEX_DATE_TIME.test(dateTimeStr)) {
            let dateStr = dateTimeStr.replace(/T.*/, "");
            let timeStr = dateTimeStr.replace(/.*T/, "");

            isValid = this.validateDate(dateStr) && this.validateTime(timeStr);
        }

        return isValid;
    }
}
