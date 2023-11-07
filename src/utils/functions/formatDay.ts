import dayjs from 'dayjs';
import 'dayjs/locale/vi';

export const formatDayVN = (dateTime: string): string => {
    var myDate = new Date(dateTime)
    myDate.setMinutes(myDate.getMinutes())
    const originalTime = dayjs(myDate).format('DD/MM/YYYY');
    return originalTime.toString()
}

export const formatDateFormDateLocal = (dateTime: string): string => {
    const formattedDate = dayjs(dateTime).locale('vi').format('DD-MM-YYYY');
    return formattedDate
}

export const formatDateLocal = (dateTime: string): string => {
    const yourTime = new Date(dateTime)
    return yourTime.toISOString()
}

export const formatDateLocalV2 = (dateTime: string): string => {
    const dateObject = dayjs(dateTime);
    const formattedDate = dateObject.format('DD-MM-YYYY HH:mm');
    return formattedDate;
}

export const dayComparedToThePast = (dateTime: string): string => {
    const now = dayjs();
    const inputDate = dayjs(dateTime);
    const diff = now.diff(inputDate, 'minute');
    let output: string;
    if (diff > 3 * 24 * 60) {
        output = inputDate.format('DD/MM/YYYY HH:mm');
    } else if (diff > 24 * 60) {
        const diffInDays = Math.floor(diff / (24 * 60));
        output = `${diffInDays} ngày trước`;
    } else if (diff > 60) {
        const diffInHours = Math.floor(diff / 60);
        output = `${diffInHours} giờ trước`;
    } else if (diff < 2) {
        output = `vừa xong`
    } else {
        output = `${diff} phút trước`;
    }
    return output;
}

