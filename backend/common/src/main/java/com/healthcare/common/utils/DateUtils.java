// format, parse, compare ngày giờ

package com.healthcare.common.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtils {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static String formatDate(LocalDate date) {
        return date != null ? date.format(DATE_FORMAT) : null;
    }

    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATETIME_FORMAT) : null;
    }

    public static LocalDate parseDate(String date) {
        return LocalDate.parse(date, DATE_FORMAT);
    }

    public static boolean isBeforeToday(LocalDate date) {
        return date.isBefore(LocalDate.now());
    }

    public static boolean isAfterToday(LocalDate date) {
        return date.isAfter(LocalDate.now());
    }
}
