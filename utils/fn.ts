import dayjs from "dayjs";

export const formatDate = (date: Date | string, formate:string = 'MMM DD, YYYY'): string => {
    return dayjs(date).format(formate);
};