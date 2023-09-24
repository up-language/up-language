package test.js;

import java.math.BigDecimal;

public class JavaFunctions {
 
    public static BigDecimal sum(Object[] args) {
        BigDecimal d = BigDecimal.ZERO;
        for (Object arg : args) {
            try {
                BigDecimal addend = new BigDecimal(String.valueOf(arg));
                d = d.add(addend);
            } catch (NumberFormatException ex) {
            }
        }
        return d;
    }
}