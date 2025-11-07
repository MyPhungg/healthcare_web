//  kiểm tra chuỗi rỗng, cắt chuỗi, chuyển

package com.healthcare.common.utils;

public class StringUtils {
    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}
