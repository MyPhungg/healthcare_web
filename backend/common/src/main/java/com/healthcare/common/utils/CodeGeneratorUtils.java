package com.healthcare.common.utils;

import java.util.Random;

public class CodeGeneratorUtils {

    private static final Random RANDOM = new Random();

    /**
     * Sinh chuỗi có định dạng: PREFIX + 8 chữ số ngẫu nhiên.
     * Ví dụ: generateCode("US") -> "US483920"
     *
     * param prefix 2 ký tự (ví dụ: "US", "OD", "AP")
     * return chuỗi gồm prefix + 8 chữ số ngẫu nhiên
     */
    public static String generateCode(String prefix) {
        if (prefix == null || prefix.length() != 3) {
            throw new IllegalArgumentException("Prefix must be exactly 2 characters.");
        }

        int number = RANDOM.nextInt(1_000_000); // 0 → 999999
        return prefix.toUpperCase() + String.format("%08d", number);
    }

}
